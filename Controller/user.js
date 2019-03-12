const express = require("express")
const user = require("../Model/User")
const route = express.Router();


route.get("/login" , (req , res) => {
    res.render("login")
})

route.get("/register" , (req , res) => {
    res.render("register" , {
        errors : []
    })
})
route.post("/register" , (req , res) => {
    errors = [];
    const { name , email, password} = req.body
    if( !name || !email || !password){
        errors.push({err : "Please insert all fileds"})
    }
    if( password.length < 7){
        errors.push({ err : "Password Length Must Be Greater Then 8"})
    }
    if(password !== req.body.cpassword){
        errors.push({ err : "Password Didn't match"})
    }
    if(errors.length > 0){
        res.render("register", {
            errors,
            name,
            email
        })
    }
    else{
        console.log(req.body)
        user.findOne({email : email}).then(response => {
            if(response){
                res.render("register" , {
                    errors : [{
                        err : "Already Registered"
                    }],
                    name : "",
                    email: ""
                })
            }
            else{    
                user({
                    name : name,
                    email : email,
                    password : password
                })
                .save()
                .then(res => {
                    console.log("Data Saved " + res)
                })
                .catch(err => {
                    console.log("OPPS!! Error occures " + err)
                })
                res.send("Registration Completed")
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    
})
    

module.exports = route;