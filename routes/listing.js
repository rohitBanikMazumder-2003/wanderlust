const express = require("express")
const router = express.Router()

const wrapAsync = require("../utils/wrapAsync")

const Listing = require("../models/listing")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")

const listingController = require("../controllers/listing.js")



router.route("/")
  //get all listings 
  .get(wrapAsync(listingController.index))
  //create new route
  .post(isLoggedIn, validateListing, wrapAsync(listingController.createNewListing))



//new route 
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm))


router.route("/:id")
  //show route
  .get(wrapAsync(listingController.showListing))
  //update route
  .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
  //destroy route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))





//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))







module.exports = router