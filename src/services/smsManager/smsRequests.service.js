const authDataValidation = require("@common/receivedDataValidator");
const { default: axios } = require("axios");
const autoBind = require('auto-bind');


class HttpSMSClient{
    #smsLineNumber;
    #apiSMS;
    #sendOTP_templateName = "otpCode";
    #sendOTP_templateId = 455546;
    constructor(){
        this.#smsLineNumber = process.env.SMS_LINE_NUMBER;
        // ==== /bind "this" keyword for methods/ ==
        this.SendMarketingSMS_Delay = this.SendMarketingSMS_Delay.bind(this);
        this.SendOTPVerifiedSMS_Fast = this.SendOTPVerifiedSMS_Fast.bind(this);
        // === / create axios instance with globally config
        this.#apiSMS = axios.create({
          baseURL : process.env.SMS_URL_ENDPOINT,
          headers : {
            'Content-Type' : 'application/json',
            'Accept' : 'text/plain',
            'X-API-KEY' : process.env.SMS_API_KEY_SANDBOX
          }
        })  
    }
    /**
     * 
     * @param {array<string>} messageTexts 
     * @param {array<string>} mobiles 
     * @param {number|null} SendDateTime 
     * @param {int | null} lineNumber
     * @returns 
     */

    SendMarketingSMS_Delay(messageTexts,mobiles,SendDateTime = null){
       if(!(messageTexts instanceof Array || (mobiles instanceof Array && mobiles.filter(num => !authDataValidation.mobileNumber_regPattern.test(num)).length !== 0))){
             throw new Error(` \'messageText\' arg must be Array of String OR mobiles pattern is incorrect`)
         }
        return new Promise((resolve,reject) => {
          this.#apiSMS.post("/likeToLike",{
            lineNumber : this.#smsLineNumber,
            messageTexts,
            mobiles,
            SendDateTime
          }).then(response => resolve(JSON.stringify(response.data)))
            .catch(err => reject(err))
          
        })
    }
    /**
     * 
     * @param {string} mobile as targetMobile 
     * @param {int} templateId 
     * @param {array<object>} parameters 
     */
    SendOTPVerifiedSMS_Fast(targetMobile,otpCode){
      if(typeof targetMobile !== "string" ||  !otpCode){
        throw new Error('arguments format may be incorrect!')
      }
      return new Promise((resolve,reject) => {
        this.#apiSMS.post("/verify",{
          mobile : targetMobile,
          templateId : this.#sendOTP_templateId,
          parameters : [
            {name : this.#sendOTP_templateName,value : otpCode}
          ]
        }).then((response) => resolve(JSON.stringify(response.data)))
          .catch((error) => reject(error))
      })
    }
}


// singletone pattern approach
const httpSMSClient = new HttpSMSClient();
module.exports = httpSMSClient