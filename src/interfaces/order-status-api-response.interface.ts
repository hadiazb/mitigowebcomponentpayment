export interface OrderStatusApiResponse {
  data: {
    accountId: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    accountNumber: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    productType: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    cardBrand: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    orderId: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    transactionEndDate: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    maskedAccountId: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    transactionId: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    numberReference: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    numberAccess: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    amount: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    stateOrder: {
      label: string;
      show: boolean;
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
    status: {
      stateOrder: string;
    };
    message: {
      title: string;
      body: string;
    };
    options: {
      retries: {
        value: number;
      };
      retryTime: {
        value: number;
      };
    };
    actions: {
      home: {
        label: string;
        show: boolean;
        type: string;
        url: string;
        setupFavorite: boolean;
        externalUrl: string;
        tabClass: string;
      };
      redirect: {
        label: string;
        show: string;
        type: string;
        url: string;
      };
      premium: {
        label: string;
        show: string;
        type: string;
        url: string;
      };
      checkout: {
        label: string;
        show: boolean;
        type: string;
        url: string;
        externalUrl: string;
      };
    };
  };
  meta: {
    id: string;
    idType: string;
    params: {
      targetMsisdn: string;
      _format: string;
    };
    businessUnit: string;
    category: string;
    cache: number;
    expirationCache: string;
  };
}
