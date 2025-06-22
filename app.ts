import express, {Application} from "express";
import todoRoutes from "./modules/MainApp/todo.routes";
import {apiLimiter} from "./modules/middleware/rateLimiter"
const app:Application = express();

app.use(express.json());

app.use('/api/v1', apiLimiter ,todoRoutes)



export default app;
