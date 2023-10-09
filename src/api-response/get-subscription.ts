import { GetSubscriptionApiResponse } from "../interfaces/get-subscription.interface";

export const getEnrollmentsApiResponse: GetSubscriptionApiResponse = {
  config: {
    footer: "",
    deleteConfirmation: {
      title: "Confirmar eliminar suscripción",
      options: {
        confirm: {
          show: true,
          label: "CONFIRMAR",
          type: "button",
          class: "confirmDelete",
        },
        cancel: {
          show: true,
          label: "CANCELAR",
          type: "button",
          class: "",
        },
      },
      description: "¿Estas seguro que quieres eliminar tu cuenta",
    },
    description: "",
    title: {
      show: true,
      value: "Mis Tarjetas",
    },
    allowedPaymentMethods: [
      {
        creditCard: {
          show: true,
          paymentMethodName: "creditCard",
          label: "Tarjeta de Crédito",
          type: "button",
          url: "/",
        },
      },
    ],
    actions: {
      add: {
        show: true,
        type: "button",
        label: "NUEVA TARJETA",
      },
      delete: {
        show: true,
        label: "Eliminar suscripción",
        type: "button",
        class: "delete",
      },
    },
    paymentMethodsTitle: {
      description: "Gestiona las tarjetas disponibles para la cuenta.",
      label: "Seleccione una tarjeta para agregar",
    },
  },
  data: {
    noData: {
      value: "",
    },
    subscriptionAccounts: [
      {
        expirationYear: {
          show: true,
          formattedValue: 2024,
          label: "expirationYear",
          value: 2024,
        },
        cardLabel: {
          show: false,
          formattedValue: "",
          label: "cardLabel",
          value: "",
        },
        expirationMonth: {
          show: true,
          formattedValue: 12,
          label: "expirationMonth",
          value: 12,
        },
        tokenizedCardId: {
          show: false,
          formattedValue: 579536,
          label: "tokenizedCardId",
          value: 579536,
        },
        maskedCreditCardNumber: {
          show: true,
          formattedValue: "**** 1111",
          label: "maskedCreditCardNumber",
          value: "411111XXXXXX1111",
        },
        cardBrand: {
          show: true,
          formattedValue: "VISA",
          label: "cardBrand",
          value: "VISA",
        },
        extraValidationRequired: {
          show: false,
          formattedValue: false,
          label: "extraValidationRequired",
          value: false,
        },
      },
      {
        expirationYear: {
          show: true,
          formattedValue: 2024,
          label: "expirationYear",
          value: 2024,
        },
        cardLabel: {
          show: false,
          formattedValue: "",
          label: "cardLabel",
          value: "",
        },
        expirationMonth: {
          show: true,
          formattedValue: 12,
          label: "expirationMonth",
          value: 12,
        },
        tokenizedCardId: {
          show: false,
          formattedValue: 578815,
          label: "tokenizedCardId",
          value: 578815,
        },
        maskedCreditCardNumber: {
          show: true,
          formattedValue: "**** 3200",
          label: "maskedCreditCardNumber",
          value: "453906XXXXXX3200",
        },
        cardBrand: {
          show: true,
          formattedValue: "VISA",
          label: "cardBrand",
          value: "VISA",
        },
        extraValidationRequired: {
          show: false,
          formattedValue: false,
          label: "extraValidationRequired",
          value: false,
        },
      },
      {
        expirationYear: {
          show: true,
          formattedValue: 2024,
          label: "expirationYear",
          value: 2024,
        },
        cardLabel: {
          show: false,
          formattedValue: "",
          label: "cardLabel",
          value: "",
        },
        expirationMonth: {
          show: true,
          formattedValue: 12,
          label: "expirationMonth",
          value: 12,
        },
        tokenizedCardId: {
          show: false,
          formattedValue: 579495,
          label: "tokenizedCardId",
          value: 579495,
        },
        maskedCreditCardNumber: {
          show: true,
          formattedValue: "**** 5100",
          label: "maskedCreditCardNumber",
          value: "510510XXXXXX5100",
        },
        cardBrand: {
          show: true,
          formattedValue: "mastercard",
          label: "cardBrand",
          value: "mastercard",
        },
        extraValidationRequired: {
          show: false,
          formattedValue: false,
          label: "extraValidationRequired",
          value: false,
        },
      },
    ],
  },
  meta: {
    cache: 0,
    id: "",
    idType: "invoices",
    params: {
      _format: "json",
      businessUnit: "billingaccount",
    },
    category: "home",
    expirationCache: 1689880135,
  },
};
