import { 
  UserData, 
  CalculationResult, 
  TeamStatus, 
  LegalStatus, 
  OfficeType,
  MarketingType,
  StaffCount,
  FounderRole,
  CompetitionLevel,
  TargetAudience,
  ProjectCategory,
  City,
  FundingRecommendation,
  ValueProposition,
  MVPReadiness,
  KeyChallenge,
  SwotAnalysis,
  CashFlowMonth
} from '../types';
import { 
  CAPEX_DEV_COST, 
  COST_LEGAL_CR, 
  COST_SETUP_MISC,
  OPEX_SALARY_NON_TECH,
  OPEX_TECH_SALARY_BASE,
  OPEX_RENT,
  OPEX_MARKETING_BASE,
  BASE_BUFFER_PERCENTAGE,
  HIGH_RISK_BUFFER_PERCENTAGE,
  CITY_COST_MULTIPLIER,
  FUNDING_SOURCES
} from '../constants';

export const calculateFeasibility = (data: UserData): CalculationResult => {
  const { 
    category, capital, team, legal, 
    runway, staff, office, marketing,
    founderRole, competition, audience, businessModel,
    city,
    unitPrice, targetVolume, valueProp, mvpReady, keyChallenge
  } = data;

  if (!category || capital === '' || !team || !legal || !runway || !staff || !office || !marketing || !founderRole || !competition || !audience || !businessModel || !city || unitPrice === '' || targetVolume === '' || !valueProp || !mvpReady || !keyChallenge) {
    throw new Error("Missing required data");
  }

  const months = parseInt(runway);
  const cityMultiplier = CITY_COST_MULTIPLIER[city];

  // --- 1. CAPEX ---
  let capexDev = 0;
  if (team === TeamStatus.AGENCY) {
    capexDev = CAPEX_DEV_COST[category];
  } else {
    // Founder developer = cheap, Manager = needs lead dev setup
    capexDev = (founderRole === FounderRole.DEVELOPER) ? 2000 : 5000; 
  }

  // MVP Logic: If NO, multiply development cost
  if (mvpReady === MVPReadiness.NO) {
    capexDev = capexDev * 2.5; // Heavy penalty for not doing MVP
  }

  let capexSetup = COST_SETUP_MISC;
  if (legal === LegalStatus.YES || legal === LegalStatus.UNSURE) {
    capexSetup += COST_LEGAL_CR;
  }
  const totalCapex = capexDev + capexSetup;

  // --- 2. OPEX (with City Adjustments) ---

  // Salaries
  let monthlySalaries = OPEX_SALARY_NON_TECH[staff];
  if (team === TeamStatus.INTERNAL && founderRole !== FounderRole.DEVELOPER) {
    monthlySalaries += OPEX_TECH_SALARY_BASE;
  }
  monthlySalaries = monthlySalaries * cityMultiplier;

  // Rent
  let monthlyRent = OPEX_RENT[office];
  if (office !== OfficeType.REMOTE) {
    monthlyRent = monthlyRent * cityMultiplier;
  }

  // Marketing
  let marketingMultiplier = 1.0;
  if (competition === CompetitionLevel.RED_OCEAN) marketingMultiplier += 0.5;
  if (competition === CompetitionLevel.BLUE_OCEAN) marketingMultiplier += 0.2;
  if (audience === TargetAudience.B2C) marketingMultiplier += 0.3;
  if (founderRole === FounderRole.MARKETER) marketingMultiplier -= 0.3;

  const monthlyMarketing = Math.round(OPEX_MARKETING_BASE[marketing] * Math.max(0.5, marketingMultiplier));

  const totalMonthlyBurn = Math.round(monthlySalaries + monthlyRent + monthlyMarketing);
  const totalRunwayCost = totalMonthlyBurn * months;

  // --- 3. REVENUE & PROFIT ---
  const revenueMonthly = Number(unitPrice) * Number(targetVolume);
  const netProfitMonthly = revenueMonthly - totalMonthlyBurn;
  const breakEvenUnits = Math.ceil(totalMonthlyBurn / Number(unitPrice));

  // --- 4. CASH FLOW PROJECTION (12 Months) ---
  const cashFlow: CashFlowMonth[] = [];
  let currentBalance = Number(capital) - totalCapex;
  
  // Assumption: Revenue ramps up linearly from 0% in Month 1 to 100% of target in Month 12
  for (let i = 1; i <= 12; i++) {
    const rampUpFactor = i / 12; 
    const monthlyRev = Math.round(revenueMonthly * rampUpFactor);
    currentBalance = currentBalance + monthlyRev - totalMonthlyBurn;
    
    cashFlow.push({
      month: `ش${i}`,
      revenue: monthlyRev,
      expenses: totalMonthlyBurn,
      balance: Math.round(currentBalance)
    });
  }


  // --- 5. SWOT Analysis Logic ---
  const swot: SwotAnalysis = {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  };

  // Strengths
  if (founderRole === FounderRole.DEVELOPER) swot.strengths.push("وجود مؤسس تقني يقلل التكاليف");
  if (founderRole === FounderRole.MARKETER) swot.strengths.push("وجود مؤسس خبير بالتسويق");
  if (mvpReady === MVPReadiness.YES) swot.strengths.push("الاعتماد على منهجية MVP المرنة");
  if (valueProp === ValueProposition.UNIQUE) swot.strengths.push("منتج مبتكر (Blue Ocean)");
  if (valueProp === ValueProposition.PRICE) swot.strengths.push("ميزة تنافسية سعرية");

  // Weaknesses
  if (team === TeamStatus.AGENCY) swot.weaknesses.push("الاعتماد الكلي على وكالة خارجية");
  if (staff === StaffCount.LARGE) swot.weaknesses.push("هيكل وظيفي ضخم ومكلف في البداية");
  if (marketing === MarketingType.ORGANIC && competition === CompetitionLevel.RED_OCEAN) swot.weaknesses.push("ضعف الميزانية التسويقية في سوق مزدحم");
  if (office !== OfficeType.REMOTE && office !== OfficeType.COWORKING) swot.weaknesses.push("أعباء إيجار ثابتة عالية");

  // Opportunities
  if (competition === CompetitionLevel.BLUE_OCEAN) swot.opportunities.push("فرصة للسيطرة على سوق جديد");
  if (audience === TargetAudience.B2G) swot.opportunities.push("فرص عقود حكومية طويلة الأمد");
  if (city === City.RIYADH) swot.opportunities.push("التواجد في أكبر مركز اقتصادي في المنطقة");
  if (category === ProjectCategory.DIGITAL_SERVICE) swot.opportunities.push("إمكانية التوسع السريع بأقل تكلفة");

  // Threats
  if (keyChallenge === KeyChallenge.COMPETITION) swot.threats.push("حرب أسعار محتملة من المنافسين الكبار");
  if (keyChallenge === KeyChallenge.LICENSING) swot.threats.push("تأخر التشغيل بسبب الإجراءات التنظيمية");
  if (keyChallenge === KeyChallenge.TALENT) swot.threats.push("صعوبة الحفاظ على الكفاءات");
  if (competition === CompetitionLevel.RED_OCEAN) swot.threats.push("تكلفة الاستحواذ على العميل (CAC) قد ترتفع");


  // --- 6. Totals & Risk ---

  let isHighRisk = false;
  if (competition === CompetitionLevel.RED_OCEAN && runway === '6') isHighRisk = true;
  if (keyChallenge === KeyChallenge.LICENSING || keyChallenge === KeyChallenge.SUPPLY_CHAIN) isHighRisk = true;
  if (mvpReady === MVPReadiness.NO) isHighRisk = true; // High risk of building wrong thing
  
  const bufferPercentage = isHighRisk ? HIGH_RISK_BUFFER_PERCENTAGE : BASE_BUFFER_PERCENTAGE;

  const subTotal = totalCapex + totalRunwayCost;
  const buffer = subTotal * bufferPercentage;
  const requiredCapital = Math.round(subTotal + buffer);
  const userCap = Number(capital);
  
  const remainingAfterCapex = userCap - totalCapex;
  const actualRunwayMonths = remainingAfterCapex > 0 
    ? Math.round((remainingAfterCapex / totalMonthlyBurn) * 10) / 10 
    : 0;

  // Score
  const ratio = userCap / requiredCapital;
  let score = 0;
  if (ratio >= 1) {
    score = 80 + Math.min(20, (ratio - 1) * 100);
  } else {
    score = Math.max(0, ratio * 80);
  }
  score = Math.round(score);

  // Funding Gap
  const fundingGap = Math.max(0, requiredCapital - userCap);

  // Recommendations Logic
  let fundingRecommendations: FundingRecommendation[] = [];
  if (category === ProjectCategory.MOBILE_APP || category === ProjectCategory.DIGITAL_SERVICE) {
    fundingRecommendations = [...FUNDING_SOURCES.TECH];
  } else if (audience === TargetAudience.B2G) {
    fundingRecommendations = [...FUNDING_SOURCES.GOV, ...FUNDING_SOURCES.SME];
  } else {
    fundingRecommendations = [...FUNDING_SOURCES.SME];
  }

  // Tips & Checklist
  const checklist = [];
  checklist.push("إصدار السجل التجاري (١٨٠ ثانية)");
  checklist.push("التسجيل في العنوان الوطني");
  if (staff !== StaffCount.ZERO) {
    checklist.push("التسجيل في التأمينات الاجتماعية (GOSI)");
    checklist.push("التسجيل في منصة قوى");
  }
  if (category === ProjectCategory.ECOMMERCE) checklist.push("توثيق المتجر في 'منصة أعمال'");
  if (office !== OfficeType.REMOTE) checklist.push(`رخصة البلدية للمقر (${city === City.RIYADH ? 'نطاق الأمانة' : 'البلدية الفرعية'})`);

  const tips = [];
  if (actualRunwayMonths < 6) tips.push("⚠️ السيولة لا تغطي ٦ أشهر. المشاريع الناشئة تحتاج ٩-١٢ شهر أمان.");
  if (mvpReady === MVPReadiness.NO) tips.push("📉 إصرارك على إطلاق منتج كامل يضاعف تكلفة التطوير والمخاطرة. ابدأ بـ MVP.");
  if (keyChallenge === KeyChallenge.COMPETITION && valueProp !== ValueProposition.UNIQUE) tips.push("⚠️ تدخل سوقاً مزدحماً بدون ميزة ابتكارية واضحة. ركز على التميز في الخدمة.");
  if (netProfitMonthly < 0) tips.push("⚠️ نموذجك المالي يظهر خسارة شهرية حتى عند تحقيق الهدف. يجب رفع السعر أو تقليل التكلفة.");
  if (breakEvenUnits > Number(targetVolume)) tips.push(`⚠️ تحتاج لبيع ${breakEvenUnits} وحدة للتعادل، بينما هدفك هو ${targetVolume}. الهدف غير واقعي.`);

  return {
    score,
    isFeasible: score >= 80,
    requiredCapital,
    userCapital: userCap,
    burnRateMonthly: totalMonthlyBurn,
    actualRunwayMonths,
    breakEvenMonthly: totalMonthlyBurn, // Cash break even (Revenue = Cost)
    breakdown: {
      capex: {
        dev: capexDev,
        setup: capexSetup,
        total: totalCapex
      },
      opex: {
        salaries: Math.round(monthlySalaries),
        rent: Math.round(monthlyRent),
        marketing: monthlyMarketing,
        totalMonthly: totalMonthlyBurn,
        totalRunway: totalRunwayCost
      },
      buffer: Math.round(buffer)
    },
    tips,
    checklist,
    riskLevel: isHighRisk ? 'HIGH' : 'LOW',
    fundingGap,
    fundingRecommendations,
    cityAdjustmentFactor: cityMultiplier,
    projectedRevenueMonthly: revenueMonthly,
    netProfitMonthly,
    breakEvenUnits,
    swot,
    cashFlow
  };
};