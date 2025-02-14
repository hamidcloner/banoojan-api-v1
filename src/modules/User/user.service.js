const UserAuthModel = require("@modules/Auth/auth.models");
const {authDataValidation} = require("@common/receivedDataValidator");





class UserService{
    #model;
    constructor(){
        this.#model = UserAuthModel;
        this.AddSkils = this.AddSkils.bind(this);
    }
    async AddSkils(skils,userId){
        if(!authDataValidation.checkValidMongooseID(userId)){
            throw {status : 400,message : CommonResStatusMessage?.BadRequest,errors : {
                id : {
                    message : ValidationMessage?.Invalid_ID
                }
            }}
        }
        const result = await this.#model.findByIdAndUpdate(userId,{skils},{runValidators : true,new : true});
        return result;
    }
}



const userService = new UserService();
module.exports = userService;
