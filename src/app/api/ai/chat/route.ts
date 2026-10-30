import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Supported models in priority order (with automatic fallback on high demand/503)
const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-flash-latest"
];

const SYSTEM_INSTRUCTION = `
আপনি "A R Green Garden AI Assistant" (এ আর গ্রিন গার্ডেন স্মার্ট এআই সহায়ক ও বৃক্ষ বিশারদ)। আপনি একজন অত্যন্ত দক্ষ সার্টিফাইড আরবোরিস্ট (ট্রি ডক্টর), হর্টিকালচারিস্ট এবং আধুনিক ল্যান্ডস্কেপ আর্কিটেক্ট (ঢাকা, বাংলাদেশ)।

আপনার নিয়মাবলী:
১. ভাষা: ব্যবহারকারী যে ভাষাতেই প্রশ্ন করুক না কেন, আপনার সম্পূর্ণ উত্তর সবসময় প্রাঞ্জল, নির্ভুল ও সম্মানসূচক বাংলায় (Bengali) দিতে হবে। প্রয়োজনে বৈজ্ঞানিক বা টেকনিক্যাল নামগুলো ব্র্যাকেটে ইংরেজিতে লিখতে পারেন।
২. ব্যক্তিত্ব: বিনম্র, আন্তরিক, ইতিবাচক এবং অত্যন্ত সাহায্যকারী। যেমন Gemini-তে যেকোনো বিষয়ে খোলামেলা ও পূর্ণাঙ্গ উত্তর পাওয়া যায়, এখানেও ব্যবহারকারী গাছের যত্ন, রোদ, সার, পানি, কীটনাশক, মাটি, ল্যান্ডস্কেপিং বা যেকোনো সাধারণ প্রশ্ন করলে বিস্তারিত কিন্তু আকর্ষণীয় উত্তর দিন।
৩. ফরম্যাটিং: উত্তর সবসময় সুন্দরভাবে সাজিয়ে দিন—বোল্ড হেডিং, পরিষ্কার বুলেট পয়েন্ট বা নম্বর তালিকা ব্যবহার করুন।
৪. গাছের ছবি ও রোগ নির্ণয় (Multimodal): যদি কোনো ছবি দেওয়া থাকে, তবে ছবিটি নিখুঁতভাবে পর্যবেক্ষণ করে গাছের অবস্থা, পাতার দাগ, পোকার আক্রমণ বা পুষ্টিহীনতা চিহ্নিত করুন এবং ধাপে ধাপে ঘরোয়া ও সঠিক ওষুধ প্রয়োগের প্রেসক্রিপশন দিন।
৫. এ আর গ্রিন গার্ডেন ও জরুরি সেবা: যদি গাছের অবস্থা অত্যন্ত সংকটজনক বা মরার উপক্রম হয়, তবে আন্তরিকভাবে জানিয়ে দিন যে তারা আমাদের অন-কল ট্রি ডক্টর টিমকে ভিজিট করাতে পারেন (হটলাইন: 01883012641)।
`;

export async function POST(req: Request) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY কনফিগার করা হয়নি। দয়া করে পরিবেশ ভেরিয়েবল চেক করুন।" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages = [], image = null, prompt = "" } = body;

    if (!prompt && (!messages || messages.length === 0) && !image) {
      return NextResponse.json(
        { error: "অনুগ্রহ করে একটি প্রশ্ন বা ছবি প্রদান করুন।" },
        { status: 400 }
      );
    }

    // Build contents payload
    const contents: Array<{ role: string; parts: Array<any> }> = [];

    // If chat history is provided
    if (Array.isArray(messages) && messages.length > 0) {
      for (const m of messages) {
        const role = m.role === "assistant" || m.role === "model" ? "model" : "user";
        contents.push({
          role,
          parts: [{ text: m.content || "" }]
        });
      }
    } else if (prompt) {
      contents.push({
        role: "user",
        parts: [{ text: prompt }]
      });
    }

    // If an image is attached to the current user message
    if (image && image.data) {
      const mimeType = image.mimeType || "image/jpeg";
      // Find or attach to last user part
      if (contents.length > 0 && contents[contents.length - 1].role === "user") {
        contents[contents.length - 1].parts.push({
          inline_data: {
            mime_type: mimeType,
            data: image.data
          }
        });
      } else {
        contents.push({
          role: "user",
          parts: [
            { text: prompt || "এই গাছের ছবিটি দেখে রোগের লক্ষণ ও সমাধান বাংলায় প্রেসক্রিপশন আকারে বলুন।" },
            {
              inline_data: {
                mime_type: mimeType,
                data: image.data
              }
            }
          ]
        });
      }
    }

    const payload = {
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    };

    let lastError: any = null;
    let replyText = "";

    // Iterate through fallback models
    for (const model of FALLBACK_MODELS) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0];
          const part = candidate?.content?.parts?.[0];
          if (part?.text) {
            replyText = part.text;
            break; // Success!
          }
        } else {
          const errText = await response.text();
          lastError = `Model ${model} returned status ${response.status}: ${errText.substring(0, 150)}`;
          // If 503 (high demand) or 404, try next model
          continue;
        }
      } catch (err: any) {
        lastError = err?.message || String(err);
        continue;
      }
    }

    if (!replyText) {
      console.error("Gemini API Error across all fallback models:", lastError);
      return NextResponse.json(
        {
          error: "সার্ভার এই মুহূর্তে ব্যস্ত। অনুগ্রহ করে কয়েক সেকেন্ড পর আবার চেষ্টা করুন।",
          details: lastError
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      reply: replyText
    });
  } catch (error: any) {
    console.error("AI Chat Route Error:", error);
    return NextResponse.json(
      { error: "এআই সার্ভিসে সাময়িক সমস্যা হয়েছে।", details: error?.message },
      { status: 500 }
    );
  }
}
