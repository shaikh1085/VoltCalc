import { SelectedCountry } from '../types';

export interface Vehicle {
  id: string;
  name: string;
  msrp: Record<SelectedCountry, number>;
  evEfficiency: Record<SelectedCountry, number>; // kWh/100km in AU, miles/kWh in US & UK
  petrolEfficiency: Record<SelectedCountry, number>; // L/100km in AU, MPG in US & UK
}

export const VEHICLES: Vehicle[] = [
  {
    id: 'tesla-3',
    name: 'Tesla Model 3',
    msrp: {
      us: 38990,
      uk: 39990,
      au: 61900,
    },
    evEfficiency: {
      us: 3.8, // miles/kWh
      uk: 3.8, // miles/kWh
      au: 14.8, // kWh/100km
    },
    petrolEfficiency: {
      us: 32, // MPG
      uk: 45, // MPG
      au: 7.2, // L/100km
    },
  },
  {
    id: 'tesla-y',
    name: 'Tesla Model Y',
    msrp: {
      us: 44990,
      uk: 44990,
      au: 65900,
    },
    evEfficiency: {
      us: 3.4,
      uk: 3.4,
      au: 16.5,
    },
    petrolEfficiency: {
      us: 28,
      uk: 38,
      au: 8.5,
    },
  },
  {
    id: 'tesla-s',
    name: 'Tesla Model S',
    msrp: {
      us: 74990,
      uk: 79990,
      au: 124900,
    },
    evEfficiency: {
      us: 3.5,
      uk: 3.5,
      au: 16.0,
    },
    petrolEfficiency: {
      us: 25,
      uk: 34,
      au: 9.8,
    },
  },
  {
    id: 'tesla-x',
    name: 'Tesla Model X',
    msrp: {
      us: 79990,
      uk: 89990,
      au: 139900,
    },
    evEfficiency: {
      us: 3.0,
      uk: 3.0,
      au: 19.1,
    },
    petrolEfficiency: {
      us: 20,
      uk: 28,
      au: 11.5,
    },
  },
  {
    id: 'byd-atto3',
    name: 'BYD Atto 3',
    msrp: {
      us: 35000,
      uk: 37990,
      au: 48990,
    },
    evEfficiency: {
      us: 3.5,
      uk: 3.5,
      au: 16.0,
    },
    petrolEfficiency: {
      us: 30,
      uk: 42,
      au: 7.5,
    },
  },
  {
    id: 'byd-dolphin',
    name: 'BYD Dolphin',
    msrp: {
      us: 29000,
      uk: 30190,
      au: 38890,
    },
    evEfficiency: {
      us: 3.7,
      uk: 3.7,
      au: 15.2,
    },
    petrolEfficiency: {
      us: 34,
      uk: 46,
      au: 6.8,
    },
  },
  {
    id: 'byd-seal',
    name: 'BYD Seal',
    msrp: {
      us: 42000,
      uk: 45690,
      au: 58790,
    },
    evEfficiency: {
      us: 3.6,
      uk: 3.6,
      au: 15.8,
    },
    petrolEfficiency: {
      us: 28,
      uk: 38,
      au: 8.5,
    },
  },
  {
    id: 'hyundai-ioniq5',
    name: 'Hyundai Ioniq 5',
    msrp: {
      us: 41800,
      uk: 43400,
      au: 64500,
    },
    evEfficiency: {
      us: 3.3,
      uk: 3.3,
      au: 17.0,
    },
    petrolEfficiency: {
      us: 26,
      uk: 35,
      au: 9.0,
    },
  },
  {
    id: 'hyundai-ioniq6',
    name: 'Hyundai Ioniq 6',
    msrp: {
      us: 42450,
      uk: 46740,
      au: 74000,
    },
    evEfficiency: {
      us: 3.9,
      uk: 3.9,
      au: 13.9,
    },
    petrolEfficiency: {
      us: 30,
      uk: 40,
      au: 7.8,
    },
  },
  {
    id: 'hyundai-kona',
    name: 'Hyundai Kona Electric',
    msrp: {
      us: 32675,
      uk: 34995,
      au: 54000,
    },
    evEfficiency: {
      us: 3.5,
      uk: 3.5,
      au: 15.0,
    },
    petrolEfficiency: {
      us: 30,
      uk: 42,
      au: 7.2,
    },
  },
  {
    id: 'kia-ev6',
    name: 'Kia EV6',
    msrp: {
      us: 42600,
      uk: 45245,
      au: 72500,
    },
    evEfficiency: {
      us: 3.2,
      uk: 3.2,
      au: 18.0,
    },
    petrolEfficiency: {
      us: 27,
      uk: 36,
      au: 8.8,
    },
  },
  {
    id: 'kia-ev9',
    name: 'Kia EV9',
    msrp: {
      us: 54900,
      uk: 65000,
      au: 97000,
    },
    evEfficiency: {
      us: 2.6,
      uk: 2.6,
      au: 22.3,
    },
    petrolEfficiency: {
      us: 19,
      uk: 26,
      au: 12.0,
    },
  },
  {
    id: 'kia-niro',
    name: 'Kia Niro EV',
    msrp: {
      us: 39600,
      uk: 37300,
      au: 66500,
    },
    evEfficiency: {
      us: 3.4,
      uk: 3.4,
      au: 16.2,
    },
    petrolEfficiency: {
      us: 29,
      uk: 41,
      au: 7.6,
    },
  },
  {
    id: 'vw-id3',
    name: 'Volkswagen ID.3',
    msrp: {
      us: 34000,
      uk: 35700,
      au: 59900,
    },
    evEfficiency: {
      us: 3.5,
      uk: 3.5,
      au: 15.5,
    },
    petrolEfficiency: {
      us: 31,
      uk: 44,
      au: 7.0,
    },
  },
  {
    id: 'vw-id4',
    name: 'Volkswagen ID.4',
    msrp: {
      us: 39735,
      uk: 42340,
      au: 75900,
    },
    evEfficiency: {
      us: 3.1,
      uk: 3.1,
      au: 18.5,
    },
    petrolEfficiency: {
      us: 28,
      uk: 38,
      au: 8.2,
    },
  },
  {
    id: 'vw-idbuzz',
    name: 'Volkswagen ID. Buzz',
    msrp: {
      us: 59995,
      uk: 59000,
      au: 89900,
    },
    evEfficiency: {
      us: 2.8,
      uk: 2.8,
      au: 20.5,
    },
    petrolEfficiency: {
      us: 20,
      uk: 29,
      au: 11.0,
    },
  },
  {
    id: 'mg-mg4',
    name: 'MG MG4 EV',
    msrp: {
      us: 28000,
      uk: 26995,
      au: 39990,
    },
    evEfficiency: {
      us: 3.6,
      uk: 3.6,
      au: 15.5,
    },
    petrolEfficiency: {
      us: 33,
      uk: 46,
      au: 7.0,
    },
  },
  {
    id: 'mg-zs-ev',
    name: 'MG ZS EV',
    msrp: {
      us: 31000,
      uk: 30495,
      au: 41990,
    },
    evEfficiency: {
      us: 3.2,
      uk: 3.2,
      au: 17.8,
    },
    petrolEfficiency: {
      us: 28,
      uk: 39,
      au: 8.0,
    },
  },
  {
    id: 'bmw-i4',
    name: 'BMW i4',
    msrp: {
      us: 52200,
      uk: 50400,
      au: 85900,
    },
    evEfficiency: {
      us: 3.4,
      uk: 3.4,
      au: 16.8,
    },
    petrolEfficiency: {
      us: 25,
      uk: 34,
      au: 9.5,
    },
  },
  {
    id: 'bmw-ix3',
    name: 'BMW iX3',
    msrp: {
      us: 65000,
      uk: 64100,
      au: 104900,
    },
    evEfficiency: {
      us: 3.1,
      uk: 3.1,
      au: 18.9,
    },
    petrolEfficiency: {
      us: 22,
      uk: 31,
      au: 10.2,
    },
  },
  {
    id: 'skoda-enyaq',
    name: 'Skoda Enyaq iV',
    msrp: {
      us: 44000,
      uk: 38970,
      au: 69990,
    },
    evEfficiency: {
      us: 3.3,
      uk: 3.3,
      au: 17.2,
    },
    petrolEfficiency: {
      us: 28,
      uk: 39,
      au: 8.4,
    },
  },
  {
    id: 'skoda-elroq',
    name: 'Skoda Elroq',
    msrp: {
      us: 38500,
      uk: 31500,
      au: 55000,
    },
    evEfficiency: {
      us: 3.6,
      uk: 3.6,
      au: 15.8,
    },
    petrolEfficiency: {
      us: 32,
      uk: 44,
      au: 7.2,
    },
  },
  {
    id: 'audi-q4',
    name: 'Audi Q4 e-tron',
    msrp: {
      us: 49800,
      uk: 50600,
      au: 88300,
    },
    evEfficiency: {
      us: 3.2,
      uk: 3.2,
      au: 17.5,
    },
    petrolEfficiency: {
      us: 26,
      uk: 35,
      au: 9.0,
    },
  },
  {
    id: 'porsche-taycan',
    name: 'Porsche Taycan',
    msrp: {
      us: 99400,
      uk: 86500,
      au: 175900,
    },
    evEfficiency: {
      us: 3.1,
      uk: 3.1,
      au: 19.5,
    },
    petrolEfficiency: {
      us: 22,
      uk: 30,
      au: 11.0,
    },
  },
  {
    id: 'polestar-2',
    name: 'Polestar 2',
    msrp: {
      us: 49900,
      uk: 48900,
      au: 67400,
    },
    evEfficiency: {
      us: 3.4,
      uk: 3.4,
      au: 16.2,
    },
    petrolEfficiency: {
      us: 27,
      uk: 37,
      au: 8.6,
    },
  },
  {
    id: 'nissan-leaf',
    name: 'Nissan Leaf',
    msrp: {
      us: 28140,
      uk: 28495,
      au: 50990,
    },
    evEfficiency: {
      us: 3.5,
      uk: 3.5,
      au: 16.0,
    },
    petrolEfficiency: {
      us: 34,
      uk: 48,
      au: 6.8,
    },
  },
  {
    id: 'custom',
    name: 'Custom (User Configured)',
    msrp: {
      us: 40000,
      uk: 40000,
      au: 70000,
    },
    evEfficiency: {
      us: 3.5,
      uk: 3.5,
      au: 16.0,
    },
    petrolEfficiency: {
      us: 30,
      uk: 40,
      au: 8.0,
    },
  },
];

export interface CountryConfig {
  currencySymbol: string;
  distanceUnits: string;
  efficiencyUnits: string;
  evEfficiencyUnits: string;
  defaultAnnualDistance: number;
  defaultGasPrice: number; // For Petrol vehicle comparison. Litre basis.
  defaultHomeChargingRate: number; // per kWh
  defaultPublicChargingRate: number; // per kWh
  defaultTaxBracket: number;
  defaultMonthlyGrossLease: number;
  defaultAnnualIncome: number;
  defaultDownPayment: number;
  defaultLoanTerm: number; // in years
  defaultInterestRate: number; // in percentage, e.g. 6.5
}

export const COUNTRY_CONFIGS: Record<SelectedCountry, CountryConfig> = {
  us: {
    currencySymbol: '$',
    distanceUnits: 'miles',
    efficiencyUnits: 'MPG',
    evEfficiencyUnits: 'miles/kWh',
    defaultAnnualDistance: 12000,
  // Line 551 ko badal kar ye kar dein:
defaultGasPrice: 3.60, // Ab ye direct Price Per Gallon ban gaya hai
    defaultHomeChargingRate: 0.17,
    defaultPublicChargingRate: 0.45,
    defaultTaxBracket: 0.22,
    defaultMonthlyGrossLease: 550,
    defaultAnnualIncome: 85000,
    defaultDownPayment: 5000,
    defaultLoanTerm: 5,
    defaultInterestRate: 6.5,
  },
  uk: {
    currencySymbol: '£',
    distanceUnits: 'miles',
    efficiencyUnits: 'MPG',
    evEfficiencyUnits: 'miles/kWh',
    defaultAnnualDistance: 10000,
    defaultGasPrice: 1.45, // £1.45/L
    defaultHomeChargingRate: 0.24,
    defaultPublicChargingRate: 0.58,
    defaultTaxBracket: 0.40,
    defaultMonthlyGrossLease: 550,
    defaultAnnualIncome: 55000,
    defaultDownPayment: 4500,
    defaultLoanTerm: 4,
    defaultInterestRate: 5.9,
  },
  au: {
    currencySymbol: 'AU$',
    distanceUnits: 'km',
    efficiencyUnits: 'L/100km',
    evEfficiencyUnits: 'kWh/100km',
    defaultAnnualDistance: 15000,
    defaultGasPrice: 2.10, // AU$2.10/L
    defaultHomeChargingRate: 0.30,
    defaultPublicChargingRate: 0.65,
    defaultTaxBracket: 0.30,
    defaultMonthlyGrossLease: 850,
    defaultAnnualIncome: 95000,
    defaultDownPayment: 8000,
    defaultLoanTerm: 5,
    defaultInterestRate: 7.2,
  },
};
