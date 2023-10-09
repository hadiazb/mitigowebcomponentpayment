import { GetEnrollmentsApiResponse } from "../interfaces/get-enrollments.interface";

export const getEnrollmentsApiResponse: GetEnrollmentsApiResponse = {
  data: {
    noData: {
      value: "",
    },
    enrollments: [
      {
        amount: {
          show: false,
          formattedValue: null,
          label: "Monto",
          value: null,
        },
        offerName: {
          show: false,
          formattedValue: null,
          label: "Nombre",
          value: null,
        },
        cardType: {
          show: true,
          formattedValue: "mastercard",
          label: "Tipo de tarjeta",
          value: "mastercard",
        },
        frequency: {
          show: false,
          formattedValue: null,
          label: "Frecuencia",
          value: null,
        },
        cardExpirationDate: {
          show: true,
          formattedValue: "12/2024",
          label: "Expira",
          value: "12/2024",
        },
        offerId: {
          show: false,
          formattedValue: null,
          label: "Id de la oferta",
          value: null,
        },
        paymentMethod: {
          show: true,
          formattedValue: "creditCard",
          label: "Tipo",
          value: "creditCard",
        },
        id: {
          show: true,
          formattedValue: "88232",
          label: "Id del enrollment",
          value: "88232",
        },
        maskedCreditCardNumber: {
          show: true,
          formattedValue: "**** 5100",
          label: "Número de tarjeta",
          value: "510510XXXXXX5100",
        },
        nextPayment: {
          show: false,
          formattedValue: null,
          label: "Siguiente compra",
          value: null,
        },
        msisdn: {
          show: true,
          formattedValue: "4111111111111111",
          label: "Número",
          value: "4111111111111111",
        },
        email: {
          show: true,
          formattedValue: "rpatilgt@mobiquityinc.com",
          label: "Email",
          value: "rpatilgt@mobiquityinc.com",
        },
        expirationDate: {
          show: false,
          formattedValue: null,
          label: "Próximo cobro en",
          value: null,
        },
        customerName: {
          show: false,
          formattedValue: null,
          label: "Próximo cobro en",
          value: null,
        },
      },
    ],
  },
  config: {
    title: {
      value: "Afiliaciones Pago Autom\u00e1tico",
      show: true,
    },
    description: "",
    footer: "",
    message: "A\u00fan no est\u00e1s afiliado a Pagos Autom\u00e1ticos.",
    actions: {
      delete: {
        label: "Eliminar",
        show: true,
        type: "button",
        url: "",
      },
      editEnrollment: {
        label: "Editar",
        show: true,
        type: "button",
        url: "",
      },
      addEnrollment: {
        label: "Agregar pago automático",
        show: true,
        type: "button",
        url: "",
      },
    },
  },
  meta: {
    id: "14199183",
    idType: "subscribers",
    params: {
      _format: "json",
    },
    businessUnit: "recurringpayment",
    category: "home",
    cache: 0,
    expirationCache: 1692338940,
  },
};
