const express=require("express");
const app=express();
const path=require("path");
const hbs=require("hbs");//to use partials.
const Register=require("./models/data");//requiring the model
const {json}=require("express");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

//including mongoose in express:-
require("./db/conn");

//To display the entered data in text form:-
app.use(express.json());//handles the json
app.use(express.urlencoded({extended:false}));//helps to get data not undefined

//including html ie. static file in app file:-(deleted)
const static_path=path.join(__dirname,"../public")
app.use(express.static(static_path));

//views:-
app.set("view engine","hbs");//to include public wali files jaise index.html


//changed to template:-
const views_path=path.join(__dirname,"../templates/views");
app.set("views",views_path);

//for partials:-
const partial_path=path.join(__dirname,"../templates/partials");
hbs.registerPartials(partial_path);

const port=process.env.port || 3000;//jahan pe bhi host kra rhe , aesa port num mil jaye jisse run ho jaye baki local p 3000.
app.get("/",(req,res)=>{
    res.render("index");//renders index.hbs
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.get("/loginn",(req,res)=>{
    res.render("loginn")
})

//form:-
app.post("/register",async (req,res)=>{
    try{
       const pwd=req.body.password;
        const finalpwd=req.body.confirmpassword;
        if(pwd===finalpwd){
            const ourdata=new Register({
                firstname:req.body.firstname,
                middlename:req.body.middlename,
                lastname:req.body.lastname,
                phone:req.body.phone,
                email:req.body.email,
                gender:req.body.gender,
                password:pwd,
                confirmpassword:finalpwd,
                age:req.body.age
            })

            //To generate token via registration.
            console.log("sucess part"+ourdata);
            const token=await ourdata.generateAuthToken();
            console.log("token part"+token);
            //def of this func is in data.js

            //data ko database me store karne se phle hume password ka hash generate karna hoga
            //hash generate krne ke baad use database me store karege.
            //It is done by concept of middleware(do cheezo ke beech me work ho raha ho)
            //iske liye hum data.js me schema ke baad ek method pre daalege.
            const result=await ourdata.save();
            console.log("the part"+result);
            res.status(201).render("index");
            //res.send("done!");
        }
        else{
            res.send("passwords not matching");
        }
        //res.send(req.body.firstname);
    }
    catch(err){
        res.status(400).send(err);
    }
})

//LOGIN:-
app.post("/loginn",async (req,res)=>{
    try{
        const username=req.body.username;
        const password=req.body.password;
        const userdetails=await Register.findOne({email:username});//first email->reg&second email->user entered
        
        //userdetails me pura data aajyega jisse humara email match krega
       /*if(userdetails.password===password){
            res.status(201).render("index");
        }
        else{
            res.send("Invalid id and password.");
        }*/
        //hashed password jo database me stored hai or jo password user ne enter kiya hai usme match krne ke liye:-
        const matchpass=await bcrypt.compare(password,userdetails.password);
        const token=await userdetails.generateAuthToken();//jwt 
           console.log("token part"+token);
        if(matchpass){
            res.status(201).render("index");
        }
        else{
            res.send("Invalid Id and Password");
        }
    }
    catch(err){
        res.status(400).send("Invalid");
    }
})

//ENCRYPTTION VS HASHING VIDEO:-
/*const bcrypt=require("bcryptjs");
const securePass=async (password)=>{
    //generating hash
    const hashPass=await bcrypt.hash(password,10);//password:-jo user enter krega
    //10:- round by default ie. kitne din me decode ho skta hai
    //console.log(hashPass);

    //password matching:-
    const passmatch=await bcrypt.compare(password,hashPass);
    console.log(passmatch);
}
securePass("vaishnavii");//password that is entered by user is passed.*/

//creating Token:-(Not connecting to login page)
/*const createToken=async()=>{
    const token=await jwt.sign({__id:"644e2c5a883e6e58e33a117a"},"Mynameisvaishnaviguptavaishnavigupta");
    //console.log(token); 
    //To match the token:-
    const userver=await jwt.verify(token,"Mynameisvaishnaviguptavaishnavigupta");
    console.log(userver);
}
createToken();*/

app.listen(port,()=>{
    console.log("Connection successfull");
})