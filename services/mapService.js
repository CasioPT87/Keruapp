

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDkXF-JzYDHB0M8Wwth0xRarNyUTDSQfA8'
});

function getCoordinates(address) {

    return new Promise((resolve, reject) => {

    	googleMapsClient.geocode({ address: address }, function(err, response) {
    		if (err) reject(err);
		    var lat = response.json.results[0].geometry.location.lat;		        
		    var lng = response.json.results[0].geometry.location.lng;    		       
	        resolve ({lat: lat, lng: lng});
    	})

    });

}

module.exports = {
	getCoordinates
};

