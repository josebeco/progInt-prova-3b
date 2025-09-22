import { Router } from "express";
import {
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "../controllers/usersController.js";
import { authenticateToken } from "../middleware/auth.js";

const rota = Router();

rota.get("/", authenticateToken, getUsers);
rota.get("/:id", authenticateToken, getUserById);
rota.put("/:id", authenticateToken, updateUser);
rota.delete("/:id", authenticateToken, deleteUser);

export default rota;
