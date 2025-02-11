const {default : mongoose} = require("mongoose");
const {authDataValidation} = require("@common/receivedDataValidator");
const CommonResStatusMessage = require("@common/commonResStatusMsg");
const {UserAuthModuleMessages} = require("@modules/Auth/auth.messages");


const userOtp = new mongoose.Schema({
    code : {
        type : String,
        required : true,
        },
    expiredIn : {
        type : Number, // if not Number => you could not computing like compare on it
        required : true
    }
})

const userAuthSchema = new mongoose.Schema({
    mobileNumber : {
        type : String,
        required : true
    },
    userName : {
        type : String,
        required : false, // become false!
    },
    skils : {
        type : String,
        required : false,
        enum : {
            values : ["developer","motion_graphics_designer","mentee","accountant","huamn_resource_manager"],
            message : (receivedValue) => `incorrect \'${receivedValue.value}'\ for \'skil field'\,skil must be into [\'developer\',\'motion_graphics_designer\',\'mentee\',\'accountant\',\'huamn_resource_manager\']`
        }
    },
    verifiedMobile : {
        type : Boolean,
        default : false
    },
    OTPcode : {
        type : userOtp,
        required : false
    },
    // ===== another later! ============
    email : {
        type : String,
        required : false
    },
    fullName : {
        type : String,
        required : false
    },
    favoritesSubjects : {
        type : Array,
        require : false
    },

})

// define mongoose-schema middlewares:

userAuthSchema.pre("save",function(next){
    // Document Middleware => this refs to document
    // this.isModified() important!
    if(!(authDataValidation.mobileNumber_regPattern.test(this.mobileNumber))){
        // Bad-Request : 400
        console.log("pre middleware : ",this.mobileNumber)
        throw {status : 400,message : CommonResStatusMessage?.BadRequest,errors : {
            "mobileNumber" : {
                message : UserAuthModuleMessages?.IncorrectMobileNumber
            }
        }}

    }
    next()
})


const UserAuthModel = mongoose.models.User || mongoose.model("User",userAuthSchema);
module.exports = UserAuthModel;