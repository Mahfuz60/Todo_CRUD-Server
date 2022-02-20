const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const Port = 5000;
const app = express();
//middleware
app.use(express.json());
app.use(cors());

//MongoDB Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hegct.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(process.env.DB_USER)
async function run() {
  try {
    await client.connect();
    const database = client.db("website");
    const userCollection = database.collection("users");

    //GET API Users
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    //POST Api Users
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      // console.log("added new User", result);
      res.json(result);
    });

    //Find User
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await userCollection.findOne(query);
      res.send(user);
      // console.log("getting id", id);
    });

    //UPDATE User APi (PUT method)
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateUser.name,
          email: updateUser.email,
          address: updateUser.address,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      // console.log("updating user", id);
      res.json(result);
    });

    //DELETE APi USERS
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      console.log("deleted user id", result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(Port, () => {
  console.log(`listening on port:${Port}`);
});
