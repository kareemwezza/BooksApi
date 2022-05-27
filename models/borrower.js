const fs = require("fs");
const path = require("path");

const { getBooks } = require("../utils/fileReader");

const p = path.resolve(__dirname, "../", "data", "borrowers.json");

const getBorrowers = (cb) => {
  fs.readFile(p, (err, data) => {
    if (err) {
      console.log(err);
      return cb([]);
    }
    cb(JSON.parse(data));
  });
};

module.exports = class Borrower {
  constructor(id, fName, lName, books = []) {
    this.id = id;
    this.fName = fName;
    this.lName = lName;
    this.books = books;
  }

  save(cb) {
    return getBorrowers((borrowers) => {
      let newBorrowers = [...borrowers];
      if (!this.id) {
        this.id = new Date().getTime().toString();
        newBorrowers.push(this);
      } else {
        const borrowerIndex = newBorrowers.findIndex((b) => b.id === this.id);
        newBorrowers[borrowerIndex] = this;
      }
      fs.writeFile(p, JSON.stringify(newBorrowers), (err) => {
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
    return getBorrowers(cb);
  }

  static findById(id, cb) {
    console.log(id);
    return getBorrowers((borrowers) => {
      console.log(borrowers);
      const foundBorrower = borrowers.find((b) => b.id === id);
      console.log(foundBorrower);
      return cb(foundBorrower);
    });
  }

  static deleteById(id, cb) {
    return getBorrowers((borrowers) => {
      const foundBorrower = borrowers.find((b) => b.id === id);
      const updatedBorrowers = borrowers.filter((b) => {
        return b.id !== id;
      });
      fs.writeFile(p, JSON.stringify(updatedBorrowers), (err) => {
        if (!err) {
          return cb(foundBorrower);
        }
        const error = new Error("Internal Server Error.");
        error.statusCode = 501;
        throw error;
      });
    });
  }

  static getBooks(id, cb) {
    return getBorrowers((borrowers) => {
      return getBooks((allBooks) => {
        const foundBorrower = borrowers.find((b) => b.id === id);
        if (!foundBorrower) {
          return cb([]);
        }
        const books = foundBorrower.books;
        const detailedBooks = allBooks.filter((book) => {
          console.log(book.author);
          return books.includes(book.id);
        });
        return cb(detailedBooks);
      });
    });
  }
};
