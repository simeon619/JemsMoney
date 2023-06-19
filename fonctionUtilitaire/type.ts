import { accountSchema } from "../store/transaction/transactionSlice";

type Agence = {
  agenceCharge: number;
  agenceIcon: string;
  agenceId: string;
  agenceMangerName: string;
  agenceName: string;
  agenceNumber: string;
};

type Country = {
  countryAgencies: string[];
  countryAllowCarte: boolean;
  countryIcon: string;
  countryId: string;
  countryName: string;
};

export type TransactionServer = {
  manager: accountSchema;
  senderAccount?: accountSchema;
  id?: string;
  discussionId: string;
  agenceReceiver: string;
  agenceSender: string;
  receiverName: string;
  senderFile: any;
  managerFile: any;
  country: string;
  telephone: string;
  carte: string;
  codePromo: string;
  createdAt: number;
  updatedAt: number;
  sent: { value: number; currency: string };
  received: { value: number; currency: string };
  status: "start" | "run" | "end" | "cancel" | "full" | "";
};
export type CountryAPISchema = {
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: { official: string; common: string };
    };
  };
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: string;
  cioc: string;
  independent: boolean;
  status: string;
  unMember: boolean;
  currencies: {
    [key: string]: { name: string; symbol: string };
  };
  idd: { root: string; suffixes: string[] };
  capital: string[];
  altSpellings: string[];
  region: string;
  subregion: string;
  languages: { [key: string]: string };
  translations: {
    [key: string]: { official: string; common: string };
  };
  latlng: number[];
  landlocked: boolean;
  borders: string[];
  area: number;
  demonyms: {
    [key: string]: { f: string; m: string };
  };
  flag: string;
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  population: number;
  gini: { [key: string]: number };
  fifa: string;
  car: { signs: string[]; side: string };
  timezones: string[];
  continents: string[];
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  coatOfArms: {
    png: string;
    svg: string;
  };
  startOfWeek: string;
  capitalInfo: {
    latlng: number[];
  };
  postalCode: {
    format: string;
    regex: string;
  };
};
type Agency = {
  charge: number;
  icon: string;
  managerName: string;
  name: string;
  number: string;
};

export type CountryDataServerSchema = {
  agencies: Agency[];
  allowCarte: boolean;
  currency: string;
  digit: string;
  icon: string;
  indicatif: string;
  name: string;
};
