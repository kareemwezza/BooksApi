const fs = require("fs");
const path = require("path");

const p = path.resolve(__dirname, "../", "data", "books.json");

const getBooks = (cb) => {
  fs.readFile(p, (err, data) => {
    if (err) {
      console.log(err);
      return cb([]);
    }
    cb(JSON.parse(data));
  });
};

module.exports = class Book {
  constructor(title, language, pages, isbn, authors = []) {
    this.id = null;
    this.title = title;
    this.language = language;
    this.pages = pages;
    this.isbn = isbn;
    this.authors = authors;
  }

  save(cb) {
    return getBooks((books) => {
      let newBooks = [...books];
      const foundBook = newBooks.find((book) => book.isbn === this.isbn);
      if (!foundBook) {
        this.id = new Date().getTime().toString();
        newBooks.push(this);
      } else {
        this.id = foundBook.id;
        const bookIndex = newBooks.findIndex((book) => book.isbn === this.isbn);
        newBooks[bookIndex] = this;
      }
      fs.writeFile(p, JSON.stringify(newBooks), (err) => {
        if (!err) {
          return cb(this);
        }
        const error = new Error("Internal Server Error!");
        error.statusCode = 501;
        throw error;
      });
    });
  }

  static getAll(cb) {
    return getBooks(cb);
  }

  static findByIsbn(isbn, cb) {
    return getBooks((books) => {
      const foundBooks = books.find((b) => b.isbn === isbn);
      return cb(foundBooks);
    });
  }

  static deleteByIsbn(isbn, cb) {
    return getBooks((books) => {
      const foundBook = books.find((b) => b.isbn === isbn);
      const updatedBooks = books.filter((b) => {
        return b.isbn !== isbn;
      });
      fs.writeFile(p, JSON.stringify(updatedBooks), (err) => {
        if (!err) {
          return cb(foundBook);
        }
        const error = new Error("Internal Server Error.");
        error.statusCode = 501;
        throw error;
      });
    });
  }

  static getBooks(id, cb) {
    return getBooks((authors) => {
      const FoundBorrower = authors.find((b) => b.id === id);
      if (!FoundBorrower) {
        return cb([]);
      }
      const books = FoundBorrower.books;
      return cb(books);
    });
  }
};
