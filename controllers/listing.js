const Listing=require("../models/listing")

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({})
    res.render("listings/index.ejs",{allListings})
    
}


module.exports.renderNewForm=async(req,res)=>{
    res.render("listings/new")
  }


  module.exports.showListing= async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner")
    if(!listing){
      req.flash("error","Listing does not exist")
      res.redirect("/listing");
    }
    res.render("listings/show.ejs",{listing})
  }

module.exports.createNewListing=async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id
    await newListing.save();
    req.flash("success","New listing created!")
    res.redirect("/listing");
  }

module.exports.renderEditForm=async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id)
    if(!listing){
      req.flash("error","Listing does not exist")
      res.redirect("/listing");
    }
    res.render("listings/edit.ejs",{listing});
  }

module.exports.updateListing=async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Listing updated!")
    res.redirect(`/listing/${id}`)
  }

module.exports.deleteListing=async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!")
    res.redirect("/listing")
  }