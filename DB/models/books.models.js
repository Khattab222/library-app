import mongoose, { Schema } from "mongoose";

export const bookSchema = new Schema(
  {
    title: String,
    category: String,
    author: String,
    issued: {
      type: Boolean,
      default: false,
    },
    issuedfrom: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    issuedDate: {
      type: Date,
    },
    returndDate: {
      type: Date,
    },
    late: Number,
    fine: Number,
    book_pic:String
  },
  {
    timestamps: true,
  }
);

const bookModel = mongoose.model("Book", bookSchema);
export default bookModel;
