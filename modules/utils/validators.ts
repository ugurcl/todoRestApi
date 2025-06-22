import { z } from "zod";

const passwordRules = z
  .string({"required_error":"Password field cannot be empty."})
  .min(6, { message: "Password must be at least 6 characters." })
  .regex(/[0-9]/, { message: "Password must contain at least 1 digit." })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    message: "Password must contain at least 1 digit.",
  })
  .regex(/[A-Z]/, { message: "Password must contain at least 1 uppercase letter." })
  .regex(/[a-z]/, { message: "Password must contain at least 1 lowercase letter." });

export const registerSchema = z.object({
  username: z
    .string({ required_error: "Username field cannot be empty." })
    .min(3, { message: "Username must be at least 3 characters." }),
  password: passwordRules,
});

export const loginSchema = z.object({
  username: z.string({ required_error: "Username field cannot be empty." }),
  password: passwordRules,
});


export const createTodoSchema = z.object({
  title: z
    .string({ required_error: "Title field is required." })
    .min(1, { message: "Title cannot be empty." }),

  description: z.string().optional(),
  dueDate: z
    .string()
    .datetime({ message: "Due date must be in a valid date format." })
    .optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  dueDate: z
    .string()
    .datetime({ message: "Due date must be in a valid date format." })
    .optional(),
});