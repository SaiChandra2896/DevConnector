const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const gravator = require('gravator');

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
            const avatar = gravator.url(req.body.email,{
                s: '200', //sie
                r: 'pg', //rating
                d: 'mm' //default
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            })
        }
    })
});

module.exports = router
