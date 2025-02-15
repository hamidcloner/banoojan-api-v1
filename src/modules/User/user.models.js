import { mongoose } from "mongoose";




const organizationalRoles = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    skilOwner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})



// const SkilsModel = 