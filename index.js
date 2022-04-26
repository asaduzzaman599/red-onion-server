require('dotenv').config()
const express = require('express');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 4000;

//middleware
app.use(cors());
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const query = require('express/lib/middleware/query');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sfale.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect()
        console.log("db connected")

        app.post('/login', async (req, res) => {
            const email = req.body;
            console.log(email)
            const token = jwt.sign(email, process.env.ACCESSTOKEN, { expiresIn: '1d' });
            res.send(token)
        })

        app.get('/foods/:type', async (req, res) => {
            const type = req.params.type;
            const connectionFood = client.db('foodOnion').collection(type)
            const cursor = connectionFood.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/food', async (req, res) => {
            const type = req.query.type;
            const id = req.query.id;
            console.log(id, type)
            const connectionFood = client.db('foodOnion').collection(type)
            const query = {
                _id: ObjectId(id)
            }

            const result = await connectionFood.findOne(query);
            res.send(result)
        })
    } finally {

    }

}
run().catch(console.dir)

/* client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
}); */


app.get('/', (req, res) => {
    res.send(`Server Running at : ${port}`)
})

app.listen(port, () => {
    console.log(`Server Running at : ${port}`)
})

