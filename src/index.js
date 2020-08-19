const express = require("express");
require("./db/mongoose.js");

const userRouter = require("./routers/user.js")
const taskRouter = require("./routers/task.js")

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

const Task = require("./models/task.js");
const User = require("./models/user.js");

const main = async () => {
    //Finding the owner of a task by the task id
    // const task = await Task.findById("5f3c596deb6a5b8b05ed5337");
    // await task.populate("owner").execPopulate()
    // console.log(task.owner);

    //Finding the tasks of an owner by the owner id
    const user = await User.findById("5f3c58ae53b1d38098135b66");
    await user.populate("tasks").execPopulate();
    //console.log(user.tasks)
}
 
main();

//Bcrypt HASHED PASSWORDS***************************************
// const bcrypt = require("bcryptjs");

// const bcryptFunction = async () => {
//     const password = "1234567";
//     const hashedPassword = await bcrypt.hash(password, 8);

//     console.log(password);
//     console.log(hashedPassword);

//     const isMatch = await bcrypt.compare(password, hashedPassword);
//     console.log(isMatch);
// }

// bcryptFunction();


//JSON WEB TOKENS GENERATION********************************************
// const jwt = require("jsonwebtoken");

// const jwtFunction = async () => {
//     const token = jwt.sign({_id: "abc123"}, "thisismynewcourse", {expiresIn: "5 seconds"});
//     console.log(token)

//     const data = jwt.verify(token, "thisismynewcourse");
//     console.log(data)

// }

//jwtFunction();