import mongoose from "mongoose";
const mongoUri = process.env.MONGODB_URL;

if (!mongoUri) {
  throw new Error("MONGO_URI enviroment variable is not defined");
}
let connection = {};

const connectToDb = async () => {
  try {
    // using already estabish connection
    if (connection.isConnected) {
      console.log("Already connected to the database");
      return;
    }
    // try to connect to db if we are not connected
    const db = await mongoose.connect(mongoUri, {
      dbName: "instaclone",
      serverSelectionTimeoutMS: 45000,
      socketTimeoutMS: 5000,
    });
    connection.isConnected = db.connections[0].readyState === 1;
    if (connection.isConnected) {
      console.log("MongoDb connected successfully");

      //handle connection event's

      mongoose.connection.on("error", (error) => {
        console.log("Mongodb connection error", error);
      });
      mongoose.connection.on("disconnected", () => {
        console.log("mongoDb disconnected");
        connection.isConnected = false;
      });
      process.on("SIGINT", async () => {
        await mongoose.connection.close();
        console.log("MongoDb connection close through app termination");
        process.exit(0);
      });
    }
  } catch (error) {
    console.error("Mongodb connection failed", error.message);
    connection.isConnected = false;
    throw new error("Failed to connect to MongoDb", error.message);
  }
};

export default connectToDb;
