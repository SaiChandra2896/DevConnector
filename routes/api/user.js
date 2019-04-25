const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../../config/keys')

//load input validation
const validateRegisterInput = require('../../validation/registration');
const validateLoginInput = require('../../validation/login');

//load models
const User = require('../../models/User');

router.get('/test', (req,res) =>{
    res.json({msg: 'User works'});
});

router.post('/register',(req,res) =>{
    const { errors, isValid} = validateRegisterInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email}).then((user) =>{
        if(user){
            return res.status(400).json({error: 'user exists'});
        }
        else{
            const avatar = gravatar.url(req.body.email,{
                s: '200', //size
                r: 'pg', //rating
                d: 'mm' //default
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err,salt) =>{
                bcrypt.hash(newUser.password,salt,(err, hash) =>{
                    if(err){
                        throw err;
                    }
                    newUser.password = hash;
                    newUser.save().then((user) =>res.json(user)).catch((err) => console.log(err));
                });
            });
        }
    });
});

router.post('/login', (req,res) =>{
   const email = req.body.email;
   const password = req.body.password;

   //find user by email
   User.findOne({email}).then((user) =>{
    const { errors, isValid} = validateLoginInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

       if(!user){
           errors.email = 'user  not found'
           return res.status(404).json(errors)
       }
       //check password
       bcrypt.compare(password,user.password).then((isMatch) =>{
           if(isMatch){
               //user matched sign token
               const payload = {id: user.id, name: user.name, avatar: user.avatar}; //create jwt payload
               jwt.sign(payload,keys.secretOrKey,{ expiresIn: 3600 },(err,token) =>{
                   res.json({
                       success: true, 
                       token: 'Bearer '+token
                   })
               });
           }
           else{
               return res.status(400).json({password: 'password incorrect'})
           }
       });
   })
});

//return current user (private route)
router.get('/current',passport.authenticate('jwt',{session: false}),(req,res) =>{
    res.json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router
