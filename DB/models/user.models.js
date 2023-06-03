import mongoose, { Schema } from "mongoose";



export  const userSchema = new Schema({
    fullname:String,
    phone:Number,
    email:String,
    password:String,
    isLoggedIn:{ type:Boolean,
        default:false},
    confirmed:{
        type:Boolean,
        default:false
    },
    code:{
        type:Number,
        default:0
    },
    profile_pic:{
        type:String,
        
    },


},{
    timestamps:true,
}) ;


const userModel = mongoose.model('User',userSchema);
export default userModel;