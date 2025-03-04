import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth"; // Get user session

export async function POST(req) {
  try {
    const { chapter } = await req.json();
    const session = await getServerSession(); // Get logged-in user session

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    // ✅ Add chapter to the user's completed list (Avoid duplicates)
    await User.updateOne(
      { _id: session.user.id },
      { $addToSet: { completedChapters: chapter } } // $addToSet ensures no duplicates
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking completion:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
