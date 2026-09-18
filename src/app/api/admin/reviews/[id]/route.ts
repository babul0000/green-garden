import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/green-garden";

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const { id } = await Promise.resolve(context.params);
  const client = new MongoClient(mongoUri);
  try {
    const { status } = await req.json();
    await client.connect();
    const db = client.db("green-garden");
    
    await db.collection("reviews").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const { id } = await Promise.resolve(context.params);
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db("green-garden");
    
    await db.collection("reviews").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
