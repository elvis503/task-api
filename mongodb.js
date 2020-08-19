//CRUD

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const {MongoClient, ObjectID} = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";


MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error){
        return console.log("Unable to connect to database");
    }

    console.log("Connected correctly");

    const db = client.db(databaseName);

    //**************************** CREATE **************************/
    // db.collection("users").insertOne({
    //     _id: id,
    //     name:"Viktor Reznov",
    //     age: 27
    // }, (error, result) => {
    //     if(error){
    //         return console.log("Unable to insert user");
    //     }

    //     console.log(result.ops);
    //     console.log(result.result)
    // })

    // db.collection("users").insertMany([
    //     {
    //         name: "Jen",
    //         age: 25
    //     },
    //     {
    //         name: "Gunther",
    //         age:24
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log("Unable to insert users");
    //     }

    //     console.log(result.ops)
    // })
    
    // db.collection("tasks").insertMany([
    //     {
    //         description: "Mow the lawn",
    //         completed: true
    //     },{
    //         description: "Get groceries",
    //         completed: true
    //     },{
    //         description: "Buy fridge",
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log("Unable to insert users");
    //     }

    //     console.log(result.ops)
    // })


    //**************************** READ ******************************/

    // db.collection("users").findOne({_id: new ObjectID("5f2a129e12decbd0679e89e7")}, (error, user) => {
    //     if(error){
    //         return console.log("Unable to fetch")
    //     }

    //     console.log(user)
    // })

    // db.collection("users").find({age: 27}).toArray((error, users) => {
    //     console.log(users)
    // })

    // db.collection("tasks").find({completed: false}).toArray((error, tasks) => {
    //     console.log(tasks)
    // })


    //************************UPDATE WITH PROMISE*************************/

    // db.collection("users").updateOne({
    //     _id: new ObjectID("5f2b34b8551f792a66b1a78b")
    // },{
    //     // $set: {
    //     //     name: "Mike Tyson",
    //     //     age: 22
    //     // }
    //     $inc: {
    //         age: 1
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection("tasks").updateMany({
        completed: false
    },{
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    
    //**************************** DELETE ***************************/

    // db.collection("users").deleteMany({
    //     age: 27
    // }).then((result) => {

    // }).catch((error) => {
        
    // })

    db.collection("tasks").deleteOne({
        description: "Get groceries"
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
})
