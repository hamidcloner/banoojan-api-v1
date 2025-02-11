const CommonResStatusMessage = require("@common/commonResStatusMsg");
const mongoose = require("mongoose")



// by npm express-validator third-party package
class AuthDataValidation{
    mobileNumber_regPattern = /^09\d{9}$/;
    commonSchemaError_type_message = ["ValidatorError","CastError"];
    commonSchemaError_contained_properties = ["validator","type","path","value"];
    clearBody_registerRoute_necessaryData = ["mobileNumber"];
    clearBody_checkOTP_ness_necessaryData = ["mobileNumber","otp"]

    constructor(){
        // == /bind "this" keyword for methods/ ==
        this.registerMobileNumberApproachValidation = this.registerMobileNumberApproachValidation.bind(this);
        this.schemaValidationErrorsLogger = this.schemaValidationErrorsLogger.bind(this);
        this.isMongooseSchemaValidationError = this.isMongooseSchemaValidationError.bind(this)
    } 
    // by third-party-package  
    registerMobileNumberApproachValidation(mobileNumber){
        return this.mobileNumber_regPattern.test(mobileNumber);
    }
    validationErrorsLogger_by_thirdPackage(){
        return function(req,res,next){
            const {errors} = validationResult(req);
            if(errors.length === 0){
                // everythings are OK!
                return next()   
            }
            let responseErrorObj = {};
            errors.forEach((error) => {
                responseErrorObj[error?.path] = {
                    message : error?.["msg"]
                }
            })
            return next({
                status : 400, // BadRequest
                message : CommonResStatusMessage?.BadRequest,
                errors : responseErrorObj
            })
        }
    }
    // manually
    checkValidMongooseID(id){
        return mongoose.Types.ObjectId.isValid(id)
    }

    schemaValidationErrorsLogger(receivedError){
        // final failed-response-structure : 
        // {status : ,message(commonStatusMessage) : ,errors : {"fieldName" : {message}}}
        const receivedErrorObje = receivedError.errors;
        const modifiedErrorObj = {};
        const message = CommonResStatusMessage?.BadRequest;
        const status = 400; // BadRequest
        for(let field in receivedErrorObje){
            modifiedErrorObj[field] = {
                message : receivedErrorObje[field]["message"]
            }
        }
        return {
            status,
            message,
            errors : modifiedErrorObj
        }
    }
    isMongooseSchemaValidationError(receivedError){
        for(let field in receivedError.errors){  
            if(this.commonSchemaError_type_message.includes(receivedError?.errors?.[field]?.["name"])){
                return true
            }
        }
        return false;
    }


}


// singeltone pattern approach
const authDataValidation = new AuthDataValidation();

module.exports = {
    authDataValidation
}