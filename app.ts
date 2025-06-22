import express, {Application} from "express";
import todoRoutes from "./modules/MainApp/todo.routes";

const app:Application = express();

app.use(express.json());

app.use('/api/v1', todoRoutes)



export default app;
