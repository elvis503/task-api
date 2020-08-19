const express = require("express");
const Task = require("../models/task.js");
const auth = require("../middleware/auth.js")
const router = new express.Router();

//************************TASKS*******************************/

//Creating a task
router.post("/tasks", auth, async (req, res) => {
    //const task = new Task(req.body);
    
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save();
        res.status(201).send(task)
    }catch(error){
        res.status(400).send(error);
    }
})

//Reading all tasks for a single user
//GET /tasks?completed=true
router.get("/tasks", auth, async (req, res) => {
    const match = {}

    if(req.query.completed){
        match.completed = req.query.completed === "true";
    }

    try{
        //const tasks = await Task.find({});
        await req.user.populate({   
            path: "tasks",
            match
        }).execPopulate();

        res.send(req.user.tasks);
    }catch(error){
        res.status(500).send(error)
    }
})

//Reading a single task by ID
router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try{
       //const task = await Task.findById(_id);
       const task = await Task.findOne({_id, owner: req.user._id})
        
        if(task){
            return res.send(task);
        }

        res.status(404).send("Not Found");
    }catch(error){
        res.status(500).send(error);
    }
}) 

//Update a single task by ID
router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates to this task"})
    }

    const _id = req.params.id;

    try{
        const task = await Task.findOne({_id, owner: req.user._id});

        //const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});

        if(!task){
            return res.status(404).send();
        }
        
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    }catch(error){
        res.status(400).send(error);
    }
})

//Delete a single task by ID
router.delete("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOneAndDelete({_id, owner: req.user._id});

        if(!task){
            return res.status(404).send();
        }

        res.send({deletedTask: task})
    }catch(error){
        res.status(500).send();
    }
})

module.exports = router;