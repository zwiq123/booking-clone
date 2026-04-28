import {Router} from 'express';
import { getUserProfile, getUserProfileSelf, loginUser, registerUser, verifyRegistration } from '../controllers/userController';
import { validate } from '../middleware/typeValidation';
import { UserAccountVerificationSchema, UserIdSchema, UserLoginSchema, UserRegisterSchema } from '../schemas/user.schema';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post("/register", validate(UserRegisterSchema as any), registerUser);
router.post("/login", validate(UserLoginSchema as any), loginUser);
router.get("/verify/registration", validate(UserAccountVerificationSchema as any), verifyRegistration);
router.get("/profile/:id", validate(UserIdSchema as any), getUserProfile)
router.get("/profile", authenticate, getUserProfileSelf);

export default router;