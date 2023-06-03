import bookModel from "../../DB/models/books.models.js";
import { updateBooksfine } from "./../../utils/updatebooksfine.js";

// add book
export const addBook = async (req, res, next) => {
  const { title, category, author } = req.body;
 
  if (!req.file) {
    return next(new Error('please choose image ',{cause:400}))
  }
  const newBook = new bookModel({
    title,
    category,
    author,
    book_pic:req.file.path
  });
  const savedbook = await newBook.save();
  if (savedbook) {
    res.status(200).json({ message: "book added success", book: savedbook });
  } else {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// issu book from user
export const issueBook = async (req, res, next) => {
  const { bookId } = req.params;
  const { returndDate } = req.body;
  const user = req.user;

  const currectBook = await bookModel.findById(bookId);
  if (!currectBook) {
    return next(new Error("invalid id"));
  }

  const issuedbook = await bookModel.findOneAndUpdate(
    { _id: bookId, issued: false },
    { issuedfrom: user._id, issued: true, issuedDate: new Date(), returndDate },

    { new: true }
  );

  if (issuedbook) {
    res
      .status(201)
      .json({ message: `issued succesful by ${user.fullname}`, issuedbook });
  } else {
    next(new Error("book already issued "));
  }
};

// get all books
export const getAllBooks = async (req, res, next) => {
  const books = await bookModel.find({});
  if (books.length) {
    res.status(200).json({ message: " succesfully", books });
  } else {
    res.status(500).json({
      message: "there is no books",
    });
  }
};

// get issued books from auth user
export const getIssuedBooks = async (req, res, next) => {
  const user = req.user;
  const books = await bookModel.find({ issuedfrom: user._id });

  if (books.length) {
    // function to update the date and late and fine
    updateBooksfine(books);
    res.status(200).json({ message: " succesfully", books });
  } else {
    res.status(500).json({
      message: "there is no books",
    });
  }
};

// get not returned books which late greater than 0
export const getNotReturnedBooks = async (req, res, next) => {
  const user = req.user;

  const books = await bookModel.find({ issuedfrom: user._id, issued: true });
  if (books.length) {
    // function to update the date and late and fine
    updateBooksfine(books);
    const booksnotreturned = books.filter((book) => book.late > 0);
    res.status(200).json({ message: "success", booksnotreturned });
  } else {
    next(new Error("No books found"));
  }
};

// search
export const searchBooks = async (req, res, next) => {
  const { search } = req.params;
  const user = req.user;
  const books = await bookModel.find({
    issuedfrom: user._id,
    issued: true,
    title: { $regex: `^${search}` },
  });
  // function to update the date and late and fine
  updateBooksfine(books);
  if (books.length) {
    const booksnotreturnedSearch = books.filter((book) => book.late > 0);
    res.status(200).json({ message: "success", booksnotreturnedSearch });
  } else {
    next(new Error("no books"));
  }
};

// return book
export const returnBook = async (req, res, next) => {
  const { bookId } = req.params;

  const user = req.user;
  const bookreturned = await bookModel.findOneAndUpdate(
    { _id: bookId, issued: true, issuedfrom: user._id },
    {
      issued: false,
      issuedDate: null,
      returndDate: null,
      issuedfrom: null,
      late: 0,
      fine: 0,
    }
  );

  if (bookreturned) {
    res.status(200).json({ message: " return book  success thanks" });
  } else {
    next(new Error("update fail "));
  }
};
