import {
  ProjectCategory,
  TeamStatus,
  LegalStatus,
  GeoScope,
  RunwayDuration,
  StaffCount,
  OfficeType,
  MarketingType,
  BusinessModel,
  TargetAudience,
  CompetitionLevel,
  FounderRole,
  City,
  FundingRecommendation,
  ValueProposition,
  MVPReadiness,
  KeyChallenge
} from './types';
import {
  Smartphone, Globe, Zap, Package, ShoppingCart, HelpCircle,
  Clock, Briefcase, Building, Megaphone,
  CreditCard, Repeat, Percent, Tv,
  User, Users, Landmark,
  Ship, Anchor, AlertTriangle,
  UserCog, Code2, LineChart,
  Map, Rocket, Gauge, ShieldAlert, BadgeCheck, XCircle,
  Sparkles, CheckCircle2
} from 'lucide-react';

// --- Arabic Labels ---

export const LABELS = {
  APP_TITLE: 'كافي',
  APP_SUBTITLE: 'حول فكرتك إلى أرقام. حاسبة جدوى تفاعلية للسوق السعودي.',
  START_BTN: 'ابدأ دراسة الجدوى',
  NEXT: 'التالي',
  BACK: 'السابق',
  CONFIRM: 'تحليل النتيجة',
  CURRENCY: 'ر.س',
  LOADING_TITLE: 'جاري تحليل النموذج المالي...',
  LOADING_SUB: 'نقوم بإعداد تحليل SWOT وجدول التدفقات النقدية المتوقعة',
  RESULT_SUCCESS: 'مشروعك قابل للتنفيذ',
  RESULT_FAIL: 'مخاطرة مالية عالية',
  RESULT_SUCCESS_SUB: 'مؤشراتك المالية إيجابية مع وجود هامش أمان',
  RESULT_FAIL_SUB: 'السيولة الحالية قد لا تغطي الفترة الحرجة الأولى',
  BTN_RETRY: 'إعادة التقييم',
  BTN_START: 'تحميل التقرير PDF',
  AI_INSIGHT_TITLE: 'رأي المستشار الذكي'
};

// ... existing options ...
export const CATEGORY_OPTIONS = [
  { id: ProjectCategory.MOBILE_APP, label: 'تطبيق جوال', icon: Smartphone },
  { id: ProjectCategory.WEBSITE, label: 'موقع إلكتروني', icon: Globe },
  { id: ProjectCategory.DIGITAL_SERVICE, label: 'خدمة رقمية', icon: Zap },
  { id: ProjectCategory.PHYSICAL_PRODUCT, label: 'منتج مادي', icon: Package },
  { id: ProjectCategory.ECOMMERCE, label: 'منصة تجارة', icon: ShoppingCart },
  { id: ProjectCategory.OTHER, label: 'أخرى', icon: HelpCircle },
];

export const TEAM_OPTIONS = [
  { id: TeamStatus.INTERNAL, label: 'نعم (سأطور داخلياً)' },
  { id: TeamStatus.AGENCY, label: 'لا (سأوظف وكالة/مطورين)' },
];

export const LEGAL_OPTIONS = [
  { id: LegalStatus.YES, label: 'نعم' },
  { id: LegalStatus.NO, label: 'لا' },
  { id: LegalStatus.UNSURE, label: 'لست متأكداً (احتساب احتياطي)' },
];

export const SCOPE_OPTIONS = [
  { id: GeoScope.CITY, label: 'مدينة/منطقة واحدة' },
  { id: GeoScope.KINGDOM, label: 'جميع أنحاء المملكة' },
];

export const RUNWAY_OPTIONS = [
  { id: RunwayDuration.MONTHS_6, label: '٦ أشهر (الحد الأدنى)', icon: Clock },
  { id: RunwayDuration.MONTHS_12, label: '١٢ شهر (موصى به)', icon: Clock },
  { id: RunwayDuration.MONTHS_18, label: '١٨ شهر+ (آمن)', icon: Clock },
];

export const STAFF_OPTIONS = [
  { id: StaffCount.ZERO, label: 'لا أحد (أنا فقط)', icon: Briefcase },
  { id: StaffCount.SMALL, label: '١ - ٢ موظفين', icon: Briefcase },
  { id: StaffCount.MEDIUM, label: '٣ - ٥ موظفين', icon: Briefcase },
  { id: StaffCount.LARGE, label: 'أكثر من ٥', icon: Briefcase },
];

export const OFFICE_OPTIONS = [
  { id: OfficeType.REMOTE, label: 'لا (عمل عن بعد/منزل)', icon: Building },
  { id: OfficeType.COWORKING, label: 'مساحة عمل مشتركة', icon: Building },
  { id: OfficeType.OFFICE, label: 'مكتب خاص / معرض', icon: Building },
  { id: OfficeType.WAREHOUSE, label: 'مستودع وتخزين', icon: Building },
];

export const MARKETING_OPTIONS = [
  { id: MarketingType.ORGANIC, label: 'علاقات / نمو طبيعي', icon: Megaphone },
  { id: MarketingType.PAID_ADS, label: 'إعلانات سوشيال ميديا', icon: Megaphone },
  { id: MarketingType.MEGA, label: 'حملات ضخمة ومشاهير', icon: Megaphone },
];

export const BUSINESS_MODEL_OPTIONS = [
  { id: BusinessModel.DIRECT_SALE, label: 'بيع مباشر (منتج/خدمة)', icon: CreditCard },
  { id: BusinessModel.SUBSCRIPTION, label: 'اشتراكات دورية', icon: Repeat },
  { id: BusinessModel.COMMISSION, label: 'عمولة (وسيط)', icon: Percent },
  { id: BusinessModel.ADS, label: 'إعلانات (تطبيق مجاني)', icon: Tv },
];

export const AUDIENCE_OPTIONS = [
  { id: TargetAudience.B2C, label: 'أفراد (B2C)', icon: User },
  { id: TargetAudience.B2B, label: 'شركات (B2B)', icon: Users },
  { id: TargetAudience.B2G, label: 'جهات حكومية (B2G)', icon: Landmark },
];

export const COMPETITION_OPTIONS = [
  { id: CompetitionLevel.BLUE_OCEAN, label: 'فكرة جديدة كلياً', icon: Ship },
  { id: CompetitionLevel.MODERATE, label: 'منافسة متوسطة', icon: Anchor },
  { id: CompetitionLevel.RED_OCEAN, label: 'سوق مزدحم جداً', icon: AlertTriangle },
];

export const FOUNDER_ROLE_OPTIONS = [
  { id: FounderRole.MANAGER, label: 'إدارة فقط', icon: UserCog },
  { id: FounderRole.MARKETER, label: 'أنا المسوق والبائع', icon: LineChart },
  { id: FounderRole.DEVELOPER, label: 'أنا المبرمج/المطور', icon: Code2 },
];

export const CITY_OPTIONS = [
  { id: City.RIYADH, label: 'الرياض', icon: Map },
  { id: City.JEDDAH, label: 'جدة', icon: Map },
  { id: City.DAMMAM, label: 'الدمام / الخبر', icon: Map },
  { id: City.OTHER, label: 'مدن أخرى', icon: Map },
];

// --- NEW OPTIONS (Feasibility 2.0) ---

export const VALUE_PROP_OPTIONS = [
  { id: ValueProposition.SPEED, label: 'السرعة / توفير الوقت', icon: Rocket },
  { id: ValueProposition.PRICE, label: 'سعر أقل / توفير المال', icon: Percent },
  { id: ValueProposition.QUALITY, label: 'جودة أعلى / فخامة', icon: BadgeCheck },
  { id: ValueProposition.UNIQUE, label: 'حل مبتكر غير موجود', icon: Sparkles },
];

export const MVP_OPTIONS = [
  { id: MVPReadiness.YES, label: 'نعم، سأطلق نسخة تجريبية (MVP)', icon: CheckCircle2 },
  { id: MVPReadiness.NO, label: 'لا، أريد منتجاً كاملاً من البداية', icon: XCircle },
];

export const CHALLENGE_OPTIONS = [
  { id: KeyChallenge.COMPETITION, label: 'منافسة قوية جداً', icon: Gauge },
  { id: KeyChallenge.LICENSING, label: 'صعوبة التراخيص', icon: ShieldAlert },
  { id: KeyChallenge.TALENT, label: 'توظيف الكفاءات', icon: Users },
  { id: KeyChallenge.SUPPLY_CHAIN, label: 'ارتفاع تكلفة التوريد', icon: Package },
];


// Cost Factors
export const CAPEX_DEV_COST: Record<ProjectCategory, number> = {
  [ProjectCategory.MOBILE_APP]: 150000,
  [ProjectCategory.WEBSITE]: 40000,
  [ProjectCategory.DIGITAL_SERVICE]: 80000,
  [ProjectCategory.ECOMMERCE]: 60000,
  [ProjectCategory.PHYSICAL_PRODUCT]: 100000,
  [ProjectCategory.OTHER]: 50000,
};

export const COST_LEGAL_CR = 2500;
export const COST_SETUP_MISC = 15000;

export const OPEX_SALARY_NON_TECH: Record<StaffCount, number> = {
  [StaffCount.ZERO]: 3000,
  [StaffCount.SMALL]: 12000,
  [StaffCount.MEDIUM]: 35000,
  [StaffCount.LARGE]: 60000,
};

export const OPEX_TECH_SALARY_BASE = 15000;

export const OPEX_RENT: Record<OfficeType, number> = {
  [OfficeType.REMOTE]: 0,
  [OfficeType.COWORKING]: 2000,
  [OfficeType.OFFICE]: 8000,
  [OfficeType.WAREHOUSE]: 15000,
};

export const OPEX_MARKETING_BASE: Record<MarketingType, number> = {
  [MarketingType.ORGANIC]: 1000,
  [MarketingType.PAID_ADS]: 5000,
  [MarketingType.MEGA]: 25000,
};

// Modifiers
export const CITY_COST_MULTIPLIER: Record<City, number> = {
  [City.RIYADH]: 1.25, // 25% more expensive
  [City.JEDDAH]: 1.10, // 10% more expensive
  [City.DAMMAM]: 1.05, // 5% more expensive
  [City.OTHER]: 0.85,  // 15% cheaper
};

export const USD_TO_SAR = 3.75;
export const EUR_TO_SAR = 4.0;
export const BASE_BUFFER_PERCENTAGE = 0.15;
export const HIGH_RISK_BUFFER_PERCENTAGE = 0.25;

// Funding Sources Data
export const FUNDING_SOURCES: Record<string, FundingRecommendation[]> = {
  TECH: [
    { name: 'الشركة السعودية للاستثمار الجريء (SVC)', description: 'استثمار في الصناديق والشركات الناشئة', url: 'https://svc.com.sa' },
    { name: 'واعد (أرامكو)', description: 'دعم ريادة الأعمال والابتكار', url: 'https://waed.net' },
  ],
  SME: [
    { name: 'بنك التنمية الاجتماعية', description: 'تمويل ميسر للمشاريع الصغيرة', url: 'https://www.sdb.gov.sa' },
    { name: 'برنامج كفالة', description: 'ضمان التمويل للمنشآت الصغيرة', url: 'https://kafalah.gov.sa' },
  ],
  GOV: [
    { name: 'تقنية (Taqnia)', description: 'استثمار في نقل التقنية', url: 'https://taqnia.com' }
  ]
};