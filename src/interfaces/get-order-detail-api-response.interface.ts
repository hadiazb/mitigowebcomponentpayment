export interface GetOrderDetailApiResponse {
  data: {
    msisdn?: {
      label: string;
      value: string;
      formattedValue: string;
      show: boolean;
    };
    amount?: {
      label: string;
      value: string;
      formattedValue: string;
      show: boolean;
    };
    detail?: {
      label: string;
      formattedValue: string;
      show: boolean;
    };
    period?: {
      label: string;
      formattedValue: string;
      show: boolean;
    };
    productType?: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    accountNumber?: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    invoiceAmount?: {
      label: string;
      show: boolean;
      value: string;
      formattedValue: string;
    };
    invoiceId?: {
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
    oneClickPayment?: {
      forms: Array<{
        billingDataForm: {
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
        };
      }>;
      isRecurrent: boolean;
      titles: {
        paymentMethodTitle: {
          label: string;
          show: boolean;
        };
        billingDataTitle: {
          label: string;
          show: boolean;
        };
        bannerTitle: {
          label: string;
          show: boolean;
        };
      };
      actions: {
        changeBillingData: {
          label: string;
          show: boolean;
        };
        submit: {
          label: string;
          show: boolean;
        };
      };
      termsAndConditions: {
        label: string;
        prefix: string;
        url: string;
        type: string;
        externalUrl: string;
        show: boolean;
      };
      params: {
        fingerPrint: {
          link: string;
          integrate: string;
        };
        purchaseorderId: string;
      };
      submit: {
        label: string;
        show: boolean;
      };
      paymentMethod: {
        creditCard: {
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
        };
      };
      show: boolean;
    };
    actions: {
      paymentMethods: Array<{
        coreBalance?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          otpRequired: boolean;
          weight: string;
          description: {
            label: string;
            formattedValue: string;
            show: boolean;
            value: {
              amount: number;
              currencyId: string;
            };
            validForPurchase: boolean;
          };
          confirmation: {
            confirmationTitle: {
              label: string;
              show: boolean;
            };
            message: {
              label: string;
              show: boolean;
            };
            orderDetailsTitle: {
              label: string;
              show: boolean;
            };
            typeProduct: {
              label: string;
              show: boolean;
            };
            paymentMethodsTitle: {
              label: string;
              show: boolean;
            };
            paymentMethod: {
              label: string;
              formattedValue: string;
              show: boolean;
            };
            coreBalancePayment: {
              label: string;
              show: boolean;
            };
            actions: {
              change: {
                label: string;
                url: string;
                type: string;
                show: boolean;
              };
              cancel: {
                label: string;
                url: string;
                type: string;
                show: boolean;
              };
              purchase: {
                label: string;
                url: string;
                type: string;
                show: boolean;
              };
              termsOfServices: {
                label: string;
                url: string;
                type: string;
                show: boolean;
              };
            };
          };
        };
        invoiceCharge?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          description: {
            label: string;
            show: boolean;
          };
          otpRequired: boolean;
          weight: string;
          confirmation: {
            confirmationTitle: {
              label: string;
              show: boolean;
            };
            message: {
              label: string;
              show: boolean;
            };
            orderDetailsTitle: {
              label: string;
              show: boolean;
            };
            productType: {
              label: string;
              show: boolean;
            };
            paymentMethodTitle: {
              label: string;
              show: boolean;
            };
            paymentMethod: {
              label: string;
              formattedValue: string;
              show: boolean;
            };
            actions: {
              cancel: {
                label: string;
                url: string;
                type: string;
                show: boolean;
              };
              purchase: {
                label: string;
                url: string;
                type: string;
                show: boolean;
              };
              termsOfServices: {
                label: string;
                url: string;
                type: string;
                show: boolean;
              };
            };
          };
        };
        Async_PSE?: {
          paymentMethodName: string;
          label: string;
          description: {
            label: string;
            show: boolean;
          };
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          weight: string;
        };
        creditCard?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          weight: string;
          description: {
            label: string;
            show: boolean;
          };
        };
        Loan_Balance?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          description: {
            label: string;
            show: boolean;
          };
          weight: string;
        };
        Loan_Packets?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          weight: string;
          description: {
            label: string;
            show: boolean;
          };
        };
        Async_Bancolombia?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          description: {
            label: string;
            show: boolean;
          };
          weight: string;
        };
        Async_Nequi?: {
          paymentMethodName: string;
          isNative: boolean;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          description: {
            label: string;
            show: boolean;
          };
          weight: string;
        };
        Async_Paypal?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          description: {
            label: string;
            show: boolean;
          };
          weight: string;
        };
        Async_Daviplata?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          description: {
            label: string;
            show: boolean;
          };
          weight: string;
        };
        tigoMoney?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          weight: string;
          description: {
            label: string;
            show: boolean;
          };
        };
        qrPayment?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          weight: string;
          description: {
            label: string;
            show: boolean;
          };
        };
        bancardAsync?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          weight: string;
          description: {
            label: string;
            show: boolean;
          };
        };
        bancard?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          weight: string;
          description: {
            label: string;
            show: boolean;
          };
        };
        Async_ClaveCard?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          weight: string;
          description: {
            label: string;
            show: boolean;
          };
        };
        Async_Yappy?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          weight: string;
          description: {
            label: string;
            show: boolean;
          };
        };
        Async_bitcoins?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          isRecurrent: boolean;
          optRequired: boolean;
          description: {
            label: string;
            show: boolean;
          };
        };
        tigoMoney_Inv?: {
          paymentMethodName: string;
          label: string;
          url: string;
          type: string;
          show: boolean;
          description: {
            show: boolean;
            label: string;
          };
          forms: {
            description: {
              show: boolean;
              value: string;
            };
            payerAccount: {
              show: boolean;
              label: string;
              placeholder: string;
              type: string;
              format: string;
              value: string;
              options: Array<string>;
              validations: {
                required: boolean;
                minLength: string;
                maxLength: string;
              };
            };
          };
        };
      }>;
    };
  };
  meta: {
    proid: number;
    cache: number;
    expirationCache: number;
  };
}
