const express = require("express");
const routes = express.Router({});
const User = require("../models/users.js");
const wrapAsync = require("../ErrorFiles/wrapAsync");
const flash = require("connect-flash");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

routes.route("/signup")
    .get(userController.createSignup)
    .post(wrapAsync(userController.setSignup));

routes.route("/login")
    .get(userController.createLogin)
    .post(saveRedirectUrl,
        passport.authenticate("local",
            {
                failureRedirect: '/login',
                failureFlash: true
            }),
        userController.setLogin
    );

// for logout page
routes.get("/logout", userController.createLogout);

module.exports = routes;