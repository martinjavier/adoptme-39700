import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("<h1 style='color:blue'>Bienvenidos</h1>");
});

export { router as viewsRouter };
