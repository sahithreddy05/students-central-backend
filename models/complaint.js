const mongoose=require("mongoose")

const complaintSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image_url:{
        type:String,
        required:true
    },
    authority:{
        type:Number,
        required:true,
    },
    posted_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("complaint",complaintSchema)