// packages
import { NextResponse } from "next/server";

// utils
import clientPromise from "@/utils/mongodb";
import { hashPassword } from "@/utils/password";
import { send200, send400, send401, send409, send500 } from "@/utils/apiResponses";

// types
import { User } from "@/types/user";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, name, password, confirmPassword } = body;

    if(!email || !password || !name || !confirmPassword) throw 400;
    if(password !== confirmPassword) throw 400;

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    
    const checkEmail = await db.collection<User>("users").findOne({email});
    if(checkEmail) throw 409;

    const user: User = {
      email,
      name,
      password: await hashPassword(password),
      createdAt: new Date(),
      role: "user"
    };

    const result = await db.collection<User>("users").insertOne(user);
    if(!result.acknowledged) throw result;

    return send200(
      {
        _id: result.insertedId.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      "User created successfully"
    );
  } catch (error) {
    if (error === 400) {
      return send400("Email and password are required");
    } else if (error === 401) {
      return send401("Email and password are incorrect");
    } else if( error === 409) {
      return send409("An account for that email already exists");
    } else {
        console.error("Error", error);
        return send500();
    }
  }
}


export async function GET(): Promise<NextResponse> {
    return NextResponse.json(
      { message: "Not implemented" },
      { status: 500 }
    );
}
