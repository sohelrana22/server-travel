const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middlewer
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ftk5c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
       const database = client.db('tourism_agency');
       const travelCollection = database.collection('travels');

       // GET Travels API
       app.get('/travels', async (req, res) => {
           const cursor = travelCollection.find({});
           const travels = await cursor.toArray();
           res.send(travels);
       })
    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('hello from tourism server')
});
// hello
app.listen(port, ()=>{
    console.log('listening to port', port);
});