import express, { Router } from "express";
import { IdController } from "../controllers/idController";
import { AccountMap } from "../models/accountMap";

// Initialize the router and dependencies
const router: Router = express.Router();
const accountMap = new AccountMap();
const idController = new IdController(accountMap);

// Define routes
/**
 * POST /add-account
 * Adds an account ID to the system.
 */
router.post("/add-account", idController.addAccount);

/**
 * POST /remove-account
 * Removes an account ID from the system.
 */
router.post("/remove-account", idController.removeAccount);

export default router;
