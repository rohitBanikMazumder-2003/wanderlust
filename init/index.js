const mongoose=require("mongoose")
const initData=require("./data")
const Listing=require("../models/listing")

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

main()
.then(()=>{
    console.log("connection succesful")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const initDB=async()=>{
    await Listing.deleteMany({})
    initData.data=initData.data.map((obj)=>({
      ...obj,owner:"67a4afcce7e683b3641417e1"
    }))
    await Listing.insertMany(initData.data)
    console.log("data was initilaized")
}

initDB();