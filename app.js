const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

/*app.use('/', (req,res,next) => {
    res.send('hello world');
});*/

console.log("app.js initiated");

//constants for all Express route files.
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/users");

//log the request for each route.
app.use(morgan("dev"));

mongoose.connect(
  "<mongodb+srv://<user-name>:" +
    process.env.MONGO_ATLAS_PW +
    "@<MongoDB Atlas URL>",
  {
    dbName: "<DB Name>",
  }
);

//Parse the body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Prevent CORS Error (Cross-Origin Resource Sharing)
/*app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin,X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Contol-Allow-Methods", "PUT, POST, PATCH, GET, DELETE");
    return res.status(200).json({});
  }
});*/

// Map the routes with actual route files.
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

//Error Handling for Not found URL
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

//Error handler with message detail if anything is coming other that 404. It will through the error 500 with detailed message.
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
