export interface PostOrderDetailApiResponse {
  data: {
    offerId: {
      label: string;
      show: boolean;
      value: number;
      formattedValue: string;
    };
    accountNumber: {
      show: boolean;
      label: string;
      value: string;
      formattedValue: string;
    };
    offerName: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    description: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    categoryName: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    validity: {
      label: string;
      show: boolean;
      value: number;
      formattedValue: string;
    };
    nextPayment?: {
      label: string;
      show: boolean;
      value: number;
      formattedValue: string;
    };
    frequency?: {
      label: string;
      show: boolean;
      value: number;
      formattedValue: string;
    };
    amount: {
      label: string;
      show: boolean;
      value: number;
      formattedValue: string;
    };
    purchaseOrderId: {
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
    paymentMethod: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    wallet: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    pinless: {
      value: boolean;
    };
    redirectUrl: {
      label: string;
      value: string;
      formattedValue: string;
      show: boolean;
    };
  };
  config: {
    title: {
      value: string;
      show: boolean;
    };
    description: string;
    footer: string;
    isValidTigoMoneyAccount: boolean;
    confirmation: {
      otpTemplateId: string;
      confirmationTitle: {
        label: string;
        show: boolean;
      };
      orderDetailsTitle: {
        label: string;
        show: boolean;
      };
      paymentMethodsTitle: {
        label: string;
        show: boolean;
      };
      invoiceDetails: {
        label: string;
        show: boolean;
      };
      actions: {
        fulldescription: {
          label: string;
          show: boolean;
          type: string;
          url: string;
        };
        change: {
          label: string;
          show: boolean;
          type: string;
          url: string;
        };
        changeInvoiceDetails: {
          label: string;
          show: boolean;
          type: string;
          url: string;
        };
        cancel: {
          label: string;
          show: boolean;
          type: string;
          url: string;
        };
        purchase: {
          label: string;
          show: boolean;
          type: string;
          url: string;
        };
        termsOfServices: {
          label: string;
          show: boolean;
          type: string;
          url: string;
        };
      };
    };
    params: {
      fingerPrint: {
        link: string;
        integrate: string;
      };
      purchaseorderId: string;
    };
    cards: {
      tokenizedCards: Array<{
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
      }>;
    };
    forms: {
      newCardForm?: {
        description: {
          show: boolean;
          label: string;
          details: string;
          value: string;
        };
        identificationType: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          options: Array<{
            value: string;
            label: string;
          }>;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          defaultValue: string;
        };
        identificationNumber: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          defaultValue: string;
        };
        nameCard: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          value: string;
        };
        numberCard: {
          show: boolean;
          validations: {
            allowedCreditCards: Array<string>;
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          label: string;
          placeholder: string;
          type: string;
          format: string;
          value: string;
        };
        expirationDateMonth: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          options: Array<{
            value: string;
            label: string;
          }>;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          value: string;
        };
        expirationDateYear: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          options: Array<{
            value: string;
            label: string;
          }>;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          value: string;
        };
        expirationDate: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          value: string;
        };
        numberQuotas: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          options: Array<{
            value: string;
            label: string;
          }>;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          defaultValue: string;
        };
        cvv: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          value: string;
        };
        phone: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          value: string;
        };
        address: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          defaultValue: string;
        };
        email: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          disableOnFormRequired: {
            tokenized: number;
            invoices_autopayments: number;
            invoices: number;
            autopackets: number;
            packets: number;
            topups: number;
          };
          hideHe: number;
          hidePP: number;
          value: string;
        };
        rememberCard: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          value: string;
        };
        country: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          value: string;
        };
        city: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          value: string;
        };
        state: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          value: string;
        };
        postalCode: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          value: string;
        };
        enrollMe: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          hideHe: number;
          hidePP: number;
          hideB2b: number;
          value: string;
        };
      };
      billingDataForm?: {
        fullname: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          value: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
        };
        nit: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          value: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
        };
        identificationNumber: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          value: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
        };
        email: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          value: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
        };
        address: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          value: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
        };
      };
      tigoMoneyForm?: {
        code: {
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          value: string;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
        };
      };
      infoMessage?: {
        description: {
          show: boolean;
          value: string;
        };
        actions: {
          change: {
            label: string;
            show: boolean;
            type: string;
            url: string;
          };
          register: {
            label: string;
            show: boolean;
            type: string;
            url: string;
          };
        };
      };
    };
    actions: {
      submit: {
        label: string;
        show: boolean;
        type: string;
        url: string;
      };
      cancel: {
        label: string;
        show: boolean;
        type: string;
        url: string;
      };
      login: {
        label: string;
        show: boolean;
        type: string;
        url: string;
      };
    };
    termsAndConditions: {
      prefix: string;
      label: string;
      url: string;
      externalUrl: string;
      type: string;
      show: boolean;
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
