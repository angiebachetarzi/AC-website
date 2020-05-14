const express = require("express");
var createError = require('http-errors');
const mongoose = require("mongoose"); 
const bodyParser = require('body-parser');

//On définit notre objet express nommé app
const app = express();

//Body Parser
const urlencodedParser = bodyParser.urlencoded({
    extended: false
});
app.use(urlencodedParser);
app.use(bodyParser.json());

//Using cors CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

//On définit la route Hello
app.get('/hello',function(req,res){
    res.json("Hello World")
})

//Définition et mise en place du port d'écoute
const port = 9000;
app.listen(port, () => console.log(`Listening on port ${port}`));