import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = params;
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    const { name, role } = await req.json();
    await client.connect();
    const db = client.db("green-garden");
    
    await db.collection("user").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, role, updatedAt: new Date() } }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("green-garden");
    
    await db.collection("user").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
