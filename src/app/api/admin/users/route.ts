import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/green-garden";

export async function GET() {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db("green-garden");
    const users = await db.collection("user").find().toArray();
    
    const formatted = users.map(u => ({
      id: u._id.toString(),
      name: u.name || "N/A",
      email: u.email,
      role: u.role || "client",
      createdAt: u.createdAt || new Date()
    }));
    
    return NextResponse.json(formatted);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(req: NextRequest) {
  const client = new MongoClient(mongoUri);
  try {
    const { name, email, role } = await req.json();
    if (!email || !name) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    
    await client.connect();
    const db = client.db("green-garden");
    
    // Check if user already exists
    const existing = await db.collection("user").findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }
    
    // Insert new user
    const result = await db.collection("user").insertOne({
      name,
      email,
      role: role || "client",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
