export enum ProjectCategory {
  MOBILE_APP = 'MOBILE_APP',
  WEBSITE = 'WEBSITE',
  DIGITAL_SERVICE = 'DIGITAL_SERVICE',
  PHYSICAL_PRODUCT = 'PHYSICAL_PRODUCT',
  ECOMMERCE = 'ECOMMERCE',
  OTHER = 'OTHER'
}

export enum TeamStatus {
  INTERNAL = 'INTERNAL', // Has team/technical founder
  AGENCY = 'AGENCY'     // Needs to hire
}

export enum LegalStatus {
  YES = 'YES',
  NO = 'NO',
  UNSURE = 'UNSURE'
}

export enum GeoScope {
  CITY = 'CITY',
  KINGDOM = 'KINGDOM'
}

export enum RunwayDuration {
  MONTHS_6 = '6',
  MONTHS_12 = '12',
  MONTHS_18 = '18'
}

export enum StaffCount {
  ZERO = 'ZERO', // Founder only
  SMALL = 'SMALL', // 1-2
  MEDIUM = 'MEDIUM', // 3-5
  LARGE = 'LARGE' // 5+
}

export enum OfficeType {
  REMOTE = 'REMOTE',
  COWORKING = 'COWORKING',
  OFFICE = 'OFFICE',
  WAREHOUSE = 'WAREHOUSE'
}

export enum MarketingType {
  ORGANIC = 'ORGANIC', // Relationships/Word of Mouth
  PAID_ADS = 'PAID_ADS', // Social Media Ads
  MEGA = 'MEGA' // Influencers/Campaigns
}

export enum BusinessModel {
  DIRECT_SALE = 'DIRECT_SALE', // Selling product/service once
  SUBSCRIPTION = 'SUBSCRIPTION', // SaaS / Content
  COMMISSION = 'COMMISSION', // Marketplace
  ADS = 'ADS' // Free app with ads
}

export enum TargetAudience {
  B2C = 'B2C', // Individuals (High marketing cost)
  B2B = 'B2B', // Companies (High sales effort)
  B2G = 'B2G'  // Government (High relationship effort)
}

export enum CompetitionLevel {
  BLUE_OCEAN = 'BLUE_OCEAN', // New idea (High education cost)
  MODERATE = 'MODERATE', // Few competitors
  RED_OCEAN = 'RED_OCEAN' // Crowded (High differentiation cost)
}

export enum FounderRole {
  MANAGER = 'MANAGER', // Needs to hire for everything
  MARKETER = 'MARKETER', // Saves on marketing agency/effort
  DEVELOPER = 'DEVELOPER' // Saves on tech salaries
}

export enum City {
  RIYADH = 'RIYADH',
  JEDDAH = 'JEDDAH',
  DAMMAM = 'DAMMAM',
  OTHER = 'OTHER'
}

// --- NEW ENUMS (Feasibility 2.0) ---

export enum ValueProposition {
  SPEED = 'SPEED', // Time saving
  PRICE = 'PRICE', // Cheaper
  QUALITY = 'QUALITY', // Better
  UNIQUE = 'UNIQUE' // New solution
}

export enum MVPReadiness {
  YES = 'YES', // Minimum Viable Product
  NO = 'NO' // Full Feature Launch
}

export enum KeyChallenge {
  COMPETITION = 'COMPETITION',
  LICENSING = 'LICENSING',
  TALENT = 'TALENT',
  SUPPLY_CHAIN = 'SUPPLY_CHAIN'
}

export type Currency = 'SAR' | 'USD' | 'EUR';

export interface FundingRecommendation {
  name: string;
  url: string;
  description: string;
}

export interface UserData {
  category: ProjectCategory | null;
  capital: number | '';
  team: TeamStatus | null;
  legal: LegalStatus | null;
  scope: GeoScope | null;
  runway: RunwayDuration | null;
  staff: StaffCount | null;
  office: OfficeType | null;
  marketing: MarketingType | null;
  businessModel: BusinessModel | null;
  audience: TargetAudience | null;
  competition: CompetitionLevel | null;
  founderRole: FounderRole | null;
  city: City | null;
  // New Fields
  unitPrice: number | ''; // Avg Revenue per Unit/User
  targetVolume: number | ''; // Monthly Sales/Users Target
  valueProp: ValueProposition | null;
  mvpReady: MVPReadiness | null;
  keyChallenge: KeyChallenge | null;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface CashFlowMonth {
  month: string;
  revenue: number;
  expenses: number;
  balance: number;
}

export interface CalculationResult {
  score: number; // 0-100
  isFeasible: boolean;
  requiredCapital: number;
  userCapital: number;
  burnRateMonthly: number;
  actualRunwayMonths: number; 
  breakEvenMonthly: number; 
  breakdown: {
    capex: {
      dev: number;
      setup: number;
      total: number;
    };
    opex: {
      salaries: number;
      rent: number;
      marketing: number;
      totalMonthly: number;
      totalRunway: number;
    };
    buffer: number;
  };
  tips: string[];
  checklist: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  fundingGap: number;
  fundingRecommendations: FundingRecommendation[];
  cityAdjustmentFactor: number;
  // New Outputs
  projectedRevenueMonthly: number;
  netProfitMonthly: number;
  breakEvenUnits: number; // How many units to sell to cover burn
  swot: SwotAnalysis;
  cashFlow: CashFlowMonth[];
}