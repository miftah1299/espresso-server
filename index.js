const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
        // await client.connect();

        const coffeeCollection = client.db("coffeeDB").collection("coffee");
        const userCollection = client.db("coffeeDB").collection("users");

        // Routes for CRUD operations
        // Get all coffees
        app.get("/coffee", async (req, res) => {
            const cursor = coffeeCollection.find({});
            const results = await cursor.toArray();
            // console.log(results);
            res.send(results);
        });

        // Get a coffee by id
        app.get("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        });

        // Create a new coffee
        app.post("/coffee", async (req, res) => {
            const newCoffee = req.body;
            // console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        });

        // Update a coffee by id
        app.put("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    chef: updatedCoffee.chef,
                    supplier: updatedCoffee.supplier,
                    taste: updatedCoffee.taste,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo,
                },
            };
            const result = await coffeeCollection.updateOne(
                filter,
                coffee,
                options
            );
            res.send(result);
        });

        // Delete a coffee by id
        app.delete("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
        });

        // User APIs
        // Get all users
        app.get("/users", async (req, res) => {
            const cursor = userCollection.find({});
            const results = await cursor.toArray();
            res.send(results);
        });

        // Create a new user
        app.post("/users", async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });

        // Update a user by email
        app.patch("/users/", async (req, res) => {
            const email = req.body.email;
            const filter = { email };
            const updatedUser = {
                $set: {
                    lastSigninTime: req.body?.lastSigninTime,
                },
            };
            const result = await userCollection.updateOne(filter, updatedUser);
            res.send(result);
        });

        // Delete a user by id
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
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
