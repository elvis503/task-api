const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task.js");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,

        validate(value){
            if(!validator.isEmail(value)){
               throw new Error("Email is invalid") 
            }
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,

        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("Your password cannot include the word 'password'")
            }
        }
    },

    age: {
        type: Number,
        default: 0,
        
        validate(value){
            if(value < 0){
                throw new Error("Age must be a positive number")
            }
        }
    },

    tokens: [{
       token: {
           type: String,
           required: true,
       } 
    }]
}, {
    timestamps: true
})

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

//Find user by email
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if(!user){
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error("Unable to login");
    }

    return user
}

userSchema.methods.toJSON= function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

//Generate Authentication Token when logging in
userSchema.methods.generateAuthToken = async function (){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, "thisismysecret");

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

//Hash password before saving it
userSchema.pre("save", async function(next){
    const user = this;

    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

//Delete user tasks when user is deleted
userSchema.pre("remove", async function(next){
    const user = this;
    await Task.deleteMany({owner: user._id})

    next();
})



//Defining a model - User
const User = mongoose.model("User", userSchema)

module.exports = User;