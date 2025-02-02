import dbConnect from "@/app/lib/dbConnect";
import Letter, { Letter as ClientLetter } from "@/models/Letter";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { message: "No user id provided" },
      { status: 400 }
    );
  }
  const sent = await Letter.find({ sender: new ObjectId(id) });
  const received = await Letter.find({ recipient: new ObjectId(id) });
  const sentLetters = sent.map((letter) => {
    return {
      ...letter,
      date: new Date(letter.date),
      sender: "me",
    } as ClientLetter;
  });
  const joinSenderNames = received.map(async (letter) => {
    const sender = await User.findById(letter.sender, "name");
    return {
      ...letter["_doc"],
      sender: sender.name,
      date: new Date(letter.date),
    } as ClientLetter;
  });
  const receivedLetters = await Promise.all(joinSenderNames).then(
    (letters) => letters
  );
  return Response.json({ sent: sentLetters, received: receivedLetters });
}
