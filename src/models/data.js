const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
//mongoose.connect("mongodb://127.0.0.1:27017/regform",{useNewUrlParser:true,useUnifiedTopology:true})
//.then(()=>console.log("success"))
//.catch((err)=>console.log(err))
const empSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    middlename:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

//generating token via register:-method when instance else static
empSchema.methods.generateAuthToken=async function(){
    try{
        console.log(this._id);
        const tok=jwt.sign({_id:this._id.toString()},"Mynameisvaishnaviguptavaishnavigupta");
        this.tokens=this.tokens.concat({token:tok});//{db,present token}
        await this.save();
        return token;
    }
    catch(err){
        res.send("error");
    }
}

//Jab hum schema create krte hain toh ek method aa jaata hai "pre" jo middleware ka kaam karta hai.
//"pre":- data ko get karke store karne se pehle.
const bcrypt=require("bcryptjs");
empSchema.pre("save",async function(next){//SVGAElement(baad me run hoga phle function hoga)
    if(this.isModified("password")){//cannot write callback function.
        //agar password wali field modify hui hai tbhi
        this.password=await bcrypt.hash(this.password,10);
        this.confirmpassword=await bcrypt.hash(this.confirmpassword,10);
    }
    next();
})//is pur wale code se password hash form me dikhega lekin confirmpassword nahi. Isliye 
//confirmpassword ko undefined krdege.

//Create Collection:-
const Register=new mongoose.model("Register",empSchema);
module.exports=Register;
//by form action user jo bhi type krega woh database me store ho jayega