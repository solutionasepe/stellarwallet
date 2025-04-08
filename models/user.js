const moongose = require("mongoose");
const schema = moongose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new schema({
    firstName: {type:String, required:true},
    lastName : {type:String, reqired:true},
    email : {type:String, required:true, unique:true},
    password : {type:String, required:true, minLength:6},
    pin : {type:String, minLength:3,},
    role : {type:String, required:true, enum:["user", "admin"], default:"admin"},
    createAt : {type:Date, default:Date.now()},
    
});

UserSchema.virtual('name').get(function(){
    let fullname = ""
    if(this.firstName && this.lastName){
        fullname = `${this.firstName}, ${this.lastName}`;
    }

    return fullname;
});

// UserSchema.pre('save', async function(next){
//     if(!this.isModified("pin")) return next();
//     this.hashpin = await bcrypt.hash(String(this.pin), 10);
//     next();
// });
module.exports = moongose.model('User', UserSchema)