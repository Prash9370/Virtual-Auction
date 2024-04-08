const { MongoClient } = require('mongodb');
const url = process.env.MongoURL;
const dbName = 'Auction';
let client = null;
async function MDBconnect(){
    client = new MongoClient(url);
    await client.connect();
    console.log("MongoDB Connected")
    return client.db(dbName);
}
async function MDBdisconnect(){
    if(client){
        client.close();
        console.log("MongoDB Disconnected");
    }
}
module.exports= {MDBconnect, MDBdisconnect};