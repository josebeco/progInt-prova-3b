import { Router } from "express";
import { login, register } from "../controllers/authController.js";

const rota = Router();


rota.post('/register', register);
rota.post('/login', login);


export default rota;