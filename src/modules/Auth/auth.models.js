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
        required : true,
        unique : true
    },
    userName : {
        type : String,
        required : false, // become false!
    },
    feedbackComment : {
        type : String,
        required : false
    },
    stepOfVerification : {
        type : Number,
    },
    skil : {
        type : String,
        required : false,
        get : (skil) => {
            const validSkilValues = ["developer","motion_graphics_designer","mentee","accountant","huamn_resource_manager"];
            const transferToFa = [["developer","برنامه نوبس"],["motion_graphics_designer","موشن گرافیست"],["mentee","کارآموز"],["accountant","حسابدار"],["huamn_resource_manager","مدیر منابع انسانی (HR)"]]
            const pairFaEn = transferToFa.find((item) => item[0] === skil)
            return {
                fa : pairFaEn[1],
                en : pairFaEn[0]
            }
        },
        enum : {
            values : ["developer","motion_graphics_designer","mentee","accountant","huamn_resource_manager"],
            message : (receivedValue) => `incorrect \'${receivedValue.value}'\ for \'skil field'\,skil must be into [\'developer\',\'motion_graphics_designer\',\'mentee\',\'accountant\',\'huamn_resource_manager\']`
        }
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    // just for initial test 
    role : {
        type : String,
    },
    // ======================
    verifiedMobile : {
        type : Boolean,
        default : false
    },
    OTPcode : {
        type : userOtp,
        required : false
    },
    isAuthenticated : {
        type : Boolean,
        default : false,
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
    console.log("pre middleware is calling!")
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
userAuthSchema.pre("findOneAndUpdate",function(next){
    console.log("update pre middleware is calling")
    next()
})




const UserAuthModel = mongoose.models.User || mongoose.model("User",userAuthSchema);
module.exports = UserAuthModel;