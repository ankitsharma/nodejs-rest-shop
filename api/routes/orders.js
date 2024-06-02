const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//import the model in API Router file.
const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Order.find()
    .select("quantity , priceId , _id")
    .populate("productId", "name _id")
    .exec()
    .then((docs) => {
      console.log(docs);
      const response = {
        count: docs.length,
        order: docs.map((doc) => {
          return {
            productId: doc.productId,
            quantity: doc.quantity,
            id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      };
      // if (docs.length > 0) {
      res.status(200).json(response);
      // } else {
      //res.status(404).json({ message: "No Record Found" });
      // }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product does not exists" });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        productId: req.body.productId,
        quantity: req.body.quantity,
      });
      order
        .save()
        .then((result) => {
          console.log("Order placed successfully");
          res.status(201).json({ result });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        messgage: "Please try again",
        error: err,
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .exec()
    .then((doc) => {
      console.log("from Database: ", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No Record Found for ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  message = "Updated Order ";
  res.status(200).json({
    message: message,
    Id: id,
  });
});

router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.put("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling POST request to /products",
  });
});

module.exports = router;
