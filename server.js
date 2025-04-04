const moongose = require("mongoose");
moongose.set("strictQuery", false);
const mongoDB = "mongodb+srv://stellarwalletDB:stellarpassword123@stellarwallet.3svl2eh.mongodb.net/?retryWrites=true&w=majority&appName=stellarwallet";

main().catch((err) => console.log(err));
async function main(){
    const conn = moongose.connect(mongoDB);
}

require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const path = require("path");
const debug = require('debug')('stellarwallet:server');

const app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/userRoute");
const { Server } = require('http');
const { default: mongoose } = require("mongoose");

//using the routes
app.use('/api', indexRoutes);
app.use('/user', userRoutes);


//setting the home routes
app.get('/', (req, res)=> {
    res.setEncoding('welcome to stellar app');
});

//start server

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`server running on port ${PORT}`));

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  module.exports = Server