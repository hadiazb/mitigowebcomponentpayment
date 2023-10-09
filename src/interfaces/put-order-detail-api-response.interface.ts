export interface PutOrderDetailApiResponse {
    data: {
      orderId: number
      transactionId: number
    }
    config: {
      title: {
        value: string
        show: boolean
      }
      description: string
      footer: string
    }
    meta: {
      id: string
      idType: string
      params: {
        targetMsisdn: string
        _format: string
      }
      businessUnit: string
      category: string
      cache: number
      expirationCache: string
    }
  }
  