import groq from "../config/groq.js";

// Keyword detection for auto-extraction of user intent and details
const detectKeywords = (message) => {
  const detectedInfo = {
    industry: null,
    location: null,
    type: null,
    budget: null,
    keywords: [],
    rawMessage: message.toLowerCase(),
  };

  // Industry detection
  const industryKeywords = {
    "real estate": ["real estate", "property", "land", "house", "apartment", "flat", "villa", "office space", "commercial space"],
    restaurant: ["restaurant", "cafe", "diner", "food", "dining", "kitchen"],
    hotel: ["hotel", "resort", "stay", "accommodation", "lodge"],
    education: ["school", "college", "university", "course", "training", "institute"],
    healthcare: ["hospital", "clinic", "doctor", "medical", "physician", "healthcare"],
    construction: ["construction", "builder", "contractor", "build", "building"],
    "it services": ["software", "website", "app", "development", "ai solution", "coding", "it service"],
    manufacturing: ["manufacture", "factory", "production", "industry"],
    logistics: ["shipping", "delivery", "cargo", "logistics", "transport"],
    fintech: ["payment", "banking", "loan", "finance", "fintech"],
    "food industry": ["supplier", "manufacturer", "food supplier"],
  };

  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
      detectedInfo.industry = industry;
      break;
    }
  }

  // Location detection (common Indian cities and generic patterns)
  const locations = [
    "bangalore", "mumbai", "delhi", "pune", "hyderabad", "chennai", "kolkata", "ahmedabad",
    "jaipur", "lucknow", "chandigarh", "indore", "surat", "vadodara", "gurgaon", "noida",
    "goa", "kerala", "delhi ncr", "india", "across india", "online", "remote"
  ];

  for (const location of locations) {
    if (message.toLowerCase().includes(location)) {
      detectedInfo.location = location;
      break;
    }
  }

  // Budget detection (numeric patterns like "50000", "50k", "$50", "50 lakhs")
  const budgetMatch = message.match(/(?:budget[:\s]*)?(?:\$|₹)?\s*(\d+(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*(?:k|lakh|cr|thousand|million)?/i);
  if (budgetMatch) {
    detectedInfo.budget = budgetMatch[0].trim();
  }

  // Type detection (buy/rent, residential/commercial, etc.)
  if (message.toLowerCase().includes("buy")) detectedInfo.type = "buy";
  else if (message.toLowerCase().includes("rent")) detectedInfo.type = "rent";
  else if (message.toLowerCase().includes("commercial")) detectedInfo.type = "commercial";
  else if (message.toLowerCase().includes("residential")) detectedInfo.type = "residential";
  else if (message.toLowerCase().includes("veg")) detectedInfo.type = "vegetarian";
  else if (message.toLowerCase().includes("non-veg")) detectedInfo.type = "non-vegetarian";

  // Extract all mentioned keywords
  detectedInfo.keywords = Object.values(industryKeywords)
    .flat()
    .filter(keyword => message.toLowerCase().includes(keyword));

  return detectedInfo;
};

// Build context from conversation to avoid redundant questions
const buildContextFromHistory = (conversationHistory, detectedKeywords) => {
  let context = "ALREADY MENTIONED IN CONVERSATION:\n";
  let mentionedCount = 0;

  if (detectedKeywords.industry) {
    context += `- Industry: ${detectedKeywords.industry}\n`;
    mentionedCount++;
  }

  if (detectedKeywords.location) {
    context += `- Location: ${detectedKeywords.location}\n`;
    mentionedCount++;
  }

  if (detectedKeywords.type) {
    context += `- Type/Category: ${detectedKeywords.type}\n`;
    mentionedCount++;
  }

  if (detectedKeywords.budget) {
    context += `- Budget: ${detectedKeywords.budget}\n`;
    mentionedCount++;
  }

  // Parse previous responses to extract collected information
  conversationHistory.forEach((msg) => {
    const msgLower = msg.content.toLowerCase();
    if (msgLower.includes("location") || msgLower.includes("where")) {
      if (!detectedKeywords.location) {
        context += `- Location mentioned in history\n`;
      }
    }
  });

  if (mentionedCount === 0) {
    context = "NO INFORMATION MENTIONED YET - Start fresh.\n";
  }

  return context;
};

export const getChatResponse = async (
  message,
  conversationHistory = []
) => {
  try {
    // Auto-detect keywords and information from user message
    const detectedKeywords = detectKeywords(message);
    const contextFromHistory = buildContextFromHistory(conversationHistory, detectedKeywords);

    const safeHistory =
      conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    const recentHistory =
      safeHistory.slice(-5);

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        max_tokens: 100,

        response_format: {
          type: "json_object",
        },

        messages: [
          {
            role: "system",
            content: `
You are an intelligent Business Recommendation Assistant with smart context awareness.

Your job is to understand the user's requirement and collect only MISSING information needed for that specific industry.

CRITICAL RULES TO FOLLOW:
1. NEVER ask about information the user has ALREADY provided
2. NEVER ask for clarification on things already mentioned
3. If user said "real estate in bangalore", DO NOT ask "are you looking in bangalore?"
4. Analyze what's ALREADY mentioned before asking follow-up questions
5. Extract multiple details from single messages (e.g., "real estate in bangalore" = industry + location)
6. Do NOT ask fixed questions - be intelligent and context-aware
7. Ask only ONE question at a time
8. Remember all previous answers from conversation history
9. When extracting requirements, skip any that are already mentioned

${contextFromHistory}

INDUSTRY REQUIREMENTS (SKIP if already mentioned with ✓):

REAL ESTATE:
- Residential / Commercial ✓
- Buy or Rent ✓
- Location ✓
- Budget ✓
- Property Size / Area (ALWAYS ASK if not mentioned)

RESTAURANTS:
- Location ✓
- Veg / Non-Veg
- Budget ✓
- Dining Type (Casual, Fine Dining, etc)
- Family or Couples

HOTELS / RESORTS:
- Location ✓
- Budget ✓
- Number of Guests
- Duration / Dates
- Resort Type (Luxury, Family, Adventure)

EDUCATION:
- Institution Type (School, College, University, Training)
- Course / Subject ✓
- Location ✓
- Budget ✓
- Online or Offline

HEALTHCARE:
- Hospital / Clinic / Specialist
- Specialty / Service ✓
- Location ✓
- Budget ✓
- Emergency or Routine

CONSTRUCTION:
- Residential or Commercial Project ✓
- Project Size / Scope
- Budget ✓
- Location ✓

IT SERVICES:
- Service Type (Website, App, AI Solution, Cloud) ✓
- Budget ✓
- Timeline
- Team Size / Scope

MANUFACTURING:
- Product Type
- Quantity / Volume
- Location ✓
- Budget ✓

LOGISTICS:
- Shipping Type / Service
- Domestic or International
- Pickup Location ✓
- Delivery Location ✓

FINTECH:
- Service Type (Payment, Banking, Loan) ✓
- Budget ✓
- Timeline

FOOD SUPPLY:
- Supplier or Manufacturer
- Veg or Non-Veg
- Quantity / Volume
- Location ✓

RESPONSE FORMAT RULES:

For questions (when more info needed):
{
  "type": "question",
  "question": "Your single, smart follow-up question",
  "contextDetected": {
    "industry": "detected industry or null",
    "location": "detected location or null",
    "type": "detected type or null",
    "budget": "detected budget or null"
  }
}

For search (when enough info collected):
{
  "type": "search",
  "industry": "confirmed industry",
  "requirements": {
    "location": "location",
    "budget": "budget",
    "type": "type/category",
    "propertySize": "or other detail",
    "additionalDetails": "all collected info as string"
  }
}

CRITICAL: Return ONLY valid JSON with NO markdown, NO code blocks, NO explanations.
Never wrap response in \`\`\`json or \`\`\`. Just return the raw JSON object.

EXAMPLE - DO THIS:
{"type":"question","question":"What property size are you looking for?"}

EXAMPLE - NEVER DO THIS:
\`\`\`json
{"type":"question","question":"What property size?"}
\`\`\`
`
          },

          ...recentHistory,

          {
            role: "user",
            content: message,
          },
        ],
      });

    const content = completion.choices[0].message.content;

    console.log("Raw AI Response:");
    console.log(content);

    // Clean response - remove markdown code blocks if present
    const cleanedContent = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleanedContent);
    } catch (error) {

      console.log(
        "JSON Parse Failed. Returning Question."
      );

      return {
        type: "question",
        question: cleanedContent,
      };

    }

    // Parse and return JSON
    const parsedResponse = JSON.parse(cleanedContent);

    // Add detected keywords to response for frontend awareness
    parsedResponse.detectedKeywords = {
      industry: detectedKeywords.industry,
      location: detectedKeywords.location,
      type: detectedKeywords.type,
      budget: detectedKeywords.budget,
    };

    return parsedResponse;

  } catch (error) {
    console.error("Groq Error:", error);

    return {
      type: "question",
      question: "Can you provide more details about your requirement? Please mention the location and what you're looking for.",
      error: true,
      detectedKeywords: {
        industry: null,
        location: null,
        type: null,
        budget: null,
      }
    };
  }
};