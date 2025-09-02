import { Router } from "express";

const router = Router();

router.get("/home", (req, res) => {
	res.send("holaa xd");
});

export default router;
