const jwt = require("jsonwebtoken");
const CommonResStatusMessage = require("@common/commonResStatusMsg");
const {UserAuthModuleMessages} = require("@modules/Auth/auth.messages");
const {failedResGen} = require("@common/responseStructure");
const authService = require("@modules/Auth/auth.service");





class CreateProtectedRoute{
    #jwtSecretKey;
    #authservice;

    constructor(){
        this.#authservice = authService;
        this.#jwtSecretKey = process.env.AUTH_JWT_SECRET_KEY;
        this.protectUsersRoute = this.protectUsersRoute.bind(this);
        
    }
    async protectUsersRoute(req,res,next){
        try{
            // const {token} = req.body;
            /**
             * @param {string} authHeader
             */
            const authHeader = req.headers?.['authorization']; 
            if(!authHeader){
                return res.status(401).json(failedResGen(401,CommonResStatusMessage?.UnAuthorized,{
                    requestHeaders : {
                        message : UserAuthModuleMessages?.UnAuthorized_Req_Headers

                    }
                }))
            }
            const token = authHeader.split(" ")[1];
            if(!token){
                res.status(401).json(failedResGen(401,CommonResStatusMessage?.UnAuthorized,{
                    token : {
                        message : UserAuthModuleMessages?.UnAuthorized_Access_Routes?.Token_Not_Send
                    }
                }))
            }
            // if token be valid,it contain {...payload,"iat" : ,"exp" : }
            // payload must be contained unique key to find by it
            const verifiedUser = await this.#authservice.verifyUserBySignedToken(token);
            console.log("verifiedUser(guard) : ",verifiedUser)
            req.body.verifiedUser = verifiedUser;
            next()

        }catch(err){
            next(err)
        }
        
    }
    
}


const createProtectedRoutes = new CreateProtectedRoute();
module.exports = createProtectedRoutes