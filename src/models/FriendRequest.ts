import mongoose from "mongoose";

export interface FriendRequests extends mongoose.Document {
    sender: mongoose.ObjectId;
    recipient: mongoose.ObjectId;
}

const FriendRequestSchema = new mongoose.Schema<FriendRequests>({
    sender: mongoose.Schema.Types.ObjectId,
    recipient: mongoose.Schema.Types.ObjectId,
})

export default mongoose.models.FriendRequest || mongoose.model<FriendRequests>("FriendRequest", FriendRequestSchema);