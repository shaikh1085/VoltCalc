export interface CalculatorInputs {
  msrp: number;                     // Vehicle MSRP
  annualDistance: number;          // Annual total travel distance (km in AU, miles in UK/US)
  fuelEfficiency: number;          // Petrol car fuel efficiency (L/100km in AU, MPG in UK/US)
  gasPrice: number;                // Gas/Petrol price per Liter (in $ or £)
  chargingHomeRatio: number;       // % Home charging (0 - 100)
  chargingPublicRatio: number;     // % Public charging (0 - 100)
  homeChargingRate: number;        // Cost per kWh for home electricity (in $ or £)
  publicChargingRate: number;      // Cost per kWh for public charging (in $ or £)
  evEfficiency: number;            // EV efficiency (kWh/100km in AU, miles/kWh in UK/US)
  
  // UK specific inputs
  taxBracket: number;              // Tax rate bracket for UK/US (e.g. 0.20, 0.40, 0.45)
  monthlyGrossLease: number;       // Gross monthly price under lease
  
  // New features: Vehicle ID and Step 2 financing inputs
  selectedVehicleId: string;
  annualIncome: number;
  downPayment: number;
  loanTerm: number;                // Loan Term in years (e.g. 3, 4, 5, 6)
  interestRate: number;            // Interest Rate in percentage (e.g. 6.5)
  customVehicleName?: string;
}

export type SelectedCountry = 'au' | 'uk' | 'us';

export interface CalculatorResults {
  country: SelectedCountry;
  currencySymbol: string;
  distanceUnits: string;           // km or miles
  efficiencyUnits: string;         // L/100km or MPG
  evEfficiencyUnits: string;       // kWh/100km or miles/kWh
  monthlyDistance: number;
  
  // Bound inputs for convenience
  msrp: number;
  taxBracket: number;
  monthlyGrossLease: number;
  
  // Fuel & Charging cost results
  petrolLitersUsed: number;        // per month
  monthlyPetrolCost: number;
  
  evTotalKwhUsed: number;          // per month
  monthlyHomeChargingCost: number;
  monthlyPublicChargingCost: number;
  monthlyTotalChargingCost: number;
  
  // Savings
  monthlyBaseSavings: number;
  yearlyBaseSavings: number;
  fiveYearBaseSavings: number;
  
  // AU specific regulatory results
  hasLct: boolean;
  lctThreshold: number;
  taxableLctValue: number;
  lctPaid: number;                 // One-off luxury car tax
  
  // UK specific salary sacrifice results
  nicSavingRate: number;           // National Insurance saving rate (e.g., 0.08 or 0.02)
  totalTaxSavingRate: number;      // Income Tax + NIC
  monthlyLeaseSourcingSaving: number; // Gross salary sacrifice savings
  monthlyBikTax: number;           // Benefit-in-kind monthly tax
  monthlyNetSalarySacrificeLease: number; // True net salary sacrifice cost per month
  salarySacrificeNetBenefit: number;      // Overall net benefit/savings combining fuel + tax

  // US specific clean vehicle & financing results
  hasFederalCredit: boolean;
  federalCreditAmount: number;
  monthlyFinancePayment: number;
  loanPrincipal: number;
}
