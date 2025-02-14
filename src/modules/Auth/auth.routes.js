const {Router} = require("express");
const router = Router();
const authController = require("@modules/Auth/auth.controllers"); // import the controller 
const {removeDestructiveRegisterReqBody,removeDestructiveRegister_CheckOTP_ReqBody} = require("@common/guard/clearBodyRequest.guard")
const {authDataValidation} = require("@common/receivedDataValidator")



// auth-routes startsWith "/auth"
router.post("/login/send-otp",[
    removeDestructiveRegisterReqBody(authDataValidation.clearBody_registerRoute_necessaryData)
],authController.mobileLoginApproachByOTP_sendOTP),


router.post("/login/check-otp",[
    removeDestructiveRegister_CheckOTP_ReqBody(authDataValidation.clearBody_checkOTP_ness_necessaryData)
],authController.mobileLoginApproachByOTP_getOTP)

router.post("/login/send-otp/error",function(req,res,next){
    try{
        throw {status : 500,message : "Internal server Error",errors : {}}
    }catch(err){
        next(err)
    }
})



module.exports = router;
