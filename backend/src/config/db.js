const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is missing. Please define it in your environment settings.");
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB connected successfully to host: ${conn.connection.host}`);
    console.log(`[Database] Using database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database] Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

