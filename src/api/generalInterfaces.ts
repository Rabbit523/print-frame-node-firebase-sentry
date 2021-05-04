export interface IContext {}

export enum orderStatus {
  started = 'started',
  completed = 'completed',
  cancelled = 'cancelled',
  refunded = 'refunded',
  paymentFailed = 'paymentFailed',
  pendingShipment = 'pendingShipment',
}

export enum userRoles {
  superAdmin = 4,
  admin = 3,
  user = 2,
}

export const statesArray = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DC',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];

export interface IAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone?: string;
  email?: string;
}

export interface IParcel {
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface IShipment {
  to_address: string;
  from_address: string;
  parcel: string;
}

export interface IAcceptPaymentConfig {
  token: string;
  invoiceNumber: string;
  generalProductDescription: string;
  taxAmount: number;
  taxName: string;
  taxDescription: string;
  shippingAmount: number;
  shippingService: string;
  shippingDescription?: string;
  billingAddress: IAddress;
  shippingAddress: IAddress;
  customerMessage?: string;
  items: [IItem];
  total: number;
  email: string;
}

export interface IItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

export interface UserUpdate {
  id: string;
  shippingAddress: IAddress;
  bilingAddress: IAddress;
}
