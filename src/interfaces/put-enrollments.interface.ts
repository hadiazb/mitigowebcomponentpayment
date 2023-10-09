export interface PutEnrollmentsApiResponse {
  data: {
    invoice: {
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
    enrollment: {
      enrollmentId: {
        label: string;
        show: boolean;
        value: string;
        formattedValue: string;
      };
      cardType: {
        label: string;
        show: boolean;
        value: string;
        formattedValue: string;
      };
      maskedCreditCardNumber: {
        label: string;
        show: boolean;
        value: string;
        formattedValue: string;
      };
      expirationDate: {
        label: string;
        show: boolean;
        value: string;
        formattedValue: string;
        expiredCard: boolean;
      };
      email: {
        label: string;
        show: boolean;
        value: string;
        formattedValue: string;
      };
      customerName: {
        label: string;
        show: boolean;
        value: string;
        formattedValue: string;
      };
    };
  };
  config: {
    title: {
      value: string;
      show: boolean;
    };
    description: {
      title: string;
      body: string;
    };
    footer: string;
    actions: {
      submit: {
        label: string;
        show: boolean;
        type: string;
        url: string;
      };
    };
    status: string;
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
