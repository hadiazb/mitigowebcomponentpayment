export interface PostSubscriptionApiResponse {
  config: {
    description: string;
    title: {
      show: boolean;
      value: string;
    };
    footer: string;
    actions: {
      accept: {
        show: boolean;
        type: string;
        label: string;
      };
    };
    forms: {
      newCardForm: {
        rememberCard: {
          show: boolean;
          format: string;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
        country: {
          show: boolean;
          format: string;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
        cvv: {
          show: boolean;
          format: string;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
        address: {
          show: boolean;
          format: string;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
        city: {
          show: boolean;
          format: string;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
        postalCode: {
          show: boolean;
          format: string;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
        numberQuotas: {
          show: boolean;
          format: string;
          options: Array<{
            value: string;
            label: string;
          }>;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
        description: {
          show: boolean;
          value: string;
          label: string;
        };
        identificationType: {
          show: boolean;
          format: string;
          options: Array<{
            value: string;
            label: boolean;
          }>;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
        expirationDateMonth: {
          show: boolean;
          format: string;
          options: Array<{
            value: string;
            label: boolean;
          }>;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
        numberCard: {
          show: boolean;
          format: string;
          validations: {
            allowedCreditCards: Array<string>;
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          label: string;
          placeholder: string;
          type: string;
          value: string;
        };
        expirationDateYear: {
          show: boolean;
          format: string;
          options: Array<{
            value: string;
            label: boolean;
          }>;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
        phone: {
          show: boolean;
          format: string;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
        nameCard: {
          show: boolean;
          format: string;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
        identificationNumber: {
          show: boolean;
          format: string;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
        state: {
          show: boolean;
          format: string;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
        email: {
          hideHe: number;
          show: boolean;
          format: string;
          disableOnFormRequired: {
            topups: string;
            tokenized: string;
            invoices: string;
            autopackets: string;
            packets: string;
            invoices_autopayments: string;
          };
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          hidePP: number;
          value: string;
        };
        expirationDate: {
          show: boolean;
          format: string;
          label: string;
          placeholder: string;
          validations: {
            required: boolean;
            maxLength: string;
            minLength: string;
          };
          type: string;
          value: string;
        };
      };
    };
  };
  data: Array<any>;
  meta: {
    cache: number;
    idType: string;
    businessUnit: string;
    expirationCache: number;
    id: string;
    params: {
      _format: string;
    };
    category: string;
  };
}
