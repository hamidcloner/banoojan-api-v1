const authService = require("@modules/Auth/auth.service");
const {successResGen} = require("@common/responseStructure");
const httpCodes = require("http-codes");
const {UserAuthModuleMessages} = require("@modules/Auth/auth.messages");
const UserAuthModel = require("@modules/Auth/auth.models");



class AuthController{
    #service;
    constructor(){
        this.mobileLoginApproachByOTP_sendOTP = this.mobileLoginApproachByOTP_sendOTP.bind(this);
        this.mobileLoginApproachByOTP_getOTP = this.mobileLoginApproachByOTP_getOTP.bind(this);
        this.#service = authService;
    }
    async mobileLoginApproachByOTP_sendOTP(req,res,next){
        try{
            const {mobileNumber} = req.body;
            const acceptUser = await this.#service.OTPfactory(mobileNumber);
            return res.status(httpCodes.CREATED).json(successResGen(httpCodes.CREATED,UserAuthModuleMessages?.OPTcodeSent,acceptUser))
        }catch(error){
            next(error)
        }
    }
    async mobileLoginApproachByOTP_getOTP(req,res,next){
        const {mobileNumber,otp} = req.body;
        console.log("mobileNumber : ",mobileNumber)
        console.log("otp : ",otp)
        try{
            const {verifiedUser,access_token} = await this.#service.checkValidOTP(otp,mobileNumber);
            return res.status(httpCodes.OK).json(successResGen(httpCodes.OK,UserAuthModuleMessages?.LoginSuccess,{
                access_token
            }))
        }catch(error){
            // go to exception-handler
            next(error);
        }
    }
}

module.exports = new AuthController();


