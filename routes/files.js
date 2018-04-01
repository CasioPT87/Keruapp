var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');

const S3_BUCKET = process.env.S3_BUCKET;
console.log(S3_BUCKET)

router.get('/form', (req, res) => res.render('form'));

router.get('/file/sign-s3', (req, res) => {
  console.log('hola')
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

router.post('/save-details', (req, res) => {
  // TODO: Read POSTed form data and do something useful
});

module.exports = router;