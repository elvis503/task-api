const express = require("express");
const User = require("../models/user.js");
const auth = require("../middleware/auth.js")
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");
const {sendWelcomeEmail, sendCancelationEmail} = require("../emails/account.js");
//************************USERS*******************************/

//Creating a user
router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try{
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        
        const token = await user.generateAuthToken();
        res.status(201).send({user, token})
    }catch(error){
        res.status(400).send(error);
    }
})

//Log In User
router.post("/users/login", async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    }catch(e){
        res.status(400).send();
    }
})

//Logging out User
router.post("/users/logout", auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })

        await req.user.save();

        res.send();
    }catch(error){
        res.status(500).send();
    }
})

//Logging out all users
router.post("/users/logoutAll", auth, async (req, res) => {
    try{
       req.user.tokens = [];
       await req.user.save();
       res.send();
    }catch(e){
        res.status(500).send();
    }
})

//Reading own user
router.get("/users/me", auth, async (req, res) => {
    // try{
    //     const users = await User.find({});
    //     res.send(users)
    // }catch (error){
    //     res.status(500).send();
    // }

    res.send(req.user)
})

//Reading a single user by ID****************************************
// router.get("/users/:id", async (req, res) => {
//     const _id = req.params.id;

//     try{
//         const user = await User.findById(_id);
        
//         if(user){
//             return res.send(user);
//         }

//         res.status(404).send("Not Found");
        
//     }catch (error){
//         res.status(500).send(error);
//     }
// }) 

//Update a single user by ID
router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates to this user"})
    }

    try{
        //const user = await User.findById(req.user._id);
        updates.forEach((update) => req.user[update] = req.body[update])

        //const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});

        await req.user.save();
        res.send(req.user);

    }catch(error){
        res.status(400).send(error);
    }
})

//Delete a single user by ID
router.delete("/users/me", auth, async (req, res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id);

        // if(!user){
        //     return res.status(404).send();
        // }

        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
        
    }catch(error){
        res.status(500).send();
    }
})

//Using multer to filter and specify the type of file for the profile picture
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    //Filer files to only accept .pdf
    fileFilter(req, file, cb){
        const regExp = /\.(jpg|jpeg|png)$/;

        if(!file.originalname.match(regExp)){
            return cb(new Error("Please upload a jpg, jpeg or png file"))
        }

        cb(undefined, true);
    }
})

//Uploading a profile picture img
router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer();
    
    req.user.avatar = buffer;
    
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
})

//Deleting profile picture img
router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    
    await req.user.save();
    res.send() 
})

//Serve image in URL
router.get("/users/:id/avatar", async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar){
            throw new Error();
        }

        res.set("Content-Type", "image/png");
        res.send(user.avatar)

    }catch(e){
        res.status(404).send();
    }
})

module.exports = router;
