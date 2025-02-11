const { failedResGen } = require("@common/responseStructure");
const { UserAuthModuleMessages } = require("@modules/Auth/auth.messages");
const CommonResStatusMessage = require("@common/commonResStatusMsg")


// necessaryData => فیلدهایی که مجوز عبور دارند،اینجا فعلا کاری نداریم که بعضی از اون ها اجباری هستد یا در دیتابیس ثبت می شوند
// necessaryData => فقط فیلدهایی که اجباری هستند،وجودشون همینجا چک میشود
function removeDestructiveRegisterReqBody(necessaryData){
    // pathName =ENUM=> ["checkOTP"]
    if(!(necessaryData instanceof Array)  || necessaryData.length === 0){
        throw new Error("necessaryData argument must be Array!")
    }
    return (req,res,next) => {
        try{
            const receivedBodyContent = req.body; // is an "Object"
            const receivedBodyContent_keys = Object.keys(receivedBodyContent)

            // ==== Here you must "not-empty" check-validation =====
            // check mobileNumber was sent or not (one of validation steps that check here)

            if(!receivedBodyContent_keys.includes("mobileNumber")){
                throw failedResGen(400,CommonResStatusMessage?.BadRequest,{
                    "mobileNumber" : {
                        message : UserAuthModuleMessages?.MobileNumberIsRequired
                    }
                })
            }

                        
            const safeBodyContent = {};
            necessaryData.forEach((bodyValidItem) => {
                if(receivedBodyContent_keys.includes(bodyValidItem)){
                    safeBodyContent[bodyValidItem] = receivedBodyContent[bodyValidItem];
                }
                
            })
            req.body = safeBodyContent;
            return next()
        }catch(err){
            next(err)
        }

}}

function removeDestructiveRegister_CheckOTP_ReqBody(necessaryData){
    if(!(necessaryData instanceof Array)  || necessaryData.length === 0){
        throw new Error("necessaryData argument must be Array!")
    }
    return (req,res,next) => {
        try{
            const receivedBodyContent = req.body; // is an "Object"
            const receivedBodyContent_keys = Object.keys(receivedBodyContent)
            
            if(!receivedBodyContent_keys.includes("otp") || !receivedBodyContent_keys.includes("mobileNumber")){
                throw failedResGen(400,CommonResStatusMessage?.BadRequest,{
                    message : UserAuthModuleMessages?.OTP_OR_MobileNumber_Required
                })
            }
            const safeBodyContent = {};
            necessaryData.forEach((bodyValidItem) => {
                if(receivedBodyContent_keys.includes(bodyValidItem)){
                    safeBodyContent[bodyValidItem] = receivedBodyContent[bodyValidItem];
                }
                
            })
            req.body = safeBodyContent;
            return next()
            
        }catch(err){
            next(err)
        }
    }
}


module.exports = {
    removeDestructiveRegisterReqBody,
    removeDestructiveRegister_CheckOTP_ReqBody
};