const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync")
const passport=require("passport")
const {saveRedirectUrl}=require("../middleware.js")
const userConrtoller=require("../controllers/user.js")

//signup render form
router.get("/signup", userConrtoller.renderSignupForm)

//signup
router.post("/signup", wrapAsync(userConrtoller.signup))

//login render form
router.get("/login", userConrtoller.renderLoginForm)

//login
router.post("/login", saveRedirectUrl,passport.authenticate("local",
    {failureRedirect:"/login",failureFlash:true}),
    userConrtoller.login
)


//logout
router.get("/logout",userConrtoller.logout)

module.exports = router;