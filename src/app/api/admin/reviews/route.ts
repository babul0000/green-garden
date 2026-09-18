import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/green-garden";

export async function GET() {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db("green-garden");
    const reviews = await db.collection("reviews").find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json(reviews);
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
    const { name, rating, comment, service, status } = await req.json();
    await client.connect();
    const db = client.db("green-garden");
    
    const result = await db.collection("reviews").insertOne({
      name,
      rating: parseInt(rating, 10) || 5,
      comment,
      service: service || "General Services",
      status: status || "Pending",
      createdAt: new Date()
    });
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
