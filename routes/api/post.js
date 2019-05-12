const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//validation file
const validatePostInput = require("../../validation/post");

router.get("/test", (req, res) => {
  res.json({
    msg: "Post works"
  });
});

//get posts
router.get("/", (req, res) => {
  Post.find()
    .sort({
      date: -1
    })
    .then(posts => {
      if (!posts) {
        return res.status(404).json({
          noposts: "no posts found"
        });
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
          .json({
            nopostfound: "No Post found with that id"
          });
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
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const {
      errors,
      isValid
    } = validatePostInput(req.body);

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

//delete post
router.delete(
  "/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id).then(post => {
        //check for post owner
        //console.log(post.user);
        //console.log(req.user.id);
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({
            notauthorized: "User not authorized"
          });
        }
        if (!post) {
          return res.status(404).json({
            postnotfound: "No Post found"
          });
        }
        post
          .remove()
          .then(() => {
            res.json({
              msg: "Post deleted"
            });
          })
          .catch(err => {
            res.status(404).json(err);
          });
      });
    });
  }
);

//like post
router.post(
  "/like/:postid",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.postid).then(post => {
        if (!post) {
          return res.status(404).json({
            postnotfound: "No Post found"
          });
        }
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
          .length > 0
        ) {
          return res
            .status(400)
            .json({
              alreadyliked: "User already liked this post"
            });
        }
        //add user id to post array
        post.likes.unshift({
          user: req.user.id
        });

        post.save().then(post => {
          res.json(post);
        });
      });
    });
  }
);

//unlike post
router.post(
  "/unlike/:postid",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.postid).then(post => {
        if (!post) {
          return res.status(404).json({
            postnotfound: "No Post found"
          });
        }
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
          .length === 0
        ) {
          return res
            .status(400)
            .json({
              notliked: "You have not liked the post"
            });
        }
        //get remove index
        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);

        //remove out of array
        post.likes.splice(removeIndex, 1);

        post
          .save()
          .then(post => {
            res.json(post);
          })
          .catch(err => {
            res.status(404).json(err);
          });
      });
    });
  }
);

module.exports = router;