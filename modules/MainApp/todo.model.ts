import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface ITodo extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  dueDate?: Date;
  createdAt: Date;
}

export interface IUser extends Document {
  username: string;
  password: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}


const TodoSchema: Schema = new Schema<ITodo>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending",
  },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});


const UserSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre<IUser>('save', async function(next) {
    if(!this.isModified('password')) return next();
    try{
        const salt    = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next(); 
    }catch(e){
        next(e as any)
    }
})


UserSchema.methods.comparePassword = async function (password:string):Promise<boolean>  {
    return bcrypt.compare(password, this.password)
}

export const Todo =  mongoose.model<ITodo>("Todo", TodoSchema);
export const User =  mongoose.model<IUser>('User', UserSchema);