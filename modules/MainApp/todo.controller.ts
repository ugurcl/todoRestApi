import { Request, Response, NextFunction } from "express";
import {
  createTodoSchema,
  registerSchema,
  updateTodoSchema,
} from "../utils/validators";
import { Todo, User } from "./todo.model";
import { generateToken } from "../utils/generate_token";
import mongoose from "mongoose";

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

    const token = await generateToken({ user_id: user._id as string });

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

export const register = async (req: Request, res: Response): Promise<any> => {
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

export const createTodo = async (req: Request, res: Response): Promise<any> => {
  try {
    const validated = createTodoSchema.parse(req.body);
    const title = validated.title;
    const userId = (req as any).user.user_id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: "Invalid user." });
    }
    const existingTitle = await Todo.findOne({ user: userId, title: title });
    if (existingTitle)
      return res
        .status(409)
        .json({ error: "This title is already registered." });

    const newTodo = await Todo.create({
      ...validated,
      status: "pending",
      user: userId,
    });
    return res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "Todo created successfully.",
      data: newTodo,
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
): Promise<any> => {
  const userId = (req as any).user.user_id;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ error: "Invalid user." });
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const totalItems = await Todo.countDocuments({ user: userId });

  const todos = await Todo.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalPages = Math.ceil(totalItems / limit);

  return res.status(200).json({
    status: "success",
    currentPage: page,
    totalPages,
    totalItems,
    data: todos,
  });
};

export const getTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const todoId = (req as any).params.id;
    const userId = (req as any).user.user_id;

    if (!mongoose.Types.ObjectId.isValid(todoId))
      return res.status(400).json({
        error: "Invalid ID format.",
      });
    const todo = await Todo.findOne({ _id: todoId, user: userId }).lean();

    if (!todo) {
      return res.status(404).json({ data: [] });
    }

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      data: [todo],
    });
  } catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const firstError = err.errors[0].message;
      return res.status(400).json({ error: firstError });
    }

    return res.status(500).json({ error: "Something went wrong." });
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const todoId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({ error: "Invalid ID format." });
    }

    const userId = (req as any).user?.user_id;

    const deleted = await Todo.findOneAndDelete({
      _id: todoId,
      user: userId,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Todo not found or you don't have permission." });
    }

    return res.status(200).json({
      status: "success",
      message: "Todo deleted successfully.",
      data: deleted,
    });
  } catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const firstError = err.errors[0].message;
      return res.status(400).json({ error: firstError });
    }

    return res.status(500).json({ error: "Something went wrong." });
  }
};

export const patchTodoById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const todoId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({ error: "Invalid ID format." });
    }

    const userId = (req as any).user?.user_id;

    const validatedData = updateTodoSchema.parse(req.body);

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, user: userId },
      { $set: validatedData },
      { new: true }
    ).lean();

    if (!updatedTodo) {
      return res
        .status(404)
        .json({ error: "Todo not found or you don't have permission." });
    }

    return res.status(200).json({
      status: "success",
      message: "Todo updated successfully.",
      data: updatedTodo,
    });
  } catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const firstError = err.errors[0].message;
      return res.status(400).json({ error: firstError });
    }
    return res.status(500).json({ error: "Something went wrong." });
  }
};

export const patchTodoStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const todoId = req.params.id;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({ error: "Invalid ID format." });
    }

    const validStatuses = ["pending", "in_progress", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status value. Valid values: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    const userId = (req as any).user?.user_id;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, user: userId },
      { $set: { status } },
      { new: true }
    ).lean();

    if (!updatedTodo) {
      return res
        .status(404)
        .json({ error: "Todo not found or you don't have permission." });
    }

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Status updated successfully.",
      data: updatedTodo,
    });
  } catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const firstError = err.errors[0].message;
      return res.status(400).json({ error: firstError });
    }
    return res.status(500).json({ error: "Something went wrong." });
  }
};
