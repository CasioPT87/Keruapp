var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');

const S3_BUCKET = process.env.S3_BUCKET;
//`https://eraseunavezuntralariquevi1986.s3.amazonaws.com`

router.get('/file/form', (req, res) => res.render('form'));

router.get('/sign-s3', (req, res) => {
  console.log(`we're here in the route!!!`)
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  console.log(fileName, fileType)
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log('tenemos un error aqui, este es el error: ');
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    console.log('returnData.signedRequest: ')
    console.log(returnData.signedRequest)
    console.log('returnData.url: ')
    console.log(returnData.url)
    console.log('JSON.stringify(returnData): ')
    console.log(JSON.stringify(returnData))
    res.json(JSON.stringify(returnData));
    
    //res.end();
  });
});

router.post('/save-details', (req, res) => {
  console.log(req.body)
  res.json(req.body)
});

module.exports = router;


//https://s3.console.aws.amazon.com/s3/buckets/eraseunavezuntralariquevi1986/?region=us-east-2&tab=overview