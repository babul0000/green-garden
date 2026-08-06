"use client";

import { useState } from "react";

export default function Estimator({ isModal, onClose }) {
  const [gardenType, setGardenType] = useState("rooftop");
  const [gardenSize, setGardenSize] = useState(150);
  const [budgetTier, setBudgetTier] = useState("premium");
  const [estimateResult, setEstimateResult] = useState(null);
  const [estimatorSubmitted, setEstimatorSubmitted] = useState(false);
  const [contactPhone, setContactPhone] = useState("");

  const handleCalculateEstimate = (e) => {
    e.preventDefault();
    
    const rates = {
      rooftop: 120,
      vertical: 220,
      backyard: 95,
      indoor: 70
    };

    const multipliers = {
      standard: 1.0,
      premium: 1.6,
      luxury: 2.5
    };

    const baseRate = rates[gardenType] || 100;
    const multiplier = multipliers[budgetTier] || 1.0;
    
    const calculatedBase = baseRate * gardenSize * multiplier;
    const minEstimate = Math.round(calculatedBase * 0.9);
    const maxEstimate = Math.round(calculatedBase * 1.15);

    setEstimateResult({
      min: minEstimate.toLocaleString("en-US"),
      max: maxEstimate.toLocaleString("en-US")
    });
    setEstimatorSubmitted(false);
  };

  const formContent = (
    <div className="w-full">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-3 mb-8">
        <span className="text-[13px] font-semibold tracking-wider text-primary-green uppercase">Instant Valuation</span>
        <h2 className="text-2xl md:text-3xl font-serif font-bold">Garden Size & Budget Estimator</h2>
        <p className="text-foreground/70 text-xs md:text-sm">
          Get an instant cost assessment range for your customized landscaping project based on our standard pricing model.
        </p>
      </div>

      <form onSubmit={handleCalculateEstimate} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input Side */}
        <div className="flex flex-col gap-6">
          
          {/* Garden Type Select */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-foreground/80">Project Category</label>
            <select 
              value={gardenType} 
              onChange={(e) => setGardenType(e.target.value)}
              className="bg-white border border-foreground/10 text-foreground py-3 px-4 rounded-xl text-xs md:text-sm focus:outline-none focus:border-primary-green transition-all"
            >
              <option value="rooftop">Rooftop Garden Setup</option>
              <option value="vertical">Vertical Wall Greenery</option>
              <option value="backyard">Backyard Landscaping</option>
              <option value="indoor">Indoor Plant Collection</option>
            </select>
          </div>

          {/* Slider for size */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[14px]">
              <span className="font-bold text-foreground/80">Project Area Size</span>
              <span className="text-primary-green font-semibold">{gardenSize} Sq. Ft.</span>
            </div>
            <input 
              type="range" 
              min="30" 
              max="1200" 
              step="10"
              value={gardenSize} 
              onChange={(e) => setGardenSize(parseInt(e.target.value))}
              className="w-full accent-primary-green h-2 bg-sage-pastel rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-foreground/40 mt-1">
              <span>30 sq ft</span>
              <span>1,200 sq ft</span>
            </div>
          </div>

          {/* Budget Tier Buttons */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-foreground/80">Material Standard Quality</label>
            <div className="grid grid-cols-3 gap-3">
              {["standard", "premium", "luxury"].map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setBudgetTier(tier)}
                  className={`py-2.5 rounded-xl text-[13px] font-semibold border capitalize transition-all duration-300 ${
                    budgetTier === tier 
                      ? "bg-primary-green text-white border-primary-green"
                      : "bg-white text-foreground/75 border-foreground/10 hover:border-primary-green-light"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Submit btn */}
          <button 
            type="submit" 
            className="w-full bg-primary-green hover:bg-primary-green-dark text-white font-medium text-[15px] py-4 rounded-xl transition-all duration-300 shadow-md cursor-pointer"
          >
            Calculate Valuation
          </button>
        </div>

        {/* Results Side */}
        <div className="h-full flex flex-col justify-center items-center bg-white/70 border border-foreground/5 rounded-2xl p-8 min-h-[280px] text-center">
          {estimateResult ? (
            <div className="flex flex-col gap-6 animate-fade-in-up">
              <div className="w-12 h-12 rounded-full bg-primary-green/10 flex items-center justify-center text-xl text-primary-green mx-auto">
                💰
              </div>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wider text-foreground/50">Estimated Budget Range</p>
                <p className="text-2xl md:text-3xl font-serif font-bold text-primary-green mt-2">
                  ৳{estimateResult.min} - ৳{estimateResult.max} BDT
                </p>
                <p className="text-[11px] text-foreground/50 mt-1">Estimations include plants, substrate, logistics and initial design styling</p>
              </div>
              
              {estimatorSubmitted ? (
                <div className="bg-primary-green/10 text-primary-green text-[14px] font-medium p-3 rounded-lg">
                  Request Sent! Our architect will contact you.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <input 
                    type="tel"
                    required
                    placeholder="Your Phone Number"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="bg-white border border-foreground/10 text-foreground py-2 px-3 rounded-lg text-xs w-full focus:outline-none focus:border-primary-green text-center"
                  />
                  <button
                    type="button"
                    onClick={() => { if (contactPhone) setEstimatorSubmitted(true); }}
                    className="bg-primary-green-light hover:bg-primary-green text-white font-medium text-[14px] px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    Send This Estimate to Design Team
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-foreground/50">
              <div className="text-4xl">📊</div>
              <h4 className="font-bold font-serif text-lg text-foreground/70">Awaiting Inputs</h4>
              <p className="text-sm max-w-[250px] leading-relaxed">
                Set your project type, select sizes and quality tiers, and hit calculate to generate estimates instantly.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <div 
          onClick={onClose}
          className="absolute inset-0 bg-primary-green-dark/45 backdrop-filter backdrop-blur-sm"
        ></div>
        
        {/* Modal Box */}
        <div className="relative glass-card bg-white p-8 md:p-10 rounded-3xl border border-white/60 shadow-2xl max-w-xl w-full animate-fade-in-up z-10 max-h-[90vh] overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-foreground/45 hover:text-foreground p-1 cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <section id="estimator-section" className="py-24 px-6 bg-sage-light">
      <div className="max-w-4xl mx-auto glass-card bg-white/60 p-8 md:p-12 rounded-[32px] border border-white shadow-xl">
        {formContent}
      </div>
    </section>
  );
}
