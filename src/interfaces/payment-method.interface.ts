export interface PaymentMethod {
  paymentMethodName: string;
  label: string;
  description?: Description;
  url?: string;
  type?: string;
  show?: boolean;
  weight?: string;
}

export interface Description {
  label: string;
  show: boolean;
  validForPurchase?: boolean;
  formattedValue?: string;
}
