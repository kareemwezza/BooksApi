const { Router } = require("express");
const { nextTick } = require("process");
const Borrower = require("../models/borrower");
const Author = require("../models/author");
const Book = require("../models/book");

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello to our Books API V1.");
});

// All books routes
router.get("/books", (req, res) => {
  const page = req.query.page || 1;
  const itemsPerReq = 5;

  Book.getAll((books) => {
    const result = books.slice(
      itemsPerReq * page - itemsPerReq,
      itemsPerReq * page
    );
    res.status(200).json(result);
  });
});

router.get("/books/:isbn", (req, res) => {
  const { isbn } = req.params;
  Book.findByIsbn(isbn, (book) => {
    if (!book) {
      return res.status(404).json({ msg: "No Book Found with such isbn." });
    }
    return res.status(200).json(book);
  });
});

router.post("/books", (req, res) => {
  const isbnPattern = /^[1-9][0-9]{9}$/;
  const { title, isbn, language, pages, authors = [] } = req.body;
  if (pages < 50) {
    return res
      .status(406)
      .json({ msg: "Can't add this book, Pages less than 50." });
  }
  if (language !== "ar" && language !== "en") {
    return res
      .status(406)
      .json({ msg: "Can't add this book, Language should be ar OR en." });
  }
  if (!isbnPattern.test(isbn)) {
    return res
      .status(406)
      .json({ msg: "isbn should be 10 numbers and doesn't start with 0." });
  }
  const book = new Book(title, language, pages, isbn, authors);
  book.save((b) => {
    res.status(201).json({ msg: "Book Created Successfully!", borrower: b });
  });
});

router.put("/books/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { title, language, pages, authors = [] } = req.body;
  if (pages < 50) {
    return res
      .status(406)
      .json({ msg: "Can't add this book, Pages less than 50." });
  }
  if (language !== "ar" && language !== "en") {
    return res
      .status(406)
      .json({ msg: "Can't add this book, Language should be ar OR en." });
  }
  const book = new Book(title, language, pages, isbn, authors);
  book.save((b) => {
    res.status(201).json({ msg: "Book Updated Successfully!", borrower: b });
  });
});

router.delete("/books/:isbn", (req, res) => {
  const { isbn } = req.params;
  Book.deleteByIsbn(isbn, (book) => {
    if (!book) {
      return res.status(404).json({ msg: "No such Book found!" });
    }
    return res
      .status(200)
      .json({ msg: "Book deleted successfully!", Book: book });
  });
});

// Borrowers
router.get("/borrowers", (req, res) => {
  Borrower.getAll((b) => {
    res.status(200).json(b);
  });
});

router.get("/borrowers/:id", (req, res) => {
  const { id } = req.params;
  Borrower.findById(id, (b) => {
    if (!b) {
      return res.status(404).json({ msg: "No Borrower Found with such ID." });
    }
    return res.status(200).json(b);
  });
});

router.post("/borrowers", async (req, res) => {
  const { fName, lName, books = [] } = req.body;
  let borrower = new Borrower(null, fName, lName, books);
  borrower.save((b) => {
    res
      .status(201)
      .json({ msg: "new borrower created successfully.", borrower: b });
  });
});

router.put("/borrowers/:id", (req, res) => {
  const { id } = req.params;
  const { fName, lName, books = [] } = req.body;
  if (!id) {
    res.status(404).json({ msg: "No Such Borrower Found!" });
  }
  const borrower = new Borrower(id, fName, lName, books);
  borrower.save((b) => {
    res
      .status(201)
      .json({ msg: "Borrower Updated Successfully!", borrower: b });
  });
});

router.get("/borrowers/:id/books", (req, res, next) => {
  const { id } = req.params;

  Borrower.getBooks(id, (books) => {
    return res.status(200).json({ books });
  });
});

router.delete("/borrowers/:id", (req, res) => {
  const { id } = req.params;
  Borrower.deleteById(id, (b) => {
    if (!b) {
      return res.status(404).json({ msg: "No such borrower found!" });
    }
    return res
      .status(200)
      .json({ msg: "Borrower deleted successfully!", borrower: b });
  });
});

// Authors
router.get("/authors", (req, res) => {
  Author.getAll((a) => {
    res.status(200).json(a);
  });
});

router.get("/authors/:id", (req, res) => {
  const { id } = req.params;
  Author.findById(id, (author) => {
    if (!author) {
      return res.status(404).json({ msg: "No Author Found with such ID." });
    }
    return res.status(200).json(author);
  });
});

router.get("/authors/:id/books", (req, res) => {
  const { id } = req.params;
  Author.getBooks(id, (books) => {
    return res.status(200).json({ books });
  });
});

router.post("/authors", (req, res) => {
  const { fName, lName } = req.body;
  let author = new Author(null, fName, lName);
  author.save((author) => {
    res
      .status(201)
      .json({ msg: "New Author Created Successfully.", Author: author });
  });
});

router.put("/authors/:id", (req, res) => {
  const { id } = req.params;
  const { fName, lName } = req.body;
  if (!id) {
    res.status(404).json({ msg: "No Such Author Found!" });
  }
  const author = new Author(id, fName, lName);
  author.save((author) => {
    res
      .status(201)
      .json({ msg: "Author Updated Successfully!", Author: author });
  });
});

router.delete("/authors/:id", (req, res) => {
  const { id } = req.params;
});

module.exports = router;
