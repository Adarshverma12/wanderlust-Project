const Listen = require("../models/listening.js");
const ExpressError = require("../ErrorFiles/ExpressError.js");

// 1) for all the data into the screen
module.exports.index = async (req, res) => {
    const gettingData = await Listen.find({});
    res.render("listening/index.ejs", { gettingData });
};

// 2) for all information of particular listening
module.exports.uniqueListening = async (req, res) => {
    let { id } = req.params;
    let listenData = await Listen.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("owner");
    if (!listenData) {
        req.flash("error", "The listing you are looking for does not exist. Please enter a valid listing.!");
        res.redirect("/listening");
    }
    res.render("listening/show.ejs", { listenData });
};

// for new listening :- 
module.exports.newListening = async (req, res) => {
    const url = req.file.path;
    const filename = req.file.filename;
    const newListen = new Listen(req.body.listing);
    newListen.owner = req.user._id;
    newListen.image = { url, filename };
    await newListen.save();
    req.flash("success", "new listing were added!");
    res.redirect("/listening");
};

// for editing
module.exports.editListening = async (req, res) => {
    let { id } = req.params;
    let findId = await Listen.findById(id);
    if (!findId) {
        req.flash("error", "The listing you are looking for does not exist. Please enter a valid listing.!");
        res.redirect("/listening");
    }
    let originalURL = findId.image.url;
    originalURL = originalURL.replace("/upload", "/upload/w_250");
    res.render("listening/edit.ejs", { findId, originalURL });
};

// for updating
module.exports.updateListening = async (req, res) => {
    let { id } = req.params;

    if (!req.body.listing) {
        throw new ExpressError(400, "send valid data for listening");
    }

    let Listing = await Listen.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        const url = req.file.path;
        const filename = req.file.filename;
        Listing.image = { url, filename };
        await Listing.save();
    }

    req.flash("success", "Listing updated");
    res.redirect(`/listening/${id}`);
};

// for deleting
module.exports.deleteListening = async (req, res) => {
    let { id } = req.params;
    let deleteListen = await Listen.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted!");
    res.redirect("/listening");
};