import mongoose from "mongoose";

const connectDB = (url)=>{
    console.log("Connected to db")
    return (
        mongoose.connect(url)
    )
}

export default connectDB;