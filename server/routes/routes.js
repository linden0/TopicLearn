const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AWS = require('aws-sdk');
const Router = express.Router();
const multer = require('multer');

const dbo = require("../db/connection");

const ObjectId = require("mongodb").ObjectId;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const upload = multer({
  limits: {
    fileSize: 5000000 // 5 MB
  }
});

Router.post("/register", async function (req, res) {
  let db_connect = dbo.getDb();
  let Users = db_connect.collection("users");
  let user = req.body;
  user = {...user, liked:[], topics:[]}
  const takenEmail = await Users.findOne({email: user.email});

  if (takenEmail) {
    res.json({message: "Username or email has already been taken"})
  } else {
    user.password = await bcrypt.hash(req.body.password, 10);
    await Users.insertOne(user);

    Users.findOne({email: user.email})
    .then(dbUser => {
      const payload = {
        id: dbUser._id,
        email: dbUser.email
      }
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: 86400},
        (err, token) => {
          if (err) return res.json(({message:"err"}))
          return res.json({
            message:"Success",
            token: "Bearer " + token
          })
        }
      )
    })
  }

});

Router.post("/login", (req, res) => {
  let db_connect = dbo.getDb();
  let Users = db_connect.collection("users");
  const userLoggingIn = req.body;
  
  Users.findOne({email: userLoggingIn.email})
  .then(dbUser => {
    if (!dbUser) {
      return res.json({
        message: "Invalid email or password"
      })
    }
    bcrypt.compare(userLoggingIn.password, dbUser.password)
    .then(isCorrect => {
      if (isCorrect) {
        const payload = {
          id: dbUser._id,
          email: dbUser.email
        }
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {expiresIn: 86400},
          (err, token) => {
            if (err) return res.json(({message:"err"}))
            return res.json({
              message:"Success",
              token: "Bearer " + token
            })
          }
        )
      } else {
        return res.json({
          message: "Invalid email or password"
        })
      }
    })

  })
})

function verifyJWT(req, res, next) {
  const token = req.headers["x-access-token"]?.split(' ')[1]
  console.log(req.body)
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.json({
        isAuthenticated: false,
        message: "Failed to authenticate"
      })
      req.user = {};
      req.user.id = decoded.id;
      req.user.email = decoded.email;
      next();
    })
  } else {
    res.json({message: "Incorrect token given", isAuthenticated: false})
  }
}
Router.post("/createPost", verifyJWT, upload.single('image'), (req, res) => {
  let db_connect = dbo.getDb();
  let Posts = db_connect.collection("posts");

  let postId = new ObjectId();
  let post = {...req.body, _id: postId, authorId:req.user.id, date: new Date(), likes: 0, previousDate: new Date(), previousNumLikes: 0, trendScore: 0, topics: []}
  Posts.insertOne(post);

  const image = req.file;
  if (image.mimetype.slice(0, 5) !== 'image') {
    return res.status(400).send({ message: 'File is not an image' });
  }
  const params = {
    Bucket: 'topiclearn',
    Key: postId.toHexString(),
    Body: image.buffer,
    ContentType: image.mimetype
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
    }
  })
  res.json({isAuthenticated:true})

})
Router.get("/isUserAuthenticated", verifyJWT, (req, res) => {
  res.json({isAuthenticated: true, email: req.user.email})
})


module.exports = Router;
