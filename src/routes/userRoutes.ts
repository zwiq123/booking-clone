import {Router} from 'express';
import { getUserProfile, loginUser, registerUser, verifyRegistration } from '../controllers/userController';
import { validate } from '../middleware/typeValidation';
import { UserIdSchema, UserLoginSchema, UserRegisterSchema } from '../schemas/user.schema';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post("/register", validate(UserRegisterSchema), registerUser);
router.post("/login", loginUser);
router.get("/verify/registration", validate(UserLoginSchema), verifyRegistration);
router.get("/profile/:id", validate(UserIdSchema), getUserProfile)

export default router;