import { NextResponse } from "next/server";
import User from "../../../models/User";
import dbConnect from "@/app/lib/dbConnect";

/*
GET /users -> return all users
POST /users/:username/:useremail -> add new user to db (only use for testing/dummy data)
*/

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({});

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const userName = body.username;
    const userEmail = body.useremail;

    if (!userName || !userEmail) {
      return NextResponse.json(
        { error: "Email & username required" },
        { status: 500 }
      );
    }

    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "This user already exists" },
        { status: 500 }
      );
    }

    const newUser = new User({
      name: userName,
      email: userEmail,
      friends: [],
    });

    await newUser.save();
    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json(
      { error: "An error occurred while adding user" },
      { status: 500 }
    );
  }
}
