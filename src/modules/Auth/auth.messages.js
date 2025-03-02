const UserAuthModuleMessages = Object.freeze({
    OPTcodeSent : "OTP code sent successFully!",
    MobileNumberIsRequired : "mobileNumber is required,please send it",
    LoginSuccess : "your logged in successFully!",
    // user ui message => with persian-text message
    MobileNubmerNotFound : {
        en_message : "mobileNumber not found!please register your mobileNumber",
        fa_message : "هنوز شماره موبایل را وارد نکردید،ابتدا شماره موبایل را ارسال کنید"
    },
    OTPcode_OR_ExpiredIn_Invalid : {
        en_message : "otp code is not valid OR otp time was expired!",
        fa_message : "رمز یکبار مصرف شما نامعنبر است یا زمان انقضای آن به پایان رسیده است"
    },
    OTPcode_Invalid : {
        en_message : "sorry!otp code is invalid!",
        fa_message : "کد نادرست است،دقت کنید",
    },
    OTPcode_time_expired : {
        en_message : "otp-code time was expired!",
        fa_message : "زمان استفاده از کد،به پایان رسید،دوباره درخواست بدید"

    },
    IncorrectMobileNumber : {
        en_message : "your mobileNumber is not valid!",
        fa_message : "شماره همراه وارد شده نادرست است"
    },
    OTPcodeNotExpired : {
        en_message : "your previous otp code not expired yet!please try again later",
        fa_message : "رمز یکبار مصرف قبلی هنوز منقضی نشده است،بعد از 2 دقیقه دوباره تلاش کنید"
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
    },
    UnAuthorized_Req_Headers : {
        en_message : "your request headers not contains \`authorization\` header",
    },
    NotFound_User_By_UniqueKey : {
        en_message : "not found any user with this field",
        fa_message : "کاربری با این مشخصات پیدا نشد"
    },
    CHECK_AUTH_SUCCESSFULLY : {
        en_message : "User Auhtenticated SuccessFully",
        fa_message : "شناسایی کاربر موفقیت آمیز بود"

    }

})










module.exports = {
    UserAuthModuleMessages
}