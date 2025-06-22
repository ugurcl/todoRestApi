import { Request, Response, NextFunction } from "express";
import { registerSchema } from "../utils/validators";
import { User } from "./todo.model";
import { generateToken } from "../utils/generate_token";
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const validateBody = registerSchema.parse(req.body);
        const { username, password } = validateBody;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Incorrect username or password." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect username or password." });
        }

        const token = generateToken({ user_id: user._id as string });
        return res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Login successful.",
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                },
            },
        });
    } catch (err: any) {
        if (err.errors && Array.isArray(err.errors)) {
            const firstError = err.errors[0].message;
            return res.status(400).json({ error: firstError });
        }
        return res.status(500).json({ error: "Something went wrong." });
    }
};

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const validateBody = registerSchema.parse(req.body);
        const { username, password } = validateBody;
        const existingUsername = await User.findOne({ username });
        if (existingUsername)
            return res
                .status(409)
                .json({ error: "This username is already registered." });

        const newUser = await User.create({ username, password });
        return res.status(201).json({
            status: "success",
            statusCode: 201,
            message: "User registered successfully.",
        });
    } catch (err: any) {
        if (err.errors && Array.isArray(err.errors)) {
            const firstError = err.errors[0].message;
            return res.status(400).json({ error: firstError });
        }
        return res.status(500).json({ error: "Something went wrong." });
    }
};

export const getTodos = async (
    req: Request,
    res: Response,
    next: NextFunction
) => { };

export const getTodoById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => { };

export const deleteTodo = (
    req: Request,
    res: Response,
    next: NextFunction
) => { };

export const patchTodoById = (
    req: Request,
    res: Response,
    next: NextFunction
) => { };

export const patchTodoStatus = (
    req: Request,
    res: Response,
    next: NextFunction
) => { };
