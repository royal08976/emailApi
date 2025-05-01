
const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
mobileNumber:{
    type:String,
   
    required:true,
    maxLength:10
},
fullName:{
    type:String,
    required:true,

},
email:{
    type:String,
    required:true
},
gender:{
    type:String,
    required:true
},
DOB:{
    type:String,
    
},
AlternateNum:{
    type:String,
    maxLength:10
},
HintName:{
    type:String
},
created_at:{
    type:Date,
    // required:true
}
})

const user=mongoose.model("user",userSchema)
module.exports=user;