const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//load models
const User = require('../../models/User');

router.get('/test', (req,res) =>{
    res.json({msg: 'User works'});
});

router.post('/register',(req,res) =>{
    User.findOne({email: req.body.email}).then((user) =>{
        if(user){
            return res.status(400).json();
        }
        else{
            const avatar = gravatar.url(req.body.email,{
                s: '200', //sie
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
       if(!user){
           return res.status(404).json({email: 'user  not found'})
       }
       //check password
       bcrypt.compare(password,user.password).then((isMatch) =>{
           if(isMatch){
               res.json({msg: 'Success'});
           }
           else{
               return res.status(400).json({password: 'password incorrect'})
           }
       });
   })
});

module.exports = router
