const {failedResGen} = require("@common/responseStructure");
const {authDataValidation} = require("@common/receivedDataValidator")

module.exports = (err,req,res,next) => {
    let error;
    // // mongoose-schema-errors-detaction
    if(authDataValidation.isMongooseSchemaValidationError(err)){
        error = authDataValidation.schemaValidationErrorsLogger(err)
    }else{
        error = err;
    }
    // const statusCode = 100 < err?.status < 500 ? err.status : 500;
    let statusCode = error?.status ?? error?.statusCode ?? error?.code;
    if(!statusCode ||  isNaN(+statusCode) || statusCode > 511 || statusCode < 200) statusCode = 500
    const message = error?.message || "Internal Server Error";
    return res.status(statusCode).json(failedResGen(statusCode,message,error.errors))
}