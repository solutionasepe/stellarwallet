const user = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../utilis/sendmail")

const asyncHandler = require("express-async-handler");

exports.userSignup = asyncHandler(async function(req, res, next){
    try{
    
        const {firstName, lastName, email, password, pin} = req.body;
        
        const existingUser = await user.findOne({email});

        if(existingUser){
            res.status(400).json({message:"user already exist"});
        }

        const [hashpassword, hashpin] = await Promise.all([
            bcrypt.hash(password, 10),
            bcrypt.hash(pin, 10)
        ]);
        // const hashpassword = await bcrypt.hash(password, 10);
        
        const newUser = new user({
            firstName,
            lastName,
            email,
            password:hashpassword,
            pin:hashpin
        });

        const savedUser = await newUser.save()

        const{role,...userdata} = savedUser._doc;
        res.status(201).json({userdata});
    }
    catch(err){
        next(err);
    }
});

exports.signin = asyncHandler(async function(req, res, next){
    try{
        const {email, password} = req.body;
        const existingUser = await user.findOne({email});
        if (!existingUser){
            return res.status(400).json({message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(!isMatch){
            res.status(400).json({message:"invalid credentials"});
        }

        const token = jwt.sign({id:existingUser._id}, process.env.SECRET_KEY, {expiresIn:"30min"});

        const{role,...userdata} = existingUser._doc;
        res.status(200).json({token});
    }
    catch(err){
        next(err);
    }
});

let tokenBlacklist = [];
exports.tokenBlacklist = tokenBlacklist;
exports.signOut = asyncHandler(async function(req, res, next){
    try{
        
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(400).json({message:"No token provided"});
        }
        tokenBlacklist.push(token);
        res.status(200).json({message:"Logged out successfully"})
    }
    catch(err){
        next(err);
    }
});


exports.dashboard = asyncHandler(async function(req, res, next){
    try{
        const{pin} = req.body;

        const loggedInUser = await user.findById(req.user._id);
        if(!loggedInUser){
            return res.status(404).json({message:"Invalid Pin"});
        }

        const isMatch = await bcrypt.compare(pin, loggedInUser.pin);
        if(!isMatch){
            return res.status(400).json({message:"wrong pin, pls try again"});
        }

        res.status(200).json({message:"Access granted to the dashbaord"});
    }catch(err){
        res.status(400).json({message:"Authentication error"})
    }
});

exports.requestPasswordReset =asyncHandler(async function (req, res, next){
    const{email} = req.body;

    const existingUser = await user.findOne({email});
    if(!existingUser){
        return res.status(404).json({message:"User not found"});
    };

    const resetToken = jwt.sign({id:existingUser._id}, process.env.SECRET_KEY, {expiresIn:"15m"});

    const resetUrl = `${process.env.FRONTEND_URL}/user/reset-password/${resetToken}`
    const message =`You requested a password reset. click the link below to reset your password:\n\n${resetUrl}\n\n if you did not request this, pls ignore this email`;

    try{
        await sendEmail(email, "passowrd reset request", message);
        console.log(sendEmail);
        res.status(200).json({message:"password reset email sent"});
    }catch(err){
        next(err);
    }
});

exports.passworReset = asyncHandler(async function(req, res, next){
    try{
        const {newPassword} = req.body;
        const {resetToken} = req.params;
        console.log(resetToken);
        const decoded = jwt.verify(resetToken, process.env.SECRET_KEY);
        const existingUser = await user.findById(decoded.id);
        if(!existingUser){
            return res.status(404).json({message:"user not found"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        existingUser.password = hashedPassword;
        await existingUser.save();

        res.status(200).json({message:"password reset sucessfully"});
    }catch(err){
        next(err)
    }
});

exports.Users = asyncHandler(async function(req, res, next){
    try {
        const userList = await user.find()
        res.status(200).json({userList});
    }catch(err){
        next(err);
    }
});

exports.deleteUsers = asyncHandler(async function(req, res, next){
    try{
        const{email, pin} = req.body;

        const existingUser = await user.findOne({email});
        if(!existingUser){
            return res.status(404).json({message:"user not found"})
        }
        const confrimPin = await bcrypt.compare(pin, existingUser.pin);
        if(!confrimPin){
            return res.status(400).json({message:"Incorrect password"});
        }

        if(existingUser && confrimPin){
            await user.deleteOne({_id:existingUser._id});
            return res.status(200).json({message:"User deleted sucessfully"});
        }
    }catch(err){
        next(err);
    }
});