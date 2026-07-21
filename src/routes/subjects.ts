import { Router, type Request, type Response } from "express";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.error("GET /subjects ERROR:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
