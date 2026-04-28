import {Router} from 'express';
import { getUserProfile, loginUser, registerUser, verifyRegistration } from '../controllers/userController';
import { validate } from '../middleware/typeValidation';
import { UserIdSchema, UserLoginSchema, UserRegisterSchema } from '../schemas/user.schema';

const router = Router();

router.post("/register", validate(UserRegisterSchema as any), registerUser);
router.post("/login", loginUser);
router.get("/verify/registration", validate(UserLoginSchema as any), verifyRegistration);
router.get("/profile/:id", validate(UserIdSchema as any), getUserProfile)

export default router;