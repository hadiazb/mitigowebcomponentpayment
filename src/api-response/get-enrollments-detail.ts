import { GetEnrollmentsDetailApiResponse } from "../interfaces/get-enrollments-detail.interface";

export const getEnrollmentsDetailApiResponse: GetEnrollmentsDetailApiResponse = {
    data: {
      transactionType: {
        show: true,
        label: "Tipo de transacci\u00f3n",
        value: "D\u00e9bito autom\u00e1tico",
        formattedValue: "D\u00e9bito autom\u00e1tico",
      },
      accountNumber: {
        show: true,
        label: "N\u00famero de cuenta",
        value: "57490034",
        formattedValue: "57490034",
      },
      accountToEnroll: {
        show: true,
        label: "Cuenta a inscribir",
        value: "14199183",
        formattedValue: "14199183",
      },
      invoiceAmount: {
        show: true,
        label: "Monto mensual",
        value: "",
        formattedValue: "",
      },
    },
    config: {
      title: {
        value: "Forma de pago",
        show: false,
      },
      description: "",
      footer: "",
      note: "El monto est\u00e1 sujeto a cambios por servicios adicionales contratados durante el mes.",
      actions: {
        paymentMethods: [
          {
            creditCard: {
              paymentMethodName: "creditCard",
              label: "Tarjeta de cr\u00e9dito",
              url: "/",
              type: "button",
              show: true,
            },
          },
        ],
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
      expirationCache: 1692596772,
    },
  };
