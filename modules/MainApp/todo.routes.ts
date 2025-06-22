import { Router } from "express";
import {
    login,
    register,
    createTodo,
    getTodos,
    getTodoById
} from "./todo.controller";
import {verifyToken} from "../middleware/auth.middleware";


const router = Router();

router.post('/register', register);
router.post('/login', login);


router.route('/todos')
    .post(verifyToken ,createTodo)
    .get(verifyToken, getTodos)

router.route('/todo/:id')
    .get(verifyToken,getTodoById)


export default router;