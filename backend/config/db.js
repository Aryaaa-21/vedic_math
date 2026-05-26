const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("bufferCommands", false);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (error.reason?.servers) {
      for (const [server, description] of error.reason.servers.entries()) {
        console.error(`MongoDB ${server}: ${description.error?.message || description.type}`);
      }
    }
    console.warn("Server is running, but database operations will fail until MongoDB is connected.");
  }
};

module.exports = connectDB;
