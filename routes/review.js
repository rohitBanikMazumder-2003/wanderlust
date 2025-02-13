const express=require("express")
const router=express.Router({mergeParams:true})

const wrapAsync=require("../utils/wrapAsync")

const Review=require("../models/review")
const Listing=require("../models/listing")
const {isLoggedIn,validateReview,isReviewAuthor}=require("../middleware.js")

const reviewController=require("../controllers/review.js")

//create review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports=router