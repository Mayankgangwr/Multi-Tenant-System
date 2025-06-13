import mongoose from "mongoose";
import { DB_NAME } from "../constants";
import configENV from "./configENV";

const connectDB = async () => {
    try {
        const baseURI = configENV.DATABASE_URI;
        const connectionString = `${baseURI.replace(/\/$/, "")}/${DB_NAME}`;

        const connectionInstance = await mongoose.connect(connectionString);
        const { host, port } = connectionInstance.connection;
        console.log(`\n MONGODB connection !! DB HOST: ${host}:${port}`)
    } catch (error) {
        console.error(`MONGODB connection error ${error}`);
        process.exit(1);
    }
};

export default connectDB;

