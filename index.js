const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x4tlawd.mongodb.net/?retryWrites=true&w=majority`;

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

    const toyCollection = client.db("toysHub").collection("toys");
    // const addToyCollection = client.db("toysHub").collection("addToy");

    app.get("/toys", async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        projection: {
          picture: 1,
          name: 1,
          seller: 1,
          sellerEmail: 1,
          price: 1,
          rating: 1,
          availableQuantity: 1,
          detailDescription: 1,
        },
      };

      const result = await toyCollection.findOne(query, options);
      res.send(result);
    });

    // added
    app.get("/addToy", async (req, res) => {
      console.log(req.query.Email);
      let query = {};
      if (req.query?.Email) {
        query = { Email: req.query.Email };
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/addToy", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await toyCollection.insertOne(user);
      res.send(result);
    });

    app.patch("/addToy/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updated = req.body;
      console.log(updated);
      const updateDoc = {
        $set: {
          status: updated.status,
        },
      };
      const result = await toyCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/addToy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);
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

app.get("/", (req, res) => {
  res.send("Toys Hub is running");
});

app.listen(port, () => {
  console.log(`Toys Hub Server is running on port: ${port}`);
});
