const UserAuthModel = require("@modules/Auth/auth.models");
const {authDataValidation} = require("@common/receivedDataValidator");
const {UserMessages} = require("@modules/User/user.messages")





class UserService{
    #model;
    constructor(){
        this.#model = UserAuthModel;
        this.AddSkils = this.AddSkils.bind(this);
        this.AddVisitedWebFeedbackComment = this.AddVisitedWebFeedbackComment.bind(this)
    }
    async AddSkils(skil,userId){
        if(!authDataValidation.checkValidMongooseID(userId)){
            throw {status : 400,message : CommonResStatusMessage?.BadRequest,errors : {
                id : {
                    message : ValidationMessage?.Invalid_ID
                }
            }}
        }
        const result = await this.#model.findByIdAndUpdate(userId,{$set : {skil : skil}},{runValidators : true,new : true});
        if(!result){
            throw {status : 404,message : CommonResStatusMessage?.NotFound,errors : {
                user : {
                    message : UserMessages?.NotFound_User_By_UniqueKey

                }
            }}
        }
        return result;
    }
    async AddVisitedWebFeedbackComment(cm,userId){
        if(!authDataValidation.checkValidMongooseID(userId)){
            throw {status : 400,message : CommonResStatusMessage?.BadRequest,errors : {
                id : {
                    message : ValidationMessage?.Invalid_ID
                }
            }}
        }
        const result = await this.#model.findByIdAndUpdate(userId,{$set : {feedbackComment : cm}},{runValidators : true,new : true});
        if(!result){
            throw {status : 404,message : CommonResStatusMessage?.NotFound,errors : {
                user : {
                    message : UserMessages?.NotFound_User_By_UniqueKey

                }
            }}
        }
        return result;



    }
}



const userService = new UserService();
module.exports = userService;
