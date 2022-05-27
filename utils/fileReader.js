const fs = require("fs");
const path = require("path");

const pborrowers = path.resolve(__dirname, "../", "data", "borrowers.json");
const pbooks = path.resolve(__dirname, "../", "data", "books.json");

const getBorrowers = (cb) => {
  fs.readFile(pborrowers, (err, data) => {
    if (err) {
      console.log(err);
      return cb([]);
    }
    cb(JSON.parse(data));
  });
};

const getBooks = (cb) => {
  fs.readFile(pbooks, (err, data) => {
    if (err) {
      console.log(err);
      return cb([]);
    }
    cb(JSON.parse(data));
  });
};

module.exports = {
  getBorrowers,
  getBooks,
};
