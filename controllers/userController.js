const user = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const asyncHandler = require("express-async-handler");

exports.userSignup = asyncHandler(async function(req, res, next){
    try{
    
        const {firstName, lastName, email, password, pin} = req.body;
        
        const existingUser = await user.findOne({email})

        if(existingUser){
            res.status(400).json({message:"user already exist"});
        }

        // const [hashpassword, hashpin] = await Promise.all([
        //     bcrypt.hash(password, 10),
        //     bcrypt.hash(String(pin), 10)
        // ]);
        const hashpassword = await bcrypt.hash(password, 10);
        
        const newUser = new user({
            firstName,
            lastName,
            email,
            password:hashpassword,
            pin
        });

        const savedUser = await newUser.save()

        const{role,...userdata} = savedUser._doc;
        res.status(201).json({userdata});
    }
    catch(err){
        next(err);
    }
});

// exports.signin 