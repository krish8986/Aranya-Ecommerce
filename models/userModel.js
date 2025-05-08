import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
    },
    address:{
        type:{},
        required:true,
    },
    answer: {
        type: String,
        required: true,
    },
    role:{
        type:Number,
        default:0
    },
    subcription: {
        type: String,
        default: 'basic'
    },
    businessName: {
        type: String,
        required: function () {
            return this.role === 2;
        },
    },
    gstNumber: {
        type: String,
        required: function () {
            return this.role === 2;
        }
    },
    },
{ timestamps:true }
);

export default mongoose.model("users",userSchema);