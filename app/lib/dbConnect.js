import mongoose from "mongoose";
import Usermodel from "../models/Usermodel";

const MONGO_URI = process.env.MONGO_URI;

const databaseConnect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await Usermodel.syncIndexes();
    console.log(
      "------------------->> --------------------->> connected to db << ------------------------ <<------------------"
    );
  } catch (err) {
    console.log(err);
  }
};

export default databaseConnect;
