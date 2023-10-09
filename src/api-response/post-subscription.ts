import { PostSubscriptionApiResponse } from "../interfaces/post-subscription-api-response.interface";

export const postSubscriptionApiResponse: PostSubscriptionApiResponse = {
  config: {
    description: "",
    title: {
      show: false,
      value: "OneApp Convergent add cards v2.0",
    },
    footer: "",
    actions: {
      accept: {
        show: true,
        type: "button",
        label: "Aceptar",
      },
    },
    forms: {
      newCardForm: {
        rememberCard: {
          show: true,
          format: "",
          label: "Quiero guardar esta tarjeta para futuros pagos",
          placeholder: "",
          validations: {
            required: false,
            maxLength: "1",
            minLength: "0",
          },
          type: "checkbox",
          value: "",
        },
        country: {
          show: false,
          format: "",
          label: "Pais",
          placeholder: "US",
          validations: {
            required: false,
            maxLength: "32",
            minLength: "2",
          },
          type: "text",
          value: "",
        },
        cvv: {
          show: true,
          format: "",
          label: "CVV",
          placeholder: "000",
          validations: {
            required: true,
            maxLength: "4",
            minLength: "3",
          },
          type: "tel",
          value: "",
        },
        address: {
          show: false,
          format: "",
          label: "Dirección",
          placeholder: "",
          validations: {
            required: false,
            maxLength: "128",
            minLength: "0",
          },
          type: "text",
          value: "",
        },
        city: {
          show: false,
          format: "",
          label: "Ciudad",
          placeholder: "Mountain View",
          validations: {
            required: false,
            maxLength: "32",
            minLength: "2",
          },
          type: "text",
          value: "",
        },
        postalCode: {
          show: false,
          format: "",
          label: "Código Postal",
          placeholder: "94043",
          validations: {
            required: false,
            maxLength: "32",
            minLength: "2",
          },
          type: "text",
          value: "",
        },
        numberQuotas: {
          show: false,
          format: "",
          options: [
            {
              value: "1",
              label: "1",
            },
            {
              value: "2",
              label: "2",
            },
            {
              value: "3",
              label: "3",
            },
          ],
          label: "Cuotas",
          placeholder: "",
          validations: {
            required: true,
            maxLength: "4",
            minLength: "0",
          },
          type: "select",
          value: "",
        },
        description: {
          show: true,
          value: "",
          label: "Allowed credits cards",
        },
        identificationType: {
          show: false,
          format: "",
          options: [
            {
              value: "",
              label: false,
            },
          ],
          label: "Tipo de identificación",
          placeholder: "",
          validations: {
            required: false,
            maxLength: "128",
            minLength: "0",
          },
          type: "select",
          value: "",
        },
        expirationDateMonth: {
          show: true,
          format: "MM",
          options: [
            {
              value: "",
              label: false,
            },
          ],
          label: "Fecha de expiración mes",
          placeholder: "",
          validations: {
            required: true,
            maxLength: "128",
            minLength: "0",
          },
          type: "select",
          value: "",
        },
        numberCard: {
          show: true,
          format: "",
          validations: {
            allowedCreditCards: ["AMEX", "VISA", "MASTERCARD"],
            required: true,
            maxLength: "19",
            minLength: "12",
          },
          label: "Número de la tarjeta",
          placeholder: "0000 0000 0000 0000",
          type: "tel",
          value: "",
        },
        expirationDateYear: {
          show: true,
          format: "YY",
          options: [
            {
              value: "",
              label: false,
            },
          ],
          label: "Fecha de expiración year",
          placeholder: "",
          validations: {
            required: true,
            maxLength: "128",
            minLength: "0",
          },
          type: "select",
          value: "",
        },
        phone: {
          show: false,
          format: "",
          label: "Teléfono celular",
          placeholder: "",
          validations: {
            required: true,
            maxLength: "15",
            minLength: "8",
          },
          type: "text",
          value: "",
        },
        nameCard: {
          show: true,
          format: "",
          label: "Nombre del titular",
          placeholder: "",
          validations: {
            required: false,
            maxLength: "128",
            minLength: "0",
          },
          type: "text",
          value: "",
        },
        identificationNumber: {
          show: false,
          format: "",
          label: "Número de identificación",
          placeholder: "",
          validations: {
            required: false,
            maxLength: "128",
            minLength: "0",
          },
          type: "number",
          value: "",
        },
        state: {
          show: false,
          format: "",
          label: "Estado",
          placeholder: "CA",
          validations: {
            required: false,
            maxLength: "2",
            minLength: "2",
          },
          type: "text",
          value: "",
        },
        email: {
          hideHe: 0,
          show: false,
          format: "",
          disableOnFormRequired: {
            topups: "topups",
            tokenized: "tokenized",
            invoices: "invoices",
            autopackets: "autopackets",
            packets: "packets",
            invoices_autopayments: "invoices_autopayments",
          },
          label: "Correo electrónico",
          placeholder: "",
          validations: {
            required: false,
            maxLength: "128",
            minLength: "5",
          },
          type: "text",
          hidePP: 0,
          value: "",
        },
        expirationDate: {
          show: true,
          format: "MM/YY",
          label: "Fecha Vencimiento",
          placeholder: "MM/YY",
          validations: {
            required: true,
            maxLength: "5",
            minLength: "5",
          },
          type: "tel",
          value: "",
        },
      },
    },
  },
  data: [],
  meta: {
    cache: 0,
    idType: "billingaccounts",
    businessUnit: "billingaccount",
    expirationCache: 1690827283,
    id: "",
    params: {
      _format: "json",
    },
    category: "home",
  },
};