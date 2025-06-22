import app from "./app";
import dotenv from "dotenv";
import { connect_db } from "./modules/config/db";

dotenv.config();


const PORT = process.env.PORT;




app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
    connect_db();
})