require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const User = require("./models/user")
const cors = require("cors")

app.use(express.json())
app.use(cors())

app.get("/", async (req ,res) => {
    try{
        const vals = await User.find({});
        res.status(200).json(vals);
    }
    catch(err){
        res.status(400).json({message: "error fetching users", error: err})
    }

})

app.post("/add", async (req, res) => {
    const {firstname,lastname,email} = req.body
    try{
        const horrah = await User.create({firstname,lastname,email})
        res.status(201).json(horrah)
    }catch(err){
        res.json({message: "error adding user", error: err})
    }
})

app.delete("/remove/:id", async (req,res) => {
    const { id } = req.params
    try{
        const deleted = await User.findOneAndDelete({_id: id})
        if (deleted){
            res.status(200).json({message: "success"})
        }
        else{
            res.status(400).json({message: "Error deleting it"})
        }
    }catch(err){
        res.status(400).json({error: err})
    }
})

mongoose.connect(process.env.URI).then(()=>{
    console.log("database connencted"),
    app.listen(process.env.PORT, ()=>{
        console.log(`running on port ${process.env.PORT}`);
    })}).catch(err =>{
    console.error("database connection error", err);
});


