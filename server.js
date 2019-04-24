const mongoose = require('mongoose');
const express = require('express');

const app = express();

//DB config
const db = require('./config/keys').mongoURI;

//connect to mongodb
mongoose.connect(db,{useNewUrlParser: true}).then(() => console.log('mongodb connected')).catch((err) =>console.log(err));

const port = process.env.PORT || 5000;

app.get('/',(req,res) =>{
    res.send('Hello!!');
});

app.listen(port,() =>{
    console.log('server is up on port '+port);
})