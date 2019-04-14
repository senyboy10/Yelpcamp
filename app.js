//Create the express framework
var express = require("express"),
    app = express(),
    port = 3000,
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require('method-override'),
    flash = require("connect-flash"),

Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    User = require("./models/user");

//Requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require('./routes/index');

//add three new campgrounds sample everything the server restarts
//seedDB();

//open connection with mongoDB for the yelcamp DB

mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true }, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("successful connection to local mongoDB");
    }
});
//console.log(process.env.DATABASEURL);
// process.env.databaseURL= "mongodb+srv://senyboy10:<         >@firstcluster-iauqk.mongodb.net/?retryWrites=true";
// mongoose.connect(uri, { useNewUrlParser: true }, function(err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("mongoose atlas was successfully connected");
//     }
// });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//--------PASSPORT AUTHENTICATION CONFIGURATION--------------
app.use(require('express-session')({
    secret: 'keyword for the yelpcamp application',
    resave: false,
    saveUninitialized: false
}));

//use passport in an express based application, configure it
//with the required passport.initialize()
app.use(passport.initialize());

//passport.session(): middleware use for persistent login sessions
app.use(passport.session());


//UserSchema authentication strategies
passport.use(new LocalStrategy(User.authenticate()));


//authenticated user must be serialized to the session for 
//persistent sessions to work and deserialized when subsequent
//request is made
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//----------------------------------------------------------
//function to pass the user in every page &
//falsh on every page

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//use all routes that are required
app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);




app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelCamp Server has Started!");
});

//process.env.PORT, process.env.IP, function()