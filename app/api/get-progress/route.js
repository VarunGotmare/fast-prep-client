import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth"; // Get user session

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const user = await User.findById(session.user.id).select("completedChapters");

    return NextResponse.json({ completedChapters: user?.completedChapters || [] });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
