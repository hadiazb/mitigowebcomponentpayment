import { OrderStatusApiResponse } from '../interfaces/order-status-api-response.interface';

export const orderStatusApiResponse: OrderStatusApiResponse = {
  data: {
    accountId: {
      label: 'Número remitente',
      show: false,
      value: '123456789',
      formattedValue: '123456789',
    },
    accountNumber: {
      label: 'Número de la línea:',
      show: true,
      value: '123456789',
      formattedValue: '123456789',
    },
    productType: {
      label: 'Opción:',
      show: true,
      value: 'packets',
      formattedValue: 'Pago de paquetes',
    },
    cardBrand: {
      label: 'Medio de pago:',
      show: true,
      value: 'VISA',
      formattedValue: 'VISA',
    },
    orderId: {
      label: 'Número de orden:',
      show: true,
      value: '280080',
      formattedValue: '280080',
    },
    transactionEndDate: {
      label: 'Fecha de la transacción:',
      show: true,
      value: '1688415673',
      formattedValue: '03/07/2023 - 14:21',
    },
    maskedAccountId: {
      label: 'Número de tarjeta:',
      show: true,
      value: '**** 1111',
      formattedValue: '**** 1111',
    },
    transactionId: {
      label: 'Número de auditoría:',
      show: true,
      value: '123456',
      formattedValue: '123456',
    },
    numberReference: {
      label: 'Número de referencia:',
      show: true,
      value: '1234567890123456789',
      formattedValue: '1234567890123456789',
    },
    numberAccess: {
      label: 'Número de autorización:',
      show: true,
      value: '123456',
      formattedValue: '831000',
    },
    amount: {
      label: 'Monto autorizado:',
      show: true,
      value: '9.99',
      formattedValue: 'Q9.99',
    },
    stateOrder: {
      label: 'Estado de la transacción:',
      show: false,
      value: 'ORDER_IN_PROGRESS',
      formattedValue: 'ORDER_IN_PROGRESS',
    },
  },
  config: {
    title: {
      value: 'OneApp Mobile Payment Gateway Packets Purchase Status v2.0 - (Detalle del paquete)',
      show: false,
    },
    description: '',
    footer: '',
    status: {
      stateOrder: 'ORDER_IN_PROGRESS',
    },
    message: {
      title: '¡Su compra está en proceso!',
      body: 'Procesar su pago está tardando más de lo esperado. No se preocupe, le notificaremos en los próximos minutos tan pronto esté completado. Puede seguir navegando, esto no interrumpirá el procesamiento.',
    },
    options: {
      retries: {
        value: 1,
      },
      retryTime: {
        value: 5,
      },
    },
    actions: {
      home: {
        label: 'VOLVER AL INICIO',
        show: true,
        type: 'link',
        url: 'test default',
        setupFavorite: false,
        externalUrl: 'test default',
        tabClass: 'servicios',
      },
      redirect: {
        label: 'En {timer} segundos serás redirigido para que ACTIVES tu suscripción',
        show: '1',
        type: 'link',
        url: '/redirect',
      },
      premium: {
        label: 'PREMIUM',
        show: '1',
        type: 'link',
        url: '/premium',
      },
      checkout: {
        label: 'PAGAR CON OTRO METODO',
        show: true,
        type: 'link',
        url: 'test default',
        externalUrl: 'test default',
      },
    },
  },
  meta: {
    id: 'account number',
    idType: 'subscribers',
    params: {
      targetMsisdn: 'target msisdn',
      _format: 'json',
    },
    businessUnit: 'payment',
    category: 'mobile',
    cache: 0,
    expirationCache: 'expiration',
  },
};
