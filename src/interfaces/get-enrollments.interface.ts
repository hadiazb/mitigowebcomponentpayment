export interface GetEnrollmentsApiResponse {
  data: {
    noData?: {
      value: string;
    };
    enrollments: Array<{
      amount: {
        show: boolean
        formattedValue: any
        label: string
        value: any
      }
      offerName: {
        show: boolean
        formattedValue: any
        label: string
        value: any
      }
      cardType: {
        show: boolean
        formattedValue: string
        label: string
        value: string
      }
      frequency: {
        show: boolean
        formattedValue: any
        label: string
        value: any
      }
      cardExpirationDate: {
        show: boolean
        formattedValue: string
        label: string
        value: string
      }
      offerId: {
        show: boolean
        formattedValue: any
        label: string
        value: any
      }
      paymentMethod: {
        show: boolean
        formattedValue: string
        label: string
        value: string
      }
      id: {
        show: boolean
        formattedValue: string
        label: string
        value: string
      }
      maskedCreditCardNumber: {
        show: boolean
        formattedValue: string
        label: string
        value: string
      }
      nextPayment: {
        show: boolean
        formattedValue: any
        label: string
        value: any
      }
      msisdn: {
        show: boolean
        formattedValue: string
        label: string
        value: string
      }
      email: {
        show: boolean
        formattedValue: string
        label: string
        value: string
      }
      expirationDate: {
        show: boolean
        formattedValue: any
        label: string
        value: any
      }
      customerName: {
        show: boolean
        formattedValue: any
        label: string
        value: any
      }
    }>
  };
  config: {
    title: {
      value: string;
      show: boolean;
    };
    description: string;
    footer: string;
    message: string;
    actions: {
      addEnrollment?: {
        label: string;
        show: boolean;
        type: string;
        url: string;
      };
      delete?: {
        label: string;
        show: boolean;
        type: string;
        url: string;
      };
      editEnrollment?: {
        label: string;
        show: boolean;
        type: string;
        url: string;
      };
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
