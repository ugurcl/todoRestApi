import mongoose from "mongoose";



export const connect_db = async () => {
    try{
        await mongoose.connect(process.env.CONNECTION_STRING as string);
        console.log('Connected to the database.');
    }catch(e){
        console.log('Could not connect to the database.')
        process.exit(1);
    }
}