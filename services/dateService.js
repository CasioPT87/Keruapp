
var moment = require('moment');
  
function formatAddress(rawAddress) {

    var date = new Date(rawAddress);
    var dateLocale = moment(date);
    moment.locale('es');
    dateLocale.locale(false);
    var dateFormated = dateLocale.format('LLLL');
	  return dateFormated;
}

module.exports = {
	formatAddress
};