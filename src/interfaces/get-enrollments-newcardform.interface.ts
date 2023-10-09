export interface GetEnrollmentsNewCardFormApiResponse {
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
    actions: {
      initSubmit: {
        label: string;
        show: boolean;
        type: string;
        url: string;
      };
      initCancel: {
        label: string;
        show: boolean;
        type: string;
        url: string;
      };
      summarySubmit: {
        label: string;
        show: boolean;
        type: string;
        url: string;
      };
      summaryCancel: {
        label: string;
        show: boolean;
        type: string;
        url: string;
      };
    };
    forms: {
      newCardForm: {
        description: {
          show: boolean;
          label: string;
          details: string;
          value: string;
        };
        identificationType: {
            defaultValue: string;  
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          options: Array<{
            value: string;
            label: boolean;
          }>;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          value: string;
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
          value: string;
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
            label: boolean;
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
            label: boolean;
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
          defaultValue: string;
          show: boolean;
          label: string;
          placeholder: string;
          type: string;
          format: string;
          options: Array<{
            value: string;
            label: boolean;
          }>;
          validations: {
            required: boolean;
            minLength: string;
            maxLength: string;
          };
          value: string;
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
          value: string;
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
    };
    summary: {
      title: {
        value: string;
        show: boolean;
      };
      description: string;
      note: string;
      footer: string;
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
      _format: string;
    };
    businessUnit: string;
    category: string;
    cache: number;
    expirationCache: number;
  };
}
