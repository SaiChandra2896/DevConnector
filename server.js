const mongoose = require('mongoose');
const express = require('express');

const user = require('./routes/api/user');
const profile = require('./routes/api/profile');
const post = require('./routes/api/post');

const app = express();

//DB config
const db = require('./config/keys').mongoURI;

//connect to mongodb
mongoose.connect(db,{useNewUrlParser: true}).then(() => console.log('mongodb connected')).catch((err) =>console.log(err));

const port = process.env.PORT || 5000;

app.get('/',(req,res) =>{
    res.send('Hello!!');
});

//use routes
app.use('/api/user',user);
app.use('/api/profile',profile);
app.use('/api/post',post);


app.listen(port,() =>{
    console.log('server is up on port '+port);
});