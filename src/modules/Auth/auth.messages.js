const UserAuthModuleMessages = Object.freeze({
    MobileNubmerNotFound : "mobileNumber not found!please register your mobileNumber",
    OPTcodeSent : "OTP code sent successFully!",
    MobileNumberIsRequired : "mobileNumber is required,please send it",
    LoginSuccess : "your logged in successFully!",
    // user ui message => with persian-text message
    OTPcode_OR_ExpiredIn_Invalid : {
        en_message : "otp code is not valid OR otp time was expired!",
        fa_message : "رمز یکبار مصرف شما نامعنبر است یا زمان انقضای آن به پایان رسیده است"
    },
    IncorrectMobileNumber : {
        en_message : "your mobileNumber is not valid!",
        fa_message : "شماره همراه وارد شده نادرست است"
    },
    OTPcodeNotExpired : {
        en_message : "your previous otp code not expired yet!please try again later",
        fa_message : "رمز یکبار مصرف قبلی هنوز منقضی نشده است،بعدا دوباره تلاش کنید"
    },
    OTP_OR_MobileNumber_Required : {
        en_message : "mobileNumber or OTP code is Required,but not sent!",
        fa_message : "رمز یکبار مصرف یا شماره موبایل خود را ارسال نکرده اید",
        
    },
    User_Not_Found : {
        en_messgae : "User Not Found",
        fa_message : "کاربری با این مشخصات پیدا نشد"

    },
    UnAuthorized_Access_Routes : {
        Token_Not_Send : "you should send access-token!your request must be have `token` property and valid signed-token value",
        Token_Not_Valid : "sorry!your signed-token is invalid OR expired!"
    }

})










module.exports = {
    UserAuthModuleMessages
}