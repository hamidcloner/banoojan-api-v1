const successResGen = function(statusCode,message,data){
    if(!statusCode) throw new Error("statusCode argument is Required");
    return {
        success : true,
        status : statusCode,
        message,
        [data && "data"] : data
    }
}


const failedResGen = function(statusCode,message,errors){
    if(!statusCode) throw new Error("statusCode argument is Required");
    return {
        success : false,
        status : statusCode,
        message,
        errors 
    }
}



module.exports = {
    successResGen,
    failedResGen
}