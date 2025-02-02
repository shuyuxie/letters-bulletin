import dbConnect from "@/app/lib/dbConnect";
import Letter from "@/models/Letter";
import LetterModel from "@/models/Letter";
import User from "@/models/User"; // Import the User model
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
export async function POST(request: NextRequest) {
  await dbConnect();

  const body = await request.json();
  const { sender, recipient, content } = body;

  // Validate that all required fields are present
  if (!sender || !recipient || !content) {
    return NextResponse.json(
      { error: "Sender, recipient, and content are required." },
      { status: 400 }
    );
  }

  try {
    // Find the recipient User by email
    const recipientUser = await User.findOne({ email: recipient });

    if (!recipientUser) {
      return NextResponse.json(
        { error: "Recipient not found." },
        { status: 404 }
      );
    }

    // Create a new Letter document with sender and recipient as ObjectIds
    const letterDoc = new Letter({
      sender: sender, // Assuming sender is already an ObjectId
      recipient: recipientUser._id,
      content: content,
      coordinates: { x: 0, y: 0, z: 0 },
    });

    // Save the Letter document to the database
    const savedLetter = await letterDoc.save();

    return NextResponse.json(savedLetter, { status: 201 });
  } catch (error) {
    console.error("Error saving letter:", error);
    return NextResponse.json(
      { error: "Failed to save the letter." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const letterId = searchParams.get("id");

    if (!letterId) {
      return NextResponse.json(
        { error: "Letter ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(letterId)) {
      return NextResponse.json(
        { error: "Invalid letter ID format" },
        { status: 400 }
      );
    }

    const letter = await LetterModel.findById(letterId);

    if (!letter) {
      return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    }

    await LetterModel.findByIdAndDelete(letterId);

    return NextResponse.json(
      { message: "Letter deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting letter:", error);
    return NextResponse.json(
      { error: "Failed to delete letter:" + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, coordinates } = body;

    if (!id || !coordinates) {
      return NextResponse.json(
        { error: "ID and new coords are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid letter ID format" },
        { status: 400 }
      );
    }

    const letter = await LetterModel.findById(id);

    if (!letter) {
      return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    }

    letter.coordinates = coordinates;
    await letter.save();

    return NextResponse.json(
      { message: "Letter updated successfully", letter },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating letter:", error);
    return NextResponse.json(
      { error: "Failed to update letter:" + error },
      { status: 500 }
    );
  }
}
