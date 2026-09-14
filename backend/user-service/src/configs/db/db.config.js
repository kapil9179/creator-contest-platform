import mongoose from "mongoose";
import envconfig from "../env/env.config.js";

const connectUserDB = async () => {
  const mongoUri = envconfig.mongouri;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  await mongoose.connect(mongoUri,{
    dbName:envconfig.dbname
  });
  
};

export default connectUserDB;
















