const express = require("express");
const routes = require("./routes/index");

const app = express();

app.use(express.json());

app.use("/api/v1", routes);

app.use((error, req, res, next) => {
  console.log("An error Occurred.");
  res.status(error.statusCode || 500);
  res.json({ msg: error });
});

app.listen(process.env.PORT, () => {
  console.log("Server Running successfuly on port 4000");
});
