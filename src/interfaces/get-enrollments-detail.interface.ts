export interface GetEnrollmentsDetailApiResponse {
  data: {
    transactionType: {
      show: boolean;
      label: string;
      value: string;
      formattedValue: string;
    };
    accountNumber: {
      show: boolean;
      label: string;
      value: string;
      formattedValue: string;
    };
    accountToEnroll: {
      show: boolean;
      label: string;
      value: string;
      formattedValue: string;
    };
    invoiceAmount: {
      show: boolean;
      label: string;
      value: string;
      formattedValue: string;
    };
  };
  config: {
    title: {
      value: string;
      show: boolean;
    };
    description: string;
    footer: string;
    note: string;
    actions: {
      paymentMethods: Array<{
        creditCard: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
        };
      }>;
    };
  };
  meta: {
    id: string;
    idType: string;
    params: {
      _format: string;
    };
    businessUnit: string;
    category: string;
    cache: number;
    expirationCache: number;
  };
}
