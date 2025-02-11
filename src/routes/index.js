const {Router} = require("express");
const router = Router();

const authRouter = require("@modules/Auth/auth.routes");
const userRouter = require("@modules/User/user.routes");



router.use("/auth",authRouter);
router.use("/user",userRouter);





module.exports = router;
