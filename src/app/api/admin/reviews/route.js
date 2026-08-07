import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("green-garden");
    const reviews = await db.collection("reviews").find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(req) {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    const { name, rating, comment, service, status } = await req.json();
    await client.connect();
    const db = client.db("green-garden");
    
    const result = await db.collection("reviews").insertOne({
      name,
      rating: parseInt(rating) || 5,
      comment,
      service: service || "General Services",
      status: status || "Pending",
      createdAt: new Date()
    });
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
