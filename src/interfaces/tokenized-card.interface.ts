export interface TokenizedCard {
  tokenizedCardId: {
    value: number;
    show: boolean;
    label: string;
    formattedValue: string;
  };
  maskedCreditCardNumber: {
    value: string;
    show: boolean;
    label: string;
    formattedValue: string;
  };
  cardBrand: {
    value: string;
    show: boolean;
    label: string;
    formattedValue: string;
  };
  expirationMonth: {
    value: number;
    show: boolean;
    label: string;
    formattedValue: string;
  };
  expirationYear: {
    value: number;
    show: boolean;
    label: string;
    formattedValue: string;
  };
  extraValidationRequired: {
    value: boolean;
    show: boolean;
    label: string;
    formattedValue: boolean;
  };
  cardLabel: {
    label: string;
    value: string;
    formattedValue: string;
    show: boolean;
  };
}
