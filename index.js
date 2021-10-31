const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
       const orderCollection = database.collection('order');

       // GET Travels API
       app.get('/travels', async (req, res) => {
           const cursor = travelCollection.find({});
           const travels = await cursor.toArray();
           res.send(travels);
       })

       // Get Single Order
       app.get('/order/:id', async (req, res) => {
           const id = req.params.id;
           const query = {_id: ObjectId(id)};
           const order = await orderCollection.findOne(query);
           res.json(order);
       })
      
       app.get('/orders/:email', async (req, res) => {
        const email = req.params.email;
        const query ={email};
        const order = await orderCollection.find(query).toArray();
        res.json(order);
    })

       // POST API
       app.post('/order', async (req, res) => {
           const order =req.body;
           console.log('hit the post api', order);

           const result =await orderCollection.insertOne(order);
           console.log(result);
           res.send(result)
       });

        // GET API 
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders)
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