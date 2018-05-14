
  
function stringLenghtControl(stringToControl, numMaxCharacters) {

  var stringToControl = stringToControl.toString();

  var lengthString = stringToControl.length;

  if (lengthString > numMaxCharacters) {

    var newString = stringToControl.slice(0, numMaxCharacters);

    return newString;

  } else {

    return stringToControl;
  }
}

module.exports = {
	stringLenghtControl
};