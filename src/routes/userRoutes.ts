import {Router} from 'express';
import { loginUser, registerUser, verifyRegistration } from '../controllers/userController';

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/registration", verifyRegistration);

export default router;