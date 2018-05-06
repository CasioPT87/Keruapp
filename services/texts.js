

const texts = {
  en: {

  },
  sp: {

  }
}
  
function getTexts(lang, stage) {

  var shortLang = lang.substr(0, 2).toLowerCase();

  if(shortLang !== 'sp') shortLang = 'en';

  var textsSelected = texts[shortLang][stage];

  if (textsSelected) return textsSelected;
  else return null;

}

module.exports = {
	getTexts
};