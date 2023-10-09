import { Env } from "@stencil/core";
import { ApiError } from "../interfaces/api-error.interface";
import { OrderStatusApiResponse } from "../interfaces/order-status-api-response.interface";

class HttpController {
  public getOrderDetailData;
  public getEnrollmentsData;
  public postOrderDetailData;
  public putOrderDetailData;
  public getOrderStatusData: OrderStatusApiResponse;
  public getEnrollmentsDetailData;
  public postEnrollmentsData;
  public postEnrollmentsDetailData;
  public getEncryptionCode;
  public putEnrollmentsData;
  public deleteEnrollmentsData;
  public getSubscriptionData;
  public deleteSubscriptionData;
  public postSubscriptionData;
  public putSubscriptionData;
  private baseUrl: string = Env.API_HOST;
  public apiError: ApiError;

  async getData(url: string, idToken: string, apiName: string) {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", idToken);
      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
      let response = await fetch(`${this.baseUrl}${url}`, requestOptions);
      const jsonResponse = await response.json();
      this.handleErrors(jsonResponse);
      if (apiName === "GetOrderDetailApiResponse") {
        this.getOrderDetailData = jsonResponse;
      } else if (apiName === "GetEncryptionCode") {
        this.getEncryptionCode = jsonResponse;
      } else if (apiName === "GetOrderStatusApiResponse") {
        this.getOrderStatusData = jsonResponse;
      } else if (apiName === "GetEnrollmentsData") {
        this.getEnrollmentsData = jsonResponse;
      } else if (apiName === "GetEnrollmentsDetailApiResponse") {
        this.getEnrollmentsDetailData = jsonResponse;
      } else if (apiName === "GetSubscriptionData") {
        this.getSubscriptionData = jsonResponse;
      }
    } catch (_) {
      this.apiError = {
        success: false,
        body: null,
        status: [
          {
            code: "401",
            description: "Auth Error",
            userMessage: "Auth Error",
          },
        ],
      };
    }
  }

  async postData(url: string, idToken: string, data: any, apiName: string) {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", idToken);
      myHeaders.append("Content-Type", "application/json");
      let response = await fetch(`${this.baseUrl}${url}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: myHeaders,
      });
      this.handleErrors(response);
      const jsonResponse = await response.json();
      if (apiName === "postOrderDetailData") {
        this.postOrderDetailData = jsonResponse;
      } else if (apiName === "postEnrollmentsData") {
        this.postEnrollmentsData = jsonResponse;
      } else if (apiName === "postEnrollmentsDetailData") {
        this.postEnrollmentsDetailData = jsonResponse;
      } else if (apiName === "postSubscriptionData") {
        this.postSubscriptionData = jsonResponse;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async putData(url: string, idToken: string, data: any, apiName: string) {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", idToken);
      myHeaders.append("Content-Type", "application/json");
      let response = await fetch(`${this.baseUrl}${url}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: myHeaders,
      });
      this.handleErrors(response);
      const jsonResponse = await response.json();
      if (apiName === "putOrderDetailData") {
        this.putOrderDetailData = jsonResponse;
      } else if (apiName === "putEnrollmentsData") {
        this.putEnrollmentsData = jsonResponse;
      } else if (apiName === "putSubscriptionData") {
        this.putSubscriptionData = jsonResponse;
      }
    } catch (err) {
      console.log(err);
    }
  }

  handleErrors(response) {
    this.apiError = undefined;
    if (!response) {
      this.apiError = response;
      throw response;
    }
  }

  async deleteData(url: string, idToken: string, apiName: string) {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", idToken);
      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
      };
      let response = await fetch(`${this.baseUrl}${url}`, requestOptions);
      const jsonResponse = await response.json();
      this.handleErrors(jsonResponse);
      if (apiName === "deleteEnrollmentsData") {
        this.deleteEnrollmentsData = jsonResponse;
      } else if (apiName === "deleteSubscriptionData") {
        this.deleteSubscriptionData = jsonResponse;
      }
    } catch (_) {
      this.apiError = {
        success: false,
        body: null,
        status: [
          {
            code: "401",
            description: "Auth Error",
            userMessage: "Auth Error",
          },
        ],
      };
    }
  }
}

export const HttpService = new HttpController();
