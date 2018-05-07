
var moment = require('moment');
  
function formatAddress(rawAddress) {

    var date = new Date(rawAddress);
    var dateLocale = moment(date);
    moment.locale('en-gb');
    dateLocale.locale(false);
    var dateFormated = dateLocale.format('LLLL');
	  return dateFormated;
}

module.exports = {
	formatAddress
};