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
  agence: string;
  carte?: any;
  codePromo: string;
  country: string;
  createdAt: number;
  discussionId?: any;
  id: string;
  manager?: any;
  managerFile?: any;
  receiverName: string;
  sender: string;
  senderFile?: any;
  status: string;
  sum: number;
  telephone: string;
  transactionId: string;
  updatedAt: number;
};
