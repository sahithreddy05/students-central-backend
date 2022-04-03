const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
    item_description:{
        type:String,
        required: true
    },
    user_Posted:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    posted_username:{
        type:String,
    },
    posted_userphone:{
        type:String,
    },
    image_url:{
        type:String,
        required:true
    },
    place:{
        type:String,
        required:true
    },
    item_status:{
        type:Boolean,
        default:0
    },
    lost_found:{
        type:Boolean,
        required:true
    },
    claimed_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    claimed_username:{
        type:String,
    },
    claimed_userphone:{
        type:String,
    },
    data:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model("item",itemSchema)
