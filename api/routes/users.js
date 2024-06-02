const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//import the model in API Router file.
const User = require("../models/user");
const { token } = require("morgan");

const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email }).then((user) => {
    if (user.length >= 1) {
      return res.status(422).json({
        message: " User already registered",
      });
    } else {
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
          });
          user
            .save()
            .then((result) => {
              res.status(201).json({
                message: "User Created",
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ error: err });
            });
        }
      });
    }
  });
});

router.post("/login", (req, res, next) => {
  console.log(
    "process.env.JWT_KEY, : ",
    process.env.JWT_KEY,
    " process.env.MONGO_ATLAS_PW : ",
    process.env.MONGO_ATLAS_PW
  );
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Invalid User Name or email address",
        });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          console.log("result : ", result);
          if (err) {
            return res.status(401).json({
              message: "Auth failed 2",
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id,
              },
              process.env.JWT_KEY,
              { expiresIn: "1h" }
            );
            return res.status(200).json({
              message: "Auth Successful",
              token: token,
            });
          }

          res.status(401).json({ message: "Invalid Password" });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
