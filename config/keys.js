//add this file to git.ignore

module.exports = {
    google: {
    //options for strategy
        clientID: "1027748645645-ien94lrmn26qdb58k9fhm3grnm8n1tuf.apps.googleusercontent.com",
        clientSecret: "NsfjN-xywLgzRBONKp2POQYF"
    },
    mongodb: {
        dbURI: "mongodb://serch:c2kzNpQcbbGxzS0f@clusterkeruapp-shard-00-00-zgdvs.mongodb.net:27017,clusterkeruapp-shard-00-01-zgdvs.mongodb.net:27017,clusterkeruapp-shard-00-02-zgdvs.mongodb.net:27017/keruappdb?ssl=true&replicaSet=ClusterKeruapp-shard-0&authSource=admin&retryWrites=true",
    },
    session: {
        cookieKey: 'thisgottobeanrandomstring'
    }
}