import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/app/lib/dbConnect";

/*
POST /friends/:userida/:useridb -> add user b to user a's friends
GET /friends/:userid -> return user's friends
*/

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json(
      { error: "User ID required :((" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findById(userId).populate("friends", "name email");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ friends: user.friends });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching the user's friends" },
      { status: 500 }
    );
  }
}

// okay, this seems freaky but i'm just trying to cut down on API calls by passing this endpoint email addresses
export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const userEmailA = body.emaila;
  const userEmailB = body.emailb;

  if (!userEmailA || !userEmailB) {
    return NextResponse.json(
      { error: "Both user emails required :((" },
      { status: 400 }
    );
  }

  try {
    const userA = await User.findOne({ email: userEmailA });
    const userB = await User.findOne({ email: userEmailB });

    if (!userA || !userB) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!userA.friends.includes(userB._id)) {
      userA.friends.push(userB._id);
      await userA.save();
    }

    return NextResponse.json(
      { message: "Friend added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while trying to add friend" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  const body = await request.json();
  const userEmailA = body.emaila;
  const userEmailB = body.emailb;

  if (!userEmailA || !userEmailB) {
    return NextResponse.json(
      { error: "Both user emails required :((" },
      { status: 400 }
    );
  }

  try {
    const userA = await User.findOne({ email: userEmailA });
    const userB = await User.findOne({ email: userEmailB });

    if (!userA || !userB) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const friendIndex = userA.friends.indexOf(userB._id);

    if (friendIndex > -1) {
      userA.friends.splice(friendIndex, 1);
      await userA.save();

      return NextResponse.json(
        { message: "Friend removed successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Friend not found in user's friend list" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while trying to remove friend" },
      { status: 500 }
    );
  }
}
