const {Router} = require("express");
const router = Router();

const authRouter = require("@modules/Auth/auth.routes");
const userRouter = require("@modules/User/user.routes");
// add protected-route-middleware
const createProtectedRoutes = require("@common/guard/protectedRoutes.guard");



router.use("/auth",authRouter);
router.use("/user",[createProtectedRoutes.protectUsersRoute],userRouter);





module.exports = router;
