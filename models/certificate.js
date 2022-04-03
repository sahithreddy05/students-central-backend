const mongoose=require("mongoose")

const certificateSchema=mongoose.Schema({
    event_name:{
        type:String,
        required:true
    },
    image_url:{
        type:String,
        required:true
    },
    reflink:{
        type:String,
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("certificate",certificateSchema)
