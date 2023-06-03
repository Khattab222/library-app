import mongoose from "mongoose";

export const connectionDb = async () => {
  return await mongoose.connect('mongodb://127.0.0.1:27017/assignment9')
  .then(() => console.log("database connected successfully...."))
  .catch((err) => console.log({message:'connection failed '}, err))
}
mongoose.set('strictQuery', false);