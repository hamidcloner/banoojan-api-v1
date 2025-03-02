const UserAuthModel = require("@modules/Auth/auth.models");
const CommonResStatusMessage = require("@common/commonResStatusMsg");
const {failedResGen} = require("@common/responseStructure");
const {UserAuthModuleMessages} = require("@modules/auth/auth.messages");
const {ValidationMessage} = require("@common/commonAppMessages")
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {authDataValidation} = require("@common/receivedDataValidator");
const autoBind = require("auto-bind");
const httpSMSClient = require("@services/smsManager/smsRequests.service");



// =============== ALERT : set projection for find-methods

class AuthService{
    #model;
    #smsService;
    // query-projections
    #returnedUser_sendOTP_projection = {favoritesSubjects : 0,savedSubjects : 0,__v : 0,isAuthenticated : 0,isAdmin : 0};
    #returnedUser_after_protected_route_permission = {mobileNumber : 1,userName : 1,skils : 1,_id : 0};
    #returnedUser_after_checkOTP = {skils : 1,mobileNumber : 1,isAuthenticated : 1,_id : 0}
    returnedUser_after_checkAuth = {skil : 1,mobileNumber : 1,_id : 0,verifiedMobile : 1,stepOfVerification : 1}
    #tokenExpiredIn_time = "7d";
    #toke_secretKey = process.env.AUTH_JWT_SECRET_KEY;
    // and other projections
    
    constructor(){
        // autoBind(this);
        this.#model = UserAuthModel;
        this.#smsService = httpSMSClient;
        // ===== /bind "this" keyword for methods/ ==
        this.checkExistUserByMobileNumber = this.checkExistUserByMobileNumber.bind(this);
        this.setMobileNumber = this.setMobileNumber.bind(this);
        this.OTPfactory = this.OTPfactory.bind(this);
        this.checkValidOTP = this.checkValidOTP.bind(this);
        this.verifyUserBySignedToken = this.verifyUserBySignedToken.bind(this);
        this.findUserById = this.findUserById.bind(this);
        this.findUserByUniqueProperty = this.findUserByUniqueProperty.bind(this);
    }

    // ==== generate OTP code and set expiredIn-time for it! ====
    async OTPfactory(mobileNumber){
        const applicantUser = await this.setMobileNumber(mobileNumber);
        const applicantTime = new Date().getTime();
        const randomOTP_created = crypto.randomInt(1000,10000);
        const expiredIn_created = applicantTime + process.env.APP_AUTH_OTP_EXP_DURATION_MIN * 60 * 1000 // 2 minutes later!

        
        if(!(applicantUser?.OTPcode?.expiredIn)){
            // user first time!
            const OTPcode = {
                code : randomOTP_created,
                expiredIn : expiredIn_created
            }
            applicantUser.OTPcode = OTPcode;
            await applicantUser.save();
            await this.#smsService.SendOTPVerifiedSMS_Fast(mobileNumber,randomOTP_created)
            return applicantUser
        }
        
        const applicantUser_previousExp_OTP = applicantUser.OTPcode.expiredIn;
        if(applicantTime < applicantUser_previousExp_OTP){
            throw {status : 400,message : CommonResStatusMessage?.BadRequest,errors : {
                otp : {
                    message : UserAuthModuleMessages?.OTPcodeNotExpired
                }
            }}
        }

        applicantUser.OTPcode.expiredIn = expiredIn_created;
        applicantUser.OTPcode.code = randomOTP_created;
        applicantUser.stepOfVerification = 1;
        await applicantUser.save();
        console.log("applicantUser : ",applicantUser)
        await this.#smsService.SendOTPVerifiedSMS_Fast(mobileNumber,randomOTP_created)
        return applicantUser;
    }
    // === check the received OTP-code is valid or not (Based expiredIn AND code) ===
    async checkValidOTP(otp,mobileNumber){
        const applicantUser = await this.checkExistUserByMobileNumber(mobileNumber);
        const registered_OTPcode = applicantUser?.OTPcode?.code;
        const registered_expiredIn = applicantUser?.OTPcode?.expiredIn;
        const applicant_Time = new Date().getTime();

        // === check condition ===

        // last check was correct!
        // if(!(registered_OTPcode === otp && applicant_Time < registered_expiredIn)){
        //     throw {status : 400,message : CommonResStatusMessage?.BadRequest,errors : {
        //         otp : {
        //             message : UserAuthModuleMessages?.OTPcode_OR_ExpiredIn_Invalid
        //         }
        //     }}
        // }

        // ============== New check otp logic ============
        // check just valid OR invalid otp-code
        if(!(registered_OTPcode === otp)){
            throw {status : 400,message : CommonResStatusMessage?.BadRequest,errors : {
                otp : {
                    message : UserAuthModuleMessages?.OTPcode_Invalid
                }
            }}
        }
        // check just otp-time was expired or not
        if(!(applicant_Time < registered_expiredIn)){
            throw {status : 400,message : CommonResStatusMessage?.BadRequest,errors : {
                otp : {
                    message : UserAuthModuleMessages?.OTPcode_time_expired
                }
            }}
        }
        // ============ New Check OTP logic finish =================

        applicantUser.verifiedMobile = true;
        applicantUser.stepOfVerification = 2;
        // applicantUser.isAuthenticated = true;
        await applicantUser.save();
        const access_token = await this.tokenGenerator(mobileNumber);
        const verifiedUser = await this.findUserByUniqueProperty({mobileNumber},this.#returnedUser_after_checkOTP);
        return {
            verifiedUser,
            access_token
        };
    }
    // ================= define utility methods ==================
    async checkExistUserByMobileNumber(mobileNumber){
        const applicantUser = await this.#model.findOne({mobileNumber});
        if(!applicantUser) throw {message : CommonResStatusMessage?.BadRequest,status : 400,errors : {
            mobileNumber : {
                message : UserAuthModuleMessages?.MobileNubmerNotFound
            }
        }}
        return applicantUser;
    }

    // returned user if it saved later OR save it in db and returned
    async setMobileNumber(mobileNumber){
        const applicantUser = await this.#model.findOne({mobileNumber}).select(this.#returnedUser_sendOTP_projection);
        if(!applicantUser){
            const added_New_ApplicantUser = new this.#model({
                mobileNumber
            })
            await added_New_ApplicantUser.save();
            return added_New_ApplicantUser;

        }
        return applicantUser;
    }
    // generate Signed-Token for authenticate user
    async tokenGenerator(mobileNumber){
        const applicantUser = await this.checkExistUserByMobileNumber(mobileNumber);
        const userPayload = {
            _id : applicantUser._id,
            mobileNumber : applicantUser.mobileNumber
        }
        console.log("SECRET-KEY : ",this.#toke_secretKey)
        return jwt.sign(userPayload,this.#toke_secretKey,{
            expiresIn : this.#tokenExpiredIn_time
        })
    }
    // find user after across protected-route-guard based on payload
    async findUserById(id,customProjection={}){
        if(!authDataValidation.checkValidMongooseID(id)){
            throw {status : 400,message : CommonResStatusMessage?.BadRequest,errors : {
                id : {
                    message : ValidationMessage?.Invalid_ID
                }
            }}
        }
        const verifiedUser = await this.#model.findById(id).select(customProjection);
        console.log("returnedUser : ",verifiedUser)
        if(!verifiedUser){
            throw {status : 404,message : CommonResStatusMessage?.NotFound,errros : {
                id : {
                    message : UserAuthModuleMessages?.User_Not_Found
                }
            }}
        }
        return verifiedUser;
    }
    // find user by unique-property with custom-projection
    async findUserByUniqueProperty(uniqueKey,customProjection={}){
            /**
             * @param {object} uniqueKey =EX=> {mobileNumber : "09121111111"}
             */
            if(!(Object.keys(uniqueKey).length === 1)){
                throw {status : 500,errors : {
                    enteredArg : "uniqueKey arg must be a object that contains one pair key-value"
                }}
            }
            const foundedUser = await this.#model.findOne(uniqueKey).select(customProjection);
            if(!foundedUser){
                throw {status : 404,message : CommonResStatusMessage?.BadRequest,errors : {
                    message : {
                        [uniqueKey] : {
                            message : UserAuthModuleMessages?.NotFound_User_By_UniqueKey
                        }
                    }
                }}
            }
            return foundedUser;
    }
    #jwtVerifypromisify(receivedToken){
        return new Promise((resolve,reject) => {
            jwt.verify(receivedToken,this.#toke_secretKey,function(err,decodedToken){
                if(err){
                    reject({status : 401,message : CommonResStatusMessage?.UnAuthorized,errors : {
                        token : {
                            message : UserAuthModuleMessages?.UnAuthorized_Access_Routes?.Token_Not_Valid
                        }
                    }})
                }
                resolve(decodedToken)
            })
        })
    }
    async verifyUserBySignedToken(receivedToken){
        const decodedUser = await this.#jwtVerifypromisify(receivedToken);
        const userID = decodedUser._id;
        const verifiedUer = await this.findUserById(userID,{mobileNumber : 1,skils : 1,verifiedMobile : 1});
        return verifiedUer;
    }
}


module.exports = new AuthService();