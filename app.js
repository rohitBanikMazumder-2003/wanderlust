require('dotenv').config();

const express=require('express');
const app=express()
const mongoose=require('mongoose')
// const PORT = process.env.PORT || 3000
const path=require("path")

const methodOverride=require("method-override")
const engine=require("ejs-mate")

const expressError=require("./utils/expressError")



const listingsRouter=require("./routes/listing")
const reviewsRouter=require("./routes/review")
const userRouter=require("./routes/user")

const session=require("express-session")
const MongoStore=require("connect-mongo")
const flash=require("connect-flash")

const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")

const dbUrl=process.env.ATLASDB_URL

main()
.then(()=>{
    console.log("connection succesful")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

//middlewares
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"))
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")))

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600

})


store.on("error",()=>{
  console.log("ERROR IN SESSION MONGO STORE",err);
})

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}



app.use(session(sessionOptions))
app.use(flash())


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error")
  res.locals.currUser=req.user
  next()
})


app.use("/listing",listingsRouter)
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",userRouter)

app.get("/", (req, res) => {
  res.render("listings/index"); // Ensure you have a 'home.ejs' file in the 'views' folder
});


app.all("*",(req,res,next)=>{
  next(new expressError(404,"Page not found!"))
})

app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong!"}=err;
  res.status(statusCode).render("error.ejs",{message})
})

app.listen(3000,()=>{
  console.log(`app listening on port 3000`)
})
