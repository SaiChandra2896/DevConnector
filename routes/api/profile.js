const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

//get current users profile
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

//get all profiles
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "No profiles found";
        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => {
      res.status(404).json({ profile: "No Profiles found" });
    });
});

//api/profile/handle/:handle, to get profile by handle
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// to get profile by id
router.get("/user/:user_id", (req, res) => {
  console.log("test");
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

//create and update user profile
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    //console.log(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    //get feilds
    const profileFields = {};
    //getting id from logged in user
    profileFields.user = req.user.id;
    //checking if handle is sent through our form
    if (req.body.handle) {
      profileFields.handle = req.body.handle;
    }
    if (req.body.company) {
      profileFields.company = req.body.company;
    }
    if (req.body.website) {
      profileFields.website = req.body.website;
    }
    if (req.body.location) {
      profileFields.location = req.body.location;
    }
    if (req.body.status) {
      profileFields.status = req.body.status;
    }
    if (req.body.bio) {
      profileFields.bio = req.body.bio;
    }
    if (req.body.githubusername) {
      profileFields.githubusername = req.body.githubusername;
    }
    //skills split into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    //social
    profileFields.social = {};
    if (req.body.youtube) {
      profileFields.social.youtube = req.body.youtube;
    }
    if (req.body.twitter) {
      profileFields.social.twitter = req.body.twitter;
    }
    if (req.body.linkedin) {
      profileFields.social.linkedin = req.body.linkedin;
    }
    if (req.body.facebook) {
      profileFields.social.facebook = req.body.facebook;
    }
    if (req.body.instagram) {
      profileFields.social.instagram = req.body.instagram;
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => {
          res.json(profile);
        });
      } else {
        //create
        //check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }
          //save profile
          new Profile(profileFields).save().then(profile => {
            res.json(profile);
          });
        });
      }
    });
  }
);

//add experience
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    //console.log(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      //add to profile
      profile.experience.unshift(newExp);

      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

//add education
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    //console.log(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        college: req.body.college,
        degree: req.body.degree,
        fieldofStudy: req.body.fieldofStudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      //add to profile
      profile.education.unshift(newEdu);

      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

//delete experience
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //console.log(profile);
        //get index to remove
        const removeindex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);
        //console.log(removeindex);

        //splice out of array
        profile.experience.splice(removeindex, 1);
        //console.log(profile);

        profile.save().then(profile => {
          console.log(profile);
          res.json(profile);
        });
        //console.log(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//delete education
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        console.log(profile);
        //get index to remove
        const removeindex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);
        //console.log(removeindex);

        //splice out of array
        profile.education.splice(removeindex, 1);
        //console.log(profile);

        profile.save().then(profile => {
          console.log(profile);
          res.json(profile);
        });
        //console.log(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//delete user and profile
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ msg: "User removed successfully" });
      });
    });
  }
);

module.exports = router;
