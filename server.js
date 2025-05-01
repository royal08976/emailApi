require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const mongoose=require("mongoose")
const user=require("./models/users")


const app = express();
app.use(express.json());
const port = 3000;

const cors = require('cors');
app.use(cors());


const databaseUrl = process.env.MONGO_URI;



main().then(()=>{console.log("connected successfully")})
.catch(err => console.log(err));


async function main() {
  await mongoose.connect(databaseUrl);

}

// In-memory store for OTP (you can use a database in production)
let otpStore = {};

// Function to generate OTP
const generateOTP = () => {
  return crypto.randomBytes(3).toString('hex'); // 6-digit OTP
};

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

//Route to send profile details 
app.post('/edit-profile',(req,res)=>{
  let {mobileNumber,
    fullName,
    email,
    gender,
    DOB,
    AlternateNum,
    HintName}=req.body;

    // console.log(req.body)
    let newUser=new user({
      mobileNumber:mobileNumber,
    fullName:fullName,
    email:email,
    gender:gender,
    DOB:DOB,
    AlternateNum:AlternateNum,
    HintName:HintName,
    created_at:new Date()
    })

   
     newUser.save().then(res=>{console.log("chat is saved")}).catch(err=>{console.log(err)})
    res.send("working")

    // res.send("user added successfully to database")
})

// Route to send OTP to user's email
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  const otp = generateOTP();
  
  // Save OTP and expiration time (for example, 5 minutes)
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  try {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Email Verification OTP',
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('OTP sent to email');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending OTP');
  }
});

// Route to verify OTP
app.post('/verify-otp', (req, res) => {
  console.log("recieved from body", req.body)
  const { email, otp } = req.body;
  console.log("email is ",email)
  console.log("otp is ",otp)

  if (!email || !otp) {
    console.log("check 1 ",!email || !otp)
    return res.status(400).send('Email and OTP are required');
  }

  const storedOtp = otpStore[email];

  if (!storedOtp) {
    return res.status(400).send('No OTP sent to this email');
  }

  // Check OTP validity and expiration
  if (Date.now() > storedOtp.expiresAt) {
    delete otpStore[email]; // OTP expired
    return res.status(400).send('OTP has expired');
  }

  if (storedOtp.otp !== otp) {
    return res.status(400).send('Invalid OTP');
  }

  delete otpStore[email]; // OTP used, delete it
  res.status(200).send('Email verified successfully');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
