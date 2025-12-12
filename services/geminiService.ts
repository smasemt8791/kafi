import { GoogleGenAI } from "@google/genai";
import { UserData, CalculationResult, TeamStatus, OfficeType } from "../types";

export const getAIInsight = async (userData: UserData, result: CalculationResult): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Calculate percentages for context
    const total = result.requiredCapital;
    const devPct = Math.round((result.breakdown.capex.dev / total) * 100);
    const opexPct = Math.round((result.breakdown.opex.totalRunway / total) * 100);
    
    const context = `
      Project: ${userData.category}
      User Available: ${userData.capital} SAR
      Required Total: ${Math.round(result.requiredCapital)} SAR
      
      Strategy:
      - Team: ${userData.team === TeamStatus.INTERNAL ? 'In-house (Salaries applied)' : 'Agency (One-time cost)'}
      - Office: ${userData.office}
      - Runway Goal: ${userData.runway} Months
      
      Financials:
      - Monthly Burn Rate: ${result.burnRateMonthly} SAR
      - Development Cost (CAPEX): ${result.breakdown.capex.dev} SAR (${devPct}%)
      - Operations Cost (OPEX for ${userData.runway} months): ${result.breakdown.opex.totalRunway} SAR (${opexPct}%)
      
      Result: ${result.isFeasible ? 'SUFFICIENT (Green)' : 'INSUFFICIENT (Red)'}
    `;

    const prompt = `
      You are an expert Saudi business consultant named "Kafi".
      Analyze the feasibility of this project based on the strict budget breakdown provided.
      
      DATA:
      ${context}

      TASK:
      Provide a brief, 2-sentence insight in Arabic.
      
      GUIDELINES:
      - If SUFFICIENT: Validate their strategy (e.g., "Working remotely saved you 20% of the budget. Great move.").
      - If INSUFFICIENT: Pinpoint the exact "Leak" in the budget. Is it the agency cost? The office rent? The marketing? Suggest a specific fix (e.g., "Your office rent consumes 30% of the budget; switch to a co-working space").
      - Use Saudi business terminology (e.g., "تأسيس", "تشغيل", "حرق شهري").
      
      Output ONLY the Arabic text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return result.isFeasible 
      ? "ميزانيتك تغطي التكاليف التشغيلية للفترة المحددة، استثمر الفائض في التسويق."
      : "المصاريف التشغيلية الشهرية عالية جداً مقارنة برأس المال، حاول تقليل العمالة أو العمل عن بعد.";
  }
};