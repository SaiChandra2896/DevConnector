const mongoose = require('mongoose');
const express = require('express'); 
const bodyParser = require('body-parser');
const passport = require('passport');

const user = require('./routes/api/user');
const profile = require('./routes/api/profile');
const post = require('./routes/api/post');

const app = express();

//body parser middleware to use req.user
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;

//connect to mongodb
mongoose.connect(db,{useNewUrlParser: true}).then(() => console.log('mongodb connected')).catch((err) =>console.log(err));

const port = process.env.PORT || 5000;

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);

//use routes
app.use('/api/user',user);
app.use('/api/profile',profile);
app.use('/api/post',post);


app.listen(port,() =>{
    console.log('server is up on port '+port);
});