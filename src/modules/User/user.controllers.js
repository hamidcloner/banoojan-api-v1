const httpSMSClient = require("@services/smsManager/smsRequests.service");
// const axios = require("axios")
const userService = require("@modules/User/user.service");
const httpCodes = require("http-codes");
const {successResGen} = require("@common/responseStructure");
const {UserMessages} = require("@modules/User/user.messages");


class UserControllers{
    /**
     * received default req.body after affected protected-middleware
     * @param {object} verifiedUser => {_id : ,mobileNumber : ,verifiedMobile : skils : }
     */
    #smsService;
    #service;
    constructor(){
        this.#smsService = httpSMSClient;
        this.#service = userService;
        this.sendVerifiedOTPCode = this.sendVerifiedOTPCode.bind(this);
        this.sendMarketingSMS = this.sendMarketingSMS.bind(this);
        this.addNewSkil = this.addNewSkil.bind(this);  
        this.addFeedbackComment = this.addFeedbackComment.bind(this);  
        this.sendChoosenUserFields = this.sendChoosenUserFields.bind(this)
    }
    async addNewSkil(req,res,next){
        try{
            const {skil,verifiedUser : {_id : id}} = req.body;
            const modifiedUser = await this.#service.AddSkils(skil,id);
            return res.status(httpCodes.CREATED).json(successResGen(httpCodes.CREATED,UserMessages?.ADD_SKILS_SUCCESSFULLY,{
                modifiedUser
            }))

        }catch(error){
            next(error)
        }
    }
    async addFeedbackComment(req,res,next){
        try{
            const {feedbackComment,verifiedUser : {_id : id}} = req.body;
            const modifiedUser = await this.#service.AddVisitedWebFeedbackComment(feedbackComment,id);
            return res.status(httpCodes.CREATED).json(successResGen(httpCodes.CREATED,UserMessages?.ADD_FEEDBACK_COMMENT_SUCCESSFULLY,{
                modifiedUser
            }))
        }catch(error){
            next(error)
        }
    }
    async sendChoosenUserFields(req,res,next){
        try{
            console.log("====== ChoosenUserField Controller =======")
            const params = req.params;
            const {verifiedUser : {_id : id}} = req.body;
            /**
             * params : {
             *      fields : "field1-field2-...." 
             * }
             */
            const arrayOfFields = params.fields.split("-");
            const fieldsProjection = {_id : 0};
            arrayOfFields.forEach((field) => {
                fieldsProjection[field] = 1 
            });
            console.log("this => ",this.#service)
            const returnedUserInfo = await this.#service.findUserById(id,fieldsProjection)
            return res.status(httpCodes.OK).json(successResGen(httpCodes.OK,UserMessages?.SEND_USER_SPECIFIC_INFO_SUCCESSFULLY,{
                user : returnedUserInfo
            }))
        }catch(error){
            next(error)
        }


    }




















    async sendVerifiedOTPCode(req,res,next){
        try{
            // const result = await this.#smsService.SendOTPVerifiedSMS_Fast("09357324849","2569");
            const result = await httpSMSClient.SendOTPVerifiedSMS_Fast("09357324849","2569");
            return res.status(200).json({
                result
            })
        }catch(error){
            console.log("error : ",error)
            next(error)
        }
    }
    async sendMarketingSMS(req,res,next){
        try{
            const result = await this.#smsService.SendMarketingSMS_Delay(["hello"],["09357324849"]);
            return res.status(200).json({
                success : true,
                data : result
            })
        }catch(err){
            next(err)
        }
    }




    async sendSMS(req,res,next){
        try{
            const result = await httpSMSClient.SendMarketingSMS_Delay();
            console.log("controller : ",result)
            return res.status(200).json({
                success : true,
                data : result
            })
        }catch(err){
            console.log("controller error : ",err)
            next(err)
        }

    }


    // تنها حالت درست!
//     async sendSMS(req,res,next){
//         try{
//             var data = JSON.stringify({
//                 "lineNumber": 30007487133291,
//                 "messageTexts": ["HEllo"],
//                 "mobiles": [
//                 "09357324849",
//                  ],
//                 "sendDateTime": null
//                 });
//                 var config = {
//                     method: 'post',
//                     url: 'https://api.sms.ir/v1/send/likeToLike',
//                     headers: {
//                     //   'X-API-KEY': '7GjHxkaMScwGeN65uehPhiGXBR4l1RJaVH2s7ringGtB1ZeB',
//                       'X-API-KEY' : 'DfyKJfSzgvcZ4D2HT1Jb8NWQPovd5tXH1DD3nOUS0PkHcLUJ',
//                       'Content-Type': 'application/json'
//                     },
//                     data : data
//                   };
//                   axios(config)
//                   .then(function (response) {
//                     console.log(JSON.stringify(response.data));
//                   })
//                   .catch(function (error) {
//                     console.log(error);
//                   });

//         }catch(err){
//             next(err)
//         }

// }
    // این هم درست است
    async sendSMSVerify(req,res,next){
    try{
        var data = JSON.stringify({
            "mobile": "09357324849",
            "templateId": 455546,
            "parameters": [
                {name : "otpCode",value : "1256"}
             ],
            });
            var config = {
                method: 'post',
                url: 'https://api.sms.ir/v1/send/verify',
                headers: {
                //   'X-API-KEY': '7GjHxkaMScwGeN65uehPhiGXBR4l1RJaVH2s7ringGtB1ZeB',
                  'X-API-KEY' : process.env.SMS_API_KEY_SANDBOX,
                  'Content-Type': 'application/json',
                  'Accept' : "text/plain"
                },
                data : data
              };
              axios(config)
              .then(function (response) {
                console.log(JSON.stringify(response.data));
              })
              .catch(function (error) {
                console.log(error);
              });

    }catch(err){
        next(err)
    }


    }
}


const userControllers = new UserControllers()
module.exports = userControllers;