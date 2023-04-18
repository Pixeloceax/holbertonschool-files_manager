import express from "express";
import AppController from "../controllers/AppController.js";
import UsersController from "../controllers/UsersController.js";
import bodyParser from "body-parser";
const parser = bodyParser.json();

const router = express.Router();

router.get("/status", AppController.getStatus);
router.get("/stats", AppController.getStats);
router.post("/users", parser, (req, res) => UsersController.postNew(req, res));

export default router;
