const User = require("../models/users.js");

// for signup
module.exports.createSignup = async (req, res) => {
    res.render("../views/users/signUp.ejs");
};

// for set signup
module.exports.setSignup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        let result = await User.register(newUser, password);
        if (req.login(result, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", "Welcome to wanderlust");
            res.redirect("/listening");
        }));
    } catch (e) {
        req.flash("error", "Username is already exist");
        res.redirect("/signUp");
    }
};

// for login page
module.exports.createLogin = async (req, res) => {
    res.render("../views/users/login.ejs");
};

// for set login
module.exports.setLogin = async (req, res) => {
    req.flash("success", "your login is successfull");
    let NewredirectUrl = res.locals.NewredirectUrl || ("/listening");
    res.redirect(NewredirectUrl);
};

// for logout
module.exports.createLogout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfull logOut");
        res.redirect("/listening");
    });
};