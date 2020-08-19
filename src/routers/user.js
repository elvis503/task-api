const express = require("express");
const User = require("../models/user.js");
const auth = require("../middleware/auth.js")
const router = new express.Router();

//************************USERS*******************************/

//Creating a user
router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try{
        await user.save();
        
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
        res.send(req.user)
    }catch(error){
        res.status(500).send();
    }
})

module.exports = router;
