const {Router} = require("express");
const router = Router();
const authController = require("@modules/Auth/auth.controllers"); // import the controller 
const {removeDestructiveRegisterReqBody,removeDestructiveRegister_CheckOTP_ReqBody} = require("@common/guard/clearBodyRequest.guard")
const {authDataValidation} = require("@common/receivedDataValidator");
const createProtectedRoutes = require("@common/guard/protectedRoutes.guard")



// auth-routes startsWith "/auth"
router.get("/check",[createProtectedRoutes.protectUsersRoute],authController.checkAuthByJWT)

router.post("/login/send-otp",[
    removeDestructiveRegisterReqBody(authDataValidation.clearBody_registerRoute_necessaryData)
],authController.mobileLoginApproachByOTP_sendOTP),


router.post("/login/check-otp",[
    removeDestructiveRegister_CheckOTP_ReqBody(authDataValidation.clearBody_checkOTP_ness_necessaryData)
],authController.mobileLoginApproachByOTP_getOTP)




module.exports = router;
