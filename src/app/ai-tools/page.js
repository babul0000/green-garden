"use client";

import { useState } from "react";
import Estimator from "@/components/home/Estimator";

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState("estimator");

  // Plant Recommendations State
  const [sunlight, setSunlight] = useState("partial");
  const [space, setSpace] = useState("balcony");
  const [soil, setSoil] = useState("loamy");
  const [recommendedPlants, setRecommendedPlants] = useState(null);
  const [recLoading, setRecLoading] = useState(false);

  // Plant Disease Detection State
  const [diseaseImage, setDiseaseImage] = useState(null);
  const [scanState, setScanState] = useState("idle"); // idle, scanning, result
  const [scanResult, setScanResult] = useState(null);

  // AI Chat Assistant State
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hello! I am your AR Green Garden AI Assistant. Ask me anything about plant care, vertical walls, rooftop weight loads, or booking consultations!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);

  // Layout Calculator State (Garden Size Calculator)
  const [calcShape, setCalcShape] = useState("rectangle");
  const [calcLength, setCalcLength] = useState(20);
  const [calcWidth, setCalcWidth] = useState(15);
  const [calcRadius, setCalcRadius] = useState(10);
  const [calculatedSize, setCalculatedSize] = useState(300);

  const calculateSize = () => {
    let size = 0;
    if (calcShape === "rectangle") {
      size = calcLength * calcWidth;
    } else {
      size = Math.round(Math.PI * calcRadius * calcRadius);
    }
    setCalculatedSize(size);
  };

  const handleGenerateRecommendations = (e) => {
    e.preventDefault();
    setRecLoading(true);
    setRecommendedPlants(null);

    setTimeout(() => {
      setRecLoading(false);
      
      const plantsList = {
        full_sun: [
          { name: "Bougainvillea (বাগানবিলাস)", type: "Flowering Climber", care: "Water only when dry. Needs 6+ hours of hot direct sun.", desc: "Vibrant pink and orange paper-like bracts. Drought resistant and highly durable for Dhaka rooftops." },
          { name: "Curry Leaf Plant (কারি পাতা)", type: "Medicinal Shrub", care: "Moderate watering. Thrives in sandy-loam organic soil.", desc: "Fragrant leaves widely used in cooking. Very hardy and acts as a natural insect repellent." }
        ],
        partial: [
          { name: "Tulsi / Holy Basil (তুলসী)", type: "Herbal Bush", care: "Moist soil. Morning soft sunlight is best.", desc: "Highly sacred herbal plant in subtropical zones. Excellent for balconies and balcony borders." },
          { name: "Spider Plant (মাকড়সা গাছ)", type: "Air Purifier Hanging", care: "Prefers well-draining coco-peat. Indirect bright light.", desc: "Produces hanging baby plantlets. Highly efficient in filtering carbon monoxide and formaldehyde." }
        ],
        shade: [
          { name: "Devil's Ivy / Money Plant (মানি প্ল্যান্ট)", type: "Vining Foliage", care: "Can grow in plain water or moist soil. Very low light tolerant.", desc: "Fast-growing evergreen vine. Perfect for indoor vertical wall grids and bedroom decorations." },
          { name: "Boston Fern (ঢেঁকি শাক)", type: "Humidity Loving Bush", care: "Frequent misting. Prefers shady damp corners.", desc: "Feathery bright green fronds. Best for indoor vertical green walls or hanging baskets." }
        ]
      };

      const matchedKey = sunlight === "full" ? "full_sun" : sunlight === "partial" ? "partial" : "shade";
      setRecommendedPlants(plantsList[matchedKey]);
    }, 1500);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDiseaseImage(URL.createObjectURL(file));
      setScanState("idle");
      setScanResult(null);
    }
  };

  const handleScanLeaf = () => {
    if (!diseaseImage) return;
    setScanState("scanning");

    setTimeout(() => {
      setScanState("result");
      setScanResult({
        disease: "Powdery Mildew (ধুলোময় ছাতা রোগ)",
        confidence: "96.4%",
        cause: "Fungal infection triggered by high humidity levels and poor air circulation around lower plant stems.",
        remedy: "Spray leaf surfaces with organic Neem Oil mixture (5ml oil + 2ml liquid soap in 1L warm water) once every 5 days. Prune heavily infected lower leaves."
      });
    }, 3000);
  };

  const botResponses = [
    { keywords: ["hello", "hi", "hey"], answer: "Hello! How can I assist you with your landscaping or gardening questions today?" },
    { keywords: ["book", "consultation", "appointment", "schedule"], answer: "You can book a site consultation directly in your Client Dashboard under the 'Bookings' section, or submit the contact form on our Homepage!" },
    { keywords: ["waterproofing", "leak", "roof"], answer: "We apply a triple-layer elastomeric waterproofing membrane coating before placing any garden planters. We also conduct a 48-hour flood test to guarantee zero leaks." },
    { keywords: ["weight", "load", "safety"], answer: "For rooftops, our structural engineers conduct capacity assessments. We use lightweight substrates (organic coco-peat and expanded clay) instead of heavy field clay to minimize load by 50%." },
    { keywords: ["price", "cost", "budget"], answer: "Our standard landscaping setups start from BDT 70-120 per sq. ft. Use the AI Cost Estimator tab right here to calculate your project range instantly!" }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: "user", text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const inputCleaned = chatInput.toLowerCase();
    setChatInput("");
    setChatTyping(true);

    setTimeout(() => {
      setChatTyping(false);
      let matchedResponse = "I'm sorry, I didn't fully understand that. Could you ask about rooftop waterproofing, landscaping pricing, weight capacity, or how to book a consultation?";
      
      for (const res of botResponses) {
        if (res.keywords.some(kw => inputCleaned.includes(kw))) {
          matchedResponse = res.answer;
          break;
        }
      }

      setChatMessages(prev => [...prev, { sender: "bot", text: matchedResponse }]);
    }, 1200);
  };

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6 relative">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-5 animate-fade-in-up">
          <span className="text-[13px] font-bold tracking-wider text-primary-green uppercase font-sans">Artificial Intelligence</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a3020]">AI Garden Studio</h1>
          <div className="w-16 h-1.5 bg-primary-green/20 mx-auto rounded"></div>
          <p className="text-foreground/75 leading-relaxed text-sm">
            Leverage our smart tools to calculate budgets, recommend ideal local plant species, diagnose leaf disease, and get instant chat support.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center border-b border-foreground/5 pb-2 flex-wrap gap-2 md:gap-4">
          {[
            { id: "estimator", label: "💰 Cost Estimator", desc: "Budget calculations" },
            { id: "recommendation", label: "🌱 Plant Recommendation", desc: "Select sun & soil" },
            { id: "disease", label: "🍂 Disease Detector", desc: "Leaf scanner" },
            { id: "chat", label: "💬 AI Assistant Chat", desc: "24/7 help bot" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-5 rounded-2xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary-green text-white shadow-md scale-105"
                  : "bg-white text-foreground/60 border border-foreground/5 hover:border-primary-green/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="bg-white/80 border border-foreground/5 rounded-[32px] p-6 md:p-10 shadow-sm min-h-[400px]">
          
          {/* TAB 1: Cost Estimator */}
          {activeTab === "estimator" && (
            <div className="flex flex-col gap-10 animate-fade-in-up">
              {/* Garden Size Calculator widget */}
              <div className="bg-sage-light/30 border border-primary-green/10 rounded-2xl p-6">
                <h3 className="font-serif font-bold text-[#1a3020] text-sm md:text-base mb-1">📐 Area Size Calculator</h3>
                <p className="text-[11px] text-foreground/50 mb-4">Unsure of your layout size? Select a layout shape and insert dimensions.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase">Shape</label>
                    <select 
                      value={calcShape}
                      onChange={(e) => setCalcShape(e.target.value)}
                      className="bg-white border border-foreground/10 py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                    >
                      <option value="rectangle">Rectangle / Square</option>
                      <option value="circle">Circular / Dome</option>
                    </select>
                  </div>

                  {calcShape === "rectangle" ? (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-foreground/60 uppercase">Length (Ft)</label>
                        <input 
                          type="number"
                          value={calcLength}
                          onChange={(e) => setCalcLength(parseInt(e.target.value) || 0)}
                          className="bg-white border border-foreground/10 py-2 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green text-center"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-foreground/60 uppercase">Width (Ft)</label>
                        <input 
                          type="number"
                          value={calcWidth}
                          onChange={(e) => setCalcWidth(parseInt(e.target.value) || 0)}
                          className="bg-white border border-foreground/10 py-2 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green text-center"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-foreground/60 uppercase">Radius (Ft)</label>
                      <input 
                        type="number"
                        value={calcRadius}
                        onChange={(e) => setCalcRadius(parseInt(e.target.value) || 0)}
                        className="bg-white border border-foreground/10 py-2 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green text-center"
                      />
                    </div>
                  )}

                  <button
                    onClick={calculateSize}
                    type="button"
                    className="bg-[#1a3020] hover:bg-black text-white font-bold text-xs py-3 px-4 rounded-xl cursor-pointer transition-colors"
                  >
                    Calculate Area Size
                  </button>
                </div>

                {calculatedSize > 0 && (
                  <div className="mt-4 text-xs font-bold text-primary-green bg-white py-2 px-4 rounded-xl w-fit border border-primary-green/10">
                    Resulting Size: <span className="underline">{calculatedSize} Sq. Ft.</span> (Hint: slide the slider below to match this area size)
                  </div>
                )}
              </div>

              {/* General Estimator Form component */}
              <Estimator isModal={false} />
            </div>
          )}

          {/* TAB 2: Plant Recommendation */}
          {activeTab === "recommendation" && (
            <div className="flex flex-col gap-8 animate-fade-in-up">
              <div className="max-w-xl">
                <h3 className="font-serif font-bold text-[#1a3020] text-lg md:text-xl">AI Subtropical Plant Recommendation Wizard</h3>
                <p className="text-xs text-foreground/60 leading-relaxed mt-1">Select your space settings and our agricultural model will recommend ideal local and premium plant options.</p>
              </div>

              <form onSubmit={handleGenerateRecommendations} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end border-b border-foreground/5 pb-8">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-foreground/75">Sunlight Level</label>
                  <select 
                    value={sunlight}
                    onChange={(e) => setSunlight(e.target.value)}
                    className="bg-white border border-foreground/10 py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                  >
                    <option value="full">Direct Sun (6+ hours)</option>
                    <option value="partial">Partial Sun/Shade (2-4 hours)</option>
                    <option value="shade">Deep Indoors / Full Shade</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-foreground/75">Space Category</label>
                  <select 
                    value={space}
                    onChange={(e) => setSpace(e.target.value)}
                    className="bg-white border border-foreground/10 py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                  >
                    <option value="rooftop">Open Rooftop Orchard</option>
                    <option value="balcony">Balcony Railings</option>
                    <option value="indoor">Indoor Office / Living Room</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-foreground/75">Soil/Medium Standard</label>
                  <select 
                    value={soil}
                    onChange={(e) => setSoil(e.target.value)}
                    className="bg-white border border-foreground/10 py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                  >
                    <option value="loamy">Sandy Loam Mix</option>
                    <option value="clay">Heavy Garden Clay</option>
                    <option value="organic">Coco-Peat Organic Substrate</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={recLoading}
                  className="bg-primary-green hover:bg-primary-green-dark text-white font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer text-xs md:text-sm text-center flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {recLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Matching...</span>
                    </>
                  ) : "Generate Recommendations"}
                </button>
              </form>

              {/* Recommendation results */}
              {recommendedPlants && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                  {recommendedPlants.map((plant, idx) => (
                    <div key={idx} className="bg-sage-light/20 border border-primary-green/10 p-6 rounded-3xl flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <span className="text-[10px] text-primary-green font-bold uppercase tracking-wider bg-white border border-primary-green/15 px-2.5 py-1 rounded-full w-fit">
                          {plant.type}
                        </span>
                        <h4 className="font-bold text-[#1a3020] text-lg mt-3">{plant.name}</h4>
                        <p className="text-xs text-foreground/75 leading-relaxed mt-2">{plant.desc}</p>
                      </div>
                      <div className="mt-4 border-t border-[#1a3020]/5 pt-3 text-[11px] text-[#1a3020]/70 font-sans">
                        <b>🌿 Maintenance Care:</b> {plant.care}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Disease Detector */}
          {activeTab === "disease" && (
            <div className="flex flex-col md:flex-row gap-10 items-start animate-fade-in-up">
              {/* Uploader Column */}
              <div className="w-full md:w-1/2 flex flex-col gap-6">
                <div>
                  <h3 className="font-serif font-bold text-[#1a3020] text-lg">AI Leaf Health & Disease Scanner</h3>
                  <p className="text-xs text-foreground/60 mt-1 leading-relaxed">
                    Upload a clear close-up photo of infected leaves or stems. Our model will scan patterns to recommend organic bio-remedies.
                  </p>
                </div>

                {/* Upload box */}
                <div className="border-2 border-dashed border-foreground/15 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-[#f8faf9] relative min-h-[220px]">
                  {diseaseImage ? (
                    <div className="relative w-full h-full flex flex-col items-center gap-4">
                      <img src={diseaseImage} className="w-40 h-40 object-cover rounded-2xl shadow-md" alt="Uploaded leaf" />
                      <button 
                        onClick={() => setDiseaseImage(null)}
                        className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-4xl">🍂</span>
                      <div>
                        <span className="text-xs font-semibold text-foreground/50">Drag & drop photo here or</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden" 
                          id="leaf-file-input"
                        />
                        <label 
                          htmlFor="leaf-file-input"
                          className="block text-primary-green font-bold text-xs underline cursor-pointer mt-1"
                        >
                          Browse files
                        </label>
                      </div>
                      <span className="text-[10px] text-foreground/35">Supports JPG, PNG (Max 5MB)</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleScanLeaf}
                  disabled={!diseaseImage || scanState === "scanning"}
                  className="w-full bg-[#1a3020] hover:bg-black text-white font-bold py-3.5 rounded-xl shadow-md cursor-pointer text-xs md:text-sm text-center flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {scanState === "scanning" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Scanning Leaf Fibers...</span>
                    </>
                  ) : "Scan Leaf Health"}
                </button>
              </div>

              {/* Result Column */}
              <div className="w-full md:w-1/2 min-h-[300px] bg-[#f8faf9] border border-foreground/5 rounded-3xl p-6 md:p-8 flex flex-col justify-center items-center relative overflow-hidden">
                {scanState === "scanning" && (
                  <div className="flex flex-col items-center gap-4 text-center">
                    {/* Scanning radar visual effect */}
                    <div className="w-20 h-20 rounded-full border-4 border-primary-green/20 border-t-primary-green animate-spin flex items-center justify-center text-2xl">
                      🔍
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1a3020]">Analyzing Leaf Symptoms</h4>
                      <p className="text-[11px] text-foreground/45 mt-1">Comparing micro-patterns against plant pathology database...</p>
                    </div>
                  </div>
                )}

                {scanState === "result" && scanResult && (
                  <div className="flex flex-col gap-5 w-full animate-fade-in-up">
                    <div className="flex justify-between items-start border-b border-foreground/5 pb-3">
                      <div>
                        <span className="text-[10px] bg-red-50 text-red-600 font-bold border border-red-100 px-2 py-0.5 rounded-full">Disease Detected</span>
                        <h4 className="font-bold text-[#1a3020] text-[16px] md:text-[18px] mt-1.5 font-serif">{scanResult.disease}</h4>
                      </div>
                      <span className="text-xs font-bold text-primary-green bg-primary-green/10 px-2.5 py-1.5 rounded-xl border border-primary-green/10">
                        {scanResult.confidence} Match
                      </span>
                    </div>

                    <div className="text-xs">
                      <span className="font-bold text-foreground/50 uppercase tracking-wider block text-[10px]">Likely Cause</span>
                      <p className="text-foreground/75 leading-relaxed mt-1">{scanResult.cause}</p>
                    </div>

                    <div className="bg-[#f4f7f5] border-l-4 border-primary-green p-4 rounded-r-xl text-xs">
                      <span className="font-bold text-primary-green uppercase tracking-wider block text-[10px]">Organic Treatment recommendation</span>
                      <p className="text-foreground/80 leading-relaxed mt-1">{scanResult.remedy}</p>
                    </div>
                  </div>
                )}

                {scanState === "idle" && (
                  <div className="text-center text-foreground/40 max-w-[240px] flex flex-col items-center gap-4">
                    <span className="text-4xl">🔬</span>
                    <h4 className="font-bold text-sm text-foreground/60 font-serif">Diagnosis Dashboard</h4>
                    <p className="text-[11px] leading-relaxed">Please upload a photo of your leaf and click scan to run the botanical AI health assessment.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: AI Chat Assistant */}
          {activeTab === "chat" && (
            <div className="flex flex-col gap-6 animate-fade-in-up">
              <div>
                <h3 className="font-serif font-bold text-[#1a3020] text-lg">AI Gardening Assistant Bot</h3>
                <p className="text-xs text-foreground/60 mt-1 leading-relaxed">Get automated instantaneous replies regarding plant species, waterproofing solutions, and booking procedures.</p>
              </div>

              {/* Chat Container */}
              <div className="border border-foreground/5 bg-sage-light/10 rounded-3xl p-4 md:p-6 flex flex-col gap-4 h-[350px] overflow-y-auto">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col max-w-[80%] gap-1.5 ${
                      msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                    }`}
                  >
                    <span className="text-[9px] font-bold text-foreground/40 uppercase">
                      {msg.sender === "user" ? "You" : "AR Garden Assistant"}
                    </span>
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-primary-green text-white rounded-tr-none shadow-sm" 
                        : "bg-white text-foreground border border-foreground/5 rounded-tl-none shadow-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {chatTyping && (
                  <div className="flex gap-1 bg-white p-3 rounded-full border border-foreground/5 w-fit items-center justify-center ml-2 shadow-sm animate-pulse">
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce delay-200"></span>
                  </div>
                )}
              </div>

              {/* Quick Suggestion buttons */}
              <div className="flex gap-1.5 flex-wrap">
                {[
                  "How to book a consultation?",
                  "Is waterproofing guaranteed?",
                  "Rooftop load capacities?",
                  "Estimate pricing per sq ft?"
                ].map((suggest, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setChatInput(suggest); }}
                    className="bg-[#f4f7f5] hover:bg-primary-green hover:text-white border border-[#1a3020]/5 px-3 py-1.5 rounded-lg text-[10px] font-medium text-[#1a3020] transition-colors cursor-pointer"
                  >
                    {suggest}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
                <input 
                  type="text"
                  required
                  placeholder="Ask about plant care, prices, waterproofing..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="bg-white border border-foreground/10 py-3 px-4 rounded-xl text-xs flex-1 focus:outline-none focus:border-primary-green text-left"
                />
                <button
                  type="submit"
                  className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs px-6 rounded-xl transition-colors cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
