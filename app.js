// mean when we production or host our website then .env file can't show to any one
if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
// ejsMate is used when we give same styling to different filles while we creating differently
// we make single file and make past command in different fille that used that file

// for password
const Localpassport = require("passport-local");
const passport = require("passport");
const User = require("./models/users.js");

// adding error handling-middle
const ExpressError = require("./ErrorFiles/ExpressError.js");

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const listenRoute = require("./routes/listening.js");
const reviewRoute = require("./routes/reviews.js");
const userRoute = require("./routes/user.js");

const dbURL = process.env.CLOUD_URL;

main()
    .then(res => {
        console.log("connected to DB");
    })
    .catch(err => {
        console.log("error is formed");
    });

async function main() {
    await mongoose.connect(dbURL);
}

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("error is formed", err);
});

app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date() * 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use((req, res, next) => {
    res.locals.currUser = req.user || null;
    console.log("Current user in middleware:", req.user);
    next();
});

// for passwords
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currUser = req.user || null;
    console.log("currUser middleware hit:", req.user);
    next();
});

passport.use(new Localpassport(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.render("home");
});
app.use("/listening", listenRoute);
app.use("/listening/:id/review", reviewRoute);
app.use("/", userRoute);

// if no route is match when add into the localHost if it not match then this code will execute
app.all("*", (req, res, next) => {
    next(new ExpressError(401, "PAGE IS NOT FOUND"));
});

// error through middleware and route
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something want wrong! Please try agian" } = err;
    res.status(statusCode).render("listening/error.ejs", { message });
});

app.listen(8080, () => {
    console.log("server is listening at 8080");
});