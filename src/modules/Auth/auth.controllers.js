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
        this.checkAuthByJWT = this.checkAuthByJWT.bind(this)
        // ================== Test BIND ===========================
        this.testNewQueries = this.testNewQueries.bind(this);
        // ==========================================================
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
        try{
            const {verifiedUser,access_token} = await this.#service.checkValidOTP(otp,mobileNumber);
            return res.status(httpCodes.OK).json(successResGen(httpCodes.OK,UserAuthModuleMessages?.LoginSuccess,{
                access_token,
                verifiedUser
            }))
        }catch(error){
            // go to exception-handler
            next(error);
        }
    }
    async checkAuthByJWT(req,res,next){
        try{
            const {verifiedUser : {_id : id}} = req.body;
            const accepteduser = await this.#service.findUserById(id,this.#service.returnedUser_after_checkAuth);
            return res.status(httpCodes.OK).json(successResGen(httpCodes.OK,UserAuthModuleMessages?.CHECK_AUTH_SUCCESSFULLY,{
                isAuthenticated : true,
                accepteduser
            }))
        }catch(error){
            next(error)
        }

    }
    // ========= Test ==============
    async testNewQueries(req,res,next){
        try{
            const {mobileNumber} = req.body;
            const result = await this.#service.findUserByUniqueProperty({mobileNumber},{_id : 0})
            return res.status(200).json({
                success : true,
                status : 200,
                data : result
            })
        }catch(err){
            next(err)
        }
    }
}

module.exports = new AuthController();


