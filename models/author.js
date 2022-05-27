const fs = require("fs");
const path = require("path");

const { getBooks } = require("../utils/fileReader");

const p = path.resolve(__dirname, "../", "data", "authors.json");

const getAuthors = (cb) => {
  fs.readFile(p, (err, data) => {
    if (err) {
      console.log(err);
      return cb([]);
    }
    cb(JSON.parse(data));
  });
};

module.exports = class Author {
  constructor(id, fName, lName) {
    this.id = id;
    this.fName = fName;
    this.lName = lName;
  }

  save(cb) {
    return getAuthors((authors) => {
      let newAuthors = [...authors];
      if (!this.id) {
        this.id = new Date().getTime().toString();
        newAuthors.push(this);
      } else {
        const authorIndex = newAuthors.findIndex((b) => b.id === this.id);
        newAuthors[authorIndex] = this;
      }
      fs.writeFile(p, JSON.stringify(newAuthors), (err) => {
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
    return getAuthors(cb);
  }

  static findById(id, cb) {
    return getAuthors((authors) => {
      const foundAuthor = authors.find((a) => a.id === id);
      return cb(foundAuthor);
    });
  }

  static deleteById(id, cb) {
    return getAuthors((authors) => {
      const foundAuthor = authors.find((b) => b.id === id);
      const updatedAuthors = authors.filter((b) => {
        return b.id !== id;
      });
      fs.writeFile(p, JSON.stringify(updatedAuthors), (err) => {
        if (!err) {
          return cb(foundAuthor);
        }
        const error = new Error("Internal Server Error.");
        error.statusCode = 501;
        throw error;
      });
    });
  }

  static getBooks(id, cb) {
    return getAuthors((authors) => {
      return getBooks((allBooks) => {
        const foundAuthor = authors.find((author) => author.id === id);
        if (!foundAuthor) {
          return cb([]);
        }
        const detailedBooks = allBooks.filter((book) => {
          console.log(book);
          return book.authors.includes(foundAuthor.id);
        });
        return cb(detailedBooks);
      });
    });
  }
};
