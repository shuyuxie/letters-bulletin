import mongoose from "mongoose";

export interface Letters extends mongoose.Document {
  sender: mongoose.ObjectId;
  recipient: mongoose.ObjectId;
  content: string;
  date: Date;
  coordinates: { x: number; y: number; z: number };
  unseen: boolean;
  onBoard: boolean;
}

// for use in the client
export interface Letter {
  _id: string;
  sender: string; // join id with sending user's name
  content: string;
  date: Date;
  coordinates: { x: number; y: number; z: number };
  unseen: boolean;
  onBoard: boolean;
}

const LetterSchema = new mongoose.Schema<Letters>({
  sender: mongoose.Schema.Types.ObjectId,
  recipient: mongoose.Schema.Types.ObjectId,
  content: String,
  date: {
    type: Date,
    default: Date.now,
  },
  coordinates: {
    type: { x: Number, y: Number, z: Number },
  },
  unseen: {
    type: Boolean,
    default: true,
  },
  onBoard: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.models.Letter ||
  mongoose.model<Letters>("Letter", LetterSchema);
