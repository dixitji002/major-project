const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const controllUsers = require("../collections/user.js")

router.get("/signup",controllUsers.renderSignupForm);
router.post("/signup",wrapAsync(controllUsers.signup));
router.get("/login",controllUsers.renderLoginForm);
router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    controllUsers.login
);
router.get("/logout",controllUsers.logout);
module.exports = router;