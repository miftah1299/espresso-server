const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//
// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fh7he.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeeCollection = client.db("coffeeDB").collection("coffee");

        app.get("/coffee", async (req, res) => {
            const cursor = coffeeCollection.find({});
            const results = await cursor.toArray();
            // console.log(results);
            res.send(results);
        });

        app.post("/coffee", async (req, res) => {
            const newCoffee = req.body;
            // console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.json(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// Listen
app.get("/", (req, res) => {
    res.send("Coffee Server is running...");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
