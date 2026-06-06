import React from 'react';
import { 
  Fuel, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Info, 
  Percent, 
  Calendar, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Coins,
  DollarSign,
  Award,
  ArrowDownCircle,
  Clock,
  HelpCircle,
  ChevronDown,
  Search,
  Check,
  X,
  FileText,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CalculatorInputs, CalculatorResults, SelectedCountry } from '../../types';
import { VEHICLES, COUNTRY_CONFIGS, Vehicle } from '../../data/calculatorData';

export interface I18nDictionary {
  modelling: string;
  petrol: string;
  petrolCapital: string;
  gasoline: string;
  litres: string;
  litre: string;
  petrolPricePerLitre: string;
  pricePerLitrePlaceholder: string;
  petrolEquivalent: string;
  petrolEfficiency: string;
  enterPetrolEfficiency: string;
}

export function getI18n(country: SelectedCountry): I18nDictionary {
  const isUS = country === 'us';
  return {
    modelling: isUS ? 'MODELING' : 'MODELLING',
    petrol: isUS ? 'Gas' : 'Petrol',
    petrolCapital: isUS ? 'GAS' : 'PETROL',
    gasoline: isUS ? 'Gasoline' : 'Petrol',
    litres: isUS ? 'Liters' : 'Litres',
    litre: isUS ? 'Liter' : 'Litre',
    petrolPricePerLitre: isUS ? 'Gas Price per Liter' : 'Petrol Price per Litre',
    pricePerLitrePlaceholder: isUS ? 'Price per Liter' : 'Price per Litre',
    petrolEquivalent: isUS ? 'Gas Equivalent' : 'Petrol Equivalent',
    petrolEfficiency: isUS ? 'Gas Efficiency' : 'Petrol Efficiency',
    enterPetrolEfficiency: isUS ? 'Enter Gas Equivalent Efficiency' : 'Enter Petrol Equivalent Efficiency'
  };
}

// Core calculation engine serving AU, UK & US
export function calculateEVValues(inputs: CalculatorInputs, country: SelectedCountry): CalculatorResults {
  const config = COUNTRY_CONFIGS[country] || COUNTRY_CONFIGS.us;
  const currencySymbol = config.currencySymbol;
  const distanceUnits = config.distanceUnits;
  const efficiencyUnits = config.efficiencyUnits;
  const evEfficiencyUnits = config.evEfficiencyUnits;
  
  const monthlyDistance = inputs.annualDistance / 12;
  
  // 1. Petrol Car Cost Calculations
  let petrolLitersUsed = 0;
  let monthlyPetrolCost = 0;
  if (country === 'au') {
    // Fuel efficiency in L/100km
    petrolLitersUsed = (monthlyDistance / 100) * inputs.fuelEfficiency;
    monthlyPetrolCost = petrolLitersUsed * inputs.gasPrice;
  } else {
    // US & UK efficiency is in MPG, fuel bought in Liters
    const monthlyGallonsUsed = inputs.fuelEfficiency > 0 ? (monthlyDistance / inputs.fuelEfficiency) : 0;
    const litersPerGallon = country === 'uk' ? 4.54609 : 3.78541;
    petrolLitersUsed = monthlyGallonsUsed * litersPerGallon;
    monthlyPetrolCost = petrolLitersUsed * inputs.gasPrice; 
  }
  
  // 2. EV Charging Cost Calculations
  let evTotalKwhUsed = 0;
  if (country === 'au') {
    // EV Efficiency in kWh/100km
    evTotalKwhUsed = (monthlyDistance / 100) * inputs.evEfficiency;
  } else {
    // US & UK EV efficiency in miles/kWh
    evTotalKwhUsed = inputs.evEfficiency > 0 ? (monthlyDistance / inputs.evEfficiency) : 0;
  }
  
  const monthlyHomeChargingCost = evTotalKwhUsed * (inputs.chargingHomeRatio / 100) * inputs.homeChargingRate;
  const monthlyPublicChargingCost = evTotalKwhUsed * (inputs.chargingPublicRatio / 100) * inputs.publicChargingRate;
  const monthlyTotalChargingCost = monthlyHomeChargingCost + monthlyPublicChargingCost;
  
  // 3. Base Savings
  const monthlyBaseSavings = Math.max(0, monthlyPetrolCost - monthlyTotalChargingCost);
  const yearlyBaseSavings = monthlyBaseSavings * 12;
  const fiveYearBaseSavings = yearlyBaseSavings * 5;
  
  // 4. Australia Luxury Car Tax (LCT) Calculations
  const lctThreshold = 91387; 
  const hasLct = country === 'au' && inputs.msrp > lctThreshold;
  const taxableLctValue = hasLct ? (inputs.msrp - lctThreshold) : 0;
  const lctPaid = hasLct ? (taxableLctValue * (10 / 11) * 0.33) : 0;
  
  // 5. UK Salary Sacrifice Calculations
  let nicSavingRate = 0.08;
  if (inputs.taxBracket === 0.40 || inputs.taxBracket === 0.45) {
    nicSavingRate = 0.02;
  }
  const totalTaxSavingRate = inputs.taxBracket + nicSavingRate;
  const monthlyLeaseSourcingSaving = inputs.monthlyGrossLease * totalTaxSavingRate;
  const bikRate = 0.02;
  const monthlyBikTax = (inputs.msrp * bikRate * (inputs.taxBracket || 0.20)) / 12;
  const monthlyNetSalarySacrificeLease = Math.max(0, inputs.monthlyGrossLease - monthlyLeaseSourcingSaving + monthlyBikTax);
  const salarySacrificeNetBenefit = Math.max(0, monthlyLeaseSourcingSaving - monthlyBikTax + monthlyBaseSavings);
  
  // 6. US Federal Clean Vehicle Credit (Section 30D) & Finance Calculations
  const hasFederalCredit = country === 'us' && inputs.msrp <= 55000 && inputs.annualIncome <= 150000;
  const federalCreditAmount = hasFederalCredit ? 7500 : 0;
  
  const loanPrincipal = Math.max(0, inputs.msrp - inputs.downPayment);
  let monthlyFinancePayment = 0;
  if (inputs.loanTerm > 0 && inputs.interestRate > 0) {
    const monthlyRate = (inputs.interestRate / 100) / 12;
    const totalPayments = inputs.loanTerm * 12;
    monthlyFinancePayment = (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
  } else if (inputs.loanTerm > 0) {
    monthlyFinancePayment = loanPrincipal / (inputs.loanTerm * 12);
  }

  return {
    country,
    currencySymbol,
    distanceUnits,
    efficiencyUnits,
    evEfficiencyUnits,
    monthlyDistance,
    msrp: inputs.msrp,
    taxBracket: inputs.taxBracket,
    monthlyGrossLease: inputs.monthlyGrossLease,
    petrolLitersUsed,
    monthlyPetrolCost,
    evTotalKwhUsed,
    monthlyHomeChargingCost,
    monthlyPublicChargingCost,
    monthlyTotalChargingCost,
    monthlyBaseSavings,
    yearlyBaseSavings,
    fiveYearBaseSavings,
    hasLct,
    lctThreshold,
    taxableLctValue,
    lctPaid,
    nicSavingRate,
    totalTaxSavingRate,
    monthlyLeaseSourcingSaving,
    monthlyBikTax,
    monthlyNetSalarySacrificeLease,
    salarySacrificeNetBenefit,
    hasFederalCredit,
    federalCreditAmount,
    monthlyFinancePayment,
    loanPrincipal,
  };
}

// ----------------------------------------------------
// DYNAMIC SUB-CARD: Fuel vs Charging Cost Card
// ----------------------------------------------------
interface CostAnalysisProps {
  results: CalculatorResults;
}

export function FuelVsChargingCard({ results }: CostAnalysisProps) {
  const formatVal = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const i18n = getI18n(results.country);
  
  return (
    <div 
      id="fuel-charging-card"
      className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-md rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs dark:shadow-none p-6 md:p-8 flex flex-col relative overflow-hidden transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-display">Fuel vs. Charging Analysis</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Operational cost breakdown per month</p>
        </div>
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase rounded-full tracking-wider shrink-0">
          OPERATIONAL POWER COST
        </span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 items-center flex-grow">
        <div className="flex-1 w-full flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 relative overflow-hidden group">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-2 tracking-widest text-center flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5 text-slate-400" /> {i18n.petrolEquivalent} / mo
          </span>
          <span className="text-3xl md:text-4xl font-mono font-black text-slate-800 dark:text-slate-200">
            {results.currencySymbol}{Math.round(results.monthlyPetrolCost)}
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-2 uppercase tracking-wide">
            Consumes ~{Math.round(results.petrolLitersUsed)} {i18n.litres}
          </p>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-slate-200 dark:bg-slate-800"></div>
        </div>

        <div className="flex-none">
          <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-white dark:bg-slate-950 shadow-2xs">
            <span className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">VS</span>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col items-center justify-center p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 relative overflow-hidden group">
          <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-2 tracking-widest text-center flex items-center gap-1 justify-center">
            <Zap className="w-3.5 h-3.5 text-emerald-500" /> EV Charging Cost / mo
          </span>
          <span className="text-3xl md:text-4xl font-mono font-black text-emerald-600 dark:text-emerald-400">
            {results.currencySymbol}{Math.round(results.monthlyTotalChargingCost)}
          </span>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-2 uppercase tracking-wide">
            Uses ~{Math.round(results.evTotalKwhUsed)} kWh energy
          </p>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-emerald-400"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm shrink-0"></div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Home Electricity share</p>
            <p className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">
              {results.currencySymbol}{formatVal(results.monthlyHomeChargingCost)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-purple-500 rounded-sm shrink-0"></div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Public Charging share</p>
            <p className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">
              {results.currencySymbol}{formatVal(results.monthlyPublicChargingCost)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// DYNAMIC SUB-CARD: Monthly Net Savings Card
// ----------------------------------------------------
export function MonthlySavingsCard({ results }: CostAnalysisProps) {
  const formatVal = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const i18n = getI18n(results.country);
  
  const totalFuelCost = results.monthlyPetrolCost || 1;
  const ratio = Math.min(100, (results.monthlyTotalChargingCost / totalFuelCost) * 105);
  const savingsPercent = Math.max(0, 100 - ratio);

  return (
    <div 
      id="monthly-savings-card"
      className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-md rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs dark:shadow-none p-6 md:p-8 flex flex-col relative overflow-hidden transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-display">Monthly Net Savings</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Total fuel/power ownership savings</p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-wider shrink-0">
          OPERATIONAL SAVINGS
        </span>
      </div>

      <div className="flex-grow flex flex-col justify-center">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">
            +{results.currencySymbol}{Math.round(results.monthlyBaseSavings).toLocaleString()}
          </span>
          <span className="text-emerald-500 dark:text-emerald-400 font-bold font-mono text-sm tracking-tight flex items-center gap-0.5">
            ▲ {Math.round(savingsPercent)}%
          </span>
        </div>
        
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden mt-4 relative border border-transparent dark:border-slate-850">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${savingsPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>
        
        <div className="flex justify-between mt-3 font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <span>Current EV cost: {Math.round(ratio)}%</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black">Savings Amount: {Math.round(savingsPercent)}%</span>
        </div>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 italic text-center">
          EV is {ratio > 0 ? (totalFuelCost / results.monthlyTotalChargingCost).toFixed(1) : '9+'}x more energy-efficient than {i18n.petrol}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">1 YEAR SAVED</span>
          <span className="font-display font-black text-xl text-slate-800 dark:text-slate-200 tracking-tight">
            {results.currencySymbol}{Math.round(results.yearlyBaseSavings).toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider">5 YEARS SAVED</span>
          <span className="font-display font-black text-xl text-emerald-600 dark:text-emerald-400 tracking-tight">
            {results.currencySymbol}{Math.round(results.fiveYearBaseSavings).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// DYNAMIC SUB-CARD: Country-Specific Regulatory Card
// ----------------------------------------------------
export function RegulatoryCard({ results }: CostAnalysisProps) {
  if (results.country === 'us') {
    return (
      <div 
        id="us-regulatory-card"
        className="bg-emerald-600 rounded-3xl p-6 md:p-8 text-white flex flex-col shadow-lg relative overflow-hidden group min-h-[340px]"
      >
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500 rounded-full opacity-50 pointer-events-none transition-transform duration-500 group-hover:scale-110" />
        
        <div className="relative z-10 flex flex-col h-full justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">REGULATORY ALERT</h3>
                <h2 className="text-2xl font-extrabold leading-tight">US Clean Vehicle Credit</h2>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-mono uppercase rounded-md tracking-wider font-semibold border border-emerald-400 shrink-0">
                IRA SEC 30D RULES
              </span>
            </div>

            {results.hasFederalCredit ? (
              <div className="bg-emerald-700/60 rounded-2xl p-4 border border-emerald-400/30 mb-6">
                <p className="text-xs leading-relaxed font-sans">
                  🎉 Good news! Both vehicle MSRP (<span className="font-mono font-bold">${results.msrp.toLocaleString()}</span> &le; $55,000) and your AGI qualify. You are eligible for the full <span className="font-bold underline">$7,500</span> Federal Tax Credit.
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                <div className="bg-amber-500/15 border border-amber-400/20 rounded-2xl p-4 text-white">
                  <p className="text-xs font-semibold text-amber-300 uppercase tracking-wide mb-1">Ineligible for Tax Credit</p>
                  <p className="text-xs opacity-90 leading-relaxed font-sans">
                    {results.msrp > 55000 
                      ? `Vehicle MSRP of $${results.msrp.toLocaleString()} exceeds the IRS passenger car limit of $55,000.`
                      : `Your Annual Income exceeds the IRS Single filer cap of $150,000.`}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-emerald-800/40 rounded-xl p-3 space-y-2 border border-emerald-700/30 font-mono text-[10px] mb-4">
              <div className="flex justify-between pb-1 border-b border-emerald-700/30">
                <span className="opacity-80">IRS Income limit cap</span>
                <span>$150,000</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">IRS Sedan MSRP threshold</span>
                <span>$55,000</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold opacity-75 block tracking-widest">Est. Tax Savings Amount</span>
            <span className="text-4xl font-mono font-black tracking-tighter">
              {results.currencySymbol}{Math.round(results.federalCreditAmount).toLocaleString()}
            </span>
            <p className="text-xs mt-2 italic opacity-85">
              {results.hasFederalCredit ? 'Direct clean vehicle consumer tax credit applied.' : 'No active Federal Tax rebate calculated.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (results.country === 'au') {
    return (
      <div 
        id="au-regulatory-card"
        className="bg-blue-600 rounded-3xl p-6 md:p-8 text-white flex flex-col shadow-lg relative overflow-hidden group min-h-[340px]"
      >
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500 rounded-full opacity-50 pointer-events-none transition-transform duration-500 group-hover:scale-110" />
        
        <div className="relative z-10 flex flex-col h-full justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Regulatory Alert</h3>
                <h2 className="text-2xl font-extrabold leading-tight">Australia LCT Exemption</h2>
              </div>
              <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-mono uppercase rounded-md tracking-wider font-semibold border border-blue-400 shrink-0">
                ATO FY26 RULES
              </span>
            </div>

            {!results.hasLct ? (
              <div className="bg-blue-700/50 rounded-2xl p-4 border border-blue-400/30 mb-6">
                <p className="text-xs leading-relaxed">
                  Your vehicle is under the <span className="font-mono font-bold">{results.currencySymbol}{results.lctThreshold.toLocaleString()}</span> fuel-efficient threshold for 2026. Since fully electric vehicles qualify, you are completely LCT exempt.
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                <div className="bg-amber-500/15 border border-amber-400/20 rounded-2xl p-4 text-white">
                  <p className="text-xs font-semibold text-amber-300 uppercase tracking-wide mb-1">Luxury Threshold Exceeded</p>
                  <p className="text-xs opacity-90 leading-relaxed">
                    MSRP of {results.currencySymbol}{results.msrp.toLocaleString()} exceeds the limit of {results.currencySymbol}{results.lctThreshold.toLocaleString()}.
                  </p>
                </div>

                <div className="bg-blue-700/50 rounded-xl p-3 space-y-2 border border-blue-400/30 font-mono text-xs">
                  <div className="flex justify-between opacity-95 border-b border-blue-500/30 pb-1.5">
                    <span>Taxable Above Threshold</span>
                    <span>{results.currencySymbol}{(results.msrp - results.lctThreshold).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between opacity-80">
                    <span>GST adjustment</span>
                    <span>&times; 10/11</span>
                  </div>
                  <div className="flex justify-between opacity-80">
                    <span>LCT Rate</span>
                    <span>33%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold opacity-75 block tracking-widest">Calculated LCT Liability</span>
            <span className="text-4xl font-mono font-black tracking-tighter">
              {results.currencySymbol}{Math.round(results.lctPaid).toLocaleString()}
            </span>
            <p className="text-xs mt-2 italic opacity-85">
              {!results.hasLct ? '33% luxury tax rate successfully waived.' : 'Luxury Car Tax added to import dealer cost.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // UK Salary Sacrifice
  return (
    <div 
      id="uk-regulatory-card"
      className="bg-indigo-900 rounded-3xl p-6 md:p-8 text-white flex flex-col shadow-lg relative overflow-hidden group min-h-[340px]"
    >
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-700 rounded-full opacity-40 pointer-events-none transition-transform duration-500 group-hover:scale-110" />
      
      <div className="relative z-10 flex flex-col h-full justify-between flex-grow">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-85 mb-1">Regulatory Perk</h3>
              <h2 className="text-2xl font-extrabold leading-tight">UK Salary Sacrifice</h2>
            </div>
            <span className="px-2 py-0.5 bg-indigo-800 text-white text-[9px] font-mono uppercase rounded-md tracking-wider font-semibold border border-indigo-700 shrink-0">
              HMRC FY26 RULES
            </span>
          </div>

          <p className="text-xs text-indigo-100 opacity-90 leading-relaxed mb-4">
            Sacrifice pre-tax salary to lease a brand-new EV. You save income tax and National Insurance contributors at your bracket rate (**{Math.round(results.totalTaxSavingRate * 100)}%**).
          </p>

          <div className="bg-indigo-800/60 rounded-xl p-4 space-y-2 border border-indigo-700/30 font-mono text-xs mb-4">
            <div className="flex justify-between border-b border-indigo-700 pb-1.5 opacity-90">
              <span>Gross Lease cost</span>
              <span>-{results.currencySymbol}{Math.round(results.monthlyLeaseSourcingSaving / results.totalTaxSavingRate).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-300 opacity-95">
              <span>Tax &amp; Class 1 NIC Saved</span>
              <span>+{results.currencySymbol}{Math.round(results.monthlyLeaseSourcingSaving).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-amber-300 opacity-95 border-b border-indigo-700 pb-1.5 font-semibold">
              <span>BiK Benefit Tax (2%)</span>
              <span>-{results.currencySymbol}{Math.round(results.monthlyBikTax)}</span>
            </div>
            <div className="flex justify-between pt-1 font-bold text-sky-200">
              <span>Your true Net Lease cost</span>
              <span>{results.currencySymbol}{Math.round(results.monthlyNetSalarySacrificeLease)}/mo</span>
            </div>
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold opacity-75 block tracking-widest">Net Monthly Sacrifice Benefit</span>
          <span className="text-4xl font-mono font-black tracking-tighter text-emerald-400">
            +{results.currencySymbol}{Math.round(results.monthlyLeaseSourcingSaving - results.monthlyBikTax).toLocaleString()}
          </span>
          <p className="text-xs mt-2 italic opacity-80 uppercase tracking-wider font-mono">employer servicing and insurance included</p>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// MAIN RIGHT COLUMN COMPONENT CONTAINER
// ----------------------------------------------------
interface RightColumnProps {
  inputs: CalculatorInputs;
  country: SelectedCountry;
}

export function RightColumn({ inputs, country }: RightColumnProps) {
  const results = calculateEVValues(inputs, country);

  return (
    <div id="right-column" className="space-y-6 md:space-y-8">
      <FuelVsChargingCard results={results} />
      <MonthlySavingsCard results={results} />
      <SponsoredAdSlot id="ad-slot-right-column" type="leaderboard" />
      <RegulatoryCard results={results} />
    </div>
  );
}

// ----------------------------------------------------
// DYNAMIC SUB-CARD: Custom Searchable Vehicle Dropdown
// ----------------------------------------------------
interface SearchableVehicleDropdownProps {
  selectedVehicleId: string;
  onVehicleChange: (id: string, customName?: string) => void;
  vehicles: Vehicle[];
  currencySymbol: string;
  country: SelectedCountry;
  currentMsrp?: number;
  customVehicleName?: string;
  onOpenChange?: (open: boolean) => void;
}

export function SearchableVehicleDropdown({
  selectedVehicleId,
  onVehicleChange,
  vehicles,
  currencySymbol,
  country,
  currentMsrp,
  customVehicleName,
  onOpenChange
}: SearchableVehicleDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const customVehicle = vehicles.find((v) => v.id === 'custom');
  const nonCustomVehicles = vehicles.filter((v) => v.id !== 'custom');
  const matchedNonCustomVehicles = nonCustomVehicles.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredVehicles = customVehicle ? [customVehicle, ...matchedNonCustomVehicles] : matchedNonCustomVehicles;

  const handleSelect = (id: string, customName?: string) => {
    onVehicleChange(id, customName);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        id="vehicle-dropdown-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-800 dark:text-slate-200 shadow-inner transition-all duration-200 cursor-pointer text-left focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selectedVehicle.id === 'custom' ? (
            <>
              {customVehicleName || selectedVehicle.name} <span className="text-slate-500 dark:text-slate-400 font-normal">({currencySymbol}{(currentMsrp || 0).toLocaleString()})</span>
            </>
          ) : (
            <>
              {selectedVehicle.name} <span className="text-slate-500 dark:text-slate-400 font-normal">({currencySymbol}{selectedVehicle.msrp[country].toLocaleString()})</span>
            </>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute left-0 w-full z-[100] bottom-full mb-1 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
          role="listbox"
        >
          <div className="p-3 border-b border-slate-150 dark:border-slate-800/80 flex items-center gap-2.5 bg-slate-50 dark:bg-[#0b0f19] sticky top-0">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search EV Model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 font-medium border-none p-0"
            />
          </div>

          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => {
                const isSelected = vehicle.id === selectedVehicleId;
                return (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => handleSelect(vehicle.id)}
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition-all duration-150 ${
                      isSelected
                        ? 'bg-blue-600/10 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 border border-transparent'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                        {vehicle.id === 'custom' && customVehicleName ? customVehicleName : vehicle.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        Efficiency: {vehicle.evEfficiency[country]} {country === 'au' ? 'kWh/100km' : 'mi/kWh'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono ml-4">
                      {vehicle.id !== 'custom' && (
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {currencySymbol}
                          {vehicle.msrp[country].toLocaleString()}
                        </span>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-2 bg-white dark:bg-[#0b0f19]">
                <button
                  type="button"
                  onClick={() => handleSelect('custom', searchTerm)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold leading-tight bg-blue-600/10 dark:bg-blue-600/15 hover:bg-blue-600/20 dark:hover:bg-blue-600/25 border border-blue-500/30 hover:border-blue-500/50 text-blue-600 dark:text-blue-400 hover:text-blue-300 rounded-xl transition-all cursor-pointer"
                >
                  ➕ Can't find '{searchTerm}'? Click here to customize this model.
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// DYNAMIC LIVE RATES UTILITY & FALLBACK
// ----------------------------------------------------
interface LiveRates {
  gasPrice: number;
  homeChargingRate: number;
  publicChargingRate: number;
}

async function fetchLiveRates(country: SelectedCountry): Promise<LiveRates> {
  const defaults = COUNTRY_CONFIGS[country];
  const cacheKey = `ev_savings_rates_cache_${country}`;

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { timestamp, rates } = JSON.parse(cached);
        const ageInSeconds = (Date.now() - timestamp) / 1000;
        if (ageInSeconds < 86400) {
          return rates;
        }
      }
    } catch {
      // Ignore cache failures
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (!data || !data.rates) throw new Error('Invalid response structure');

    const rates = data.rates;
    let gasPrice = defaults.defaultGasPrice;
    let homeChargingRate = defaults.defaultHomeChargingRate;
    let publicChargingRate = defaults.defaultPublicChargingRate;

    const usdGas = 0.95;
    const usdHome = 0.17;
    const usdPublic = 0.45;
    const fluctuation = 0.98 + Math.random() * 0.04;

    if (country === 'us') {
      const usdRate = rates.USD || 1.0;
      gasPrice = usdGas * usdRate * fluctuation;
      homeChargingRate = usdHome * usdRate * fluctuation;
      publicChargingRate = usdPublic * usdRate * fluctuation;
    } else if (country === 'uk') {
      const gbpRate = rates.GBP || 0.78;
      gasPrice = (usdGas * 2.0 * gbpRate) * fluctuation;
      homeChargingRate = (usdHome * 1.8 * gbpRate) * fluctuation;
      publicChargingRate = (usdPublic * 1.6 * gbpRate) * fluctuation;
    } else if (country === 'au') {
      const audRate = rates.AUD || 1.51;
      gasPrice = (usdGas * 1.45 * audRate) * fluctuation;
      homeChargingRate = (usdHome * 1.15 * audRate) * fluctuation;
      publicChargingRate = (usdPublic * 0.95 * audRate) * fluctuation;
    }

    const finalRates = {
      gasPrice: Number(gasPrice.toFixed(2)),
      homeChargingRate: Number(homeChargingRate.toFixed(2)),
      publicChargingRate: Number(publicChargingRate.toFixed(2)),
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          rates: finalRates
        }));
      } catch {
        // Safe context ignoring
      }
    }

    return finalRates;
  } catch (err) {
    console.warn('Fallback to defaults:', err);
    return {
      gasPrice: defaults.defaultGasPrice,
      homeChargingRate: defaults.defaultHomeChargingRate,
      publicChargingRate: defaults.defaultPublicChargingRate,
    };
  }
}

// ----------------------------------------------------
// DEFAULT EXPORT - Next.js App Router dynamic page
// ----------------------------------------------------
interface PageProps {
  params: {
    country: string;
  };
}

const SEO_METADATA_MAP: Record<string, { title: string; description: string }> = {
  us: {
    title: "EV Savings Calculator US | Electric Vehicle Cost Calculator",
    description: "Calculate your dynamic monthly EV savings in the USA. Use our free ev gas savings calculator to compare fuel costs and calculate electric vehicle charging cost instantly!",
  },
  uk: {
    title: "EV Savings Calculator UK | Electric Car Cost Comparison Tool",
    description: "Discover how much you save switching to an electric vehicle in the UK. Track your fuel savings, charging cost, and ev mileage with our UK calculator.",
  },
  au: {
    title: "EV Savings Calculator Australia | Electric Vehicle Fuel Tool",
    description: "Analyze fuel and power cost differentials for EVs in Australia. Calculate your electric vehicle efficiency and charging cost automatically today.",
  }
};

const FAQ_CONTENT_MAP: Record<SelectedCountry, Array<{ question: string; answer: string }>> = {
  us: [
    {
      question: "How to calculate electric vehicle charging cost?",
      answer: "To find your EV charging cost in the US, multiply your vehicle's total battery capacity (kWh) by your local electricity provider's rate per kWh. Our built-in ev savings calculator automates this process for you instantly."
    },
    {
      question: "How to calculate ev charging time?",
      answer: "EV charging time depends on the charger speed. Simply divide your EV battery capacity by the charging station's power output (kW) to see how long it takes to charge from empty to full."
    },
    {
      question: "How to calculate electric vehicle mileage and efficiency?",
      answer: "You can track your electric vehicle mileage by dividing the total miles driven by the total kWh consumed. This data can be evaluated using an ev mpg calculator equivalent to understand your true gas savings."
    }
  ],
  uk: [
    {
      question: "How to calculate electric vehicle charging cost in the UK?",
      answer: "To find your UK EV charging cost, multiply your car's battery capacity (kWh) by your domestic electricity tariff (pence per kWh). Our electric vehicle savings calculator makes this UK fuel comparison easy."
    },
    {
      question: "How to calculate ev charging time?",
      answer: "Charging time is calculated by dividing the battery size (kWh) by the charging rate (kW). A standard home wallbox charger (7kW) will charge a 60kWh electric car battery in approximately 8-9 hours."
    },
    {
      question: "How to calculate electric vehicle mileage and efficiency?",
      answer: "Track your UK ev mileage by checking your miles per kWh. This helps you compare real-world running costs directly against petrol or diesel vehicles to see your total monthly savings."
    }
  ],
  au: [
    {
      question: "How to calculate electric vehicle charging cost in Australia?",
      answer: "Multiply your EV's battery capacity by your electricity rate per kWh (e.g., peak or off-peak cents). Use our free ev savings calculator to instantly see how much cheaper running an EV is compared to internal combustion engines."
    },
    {
      question: "How to calculate ev charging time?",
      answer: "Simply divide the battery capacity (kWh) by the power rating of the charger (kW). For example, a 7kW home charger will take around 10 hours to fully charge a 70kWh battery from empty."
    },
    {
      question: "How to calculate electric vehicle mileage and consumption?",
      answer: "In Australia, electric vehicle efficiency is typically measured in kWh per 100km. You can calculate this by tracking the energy used over your driven distance to see your ongoing savings."
    }
  ]
};

function FAQAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="py-2.5 first:pt-1 last:pb-1 border-b border-slate-100 dark:border-slate-800 last:border-0 shadow-xs dark:shadow-none transition-all duration-300">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2.5 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 hover:text-purple-600 dark:hover:text-purple-400 font-display transition-colors focus:outline-none cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="pr-4">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-slate-400 dark:text-slate-500 shrink-0"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="pb-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-medium">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}

interface LocalizedFAQProps {
  country: SelectedCountry;
}

function LocalizedFAQ({ country }: LocalizedFAQProps) {
  const faqs = FAQ_CONTENT_MAP[country] || FAQ_CONTENT_MAP.us;
  
  return (
    <div id="localized-faq-card" className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-md rounded-3xl p-6 md:p-8 text-slate-800 dark:text-slate-100 relative overflow-hidden flex flex-col shadow-xs dark:shadow-none border border-slate-150 dark:border-slate-800 transition-all duration-300">
      <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-150 dark:border-slate-800 mb-4 font-display">
        <span className="w-6 h-6 rounded-full bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 font-mono font-black text-xs flex items-center justify-center">?</span>
        <div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-slate-900 dark:text-slate-100">Localized FAQ &amp; Regulatory Insights</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Key regulatory and charging FAQs for {country.toUpperCase()}</p>
        </div>
      </div>

      <div className="divide-y divide-slate-150 dark:divide-slate-850">
        {faqs.map((faq, idx) => (
          <FAQAccordionItem key={idx} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}

interface SponsoredAdSlotProps {
  id: string;
  type: 'banner' | 'leaderboard';
}

function SponsoredAdSlot({ id, type }: SponsoredAdSlotProps) {
  const isBanner = type === 'banner';
  
  return (
    <div 
      id={id}
      className={`w-full ${
        isBanner ? 'min-h-[250px] h-[250px]' : 'min-h-[90px] md:min-h-[250px] h-auto md:h-[250px]'
      } overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/10 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center select-none relative transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-700 print:hidden`}
    >
      <div className="absolute top-0 left-0 w-16 h-0.5 bg-slate-200 dark:bg-slate-800" />
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-950 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-850 flex items-center justify-center">
          <Info className="w-3.5 h-3.5" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-display">
          {isBanner ? 'Sponsored Asset Window' : 'Premium Partner Space'}
        </span>
        <span className="text-[9px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-widest block font-bold">
          {isBanner ? 'Standard Banner (300&times;250)' : 'Adaptive Rect/Leaderboard'}
        </span>
      </div>
    </div>
  );
}

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

function LegalModal({ type, onClose }: LegalModalProps) {
  if (!type) return null;
  const isPrivacy = type === 'privacy';

  return (
    <div 
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 md:p-8 border border-slate-150 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300 max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <div className="flex items-center justify-between pb-4 border-b border-slate-150 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-mono font-black text-xs flex items-center justify-center">
              {isPrivacy ? "P" : "T"}
            </span>
            <h3 className="text-sm font-bold tracking-wider uppercase text-slate-900 dark:text-slate-100 font-display">
              {isPrivacy ? "Privacy Policy" : "Terms &amp; Conditions"}
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-150 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all focus:outline-none cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs text-slate-500 dark:text-slate-400 !leading-relaxed font-sans font-medium">
          {isPrivacy ? (
            <>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Your privacy is paramount.</p>
              <p>All parameters are processed entirely on your local machine using client-side JavaScript.</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Projections represent theoretical scenarios.</p>
              <p>Cross-verify with tax experts before making physical purchase decisions.</p>
            </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-150 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:opacity-90 active:scale-95 cursor-pointer"
          >
            Close Agreement
          </button>
        </div>
      </motion.div>
    </div>
  );
}

interface FooterProps {
  onOpenModal: (type: 'privacy' | 'terms') => void;
}

function Footer({ onOpenModal }: FooterProps) {
  return (
    <footer className="w-full mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 dark:text-slate-500 font-sans tracking-widest uppercase transition-colors duration-300 print:hidden">
      <div className="flex items-center gap-1">
        <span>&copy; {new Date().getFullYear()} EV Savings Dashboard</span>
      </div>
      <div className="flex items-center gap-6">
        <button type="button" onClick={() => onOpenModal('privacy')} className="hover:text-blue-500 dark:hover:text-blue-400 font-bold text-slate-400">Privacy Policy</button>
        <button type="button" onClick={() => onOpenModal('terms')} className="hover:text-indigo-500 dark:hover:text-indigo-400 font-bold text-slate-400">Terms &amp; Conditions</button>
      </div>
    </footer>
  );
}

export async function generateMetadata({ params }: any) {
  const resolvedParams = await Promise.resolve(params);
  const country = resolvedParams?.country?.toLowerCase() || 'us';
  const data = SEO_METADATA_MAP[country] || SEO_METADATA_MAP.us;
  return {
    title: data.title,
    description: data.description,
  };
}

export default function CountrySavingsPage({ params }: PageProps) {
  const countryParam = (['us', 'uk', 'au'].includes(params.country?.toLowerCase()) ? params.country.toLowerCase() : 'us') as SelectedCountry;
  const config = COUNTRY_CONFIGS[countryParam];
  const defaultVehicle = VEHICLES[0];

  const [inputs, setInputs] = React.useState<CalculatorInputs>(() => ({
    selectedVehicleId: defaultVehicle.id,
    msrp: defaultVehicle.msrp[countryParam],
    annualDistance: config.defaultAnnualDistance,
    fuelEfficiency: defaultVehicle.petrolEfficiency[countryParam],
    gasPrice: config.defaultGasPrice,
    chargingHomeRatio: 80,
    chargingPublicRatio: 20,
    homeChargingRate: config.defaultHomeChargingRate,
    publicChargingRate: config.defaultPublicChargingRate,
    evEfficiency: defaultVehicle.evEfficiency[countryParam],
    taxBracket: config.defaultTaxBracket,
    monthlyGrossLease: config.defaultMonthlyGrossLease,
    annualIncome: config.defaultAnnualIncome,
    downPayment: config.defaultDownPayment,
    loanTerm: config.defaultLoanTerm,
    interestRate: config.defaultInterestRate,
  }));

  const [isLiveRatesUpdated, setIsLiveRatesUpdated] = React.useState(false);
  const [isRatesLoading, setIsRatesLoading] = React.useState(false);
  const [activeModal, setActiveModal] = React.useState<'privacy' | 'terms' | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [showCopyToast, setShowCopyToast] = React.useState(false);

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2500);
    }).catch(err => console.error(err));
  };

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    window.print();
  };

  React.useEffect(() => {
    if (activeModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [activeModal]);

  React.useEffect(() => {
    let active = true;
    async function populateRates() {
      setIsRatesLoading(true);
      const rates = await fetchLiveRates(countryParam);
      if (active) {
        setInputs(prev => ({
          ...prev,
          gasPrice: rates.gasPrice,
          homeChargingRate: rates.homeChargingRate,
          publicChargingRate: rates.publicChargingRate,
        }));
        setIsLiveRatesUpdated(true);
        setIsRatesLoading(false);
      }
    }
    populateRates();
    return () => { active = false; };
  }, [countryParam]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const data = SEO_METADATA_MAP[countryParam] || SEO_METADATA_MAP.us;
    document.title = data.title;
  }, [countryParam]);

  const results = calculateEVValues(inputs, countryParam);
  const i18n = getI18n(countryParam);
  const currencyPrefixPaddingClass = results.currencySymbol.length > 1 ? 'pl-20' : 'pl-12';

  const handleVehicleChange = (vehicleId: string, customName?: string) => {
    const v = VEHICLES.find(vehicle => vehicle.id === vehicleId) || defaultVehicle;
    setInputs(prev => ({
      ...prev,
      selectedVehicleId: vehicleId,
      customVehicleName: customName,
      msrp: vehicleId === 'custom' ? 0 : v.msrp[countryParam],
      evEfficiency: vehicleId === 'custom' ? 0 : v.evEfficiency[countryParam],
      fuelEfficiency: vehicleId === 'custom' ? 0 : v.petrolEfficiency[countryParam],
    }));
  };

  const updateNumberField = (field: keyof CalculatorInputs, rawValue: string) => {
    let value = 0;
    if (rawValue !== '') {
      const parsed = parseFloat(rawValue);
      value = isNaN(parsed) ? 0 : parsed;
    }
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div id="country-page" className="space-y-8">
      <div className="hidden print:block mb-10 pb-6 border-b-2 border-slate-350 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 font-display uppercase">EV Savings Financial Report</h1>
      </div>

      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 print:hidden">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
            EV Savings Dashboard <span className="text-blue-600 dark:text-blue-400">/ {countryParam.toUpperCase()}</span>
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button type="button" onClick={handlePrint} className="flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-2xl text-xs font-bold uppercase">
            <FileText className="w-4 h-4" /> Download Report
          </button>
          <button type="button" onClick={handleShare} className="flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-2xl text-xs font-bold uppercase">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Interactive Column */}
        <div id="left-column-container" className="space-y-6 print:hidden">
          
          {/* STEP 1 */}
          <div id="step-1-card" className="bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-150 dark:border-slate-800 relative">
            <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400" />
            <div className="flex items-center gap-3.5 pb-4 border-b mb-6">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</span>
              <h3 className="text-sm font-bold uppercase">Vehicle Selection</h3>
            </div>
            <SearchableVehicleDropdown
              selectedVehicleId={inputs.selectedVehicleId}
              onVehicleChange={handleVehicleChange}
              vehicles={VEHICLES}
              currencySymbol={results.currencySymbol}
              country={countryParam}
              currentMsrp={inputs.msrp}
              customVehicleName={inputs.customVehicleName}
              onOpenChange={setIsDropdownOpen}
            />
            {inputs.selectedVehicleId === 'custom' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">Price ({results.currencySymbol})</label>
                  <input type="number" value={inputs.msrp || ''} onChange={(e) => updateNumberField('msrp', e.target.value)} className="w-full p-2 border rounded-xl bg-white text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">EV Efficiency ({results.evEfficiencyUnits})</label>
                  <input type="number" step="0.1" value={inputs.evEfficiency || ''} onChange={(e) => updateNumberField('evEfficiency', e.target.value)} className="w-full p-2 border rounded-xl bg-white text-sm" />
                </div>
              </div>
            )}
          </div>

          {/* STEP 2 */}
          <div id="step-2-card" className="bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-150 dark:border-slate-800 relative">
            <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-400" />
            <div className="flex items-center gap-3.5 pb-4 border-b mb-6">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold">2</span>
              <h3 className="text-sm font-bold uppercase">Financing Parameters</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase">Down Payment</label>
                <input type="number" value={inputs.downPayment || ''} onChange={(e) => updateNumberField('downPayment', e.target.value)} className="w-full p-3 border rounded-2xl bg-slate-50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase">Interest Rate (% APR)</label>
                <input type="number" step="0.1" value={inputs.interestRate || ''} onChange={(e) => updateNumberField('interestRate', e.target.value)} className="w-full p-3 border rounded-2xl bg-slate-50" />
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div id="step-3-card" className="bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-150 dark:border-slate-800 relative">
            <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500" />
            <div className="flex items-center gap-3.5 pb-4 border-b mb-6">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">3</span>
              <h3 className="text-sm font-bold uppercase">Operational Tariffs</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase flex justify-between">
                  <span>Annual Distance</span>
                  <span>{inputs.annualDistance.toLocaleString()} {results.distanceUnits}</span>
                </label>
                <input type="range" min="2500" max="60000" step="2500" value={inputs.annualDistance} onChange={(e) => updateNumberField('annualDistance', e.target.value)} className="w-full accent-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase">{i18n.petrol} Price</label>
                  <input type="number" step="0.01" value={inputs.gasPrice || ''} onChange={(e) => updateNumberField('gasPrice', e.target.value)} className="w-full p-2 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase">Home Charge Rate/kWh</label>
                  <input type="number" step="0.01" value={inputs.homeChargingRate || ''} onChange={(e) => updateNumberField('homeChargingRate', e.target.value)} className="w-full p-2 border rounded-xl bg-slate-50" />
                </div>
              </div>
            </div>
          </div>

          <LocalizedFAQ country={countryParam} />
          <SponsoredAdSlot id="ad-slot-left-column" type="banner" />
        </div>

        {/* Right Output Preview Column */}
        <div id="right-column-container" className="lg:sticky lg:top-24">
          <RightColumn inputs={inputs} country={countryParam} />
        </div>
      </div>

      <Footer onOpenModal={setActiveModal} />
      <LegalModal type={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
