const {Router} = require("express");
const router = Router();
// import protected-route-middleware
const createProtectedRoutes = require("@common/guard/protectedRoutes.guard");
// const createProtectedRoutes = require("../../common/guard/protectedRoutes.guard")


// test import 
const OrganizationalRolesModel = require("@modules/User/user.models")


const userControllers = require("@modules/User/user.controllers")



// theas routes startsWith "/user"
router.patch("/add-new-skils",userControllers.addNewSkil); // 
router.patch("/add-user-feedback-comment",userControllers.addFeedbackComment);
router.get("/:fields",userControllers.sendChoosenUserFields)




// router.get("/",[createProtectedRoutes.protectUsersRoute],function(req,res,next){
//     console.log("modifiedBody : ",req.body)
//     return res.status(200).json({
//         seccess : true,
//         message : "you authenticate successfully",
//         data : req.body
//     })
// })
router.get("/test-sms-like",userControllers.sendMarketingSMS);



// router.get("/test-client",function(req,res,next){
//     return res.status(200).json({
//         data : [
//             {title : "title1"},
//             {title : "title2"}
//         ]
//     })
// })



module.exports = router;