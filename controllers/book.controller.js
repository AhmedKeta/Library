const mongoose = require("mongoose");
const BookModel = mongoose.model("Book");
const MemberModel = mongoose.model("Member");
const booksPerPage = 12;

exports.addNewBook = (req, res, next) => {
  let newBook = new BookModel({
    title: req.body.title,
    auther: req.body.auther,
    pages: req.body.pages,
    copies: req.body.copies,
    shelf: req.body.copies,
    borrowed: [],
  });
  newBook
    .save()
    .then((book) => {
      res.status(201).json({ message: "ok", book });
    })
    .catch((err) => next(err));
};

exports.getAllBooks = (req, res, next) => {
  BookModel.find({}, { title: 1, auther: 1, pages: 1, copies: 1, shelf: 1 })
    .skip((req.params.page - 1) * booksPerPage)
    .limit(booksPerPage)
    .then((books) => {
      res.status(200).json({ message: "ok", books });
    })
    .catch((err) => next(err));
};

exports.getAllAvailableBooks = (req, res, next) => {
  BookModel.find(
    { shelf: { $gte: 2 } },
    { title: 1, auther: 1, pages: 1, copies: 1, shelf: 1 }
  )
    .skip((req.params.page - 1) * booksPerPage)
    .limit(booksPerPage)
    .then((books) => {
      res.status(200).json({ message: "ok", books });
    })
    .catch((err) => next(err));
};

exports.getAllBorrowedBooks = (req, res, next) => {
  BookModel.find(
    { borrowed: { $exists: true } },
    { title: 1, auther: 1, pages: 1, copies: 1, shelf: 1, borrowed: 1 }
  )
    .skip((req.params.page - 1) * booksPerPage)
    .limit(booksPerPage)
    .populate("borrowed")
    .then((books) => {
      res.status(200).json({ message: "ok", books });
    })
    .catch((err) => next(err));
};

exports.borrowToMember = (req, res, next) => {
  MemberModel.findOne({ email: req.body.email })
    .then((member) => {
      if (!member) {
        let error = new Error("Wrong email!!");
        error.status = 422;
        next(error);
      }
      req.member = member._id;
      return BookModel.findOne({ _id: req.body.id });
    })
    .then((book) => {
      console.log(book)
      if (book.shelf >= 2 && !book.borrowed.includes(req.member)) {
        book.shelf--;
        book.borrowed.push(req.member);
        return BookModel.updateOne(
          { _id: book._id },
          { shelf: book.shelf, borrowed: book.borrowed }
        );
      } else {
        let error = new Error("Not enough cpies!!");
        error.status = 422;
        next(error);
      }
    })
    .then((data) => {
      if (data.matchedCount) {
        res.status(201).json({ message: "ok" });
      } else {
        throw new Error("No book modified!!");
      }
    })
    .catch((err) => next(err));
};

exports.returnFromMember = (req, res, next) => {
  MemberModel.findOne({ email: req.body.email })
    .then((member) => {
      if (!member) {
        let error = new Error("Wrong email!!");
        error.status = 422;
        next(error);
      }
      req.member = member._id;
      return BookModel.findOne({ _id: req.body.id });
    })
    .then((book) => {
      if (book.borrowed.includes(req.member)) {
        book.shelf++;
        book.borrowed.splice(book.borrowed.indexOf(5), 1);
        return BookModel.updateOne({ _id: book._id }, { shelf: book.shelf, borrowed: book.borrowed});
      } else {
        let error = new Error("Not in borrowed list!!");
        error.status = 422;
        next(error);
      }
    })
    .then(() => {
      return BookModel.updateOne(
        { _id: req.body._id },
        { $pull: { borrowed: req.member } }
      );
    })
    .then((data) => {
      if (data) {
        res.status(201).json({ message: "ok" });
      } else {
        throw new Error("No book modified!!");
      }
    })
    .catch((err) => next(err));
};

exports.searchInBooks = (req, res, next) => {
  BookModel.find(
    { $text: { $search: req.params.text } },
    { title: 1, auther: 1, pages: 1, copies: 1, shelf: 1 }
  )
    .then((books) => {
      res.status(200).json({ message: "ok", books });
    })
    .catch((err) => next(err));
};
