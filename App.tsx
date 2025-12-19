import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import {
  ArrowLeft, ArrowRight, Coins, Users, FileText, MapPin, Cpu, Sparkles,
  Moon, Sun, PieChart, Download, SlidersHorizontal, AlertTriangle, CheckCircle2,
  TrendingUp, Building2, Banknote, Map,
  BarChart3, Target, Rocket, XCircle
} from 'lucide-react';
import {
  UserData, CalculationResult, StaffCount, OfficeType, City, Currency, FundingRecommendation,
  SwotAnalysis, ValueProposition, MVPReadiness, KeyChallenge
} from './types';
import {
  LABELS, CATEGORY_OPTIONS, TEAM_OPTIONS, LEGAL_OPTIONS, SCOPE_OPTIONS,
  RUNWAY_OPTIONS, STAFF_OPTIONS, OFFICE_OPTIONS, MARKETING_OPTIONS,
  BUSINESS_MODEL_OPTIONS, AUDIENCE_OPTIONS, COMPETITION_OPTIONS, FOUNDER_ROLE_OPTIONS,
  CITY_OPTIONS, USD_TO_SAR, EUR_TO_SAR, VALUE_PROP_OPTIONS, MVP_OPTIONS, CHALLENGE_OPTIONS
} from './constants';
import { calculateFeasibility } from './services/calculator';
import { getAIInsight } from './services/geminiService';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, LineChart, Line, AreaChart, Area
} from 'recharts';

// --- Sub-Components ---

const BackgroundPattern: React.FC = () => (
  <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none overflow-hidden select-none" aria-hidden="true">
    <div className="absolute top-0 left-0 w-full h-full"
      style={{
        backgroundImage: `url('images/logo-pattern.png')`,
        backgroundSize: '120px',
        backgroundRepeat: 'repeat',
        opacity: 0.8
      }}
    />
    {/* Floating Currency Symbols */}
    <div className="absolute top-10 left-10 text-6xl font-serif">﷼</div>
    <div className="absolute bottom-20 right-20 text-6xl font-serif">$</div>
    <div className="absolute top-1/3 right-10 text-6xl font-serif">€</div>
    <div className="absolute bottom-1/3 left-20 text-6xl font-serif">﷼</div>
    <div className="absolute top-20 right-1/4 text-5xl font-serif">$</div>
    <div className="absolute bottom-10 left-1/3 text-5xl font-serif">€</div>

    {/* Scattered Logo Pattern via SVG for more density */}
    <svg className="absolute inset-0 w-full h-full opacity-50" xmlns="http://www.w3.org/2000/svg">
      <pattern id="pattern-circles" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="translate(50,50) rotate(45)">
        <text x="10" y="30" fontSize="24" fill="currentColor" className="text-slate-900 dark:text-white">﷼</text>
        <text x="60" y="70" fontSize="24" fill="currentColor" className="text-slate-900 dark:text-white">$</text>
        <text x="30" y="80" fontSize="24" fill="currentColor" className="text-slate-900 dark:text-white">€</text>
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
    </svg>
  </div>
);



const InstallRibbon: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if dismissed previously
    if (localStorage.getItem('installDismissed') === 'true') return;

    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // For iOS, show ribbon immediately if not dismissed and not in standalone
      setIsVisible(true);
    } else {
      // For others, wait for beforeinstallprompt
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsVisible(true);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstall = () => {
    if (isIOS) {
      // Show iOS instructions (simple alert for now, or could lead to modal)
      alert("لتثبيت التطبيق على الآيفون:\n1. اضغط على زر المشاركة (Share) في أسفل المتصفح.\n2. اختر 'إضافة إلى الصفحة الرئيسية' (Add to Home Screen).");
    } else {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setIsVisible(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('installDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white py-3 px-4 flex justify-between items-center shadow-lg relative z-50 animate-fade-in-down print:hidden">
      <div className="flex items-center gap-2">
        <Download size={20} className="animate-bounce" />
        <span className="font-bold text-sm">
          {isIOS ? "ثبت التطبيق على شاشتك الرئيسية" : "تطبيق كافي متاح الآن!"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="bg-white text-brand-700 px-4 py-1 rounded-full text-xs font-bold hover:bg-brand-50 transition-colors shadow-sm"
        >
          {isIOS ? "طريقة التثبيت" : "حمل التطبيق"}
        </button>
        <button onClick={handleDismiss} className="text-white/80 hover:text-white p-1">
          <XCircle size={18} />
        </button>
      </div>
    </div>
  );
};

const StepIndicator: React.FC<{ step: number; total: number }> = ({ step, total }) => {
  const percentage = Math.min((step / total) * 100, 100);
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-full mb-8 overflow-hidden print:hidden">
      <div className="h-full bg-brand-600 transition-all duration-500 ease-out" style={{ width: `${percentage}%` }} />
    </div>
  );
};

const Header: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="text-center py-10 animate-fade-in-up">
    <div className="mx-auto w-24 h-24 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-3xl flex items-center justify-center mb-6 shadow-sm rotate-3 transform hover:rotate-6 transition-transform">
      <Coins size={48} />
    </div>
    <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">{LABELS.APP_TITLE}</h1>
    <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed px-4">
      {LABELS.APP_SUBTITLE}
    </p>
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-8 text-sm text-blue-800 dark:text-blue-300 max-w-sm mx-auto">
      💡 ٨٠٪ من المشاريع الناشئة تفشل بسبب نفاد السيولة في أول ٦ أشهر. احسبها صح قبل أن تبدأ.
    </div>
    <button
      onClick={onStart}
      className="bg-brand-600 hover:bg-brand-700 text-white text-xl font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 w-full sm:w-auto"
    >
      {LABELS.START_BTN}
    </button>
  </div>
);

const OptionCard: React.FC<{
  selected: boolean; onClick: () => void; label: string; icon?: React.ElementType
}> = ({ selected, onClick, label, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 text-right mb-3 group
      ${selected
        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-900 dark:text-brand-300 shadow-md'
        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-200 dark:hover:border-brand-800 hover:bg-slate-50 dark:hover:bg-slate-750'
      }`}
  >
    {Icon && (
      <div className={`p-2 rounded-lg ${selected ? 'bg-brand-200 dark:bg-brand-800 text-brand-700 dark:text-brand-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-600'}`}>
        <Icon size={24} />
      </div>
    )}
    <span className="font-semibold text-lg flex-1">{label}</span>
    {selected && <div className="w-4 h-4 bg-brand-500 rounded-full" />}
  </button>
);

const Loading: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 animate-pulse">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-brand-200 dark:bg-brand-800/50 rounded-full animate-ping opacity-75"></div>
      <div className="relative bg-brand-100 dark:bg-brand-900 p-6 rounded-full text-brand-600 dark:text-brand-400">
        <Cpu size={48} className="animate-spin-slow" />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{LABELS.LOADING_TITLE}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-center max-w-xs">{LABELS.LOADING_SUB}</p>
  </div>
);

const SmartFundingModule: React.FC<{
  gap: number;
  currency: Currency;
  recommendations: FundingRecommendation[];
}> = ({ gap, currency, recommendations }) => {
  const [equity, setEquity] = useState(10);
  const rate = currency === 'SAR' ? 1 : (currency === 'EUR' ? (1 / EUR_TO_SAR) : (1 / USD_TO_SAR));
  const currencyLabel = currency === 'SAR' ? 'ر.س' : (currency === 'EUR' ? '€' : '$');

  const displayGap = gap * rate;
  const valuation = displayGap / (equity / 100);

  const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl mb-8 shadow-xl border border-slate-700 page-break-inside-avoid">
      <div className="flex items-center gap-2 mb-4 text-brand-400 font-bold">
        <Banknote size={20} />
        <h3>محور التمويل الذكي</h3>
      </div>

      <p className="text-sm text-slate-300 mb-6">
        لديك فجوة تمويلية قدرها <span className="font-bold text-white">{formatter.format(displayGap)} {currencyLabel}</span>.
        استخدم الأداة التالية لتقدير قيمة شركتك عند البحث عن مستثمر.
      </p>

      <div className="bg-slate-800 p-4 rounded-xl mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>حصة المستثمر المقترحة</span>
          <span className="font-bold text-brand-400">{equity}%</span>
        </div>
        <input
          type="range"
          min="5" max="49" step="1"
          value={equity}
          onChange={(e) => setEquity(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>5%</span>
          <span>49%</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <span className="text-slate-400 text-xs uppercase tracking-wider">التقييم المقترح للشركة (Valuation)</span>
        <div className="text-3xl font-bold text-white mt-1">
          {formatter.format(valuation)} <span className="text-sm font-normal text-slate-400">{currencyLabel}</span>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4">
        <h4 className="text-sm font-bold mb-3 text-slate-300">جهات تمويل مقترحة لمشروعك:</h4>
        <div className="grid gap-3">
          {recommendations.map((rec, i) => (
            <a
              key={i}
              href={rec.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between bg-slate-800 hover:bg-slate-700 p-3 rounded-lg transition-colors group"
            >
              <div>
                <div className="font-bold text-sm text-brand-400 group-hover:text-brand-300">{rec.name}</div>
                <div className="text-xs text-slate-400">{rec.description}</div>
              </div>
              <ArrowRight size={16} className="text-slate-500 group-hover:text-white" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const SwotMatrix: React.FC<{ swot: SwotAnalysis }> = ({ swot }) => (
  <div className="grid grid-cols-2 gap-3 mb-6 page-break-inside-avoid">
    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
      <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-2 text-sm flex items-center gap-1"><TrendingUp size={14} /> نقاط القوة</h4>
      <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
        {swot.strengths.length ? swot.strengths.map((s, i) => <li key={i}>{s}</li>) : <li>لا يوجد نقاط قوة بارزة</li>}
      </ul>
    </div>
    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/50">
      <h4 className="font-bold text-red-800 dark:text-red-400 mb-2 text-sm flex items-center gap-1"><AlertTriangle size={14} /> نقاط الضعف</h4>
      <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
        {swot.weaknesses.length ? swot.weaknesses.map((s, i) => <li key={i}>{s}</li>) : <li>تحليل جيد!</li>}
      </ul>
    </div>
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
      <h4 className="font-bold text-blue-800 dark:text-blue-400 mb-2 text-sm flex items-center gap-1"><Sparkles size={14} /> الفرص</h4>
      <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
        {swot.opportunities.length ? swot.opportunities.map((s, i) => <li key={i}>{s}</li>) : <li>اكتشف المزيد</li>}
      </ul>
    </div>
    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/50">
      <h4 className="font-bold text-orange-800 dark:text-orange-400 mb-2 text-sm flex items-center gap-1"><Target size={14} /> التهديدات</h4>
      <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
        {swot.threats.length ? swot.threats.map((s, i) => <li key={i}>{s}</li>) : <li>الطريق آمن</li>}
      </ul>
    </div>
  </div>
);

// --- Result View Components ---

const GaugeScore: React.FC<{ score: number }> = ({ score }) => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = 'stroke-red-500';
  if (score > 50) color = 'stroke-yellow-500';
  if (score >= 80) color = 'stroke-brand-500';

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <div className="relative w-40 h-24 overflow-hidden mb-2">
        <svg height={radius * 2} width={radius * 2} className="rotate-[180deg] absolute top-0 left-0">
          <circle
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{ strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset: circumference / 2 }}
          />
          <circle
            className={`${color} transition-all duration-1000 ease-out`}
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{
              strokeDasharray: `${circumference} ${circumference}`,
              strokeDashoffset: (circumference / 2) + ((100 - score) / 100) * (circumference / 2),
              strokeLinecap: 'round'
            }}
          />
        </svg>
      </div>
      <div className="text-center">
        <span className={`text-4xl font-bold ${score >= 80 ? 'text-brand-600' : (score > 50 ? 'text-yellow-500' : 'text-red-500')} dark:text-white`}>{score}%</span>
        <span className="block text-sm text-slate-500 mt-1">مؤشر الجدوى</span>
      </div>
    </div>
  );
};

const ResultView: React.FC<{
  initialResult: CalculationResult;
  initialUserData: UserData;
  aiInsight: string | null;
  onReset: () => void;
  currency: Currency;
}> = ({ initialResult, initialUserData, aiInsight, onReset, currency }) => {

  const [userData, setUserData] = useState(initialUserData);
  const [result, setResult] = useState(initialResult);

  useEffect(() => {
    try {
      const newResult = calculateFeasibility(userData);
      setResult(newResult);
    } catch (e) { console.error(e); }
  }, [userData]);

  const handlePrint = () => {
    window.print();
  };

  const rate = currency === 'SAR' ? 1 : (currency === 'EUR' ? (1 / EUR_TO_SAR) : (1 / USD_TO_SAR));

  const formatter = new Intl.NumberFormat(currency === 'SAR' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  });

  const formatMoney = (amount: number) => formatter.format(amount * rate);

  // Data for Charts
  const cashFlowData = result.cashFlow.map(item => ({
    name: item.month,
    الرصيد: Math.round(item.balance * rate),
    الإيراد: Math.round(item.revenue * rate)
  }));

  return (
    <div className="animate-fade-in text-center pb-20 print:text-black">
      <div className="print:hidden">
        <GaugeScore score={result.score} />
      </div>

      <div className="hidden print:block mb-8 text-center border-b pb-4">
        <h1 className="text-3xl font-bold">تقرير جدوى مشروع: كافي</h1>
        <p>التاريخ: {new Date().toLocaleDateString('ar-SA')}</p>
      </div>

      <h2 className={`text-2xl font-bold mb-2 ${result.isFeasible ? 'text-brand-600' : 'text-red-600'}`}>
        {result.isFeasible ? LABELS.RESULT_SUCCESS : LABELS.RESULT_FAIL}
      </h2>
      <p className="text-slate-600 dark:text-slate-300 mb-8 px-4 text-sm">
        {result.isFeasible ? LABELS.RESULT_SUCCESS_SUB : LABELS.RESULT_FAIL_SUB}
      </p>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <span className="block text-slate-400 text-xs mb-1">صافي الربح الشهري (المتوقع)</span>
          <span className={`block font-bold text-xl ${result.netProfitMonthly < 0 ? 'text-red-500' : 'text-emerald-500'}`} dir="ltr">
            {formatMoney(result.netProfitMonthly)}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <span className="block text-slate-400 text-xs mb-1">وحدات التعادل (شهرياً)</span>
          <span className="block font-bold text-lg text-slate-800 dark:text-white">
            {result.breakEvenUnits} وحدة/عميل
          </span>
        </div>
      </div>

      {/* SWOT Analysis */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 justify-center text-slate-400 text-sm">
          <Target size={16} /> <span>تحليل SWOT</span>
        </div>
        <SwotMatrix swot={result.swot} />
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm mb-6 h-64 print:h-80 page-break-inside-avoid">
        <h3 className="text-xs text-slate-500 mb-4 text-right">التدفقات النقدية للسنة الأولى</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cashFlowData}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" fontSize={10} tick={{ fill: '#94a3b8' }} />
            <YAxis fontSize={10} tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `${val / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="3 3" />
            <Area type="monotone" dataKey="الرصيد" stroke="#22c55e" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Funding Module (Only if Red / Gap exists) */}
      {!result.isFeasible && result.fundingGap > 0 && (
        <SmartFundingModule
          gap={result.fundingGap}
          currency={currency}
          recommendations={result.fundingRecommendations}
        />
      )}

      {/* What-If Section */}
      <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl mb-6 border border-slate-200 dark:border-slate-700 print:hidden">
        <div className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300 font-bold text-sm">
          <SlidersHorizontal size={16} />
          <span>ماذا لو؟ (جرب تغيير المعطيات)</span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2 text-slate-500">
            <span>المقر: {OFFICE_OPTIONS.find(o => o.id === userData.office)?.label}</span>
          </div>
          <input
            type="range"
            min="0" max="3" step="1"
            value={OFFICE_OPTIONS.findIndex(o => o.id === userData.office)}
            onChange={(e) => {
              const idx = parseInt(e.target.value);
              setUserData({ ...userData, office: OFFICE_OPTIONS[idx].id as OfficeType });
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-2 text-slate-500">
            <span>الفريق: {STAFF_OPTIONS.find(o => o.id === userData.staff)?.label}</span>
          </div>
          <input
            type="range"
            min="0" max="3" step="1"
            value={STAFF_OPTIONS.findIndex(o => o.id === userData.staff)}
            onChange={(e) => {
              const idx = parseInt(e.target.value);
              setUserData({ ...userData, staff: STAFF_OPTIONS[idx].id as StaffCount });
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 mb-6 text-right page-break-inside-avoid">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
          <PieChart size={18} className="text-slate-400" />
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">تحليل الميزانية</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">تأسيس وتطوير (CAPEX)</span>
            <span className="font-bold text-slate-900 dark:text-white">{formatMoney(result.breakdown.capex.total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">تشغيل لمدة {userData.runway} أشهر (OPEX)</span>
            <span className="font-bold text-slate-900 dark:text-white">{formatMoney(result.breakdown.opex.totalRunway)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
            <span className="text-slate-800 dark:text-slate-200 font-bold">المجموع المطلوب</span>
            <span className="font-bold text-brand-600">{formatMoney(result.requiredCapital)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">رأس مالك</span>
            <span className="font-bold text-slate-900 dark:text-white">{formatMoney(result.userCapital)}</span>
          </div>
        </div>
      </div>

      {/* Tips & Checklist */}
      <div className="space-y-4 mb-8 page-break-inside-avoid">
        {result.tips.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 p-4 rounded-xl text-right text-sm">
            <h4 className="font-bold text-yellow-800 dark:text-yellow-400 mb-2 flex items-center gap-2">
              <AlertTriangle size={16} /> تنبيهات هامة
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
              {result.tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-xl text-right text-sm">
          <h4 className="font-bold text-brand-700 dark:text-brand-400 mb-2 flex items-center gap-2">
            <CheckCircle2 size={16} /> المتطلبات الحكومية
          </h4>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300">
            {result.checklist.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                </div>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-5 mb-8 border border-indigo-100 dark:border-indigo-800/50 text-right page-break-inside-avoid">
        <div className="flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-400 font-bold">
          <Sparkles size={18} />
          <span>{LABELS.AI_INSIGHT_TITLE}</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
          {aiInsight || <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 w-3/4 block rounded"></span>}
        </p>
      </div>

      <div className="space-y-3 print:hidden">
        <button
          onClick={handlePrint}
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-4 rounded-xl font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <Download size={20} />
          {LABELS.BTN_START}
        </button>

        <button
          onClick={onReset}
          className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          {LABELS.BTN_RETRY}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const TOTAL_QUESTIONS = 19; // Updated from 14 to 19
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    category: null, capital: '', team: null, legal: null, scope: null,
    runway: null, staff: null, office: null, marketing: null,
    businessModel: null, audience: null, competition: null, founderRole: null,
    city: null,
    unitPrice: '', targetVolume: '', valueProp: null, mvpReady: null, keyChallenge: null
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>('SAR');

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    document.title = "كافي";
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const handleNext = async () => {
    if (step === TOTAL_QUESTIONS) {
      setStep(99); // Loading
      try {
        const calcResult = calculateFeasibility(userData);
        setResult(calcResult);
        getAIInsight(userData, calcResult).then(insight => setAiInsight(insight));
        setTimeout(() => setStep(100), 2000); // Result
      } catch (e) {
        console.error(e);
        alert("حدث خطأ في البيانات");
        setStep(1);
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => setStep(prev => prev - 1);
  const updateData = (key: keyof UserData, value: any) => setUserData(prev => ({ ...prev, [key]: value }));

  return (
    <div>



      <Layout>
        <InstallRibbon />
        <BackgroundPattern />
        {/* Nav Bar */}
        <div className="w-full mb-6 flex justify-between items-center print:hidden">
          {step > 0 && step <= TOTAL_QUESTIONS ? (
            <button onClick={handleBack} className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
          ) : <div className="w-10"></div>}

          <div className="flex items-center gap-4">
            {step > 0 && step <= TOTAL_QUESTIONS && <span className="text-slate-400 dark:text-slate-600 font-medium text-sm">خطوة {step} من {TOTAL_QUESTIONS}</span>}
          </div>

          <button onClick={toggleTheme} className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mr-2 text-xs font-bold">
            <button
              onClick={() => setCurrency('SAR')}
              className={`px-2 py-1 rounded-md transition-all ${currency === 'SAR' ? 'bg-white dark:bg-slate-600 text-brand-600 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              SAR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded-md transition-all ${currency === 'USD' ? 'bg-white dark:bg-slate-600 text-brand-600 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              USD
            </button>
            <button
              onClick={() => setCurrency('EUR')}
              className={`px-2 py-1 rounded-md transition-all ${currency === 'EUR' ? 'bg-white dark:bg-slate-600 text-brand-600 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              EUR
            </button>
          </div>
        </div>

        {step > 0 && step <= TOTAL_QUESTIONS && <StepIndicator step={step} total={TOTAL_QUESTIONS} />}

        {step === 0 && <Header onStart={() => setStep(1)} />}
        {step === 99 && <Loading />}
        {step === 100 && result && (
          <ResultView
            initialResult={result}
            initialUserData={userData}
            aiInsight={aiInsight}
            onReset={() => {
              setStep(0);
              setUserData({
                category: null, capital: '', team: null, legal: null, scope: null,
                runway: null, staff: null, office: null, marketing: null,
                businessModel: null, audience: null, competition: null, founderRole: null, city: null,
                unitPrice: '', targetVolume: '', valueProp: null, mvpReady: null, keyChallenge: null
              });
              setResult(null);
              setAiInsight(null);
            }}
            currency={currency}
          />
        )}

        {(step > 0 && step <= TOTAL_QUESTIONS) && (
          <div className="min-h-[400px] flex flex-col animate-fade-in">

            {/* 1-14: Existing Steps (Abbreviated to avoid massive file, logic handles them) */}

            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-right">ما هي فكرة مشروعك؟</h2>
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[60vh]">
                  {CATEGORY_OPTIONS.map(opt => (
                    <OptionCard key={opt.id} label={opt.label} icon={opt.icon} selected={userData.category === opt.id} onClick={() => updateData('category', opt.id)} />
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">ما هو رأس المال المتاح؟</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-right text-sm">
                  {currency === 'SAR' ? 'المبلغ الإجمالي (ريال سعودي)' : 'المبلغ الإجمالي (دولار أمريكي)'}
                </p>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="number"
                      value={userData.capital}
                      onChange={(e) => updateData('capital', e.target.value)}
                      placeholder={currency === 'SAR' ? "500000" : (currency === 'EUR' ? "125000" : "135000")}
                      className="w-full text-3xl font-bold text-center p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-500 dark:focus:border-brand-500 outline-none"
                      autoFocus
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currency === 'SAR' ? 'ر.س' : (currency === 'EUR' ? '€' : '$')}</span>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-right">كيف ستطور المنتج؟</h2>
                <div className="space-y-3 flex-1">{TEAM_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={Users} selected={userData.team === opt.id} onClick={() => updateData('team', opt.id)} />)}</div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-right">هل تحتاج ترخيص تجاري؟</h2>
                <div className="space-y-3 flex-1">{LEGAL_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={FileText} selected={userData.legal === opt.id} onClick={() => updateData('legal', opt.id)} />)}</div>
              </>
            )}

            {step === 5 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-right">نطاق التوسع الجغرافي؟</h2>
                <div className="space-y-3 flex-1">{SCOPE_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={MapPin} selected={userData.scope === opt.id} onClick={() => updateData('scope', opt.id)} />)}</div>
              </>
            )}

            {step === 6 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">المدينة الأساسية؟</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-right text-sm">تكاليف التشغيل تختلف حسب المدينة</p>
                <div className="space-y-3 flex-1">{CITY_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={opt.icon} selected={userData.city === opt.id} onClick={() => updateData('city', opt.id)} />)}</div>
              </>
            )}

            {step === 7 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">فترة التشغيل (Runway)؟</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-right text-sm">كم شهر تريد أن يصمد المشروع بدون أرباح؟</p>
                <div className="space-y-3 flex-1">{RUNWAY_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={opt.icon} selected={userData.runway === opt.id} onClick={() => updateData('runway', opt.id)} />)}</div>
              </>
            )}

            {step === 8 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">فريق العمل (غير التقني)؟</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-right text-sm">عدد الموظفين في السنة الأولى (مبيعات، إدارة)</p>
                <div className="space-y-3 flex-1">{STAFF_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={opt.icon} selected={userData.staff === opt.id} onClick={() => updateData('staff', opt.id)} />)}</div>
              </>
            )}

            {step === 9 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">مقر العمل؟</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-right text-sm">الإيجارات تستهلك جزءاً كبيراً من الميزانية</p>
                <div className="space-y-3 flex-1">{OFFICE_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={opt.icon} selected={userData.office === opt.id} onClick={() => updateData('office', opt.id)} />)}</div>
              </>
            )}

            {step === 10 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">استراتيجية التسويق؟</h2>
                <div className="space-y-3 flex-1">{MARKETING_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={opt.icon} selected={userData.marketing === opt.id} onClick={() => updateData('marketing', opt.id)} />)}</div>
              </>
            )}

            {step === 11 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">نموذج الربح؟</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-right text-sm">كيف ستحقق الدخل؟</p>
                <div className="space-y-3 flex-1">{BUSINESS_MODEL_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={opt.icon} selected={userData.businessModel === opt.id} onClick={() => updateData('businessModel', opt.id)} />)}</div>
              </>
            )}

            {step === 12 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">الجمهور المستهدف؟</h2>
                <div className="space-y-3 flex-1">{AUDIENCE_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={opt.icon} selected={userData.audience === opt.id} onClick={() => updateData('audience', opt.id)} />)}</div>
              </>
            )}

            {step === 13 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">حجم المنافسة؟</h2>
                <div className="space-y-3 flex-1">{COMPETITION_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={opt.icon} selected={userData.competition === opt.id} onClick={() => updateData('competition', opt.id)} />)}</div>
              </>
            )}

            {step === 14 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">دورك في المشروع؟</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-right text-sm">مساهمتك الشخصية توفر تكاليف هائلة</p>
                <div className="space-y-3 flex-1">{FOUNDER_ROLE_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={opt.icon} selected={userData.founderRole === opt.id} onClick={() => updateData('founderRole', opt.id)} />)}</div>
              </>
            )}

            {/* --- NEW QUESTIONS START HERE --- */}

            {step === 15 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">ما هي القيمة المضافة (USP)؟</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-right text-sm">لماذا سيشتري العميل منك بدلاً من المنافس؟</p>
                <div className="space-y-3 flex-1">{VALUE_PROP_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={opt.icon} selected={userData.valueProp === opt.id} onClick={() => updateData('valueProp', opt.id)} />)}</div>
              </>
            )}

            {step === 16 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">متوسط سعر البيع المتوقع؟</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-right text-sm">سعر المنتج الواحد أو الاشتراك الشهري</p>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="number"
                      value={userData.unitPrice}
                      onChange={(e) => updateData('unitPrice', e.target.value)}
                      placeholder="100"
                      className="w-full text-3xl font-bold text-center p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-500 dark:focus:border-brand-500 outline-none"
                      autoFocus
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currency === 'SAR' ? 'ر.س' : (currency === 'EUR' ? '€' : '$')}</span>
                  </div>
                </div>
              </>
            )}

            {step === 17 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">هدف المبيعات الشهري؟</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-right text-sm">عدد العملاء/المبيعات المتوقع بعد 12 شهر</p>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="number"
                      value={userData.targetVolume}
                      onChange={(e) => updateData('targetVolume', e.target.value)}
                      placeholder="500"
                      className="w-full text-3xl font-bold text-center p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-500 dark:focus:border-brand-500 outline-none"
                      autoFocus
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">وحدة/عميل</span>
                  </div>
                </div>
              </>
            )}

            {step === 18 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">استراتيجية الإطلاق؟</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-right text-sm">هل ستبدأ بنسخة مبسطة؟</p>
                <div className="space-y-3 flex-1">{MVP_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={opt.icon} selected={userData.mvpReady === opt.id} onClick={() => updateData('mvpReady', opt.id)} />)}</div>
              </>
            )}

            {step === 19 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-right">التحدي الأكبر؟</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-right text-sm">حدد الخطر الرئيسي لزيادة نسبة الأمان</p>
                <div className="space-y-3 flex-1">{CHALLENGE_OPTIONS.map(opt => <OptionCard key={opt.id} label={opt.label} icon={opt.icon} selected={userData.keyChallenge === opt.id} onClick={() => updateData('keyChallenge', opt.id)} />)}</div>
              </>
            )}


            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                disabled={
                  (step === 1 && !userData.category) ||
                  (step === 2 && userData.capital === '') ||
                  (step === 3 && !userData.team) ||
                  (step === 4 && !userData.legal) ||
                  (step === 5 && !userData.scope) ||
                  (step === 6 && !userData.city) ||
                  (step === 7 && !userData.runway) ||
                  (step === 8 && !userData.staff) ||
                  (step === 9 && !userData.office) ||
                  (step === 10 && !userData.marketing) ||
                  (step === 11 && !userData.businessModel) ||
                  (step === 12 && !userData.audience) ||
                  (step === 13 && !userData.competition) ||
                  (step === 14 && !userData.founderRole) ||
                  (step === 15 && !userData.valueProp) ||
                  (step === 16 && userData.unitPrice === '') ||
                  (step === 17 && userData.targetVolume === '') ||
                  (step === 18 && !userData.mvpReady) ||
                  (step === 19 && !userData.keyChallenge)
                }
                onClick={handleNext}
                className="w-full bg-brand-600 hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {step === TOTAL_QUESTIONS ? LABELS.CONFIRM : LABELS.NEXT}
                {step !== TOTAL_QUESTIONS && <ArrowLeft size={20} />}
              </button>
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
}