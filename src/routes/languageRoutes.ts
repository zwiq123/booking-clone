import { Router } from "express";
import { getLanguageTypes } from "../controllers/languageController";

const router = Router();

router.get("/", getLanguageTypes);

export default router;