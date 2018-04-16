
var inspect = require('object-inspect');

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDkXF-JzYDHB0M8Wwth0xRarNyUTDSQfA8'
});

function getCoordinates(address) {

    return new Promise((resolve, reject) => {

    	googleMapsClient.geocode({ address: address }, function(err, response) {
    		if (err || !response) reject(new Error('Problema recogiendo coordenadas desde GoogleMaps')); 
		    var lat = response.json.results[0].geometry.location.lat;		        
		    var lng = response.json.results[0].geometry.location.lng; 
            var codeCountry = getCountry(response.json.results[0].address_components);
            var formatedAddress = response.json.results[0].formatted_address;  		       
	        resolve ({
                      lat: lat,
                      lng: lng,
                      codeCountry: codeCountry ? codeCountry : '',
                      formatedAddress: formatedAddress ? formatedAddress : ''
                    });
    	})

    });

}

function getCountry(addrComponents) {
    for (var i = 0; i < addrComponents.length; i++) {
        if (addrComponents[i].types[0] == "country") {
            return addrComponents[i].short_name;
        }
    }
    return false;
}

module.exports = {
	getCoordinates
};
