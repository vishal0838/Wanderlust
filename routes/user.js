const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")

router.use(express.urlencoded({ extended: true }));
const userControllers = require("../controllers/user.js");

router.route("/signup")
    .get( userControllers.signupForm)
    .post( wrapAsync (userControllers.signupRoute))


router.route("/login")
    .get( userControllers.loginForm)
    .post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login", 
        failureFlash: true, 
    }),
    userControllers.loginRoute)

//Login Route

//Logout Route
router.get("/logout", userControllers.logOut);

module.exports = router;

