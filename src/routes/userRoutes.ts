import {Router} from 'express';
import { loginUser, registerUser, verifyRegistration } from '../controllers/userController';
import { validate } from '../middleware/typeValidation';
import { UserLoginSchema, UserRegisterSchema } from '../schemas/user.schema';

const router = Router();

router.post("/register", validate(UserRegisterSchema), registerUser);
router.post("/login", loginUser);
router.get("/verify/registration", validate(UserLoginSchema), verifyRegistration);

export default router;