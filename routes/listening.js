const express = require("express");
const routes = express.Router();
const Listen = require("../models/listening.js");
const wrapAsync = require("../ErrorFiles/wrapAsync.js");
const { schemaValidation } = require("../schema.js");
const ExpressError = require("../ErrorFiles/ExpressError.js");
const { loggedIn, isOwner, listingValidation } = require("../middleware.js");
let listingController = require("../controllers/listening.js");
const multer  = require('multer')
const { storage } = require("../cloudinary.js");
const upload = multer({ storage });

routes.route("/")
    .get(wrapAsync(listingController.index))
    .post(loggedIn, upload.single("listing[image]", listingValidation), 
        wrapAsync(listingController.newListening)
    );
    
routes.route("/:id")
    .get(wrapAsync(listingController.uniqueListening))
    .put(isOwner, upload.single("listing[image]"), wrapAsync(listingController.updateListening))
    .delete(isOwner, loggedIn, wrapAsync(listingController.deleteListening));

// 3) creating new listening :- 
routes.get("/create/new", loggedIn, (req, res) => {
    res.render("listening/new.ejs");
});

// 4) edit and update listening
routes.get("/:id/edit", isOwner, loggedIn, wrapAsync(listingController.editListening));

module.exports = routes;