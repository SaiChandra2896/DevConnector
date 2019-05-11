const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../../models/Post");

//validation file
const validatePostInput = require("../../validation/post");

router.get("/test", (req, res) => {
  res.json({ msg: "Post works" });
});

//get posts
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      if (!posts) {
        return res.status(404).json({ noposts: "no posts found" });
      }
      res.json(posts);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

//find post by id
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res
          .status(404)
          .json({ nopostfound: "No Post found with that id" });
      }
      res.json(post);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

//create post
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => {
      res.json(post);
    });
  }
);

module.exports = router;
