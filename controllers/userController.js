const user = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        const {email, pin} = req.body;
        const existingUser = await user.findOne({email});
        if (!existingUser){
            return res.status(400).json({message: "User not found"});
        }

        const isMatch = await bcrypt.compare(pin, existingUser.pin);
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
})