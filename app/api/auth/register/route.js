import { connectToDB } from "../../../../lib/mongodb";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectToDB();
    
    const body = await req.json(); // Parse JSON body
    const { username, email, password, dob, class: studentClass, exam } = body;

    // Validate class and exam input
    if (![11, 12].includes(Number(studentClass))) {
      return new Response(JSON.stringify({ message: "Invalid class. Must be 11 or 12." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!["JEE", "NEET", "UPSC"].includes(exam)) {
      return new Response(JSON.stringify({ message: "Invalid exam. Must be JEE, NEET, or UPSC." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔒 Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user with hashed password
    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      dob, 
      class: studentClass, 
      exam 
    });

    await newUser.save();

    return new Response(JSON.stringify({ message: "User registered successfully" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
