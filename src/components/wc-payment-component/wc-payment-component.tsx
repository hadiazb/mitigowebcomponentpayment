import { Component, h, Prop, State, Element, Host, getAssetPath, Watch, Event, EventEmitter } from '@stencil/core';
import { getCardExpiry, getCreditCardIcon, getPaymentMethodIcon, creditCardMask, getPaymentMethods, encryptRsa, expiryInfo, getCardType } from '../../utils/utils';
import { WcData } from '../../interfaces/wc-data.interface';
import { PaymentMethod } from '../../interfaces/payment-method.interface';
import { PAYMENT_METHOD_TYPE } from '../../constants';
import { ccExpiryInputInputHandler, ccExpiryInputKeyDownHandler, ccNumberInputInputHandler, ccNumberInputKeyDownHandler } from '../../utils/credit-card';
import { CreditCardFormData } from '../../interfaces/credit-card-form-data.interface';
import { BillingFormData } from '../../interfaces/billing-form-data.interface';
import { HttpService } from '../../http';
import { GetOrderDetailApiResponse } from '../../interfaces/get-order-detail-api-response.interface';
import { PostOrderDetailApiResponse } from '../../interfaces/post-order-detail-api-response.interface';
import { PutOrderDetailApiResponse } from '../../interfaces/put-order-detail-api-response.interface';
import { OrderStatusApiResponse } from '../../interfaces/order-status-api-response.interface';
import Pristine from 'pristinejs';

@Component({
  tag: 'wc-payment-component',
  styleUrls: ['wc-payment-component.css'],
  shadow: true,
  assetsDirs: ['assets']
})
export class WcPaymentComponent {
  @Element() el: HTMLElement;
  @Prop() wcData: string;
  @State() _wcData: WcData;
  @State() isAutopacksModalOpen: boolean = false;
  @State() selectedCreditCard: any;
  @State() step: number = 1;
  @State() creditCardFormData: CreditCardFormData;
  @State() isOrderDetailOpen: boolean = true;
  @State() billingFormData: BillingFormData;
  @State() getOrderDetailApiResponse: GetOrderDetailApiResponse;
  @State() postOrderDetailApiResponse: PostOrderDetailApiResponse;
  @State() isLoading: boolean = false;
  @State() getEncryptionCode: {publicKey: string};
  @State() putOrderDetailApiResponse: PutOrderDetailApiResponse;
  @State() orderStatusApiResponse: OrderStatusApiResponse;
  @Event() wcLoading: EventEmitter<any>;
  @Event() wcMessage: EventEmitter<any>;
  @Event() wcRefreshToken: EventEmitter<any>;
  @Event() wcSegment: EventEmitter<any>;
  @Event() wcTransactionFinished: EventEmitter<any>;
  @Event() wcTransactionClosed: EventEmitter<any>;
  

  @Watch('wcData')
  parseWcDataProp(newValue: string) {
    if (newValue) this._wcData = JSON.parse(newValue);
  }
  
  private paymentMethods: PaymentMethod[];
  private selectedPaymentMethod: string;
  private selectedPaymentMethodLabel: string;
  private orderStatusApiCallCount: number = 0;
  private getOrderStatusIntervalId;
  private maxOrderStatusApiCallCount: number;
  private intervalTimeOrderStatusApiCall: number;
  private pristineAddNewCardFrom: Pristine;
  private pristineBillingDataForm: Pristine;
  private pristineConfig = {
    // class of the parent element where the error/success class is added
    classTo: 'form-group',
    errorClass: 'has-danger',
    successClass: 'has-success',
    // class of the parent element where error text element is appended
    errorTextParent: 'form-group',
    // type of element to create for the error text
    errorTextTag: 'div',
    // class of the error text element
    errorTextClass: 'text-help' 
  };
  
  private toggleAutopacksModal(data?: boolean): void {
    this.isAutopacksModalOpen = !this.isAutopacksModalOpen;
    if (data === false) {
      this.handleSegmentCall('Automatic Payment Rejected');
      (this.el.shadowRoot.querySelector('#enrollMe') as HTMLInputElement).checked = false;
    } else if(data === true) {
      this.handleSegmentCall('Automatic Payment Activated');
      this.handleStepChange(3);
    }
  }

  private toggleOrderDetail(): void {
    this.isOrderDetailOpen = !this.isOrderDetailOpen;
  }

  private handleCredirCardFromSubmit(e: Event): void {
    e.preventDefault();
    const isAddNewCardFromValid = this.pristineAddNewCardFrom.validate();
    if(!isAddNewCardFromValid) {
      return;
    }
    const numberCard = (this.el.shadowRoot.querySelector('#numberCard') as HTMLInputElement)?.value;
    const expirationDate = (this.el.shadowRoot.querySelector('#expirationDate') as HTMLInputElement)?.value;
    const cvv = (this.el.shadowRoot.querySelector('#cvv') as HTMLInputElement)?.value;
    const nameCard = (this.el.shadowRoot.querySelector('#nameCard') as HTMLInputElement)?.value;
    const numberQuotas = (this.el.shadowRoot.querySelector('#numberQuotas') as HTMLSelectElement)?.value;
    const address = (this.el.shadowRoot.querySelector('#address') as HTMLInputElement)?.value;
    const city = (this.el.shadowRoot.querySelector('#city') as HTMLInputElement)?.value;
    const state = (this.el.shadowRoot.querySelector('#state') as HTMLInputElement)?.value;
    const country = (this.el.shadowRoot.querySelector('#country') as HTMLInputElement)?.value;
    const postalCode = (this.el.shadowRoot.querySelector('#postalCode') as HTMLInputElement)?.value;
    const identificationType = (this.el.shadowRoot.querySelector('#identificationType') as HTMLSelectElement)?.value;
    const identificationNumber = (this.el.shadowRoot.querySelector('#identificationNumber') as HTMLInputElement)?.value;
    const email = (this.el.shadowRoot.querySelector('#email') as HTMLInputElement)?.value;
    const phone = (this.el.shadowRoot.querySelector('#phone') as HTMLInputElement)?.value;
    const rememberCard = (this.el.shadowRoot.querySelector('#rememberCard') as HTMLInputElement)?.checked;
    const enrollMe = (this.el.shadowRoot.querySelector('#enrollMe') as HTMLInputElement)?.checked;
    if (this.selectedCreditCard === 'addNewCard') {
      this.creditCardFormData = {
        numberCard,
        expirationDate,
        cvv,
        nameCard,
        numberQuotas,
        address,
        city,
        state,
        country,
        postalCode,
        identificationType,
        identificationNumber,
        email,
        phone,
        rememberCard,
        enrollMe,
      };
    } else {
      this.creditCardFormData = {
        numberCard,
        expirationDate,
        cvv,
        nameCard,
        numberQuotas,
        address,
        city,
        state,
        country,
        postalCode,
        identificationType,
        identificationNumber,
        email,
        phone,
        rememberCard,
        enrollMe,
      };
    }
    if (this.selectedCreditCard === 'addNewCard') {
      this.handleSegmentCall('Credit Card Number Entered');
    } else {
      this.handleSegmentCall('Credit Card Selected');
    }
    if (enrollMe) {
      this.handleSegmentCall('Automatic Payment Card Displayed');
      this.toggleAutopacksModal();
    } else {
      (this.el.shadowRoot.querySelector('#addNewCardFrom') as HTMLFormElement)?.reset();
      this.handleStepChange(3);
    }
  }

  private handleBillingDataFromSubmit(e: Event): void {
    e.preventDefault();
    const isBillingDataForm = this.pristineBillingDataForm.validate();
    if(!isBillingDataForm) {
      return;
    }
    const fullname = (this.el.shadowRoot.querySelector('#fullname') as HTMLInputElement)?.value;
    const nit = (this.el.shadowRoot.querySelector('#nit') as HTMLInputElement)?.value;
    const address = (this.el.shadowRoot.querySelector('#address') as HTMLInputElement)?.value;
    const email = (this.el.shadowRoot.querySelector('#email') as HTMLInputElement)?.value;
    const identificationNumber = (this.el.shadowRoot.querySelector('#identificationNumber') as HTMLInputElement)?.value;
    this.billingFormData = {
      fullname,
      nit,
      address,
      email,
      identificationNumber,
    };
    this.handleStepChange(3);
  }

  private handleStatusButtonClick(e: Event): void {
    e.preventDefault();
    if (this.orderStatusApiResponse?.config?.actions?.home) {
      this.wcTransactionClosed.emit({
        status: this.orderStatusApiResponse?.data?.stateOrder?.value,
        journey: this._wcData?.journey,
        tabClass: this.orderStatusApiResponse?.config?.actions?.home?.tabClass,
        externalUrl: this.orderStatusApiResponse?.config?.actions?.home?.externalUrl,
      });
    }
    this.handleStepChange(1);
  }

  private handleNumberQuotasSelect(event: Event): void {
    const el = event.target as HTMLSelectElement;
    console.log(el.value);
  }

  private handleSelectPaymentMethod(): void {
    this.handleSegmentCall('Payment Info Selected');
    this.selectedPaymentMethod = PAYMENT_METHOD_TYPE.CreditCard;
    this.selectedPaymentMethodLabel = 'Tarjeta crédito';
    this.getEncryptionCodeDetail();
    this.step += 1;
  }

  private handleStepChange(step: number): void {
    if (step === 1) {
      this.postOrderDetailApiResponse = undefined;
      this.selectedPaymentMethod = undefined;
      this.selectedPaymentMethodLabel = undefined;
      this.selectedCreditCard = undefined;
    }
    if (step === 4) {
      this.pristineBillingDataForm = undefined;
    }
    if (step === 5) {
      this.putOrderDetail();
    }
    
    this.step = step;
  }

  private cancleConfirmation(): void {
    if (this.postOrderDetailApiResponse?.config?.cards?.tokenizedCards?.length === 0) {
      this.selectedCreditCard = 'addNewCard';
    } else {
      this.selectedCreditCard = this.postOrderDetailApiResponse?.config?.cards?.tokenizedCards?.[0];
    }
    this.step = 2;
  }

  async getOrderDetail() {
    this.isLoading = true;
    this.wcLoading.emit({
      isLoading: true
    });
    await HttpService.getData(
      `/${this._wcData?.uuid}/proid/${this._wcData?.purchaseOrderId}/orderdetails`,
      this._wcData?.idToken,
      'GetOrderDetailApiResponse'
    );
    this.getOrderDetailApiResponse = HttpService.getOrderDetailData;
    this.handleSegmentCall('Payment Info Loaded');
    this.paymentMethods = getPaymentMethods(this.getOrderDetailApiResponse);
    if (HttpService.getOrderDetailData === undefined && HttpService.apiError) {
      this.handleApiError();
    }
    this.isLoading = false;
    this.wcLoading.emit({
      isLoading: false
    });
  }

  async getEncryptionCodeDetail() {
    this.isLoading = true;
    this.wcLoading.emit({
      isLoading: true
    });
    await HttpService.getData(
      `/${this._wcData?.uuid}/proid/${this._wcData?.purchaseOrderId}/code`,
      this._wcData?.idToken,
      'GetEncryptionCode'
    );
    this.getEncryptionCode = HttpService.getEncryptionCode;
    if (HttpService.getEncryptionCode === undefined && HttpService.apiError) {
      this.handleApiError();
      this.isLoading = false;
    } else {
      this.postOrderDetail();
    }
    this.wcLoading.emit({
      isLoading: false
    });
  }

  async postOrderDetail() {
    this.isLoading = true;
    this.wcLoading.emit({
      isLoading: true
    });
    await HttpService.postData(
      `/payment/${this._wcData?.uuid}/proid/${this._wcData?.purchaseOrderId}/purchaseorders`,
      this._wcData?.idToken,
      {
        paymentMethodName: this.selectedPaymentMethod,
        deviceId: this._wcData?.deviceId
      },
      'postOrderDetailData'
    );
    this.postOrderDetailApiResponse = HttpService.postOrderDetailData;
    if (HttpService.postOrderDetailData === undefined && HttpService.apiError) {
      this.handleApiError();
    }
    if (this.postOrderDetailApiResponse?.config?.cards?.tokenizedCards?.length === 0) {
      this.selectedCreditCard = 'addNewCard';
    } else {
      this.selectedCreditCard = this.postOrderDetailApiResponse?.config?.cards?.tokenizedCards?.[0];
    }
    this.isLoading = false;
    this.wcLoading.emit({
      isLoading: false
    });
  }

  private handleApiError(): void {
    if (HttpService.apiError?.status[0]?.code === '401') {
      this.wcRefreshToken.emit({
        refreshToken: true,
      });
    } else {
      this.wcMessage.emit({
        type: 'error',
        message: HttpService.apiError?.status[0]?.description
      });
    }
  }

  private handleSegmentCall(segmentName: string): void {
    this.wcSegment.emit({
      name: segmentName,
      properties: {},
      eventType: 'track'
    });
  }

  private onCardValueChange(index, event): void {
    const el = event.target as HTMLSelectElement;
    if(typeof(index) === 'number') {
      this.selectedCreditCard = this.postOrderDetailApiResponse?.config?.cards?.tokenizedCards?.[index];
    } else {
      this.selectedCreditCard = el.value;
    }
    this.pristineAddNewCardFrom = undefined;
  }

  componentDidUpdate() {
    const addNewCardFrom = this.el.shadowRoot.querySelector('#addNewCardFrom');
    if (addNewCardFrom && !this.pristineAddNewCardFrom) {
      this.pristineAddNewCardFrom = new Pristine(addNewCardFrom, this.pristineConfig, true);
      const expirationDate: HTMLInputElement = this.el.shadowRoot.querySelector('#expirationDate');
      if (expirationDate) {
        this.pristineAddNewCardFrom.addValidator(expirationDate, function(value) {
          if (value.match(/^((0[1-9]|1[0-2])\/\d{2})$/)) {
            const {0: month, 1: year} = value.split("/");
            const a = Number(`20${year}`);
            // get midnight of first day of the next month
            const expiry = new Date(a, month);
            const current = new Date();
            
            return expiry.getTime() > current.getTime();
            
          }
          return false;
          
        }, "Fecha inválida", 2, false);
      }
    }
    const billingDataForm = this.el.shadowRoot.querySelector('#billingDataForm');
    if (billingDataForm && !this.pristineBillingDataForm) {
      this.pristineBillingDataForm = new Pristine(billingDataForm, this.pristineConfig, true);
    }
  }


  async putOrderDetail() {
    this.handleSegmentCall('Order Details Loaded');
    this.isLoading = true;
    this.wcLoading.emit({
      isLoading: true
    });
    const numberCard = this.creditCardFormData?.numberCard?.replace(/[^\d]/g, '');
    let body = {
      paymentMethodName: this.selectedPaymentMethod,
      channel: this._wcData?.channel,
      channelType: this._wcData?.channelType,
      createPaymentToken: this.creditCardFormData?.rememberCard,
      deviceId: this._wcData?.deviceId,
      billingData: {
        address: this.billingFormData?.address ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.address?.value,
        email: this.billingFormData?.email ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.email?.value,
        fullname: this.billingFormData?.fullname ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.fullname?.value,
        identificationNumber: this.billingFormData?.identificationNumber ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.identificationNumber?.value,
        nit: this.billingFormData?.nit ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.nit?.value,
      }
    };
    if (this.selectedCreditCard === 'addNewCard') {
      body['cardType'] = getCardType(this.creditCardFormData?.numberCard)?.toUpperCase();
      body['customerName'] = this.creditCardFormData?.nameCard;
      body['expirationMonth'] = expiryInfo(this.creditCardFormData?.expirationDate, 'month');
      body['expirationYear'] = expiryInfo(this.creditCardFormData?.expirationDate, 'year');
      body['numberCard'] = encryptRsa(this.getEncryptionCode?.publicKey, numberCard);
      //body['numberCard'] = numberCard;
    } else {
      body['tokenizedCardId'] = this.selectedCreditCard?.tokenizedCardId?.formattedValue;
    }
    if (this.creditCardFormData?.cvv) {
      //body['cvv'] = this.creditCardFormData?.cvv;
      body['cvv'] = encryptRsa(this.getEncryptionCode?.publicKey, this.creditCardFormData?.cvv);
    }
    await HttpService.putData(
      `/payment/${this._wcData?.uuid}/proid/${this._wcData?.purchaseOrderId}/purchaseorders`,
      this._wcData?.idToken,
      body,
      'putOrderDetailData'
    );
    this.putOrderDetailApiResponse = HttpService.putOrderDetailData;
    if (HttpService.putOrderDetailData === undefined && HttpService.apiError) {
      this.handleApiError();
    }
    this.isLoading = false;
    this.wcLoading.emit({
      isLoading: false
    });
    this.handleSegmentCall('Checkout Attempted');
    this.getOrderStatus();
    this.handleSegmentCall('Checkout Started');
  }

  async getOrderStatus() {
    this.orderStatusApiCallCount += 1;
    this.isLoading = true;
    this.wcLoading.emit({
      isLoading: true
    });
    let url = `/payment/${this._wcData?.uuid}/proid/${this._wcData?.purchaseOrderId}/status?attempt=${this.orderStatusApiCallCount}&_format=json`;
    if (this.orderStatusApiCallCount === 5) {
      url = url + '&force=true';
    }
    await HttpService.getData(
      url,
      this._wcData?.idToken,
      'GetOrderStatusApiResponse'
    );
    
    this.maxOrderStatusApiCallCount = HttpService.getOrderStatusData?.config?.options?.retries?.value;
    this.intervalTimeOrderStatusApiCall = HttpService.getOrderStatusData?.config?.options?.retryTime?.value;

    if (!this.getOrderStatusIntervalId && this.maxOrderStatusApiCallCount) {
      this.getOrderStatusIntervalId = setInterval(this.getOrderStatus.bind(this), this.intervalTimeOrderStatusApiCall * 1000);
    }

    const stateOrder = HttpService.getOrderStatusData?.data?.stateOrder?.value;
    if (stateOrder === 'FULFILLMENT_COMPLETE' || this.orderStatusApiCallCount === this.maxOrderStatusApiCallCount + 1) {
      this.orderStatusApiResponse = HttpService.getOrderStatusData;
      this.handleSegmentCall(stateOrder === 'FULFILLMENT_COMPLETE' ? 'Order Completed Displayed' : 'Order Failed Displayed');
      let status = '';
      if (stateOrder === 'FULFILLMENT_COMPLETE') {
        status = 'success';
      } else if (stateOrder === 'ORDER_IN_PROGRESS') {
        status = 'in-progress';
      } else {
        status = 'error';
      }
      this.wcTransactionFinished.emit({
        name: status,
        journey: this._wcData?.journey
      });
      clearInterval(this.getOrderStatusIntervalId);
    }
    if (HttpService.getOrderStatusData === undefined && HttpService.apiError) {
      this.handleSegmentCall('Server Response Failed');
      this.handleApiError();
    }
    this.wcLoading.emit({
      isLoading: false
    });
    this.isLoading = false;
  }

  componentWillLoad() {
    this.parseWcDataProp(this.wcData);
    this.getOrderDetail();
  }

  render() {
    return (
      <Host>
        <link rel="stylesheet" href="https://atomic.tigocloud.net/sandbox/css/main-v1.2.3.min.css"/>
        {this.isLoading ?
        <div class="ml-card at-loading"><div class="at-medium-circular-progress-indicator loading"></div></div> : ''}

        {this.step === 1 && this.getOrderDetailApiResponse ?
        <div class="ml-card">
          {this.getOrderDetailApiResponse?.config?.title?.show ? <div class={'at-card-header'} id="getOrderDetailLbl">{this.getOrderDetailApiResponse?.config?.title?.value}</div> : ''}
          {this.getOrderDetailApiResponse?.data?.detail?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id="detailLbl">{this.getOrderDetailApiResponse?.data?.detail.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id="detailVal">{this.getOrderDetailApiResponse?.data?.detail.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.getOrderDetailApiResponse?.data?.period?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id="periodLbl">{this.getOrderDetailApiResponse?.data?.period.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id="periodVal">{this.getOrderDetailApiResponse?.data?.period.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.getOrderDetailApiResponse?.data?.msisdn?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id="msisdnLbl">{this.getOrderDetailApiResponse?.data?.msisdn.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id="msisdnVal">{this.getOrderDetailApiResponse?.data?.msisdn.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.getOrderDetailApiResponse?.data?.amount?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id="amountLbl">{this.getOrderDetailApiResponse?.data?.amount.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id="amountVal">{this.getOrderDetailApiResponse?.data?.amount.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.getOrderDetailApiResponse?.data?.productType?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id="productTypeLbl">{this.getOrderDetailApiResponse?.data?.productType.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id="productTypeVal">{this.getOrderDetailApiResponse?.data?.productType.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.getOrderDetailApiResponse?.data?.accountNumber?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id="accountNumberLbl">{this.getOrderDetailApiResponse?.data?.accountNumber.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id="accountNumberVal">{this.getOrderDetailApiResponse?.data?.accountNumber.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.getOrderDetailApiResponse?.data?.invoiceId?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id="invoiceIdLbl">{this.getOrderDetailApiResponse?.data?.invoiceId.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id="invoiceIdVal">{this.getOrderDetailApiResponse?.data?.invoiceId.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.getOrderDetailApiResponse?.data?.invoiceAmount?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id="invoiceAmountLbl">{this.getOrderDetailApiResponse?.data.invoiceAmount.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id="invoiceAmountVal">{this.getOrderDetailApiResponse?.data.invoiceAmount.formattedValue}</div>
            </div>
          </div> : ''
          }
        </div> : '' }

        {this.step === 1 && this.getOrderDetailApiResponse ?
        <div class="ml-card at-payment-list-card">
          <div class={'at-card-header'}>Escoge tu forma de pago</div>
          {this.paymentMethods?.map((paymentMethod) => (
            <div id="paymentMethodBtn" key={paymentMethod?.label} class={'at-paymentMethod-item'} onClick={() => {this.handleSelectPaymentMethod()}}>
                <img src={getPaymentMethodIcon(paymentMethod?.paymentMethodName)} class="at-pay-icon" alt={paymentMethod?.label}></img>
                <div class={(paymentMethod?.description && paymentMethod?.description?.show) ? 'at-with-description' : 'at-without-description'}>
                    <span class={paymentMethod?.description && paymentMethod?.description?.show ?'at-payment-name at-set-height': 'at-payment-name'}>
                      {paymentMethod.label}
                    </span>
                    {paymentMethod?.description && paymentMethod?.description?.show ? 
                    <span class={paymentMethod?.description?.validForPurchase || paymentMethod?.paymentMethodName !== PAYMENT_METHOD_TYPE.Saldo ? 'at-saldo-card' : 'at-saldo-card-red'}>
                      { paymentMethod?.description?.label } { paymentMethod?.paymentMethodName === PAYMENT_METHOD_TYPE.Saldo ? paymentMethod?.description?.formattedValue : '' }
                  </span> : ''}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2998 10.1L12.6998 8.69995L18.6998 14.7L12.6998 20.7L11.2998 19.3L15.8998 14.7L11.2998 10.1Z" fill="#00C8FF"/>
                </svg>
            </div>
          ))}
        </div> : '' }

        {this.step === 2 && this.postOrderDetailApiResponse ?
        <div class="ml-card">
           <div class={'at-credit-card-row'} id="selectedPaymentMethodLabel">
              <img src={getPaymentMethodIcon(this.selectedPaymentMethod)} class="at-payment-type-icon" alt="Payment Icon"></img>
              <span class="at-payment-method">{this.selectedPaymentMethodLabel}</span>
          </div>
          {this.postOrderDetailApiResponse?.config?.title?.show ?
          <div id="postOrderDetailTitle" class={'at-font-label at-font-24 at-bill-pay-content-title at-bill-title'}>
            {this.postOrderDetailApiResponse?.config?.title?.value}
          </div> : ''}
          {this.postOrderDetailApiResponse?.config?.description ? 
          <div id="postOrderDetailDescription" class="at-bill-pay-content-description at-bill-title">
            {this.postOrderDetailApiResponse?.config?.description}
          </div> : ''}
          <form id='addNewCardFrom' class={'form-wrapper'} onSubmit={(e) => this.handleCredirCardFromSubmit(e)}>
            {this.postOrderDetailApiResponse?.config?.cards?.tokenizedCards?.map((tokenizedCard, i) => (
              <div key={tokenizedCard?.maskedCreditCardNumber?.value} class={'at-radio-button'}>
                <input 
                  type="radio" 
                  id={('radio'+i)} 
                  name="card" 
                  value={tokenizedCard?.maskedCreditCardNumber?.value} onChange={this.onCardValueChange.bind(this, i)}
                  checked={i === 0}
                  ></input>
                <label htmlFor={('radio'+i)}>
                  <div class={'at-card-detail'}>
                    <div class={'at-credit-card-number'}>
                      <img class="at-credit-card-icon" alt={tokenizedCard?.cardBrand?.value?.toLocaleLowerCase()} src={getCreditCardIcon(tokenizedCard?.cardBrand?.value?.toLocaleLowerCase())} />
                      {tokenizedCard.maskedCreditCardNumber.formattedValue}
                    </div>
                    <div class={getCardExpiry(tokenizedCard.expirationYear.formattedValue, tokenizedCard.expirationMonth.formattedValue, 'expirystatus') ? 'at-credit-card-expire at-expired-text' : 'at-credit-card-expire at-non-expired-text'}>
                      {getCardExpiry(tokenizedCard.expirationYear.formattedValue, tokenizedCard.expirationMonth.formattedValue, '')}
                    </div>
                  </div>
                </label>
                {this.selectedCreditCard?.maskedCreditCardNumber?.value === tokenizedCard?.maskedCreditCardNumber?.value && tokenizedCard?.extraValidationRequired?.value ? 
                  <div class={'at-credit-card-cvv'}>
                    <label class="at-input-label at-active form-group">
                      <span>CVV / CVC</span>
                      <input
                      class={'at-input-textfield cvv'}
                      id="cvv"
                      type="tel"
                      name="cvv"
                      placeholder="000" 
                      data-pristine-required={tokenizedCard?.extraValidationRequired?.value}
                      maxlength={4}
                      minlength={3}
                      data-pristine-required-message="CVV incorrecto"
                      data-pristine-minlength-message="CVV incorrecto"
                      data-pristine-maxlength-message="CVV incorrecto"
                      />
                    </label>
                  </div> : ''}
              </div>))}
            {this.postOrderDetailApiResponse?.config?.cards?.tokenizedCards?.length > 0 ? 
            <div class={'at-radio-button'}>
              <input type="radio" id="addNewCard" name="card" value="addNewCard" onChange={this.onCardValueChange.bind(this, '')}></input>
                <label htmlFor={'addNewCard'}>
                  <div class={'at-card-detail at-add-new-card'}>
                    <div class={'at-credit-card-number'}>
                      <img class="at-add-card-icon" alt="card" src={getPaymentMethodIcon('newcard')} />
                      Agregar Tarjeta
                    </div>
                  </div>
                </label>
            </div> : ''}
            {this.selectedCreditCard === 'addNewCard' ?
            <div>
              {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.description?.show ? 
                <div class="at-rw">
                    <div class="at-cl at-font-h5 s12">
                      <span class={'at-font-p'}>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.description?.label}</span> 
                      {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.numberCard?.validations?.allowedCreditCards?.map((item) => (
                        <img key={item} class="at-pay-accepted-card-icon" alt={item} src={getCreditCardIcon(item?.toLocaleLowerCase())}></img>
                      ))}
                    </div>
                    <div class={'at-pay-accepted-card s12 at-font-p'}>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.description?.details}</div>
                </div> : ''}
              {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.numberCard?.show ? 
              <div class="at-rw">
                  <div class="at-cl">
                    <label class="at-input-label form-group">
                      <span>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.numberCard?.label}</span>
                      <input 
                        placeholder={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.numberCard?.placeholder} 
                        type="text" 
                        id="numberCard"
                        name="numberCard" 
                        value=""
                        class="at-input-textfield card-number" 
                        data-pristine-required={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.numberCard?.validations?.required}
                        maxlength={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.numberCard?.validations?.maxLength}
                        minlength={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.numberCard?.validations?.minLength}
                        onKeyDown={ccNumberInputKeyDownHandler}
                        onInput={ccNumberInputInputHandler}
                        data-pristine-required-message="Número de tarjeta incorrecto"
                        data-pristine-minlength-message="Número de tarjeta incorrecto"
                        data-pristine-maxlength-message="Número de tarjeta incorrecto"
                        ></input>
                    </label>
                  </div>
              </div> : ''}
              <div class="at-rw">
                  {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.expirationDate?.show ? 
                  <div class="at-cl s6">
                    <label class="at-input-label form-group">
                      <span>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.expirationDate?.label}</span>
                      <input 
                        placeholder={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.expirationDate?.placeholder} 
                        type="text" 
                        name="expirationDate" 
                        id="expirationDate"
                        value="" 
                        class="at-input-textfield expiry"
                        data-pristine-required={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.expirationDate?.validations?.required}
                        maxlength={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.expirationDate?.validations?.maxLength}
                        minlength={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.expirationDate?.validations?.minLength}
                        onKeyDown={ccExpiryInputKeyDownHandler}
                        onInput={ccExpiryInputInputHandler}
                        data-pristine-required-message="Fecha inválida"
                        data-pristine-minlength-message="Fecha inválida"
                        data-pristine-maxlength-message="Fecha inválida"
                        data-pristine-my-expiry="true"
                        ></input>
                    </label>
                  </div> : ''}
                  {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.cvv?.show ? 
                  <div class="at-cl s6">
                    <label class="at-input-label form-group">
                      <span>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.cvv?.label}</span>
                      <input
                        placeholder={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.cvv?.placeholder}
                        type="tel"
                        name="cvv"
                        id='cvv'
                        value=""
                        data-pristine-required={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.cvv?.validations?.required}
                        maxlength={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.cvv?.validations?.maxLength}
                        minlength={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.cvv?.validations?.minLength}
                        class="at-input-textfield cvv"
                        data-pristine-required-message="CVV incorrecto"
                        data-pristine-minlength-message="CVV incorrecto"
                        data-pristine-maxlength-message="CVV incorrecto"
                        ></input>
                    </label>
                  </div> : ''}
              </div>
              <div class="at-rw">
                {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.nameCard?.show ? 
                  <div class={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.nameCard?.show && this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.numberQuotas?.show ? 'at-cl s8' : 'at-cl s12'}>
                    <label class="at-input-label form-group">
                      <span>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.nameCard?.label}</span>
                      <input placeholder={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.nameCard?.placeholder}
                        type="text"
                        name="nameCard"
                        id="nameCard"
                        value=""
                        class="at-input-textfield"
                        data-pristine-required={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.nameCard?.validations?.required}
                        maxlength={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.nameCard?.validations?.maxLength}
                        minlength={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.nameCard?.validations?.minLength}
                        data-pristine-required-message="Por favor ingresa tu nombre como sale en la tarjeta"
                        data-pristine-minlength-message="Por favor ingresa tu nombre como sale en la tarjeta"
                        data-pristine-maxlength-message="Por favor ingresa tu nombre como sale en la tarjeta"
                        ></input>
                    </label>
                  </div> : ''}
                  {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.numberQuotas?.show ? 
                  <div class="at-cl s4">
                    <label class="at-selectlabel ic-expandir-mas form-group">
                      <span>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.numberQuotas?.label}</span>
                      <select class="at-input-select" onInput={this.handleNumberQuotasSelect.bind(this)} name='numberQuotas' id='numberQuotas'>
                        {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.numberQuotas?.options.map(numberQuota => (
                          <option key={numberQuota.value} value={numberQuota.value} selected={numberQuota.value === this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.numberQuotas?.defaultValue}>{numberQuota.label}</option>
                        ))}
                      </select>
                    </label>
                  </div> : ''}
              </div>
              {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.address?.show ? 
              <div class="at-rw">
                  <div class="at-cl">
                    <label class="at-input-label form-group">
                    <span>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.address?.label}</span>
                      <input placeholder={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.address?.placeholder} type="text" name="address" id='address' value="" class="at-input-textfield"></input>
                    </label>
                  </div>
              </div> : ''}
              <div class="at-rw">
                  {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.city?.show ? 
                    <div class="at-cl s8">
                      <label class="at-input-label form-group">
                        <span>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.city?.label}</span>
                        <input placeholder={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.city?.placeholder} type="text" name="city" id='city' value="" class="at-input-textfield"></input>
                      </label>
                    </div>
                  : ''}
                  {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.state?.show ? 
                    <div class="at-cl s4">
                      <label class="at-input-label form-group">
                        <span>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.state?.label}</span>
                        <input placeholder={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.state?.placeholder} type="text" name="state" id='state' value="" class="at-input-textfield"></input>
                      </label>
                    </div>
                  : ''}
              </div>
              <div class="at-rw">
                  {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.country?.show ? 
                    <div class="at-cl s8">
                      <label class="at-input-label form-group">
                        <span>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.country?.label}</span>
                        <input placeholder={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.country?.placeholder} type="text" name="country" id='country' value="" class="at-input-textfield"></input>
                      </label>
                    </div>
                  : ''}
                  {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.postalCode?.show ? 
                    <div class="at-cl s4">
                      <label class="at-input-label form-group">
                        <span>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.postalCode?.label}</span>
                        <input placeholder={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.postalCode?.placeholder} type="text" name="postalCode" id='postalCode' value="" class="at-input-textfield"></input>
                      </label>
                    </div>
                  : ''}
              </div>
              <div class="at-rw">
                  {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.identificationType?.show ? 
                    <div class="at-cl s4">
                      <label class="at-selectlabel ic-expandir-mas form-group">
                      <span>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.identificationType?.label}</span>
                      <select class="at-input-select" onInput={this.handleNumberQuotasSelect.bind(this)} name='identificationType' id='identificationType'>
                        {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.identificationType?.options.map(identificationType => (
                          <option key={identificationType.value} value={identificationType.value} selected={identificationType.value === this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.identificationType?.defaultValue}>{identificationType.label}</option>
                        ))}
                      </select>
                    </label>
                    </div>
                    : ''}
                  {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.identificationNumber?.show ? 
                    <div class="at-cl s8">
                      <label class="at-input-label form-group">
                        <span>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.identificationNumber?.label}</span>
                        <input placeholder={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.identificationNumber?.placeholder} type="text" name="identificationNumber" id='identificationNumber' value="" class="at-input-textfield"></input>
                      </label>
                    </div>
                  : ''}
              </div>
              {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.email?.show ? 
                <div class="at-rw">
                    <div class="at-cl">
                      <label class="at-input-label form-group">
                      <span>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.email?.label}</span>
                        <input placeholder={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.email?.placeholder} type="email" name="email" id='email' value="" class="at-input-textfield"></input>
                      </label>
                    </div>
                </div>
                : ''}
              {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.phone?.show ? 
                <div class="at-rw">
                    <div class="at-cl">
                      <label class="at-input-label form-group">
                      <span>{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.phone?.label}</span>
                        <input placeholder={this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.phone?.placeholder} type="tel" name="phone" id='phone' value="" class="at-input-textfield"></input>
                      </label>
                    </div>
                </div>
                : ''}
              {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.rememberCard?.show ? 
                <div class="at-rw at-checkbox-row">
                    <div class="at-cl">
                      <div class="at-input-checkbox form-group">
                        <input type="checkbox" name="rememberCard" id='rememberCard' checked={false}></input>
                        <label></label>
                        <span class="label at-font-p">{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.rememberCard?.label}</span>
                      </div>
                    </div>
                </div>
                : ''}
              {this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.enrollMe?.show ? 
                <div class="at-rw at-checkbox-row">
                    <div class="at-cl">
                      <div class="at-input-checkbox">
                        <input type="checkbox" name="enrollMe" id='enrollMe' checked={false}></input>
                        <label></label>
                        <span class="label at-font-p">{this.postOrderDetailApiResponse?.config?.forms?.newCardForm?.enrollMe?.label}</span>
                      </div>
                    </div>
                </div>
                : ''}
              {this.postOrderDetailApiResponse?.config?.termsAndConditions?.show ? 
                <div class="at-rw">
                    <div class="at-cl at-terms">
                      {this.postOrderDetailApiResponse?.config?.termsAndConditions?.prefix} 
                      <a class="at-link">{this.postOrderDetailApiResponse?.config?.termsAndConditions?.label}</a>
                    </div>
                </div>
                : ''}
            </div> : '' }
            <div class={'at-button-row'}>
            {this.postOrderDetailApiResponse?.config?.actions?.cancel?.show ? 
              <button class="at-button-tertiary" type='button' onClick={() => this.handleStepChange(1)} id="postOrderDetailCancelbtn">{this.postOrderDetailApiResponse?.config?.actions?.cancel?.label}</button>
              : ''}
            {this.postOrderDetailApiResponse?.config?.actions?.submit?.show ? 
              <button class="at-button-primary" type='submit' id="addNewCardFromSubmit">{this.postOrderDetailApiResponse?.config?.actions?.submit?.label}</button>
              : ''}
            </div>
          </form>
        </div> : '' }

        {this.step === 3 ?
        <div class="ml-card">
          {this.postOrderDetailApiResponse?.config?.confirmation?.confirmationTitle?.show ? 
          <div id="postOrderDetailConfirmationTitle" class={'at-card-header'}>{this.postOrderDetailApiResponse?.config?.confirmation?.confirmationTitle?.label}</div> : ''}
          {this.postOrderDetailApiResponse?.config?.confirmation?.orderDetailsTitle?.show ? 
          <div class={'at-rw'}>
            <div class={'at-cl s6'}>
              <div class={'at-card-title'} id="postOrderDetailOrderDetailsTitle">{this.postOrderDetailApiResponse?.config?.confirmation?.orderDetailsTitle?.label}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.data?.offerName?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id="offerNameLbl">{this.postOrderDetailApiResponse?.data?.offerName?.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id="offerNameVal">{this.postOrderDetailApiResponse?.data?.offerName?.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.data?.description?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='descriptionLbl'>{this.postOrderDetailApiResponse?.data?.description?.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id="descriptionVal">{this.postOrderDetailApiResponse?.data?.description?.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.data?.validity?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='validityLbl'>{this.postOrderDetailApiResponse?.data?.validity?.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='validityVal'>{this.postOrderDetailApiResponse?.data?.validity?.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.data?.productType?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='productTypeLbl'>{this.postOrderDetailApiResponse?.data?.productType.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='productTypeval'>{this.postOrderDetailApiResponse?.data?.productType.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.data?.accountNumber?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='accountNumberLbl'>{this.postOrderDetailApiResponse?.data?.accountNumber.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='accountNumberVal'>{this.postOrderDetailApiResponse?.data?.accountNumber.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.data?.categoryName?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='categoryNameLbl'>{this.postOrderDetailApiResponse?.data?.categoryName.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='categoryNameVal'>{this.postOrderDetailApiResponse?.data?.categoryName.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.data?.validity?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='validityLbl'>{this.postOrderDetailApiResponse?.data?.validity.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='validityVal'>{this.postOrderDetailApiResponse?.data?.validity.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.data?.nextPayment?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='nextPaymentLbl'>{this.postOrderDetailApiResponse?.data?.nextPayment.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='nextPaymentVal'>{this.postOrderDetailApiResponse?.data?.nextPayment.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.data?.frequency?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='frequencyLbl'>{this.postOrderDetailApiResponse?.data?.frequency.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='frequencyVal'>{this.postOrderDetailApiResponse?.data?.frequency.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.config?.confirmation?.paymentMethodsTitle?.show ?   
          <div class={'at-rw at-edit-detail'}>
            <div class={'at-cl s6'}>
              <div class={'at-card-title'} id='paymentMethodsTitleLbl'>{this.postOrderDetailApiResponse?.config?.confirmation?.paymentMethodsTitle?.label}</div>
            </div>
            {this.postOrderDetailApiResponse?.config?.confirmation?.actions?.change?.show ? 
            <div class={'at-cl s6'}>
              <button id='paymentMethodchangeBtn' class="at-button-tertiary" type='button' onClick={() => this.cancleConfirmation()}>{this.postOrderDetailApiResponse?.config?.confirmation?.actions?.change?.label}</button>
            </div> : '' }
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.data?.paymentMethod?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='paymentMethodLbl'>{this.postOrderDetailApiResponse?.data?.paymentMethod?.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='paymentMethodval'>{this.postOrderDetailApiResponse?.data?.paymentMethod?.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.data?.wallet?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='walletLbl'>{this.postOrderDetailApiResponse?.data?.wallet?.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='walletVal'>{this.postOrderDetailApiResponse?.data?.wallet?.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.creditCardFormData?.nameCard || this.selectedCreditCard?.cardLabel?.formattedValue ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='nombreLbl'>Nombre:</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='nombreVal'>{this.selectedCreditCard === 'addNewCard' ? this.creditCardFormData?.nameCard : this.selectedCreditCard?.cardLabel?.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.creditCardFormData?.numberCard || this.selectedCreditCard?.maskedCreditCardNumber?.formattedValue ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='tarjetaLbl'>Tarjeta:</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='tarjetaVal'>{this.selectedCreditCard === 'addNewCard' ? creditCardMask(this.creditCardFormData?.numberCard) : this.selectedCreditCard?.maskedCreditCardNumber?.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.getOrderDetailApiResponse?.data?.detail?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='vencimientoLbl'>Vencimiento:</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='vencimientoVal'>{this.selectedCreditCard === 'addNewCard' ? this.creditCardFormData?.expirationDate : this.selectedCreditCard?.expirationMonth?.formattedValue + '/' + this.selectedCreditCard?.expirationYear?.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.config?.confirmation?.invoiceDetails?.show ? 
          <div class={'at-rw at-edit-detail'}>
            <div class={'at-cl s6'}>
              <div class={'at-card-title'} id='invoiceDetailsLbl'>{this.postOrderDetailApiResponse?.config?.confirmation?.invoiceDetails?.label}</div>
            </div>
            {this.postOrderDetailApiResponse?.config?.confirmation?.actions?.changeInvoiceDetails?.show ? 
            <div class={'at-cl s6'}>
              <button id='changeInvoiceDetailsBtn' class="at-button-tertiary" type='button' onClick={() => this.handleStepChange(4)}>{this.postOrderDetailApiResponse?.config?.confirmation?.actions?.changeInvoiceDetails?.label}</button>
            </div> : '' }
          </div> : '' }
          {this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.fullname?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='fullnameLbl'>{this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.fullname?.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='fullnameVal'>{this.billingFormData?.fullname ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.fullname?.value}</div>
            </div>
          </div> : '' }
          {this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.nit?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='nitLbl'>{this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.nit?.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='nitVal'>{this.billingFormData?.nit ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.nit?.value}</div>
            </div>
          </div> : '' }
          {this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.address?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='addressLbl'>{this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.address?.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='addressVal'>{this.billingFormData?.address ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.address?.value}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.email?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='emailLbl'>{this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.email?.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='emailVal'>{this.billingFormData?.email ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.email?.value}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.identificationNumber?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'} id='identificationNumberLbl'>{this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.identificationNumber?.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'} id='identificationNumberVal'>{this.billingFormData?.identificationNumber ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.identificationNumber?.value}</div>
            </div>
          </div> : ''
          }
          {this.postOrderDetailApiResponse?.config?.termsAndConditions?.show ? 
            <div class="at-rw">
                <div class="at-cl at-terms" id='termsAndConditions'>
                  {this.postOrderDetailApiResponse?.config?.termsAndConditions?.prefix} 
                  <a class="at-link">{this.postOrderDetailApiResponse?.config?.termsAndConditions?.label}</a>
                </div>
            </div>
            : ''}
          <div class={'at-button-row'}>
          {this.postOrderDetailApiResponse?.config?.confirmation?.actions?.cancel?.show ? 
            <button id='confirmationCancelBtn' class="at-button-tertiary" type='button' onClick={() => this.cancleConfirmation()}>{this.postOrderDetailApiResponse?.config?.confirmation?.actions?.cancel?.label}</button>
            : ''}
          {this.postOrderDetailApiResponse?.config?.confirmation?.actions?.purchase?.show ? 
            <button id='confirmationPurchaseBtn' class="at-button-primary" type='button' onClick={() => this.handleStepChange(5)}>{this.postOrderDetailApiResponse?.config?.confirmation?.actions?.purchase?.label}</button>
            : ''}
          </div>
        </div> : '' }

        {this.step === 4 ?
        <div class="ml-card">
          <div id='billingDetailHeaderLbl' class={'at-font-label at-font-24 at-bill-detail-title'}>
            Ingresa los datos solicitados para que tu factura sea enviada a tu correo electrónico.
          </div>
          <form id='billingDataForm' class={'form-wrapper'} onSubmit={(e) => this.handleBillingDataFromSubmit(e)}>
          {this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.fullname?.show ? 
          <div class="at-rw">
              <div class="at-cl">
                <label class="at-input-label form-group">
                  <span>{this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.fullname?.label}</span>
                  <input
                    placeholder={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.fullname?.placeholder}
                    type="text"
                    name="fullname"
                    id="fullname"
                    value={this.billingFormData?.fullname ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.fullname?.value}
                    class="at-input-textfield"
                    data-pristine-required={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.fullname?.validations?.required}
                    maxlength={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.fullname?.validations?.maxLength}
                    minlength={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.fullname?.validations?.minLength}
                    data-pristine-required-message="fullname de tarjeta incorrecto"
                    data-pristine-minlength-message="fullname de tarjeta incorrecto"
                    data-pristine-maxlength-message="fullname de tarjeta incorrecto"
                    ></input>
                </label>
              </div>
          </div> : ''}
          {this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.nit?.show ? 
          <div class="at-rw">
              <div class="at-cl">
                <label class="at-input-label form-group">
                <span>{this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.nit?.label}</span>
                  <input
                  placeholder={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.nit?.placeholder} 
                  type="text" 
                  name="nit" 
                  id='nit' 
                  value={this.billingFormData?.nit ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.nit?.value}
                  class="at-input-textfield"
                  data-pristine-required={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.nit?.validations?.required}
                  maxlength={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.nit?.validations?.maxLength}
                  minlength={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.nit?.validations?.minLength}
                  data-pristine-required-message="nit de tarjeta incorrecto"
                  data-pristine-minlength-message="nit de tarjeta incorrecto"
                  data-pristine-maxlength-message="nit de tarjeta incorrecto"
                  ></input>
                </label>
              </div>
          </div> : ''}
          {this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.address?.show ? 
          <div class="at-rw">
              <div class="at-cl">
                <label class="at-input-label form-group">
                <span>{this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.address?.label}</span>
                  <input
                  placeholder={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.address?.placeholder} 
                  type="text" 
                  name="address" 
                  id='address' 
                  value={this.billingFormData?.address ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.address?.value}
                  class="at-input-textfield"
                  data-pristine-required={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.address?.validations?.required}
                  maxlength={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.address?.validations?.maxLength}
                  minlength={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.address?.validations?.minLength}
                  data-pristine-required-message="address de tarjeta incorrecto"
                  data-pristine-minlength-message="address de tarjeta incorrecto"
                  data-pristine-maxlength-message="address de tarjeta incorrecto"
                  ></input>
                </label>
              </div>
          </div> : ''}
          {this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.email?.show ? 
            <div class="at-rw">
                <div class="at-cl">
                  <label class="at-input-label form-group">
                  <span>{this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.email?.label}</span>
                    <input
                    placeholder={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.email?.placeholder} 
                    type="email" 
                    name="email" 
                    id='email' 
                    value={this.billingFormData?.email ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.email?.value}
                    class="at-input-textfield"
                    data-pristine-required={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.email?.validations?.required}
                    maxlength={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.email?.validations?.maxLength}
                    minlength={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.email?.validations?.minLength}
                    data-pristine-required-message="email de tarjeta incorrecto"
                    data-pristine-minlength-message="email de tarjeta incorrecto"
                    data-pristine-maxlength-message="email de tarjeta incorrecto"
                    ></input>
                  </label>
                </div>
            </div>
            : ''}
          {this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.identificationNumber?.show ? 
          <div class="at-rw">
              <div class="at-cl">
                <label class="at-input-label form-group">
                  <span>{this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.identificationNumber?.label}</span>
                  <input
                  placeholder={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.identificationNumber?.placeholder} 
                  type="text" 
                  name="identificationNumber" 
                  id='identificationNumber' 
                  value={this.billingFormData?.identificationNumber ?? this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.identificationNumber?.value}
                  class="at-input-textfield"
                  data-pristine-required={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.identificationNumber?.validations?.required}
                  maxlength={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.identificationNumber?.validations?.maxLength}
                  minlength={this.postOrderDetailApiResponse?.config?.forms?.billingDataForm?.identificationNumber?.validations?.minLength}
                  data-pristine-required-message="identificationNumber de tarjeta incorrecto"
                  data-pristine-minlength-message="identificationNumber de tarjeta incorrecto"
                  data-pristine-maxlength-message="identificationNumber de tarjeta incorrecto"
                  ></input>
                </label>
              </div>
          </div> : ''}
          <div class={'at-button-row'}>
            <button class="at-button-tertiary" type='button' onClick={() => this.handleStepChange(3)}>{this.postOrderDetailApiResponse?.config?.actions?.cancel?.label}</button>
            <button class="at-button-primary" type='submit'>{this.postOrderDetailApiResponse?.config?.actions?.submit?.label}</button>
          </div>
          </form>
        </div> : '' }

        {this.step === 5 && this.orderStatusApiResponse ?
        <div class="ml-card at-order-status">
          <div class={'at-order-status-header'}>
            <div class={'at-rw center'}>
              <div class={'at-cl'}>
                {this.orderStatusApiResponse?.data?.stateOrder?.value === 'FULFILLMENT_COMPLETE' || 
                  this.orderStatusApiResponse?.data?.stateOrder?.value === 'PAYMENT_COMPLETE' ? 
                  <img id='at-order-ok-icon' class="at-order-status-icon" src={getAssetPath('../assets/icons/ok.png')} alt={this.orderStatusApiResponse?.data?.stateOrder?.value} />
                : ''}
                {this.orderStatusApiResponse?.data?.stateOrder?.value === 'FULFILLMENT_NON_COMPLETE' || 
                  this.orderStatusApiResponse?.data?.stateOrder?.value === 'PAYMENT_NON_COMPLETE' ||
                  this.orderStatusApiResponse?.data?.stateOrder?.value === 'PRE_ORDER_EXPIRED' ||
                  this.orderStatusApiResponse?.data?.stateOrder?.value === 'MAX_CHECKOUT_ATTEMPTED' ? 
                  <img id='at-order-failure-icon' class="at-order-status-icon" src={getAssetPath('../assets/icons/failure.svg')} alt={this.orderStatusApiResponse?.data?.stateOrder?.value} />
                : ''}
                {this.orderStatusApiResponse?.data?.stateOrder?.value === 'ORDER_IN_PROGRESS' ||
                  this.orderStatusApiResponse?.data?.stateOrder?.value === 'INITIALIZED' ? 
                  <img id='at-order-warning-icon' class="at-order-status-icon" src={getAssetPath('../assets/icons/warning.svg')} alt={this.orderStatusApiResponse?.data?.stateOrder?.value} />
                : ''}
                <div class="at-text-primary">
                  {this.orderStatusApiResponse?.config?.message?.title}
                </div>
                <div class="at-text-normal">
                  {this.orderStatusApiResponse?.config?.message?.body}
                </div>
                {this.orderStatusApiResponse?.config?.actions?.checkout?.show ?
                <div class="at-status-btn">
                  <button id="checkoutBtn" class="at-button-primary" type='button' onClick={(e) => this.handleStatusButtonClick(e)}>{this.orderStatusApiResponse?.config?.actions?.checkout?.label}</button>
                </div> : ''}
                {this.orderStatusApiResponse?.config?.actions?.home?.show ?
                <div class="at-status-btn">
                  <button id="homeBtn" class="at-button-primary" type='button' onClick={(e) => this.handleStatusButtonClick(e)}>{this.orderStatusApiResponse?.config?.actions?.home?.label}</button>
                </div> : ''}
              </div>
            </div>
          </div>
          <div class={'at-order-status-footer'}>
            
            <div class={'at-rw center'}>
              <div class={'at-cl s12'}>
                <div class='at-detail-btn'>
                  <button class="at-button-iconcolor at-button-tertiary" onClick={() => this.toggleOrderDetail()}>VER DETALLES <i class={this.isOrderDetailOpen ? 'ic-expandir-mas ic-expandir-mas-less' : 'ic-expandir-mas'}></i></button>
                </div>
                <div class='at-detail-title' style={{display: this.isOrderDetailOpen ? 'block' : 'none'}}>
                  <h5>{this.orderStatusApiResponse?.config?.title?.value}</h5>
                </div>
                <div class={'at-rw'} style={{display: this.isOrderDetailOpen ? 'flex' : 'none'}}>
                  <div class={'at-cl s12 m6'}>
                  {this.orderStatusApiResponse?.data?.accountId?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.orderStatusApiResponse?.data?.accountId?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.orderStatusApiResponse?.data?.accountId?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                  {this.orderStatusApiResponse?.data?.accountNumber?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.orderStatusApiResponse?.data?.accountNumber?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.orderStatusApiResponse?.data?.accountNumber?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                  {this.orderStatusApiResponse?.data?.productType?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.orderStatusApiResponse?.data?.productType?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.orderStatusApiResponse?.data?.productType?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                  {this.orderStatusApiResponse?.data?.cardBrand?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.orderStatusApiResponse?.data?.cardBrand?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.orderStatusApiResponse?.data?.cardBrand?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                  </div>
                  <div class={'at-cl s12 m6'}>
                    {this.orderStatusApiResponse?.data?.orderId?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.orderStatusApiResponse?.data?.orderId?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.orderStatusApiResponse?.data?.orderId?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                    {this.orderStatusApiResponse?.data?.transactionEndDate?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.orderStatusApiResponse?.data?.transactionEndDate?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.orderStatusApiResponse?.data?.transactionEndDate?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                    {this.orderStatusApiResponse?.data?.maskedAccountId?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.orderStatusApiResponse?.data?.maskedAccountId?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.orderStatusApiResponse?.data?.maskedAccountId?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                    {this.orderStatusApiResponse?.data?.transactionId?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.orderStatusApiResponse?.data?.transactionId?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.orderStatusApiResponse?.data?.transactionId?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                    {this.orderStatusApiResponse?.data?.numberReference?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.orderStatusApiResponse?.data?.numberReference?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.orderStatusApiResponse?.data?.numberReference?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                    {this.orderStatusApiResponse?.data?.numberAccess?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.orderStatusApiResponse?.data?.numberAccess?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.orderStatusApiResponse?.data?.numberAccess?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                    {this.orderStatusApiResponse?.data?.amount?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.orderStatusApiResponse?.data?.amount?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.orderStatusApiResponse?.data?.amount?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> : '' }

        <div id="mypopup" class="ml-popup" style={{display: this.isAutopacksModalOpen ? 'block' : 'none'}}>
          <div class="popup-content">
            <div class="at-content-popup-header">
              <div class="at-content-popup-title">
                <h5>¡Ahorra tiempo en tus próximos pagos!</h5>
                <img class="at-auto-packs-icon" src={getAssetPath('../assets/imgs/auto-packs.png')} alt="Auto Packs" />
              </div>
            </div>
            <div class="at-content-popup-body">
              <p class="at-font-p">¡Activa el pago automático de tu factura y despreocúpate!</p>
            </div>
            <div class="at-content-popup-footer">
              <button id="autoPaySuccess" class="at-button-primary" onClick={() => this.toggleAutopacksModal(true)}>ACTIVAR PAGO AUTOMÁTICO</button>
              <button id="autoPayClose" class="at-button-secondary" onClick={() => this.toggleAutopacksModal(false)}>NO, GRACIAS</button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
