export interface GetSubscriptionApiResponse {
  config: {
    footer: string
    deleteConfirmation: {
      title: string
      options: {
        confirm: {
          show: boolean
          label: string
          type: string
          class: string
        }
        cancel: {
          show: boolean
          label: string
          type: string
          class: string
        }
      }
      description: string
    }
    description: string
    title: {
      show: boolean
      value: string
    }
    allowedPaymentMethods: Array<{
      creditCard: {
        show: boolean
        paymentMethodName: string
        label: string
        type: string
        url: string
      }
    }>
    actions: {
      add: {
        show: boolean
        type: string
        label: string
      }
      delete: {
        show: boolean
        label: string
        type: string
        class: string
      }
    }
    paymentMethodsTitle: {
      description: string
      label: string
    }
  }
  data: {
    noData?: {
      value: string;
    };
    subscriptionAccounts: Array<{
      expirationYear: {
        show: boolean
        formattedValue: number
        label: string
        value: number
      }
      cardLabel: {
        show: boolean
        formattedValue: string
        label: string
        value: string
      }
      expirationMonth: {
        show: boolean
        formattedValue: number
        label: string
        value: number
      }
      tokenizedCardId: {
        show: boolean
        formattedValue: number
        label: string
        value: number
      }
      maskedCreditCardNumber: {
        show: boolean
        formattedValue: string
        label: string
        value: string
      }
      cardBrand: {
        show: boolean
        formattedValue: string
        label: string
        value: string
      }
      extraValidationRequired: {
        show: boolean
        formattedValue: boolean
        label: string
        value: boolean
      }
    }>
  }
  meta: {
    cache: number
    id: string
    idType: string
    params: {
      _format: string
      businessUnit: string
    }
    category: string
    expirationCache: number
  }
}
