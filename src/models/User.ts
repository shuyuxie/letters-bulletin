import mongoose from "mongoose";

export interface Users extends mongoose.Document {
    name: string;
    email: string;
    friends: mongoose.ObjectId[];
}

const UserSchema = new mongoose.Schema<Users>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    friends: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }
})

export default mongoose.models?.User || mongoose.model<Users>("User", UserSchema);