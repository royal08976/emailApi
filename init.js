require('dotenv').config();
const mongoose=require("mongoose")
const user=require("./models/users")
const databaseUrl = process.env.MONGO_URI;



main().then(()=>{console.log("connected successfully")})
.catch(err => console.log(err));


async function main() {
  await mongoose.connect(databaseUrl);

}

// const allChats=[{
//     from:"ram",
//     to:"shyam",
//     msg:"send me your reports",
//     created_at:new Date()
// },
// {
//     from:"radha",
//     to:"sita",
//     msg:"send me your papers",
//     created_at:new Date()
// },
// {
//     from:"arjun",
//     to:"bhim",
//     msg:"send me your files",
//     created_at:new Date()
// },
// {
//     from:"prince",
//     to:"princess",
//     msg:"send me your letters",
//     created_at:new Date()
// },
// {
//     from:"raghav",
//     to:"gopal",
//     msg:"send me your names",
//     created_at:new Date()
// }

// ]

const user1=new user({
    mobileNumber:"9876987645",
    fullName:"Rakesh sharma",
    email:"rakesh@gmiail.com",
    gender:"male",
    DOB:"09/08/2003",
    AlternateNum:"9797886862",
    HintName:"ricky",
    created_at:new Date()
    
   
  })
 
const user2=new user({
    mobileNumber:"9878976453",
    fullName:"Raj",
    email:"rajesh@gmiail.com",
    gender:"male",
    DOB:"09/08/2001",
    AlternateNum:"9797887865",
    HintName:"ricu",
    created_at:new Date()
    
   
  })
 
  
  user1.save().then((res)=>{
    console.log(res)
  })
  user2.save().then((res)=>{
    console.log(res)
  })
  
  
  
// chat.insertMany(allChats).then((res)=>{
//     console.log(res)
// })