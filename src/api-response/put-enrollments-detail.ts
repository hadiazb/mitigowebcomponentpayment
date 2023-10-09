import { PutEnrollmentsApiResponse } from "../interfaces/put-enrollments.interface";

export const putEnrollmentsApiResponse: PutEnrollmentsApiResponse =
  {
    data: {
      invoice: {
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
      enrollment: {
        enrollmentId: {
          label: "Id del enrollment",
          show: true,
          value: "19617",
          formattedValue: "19617",
        },
        cardType: {
          label: "Tipo de tarjeta",
          show: true,
          value: "VISA",
          formattedValue: "VISA",
        },
        maskedCreditCardNumber: {
          label: "N\u00famero de tarjeta",
          show: true,
          value: "411111XXXXXX2222",
          formattedValue: "**** 2222",
        },
        expirationDate: {
          label: "Vencimiento",
          show: true,
          value: "02/2024",
          formattedValue: "02/24",
          expiredCard: false,
        },
        email: {
          label: "Email",
          show: true,
          value: "jbuzzi+1@mobiquityinc.com",
          formattedValue: "jb**@mobiquityinc.com",
        },
        customerName: {
          label: "Nombre del cliente",
          show: true,
          value: "Harsh Patel",
          formattedValue: "Harsh Patel",
        },
      },
    },
    config: {
      title: {
        value: "Afiliaci\u00f3n Exitosa",
        show: false,
      },
      description: {
        title:
          "!Cambiaste los datos de afiliaci\u00f3n a pagos autom\u00e1cios!",
        body: "Se ha editado y guardado\u00a0de manera exitosa.",
      },
      footer: "",
      actions: {
        submit: {
          label: "Volver Al Inicio",
          show: true,
          type: "button",
          url: "",
        },
      },
      status: "success",
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
      expirationCache: 1692692382,
    },
  };
