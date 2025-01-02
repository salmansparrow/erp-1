import { MongoClient, ServerApiVersion } from "mongodb";

// MongoDB URI (from your .env file)
const uri = process.env.MONGO_URI;

// Create MongoClient instance with options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbConnect = async () => {
  try {
    // Connect the client to the MongoDB server
    await client.connect();

    // Ping the MongoDB server to check if the connection is successful
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

export default dbConnect;
