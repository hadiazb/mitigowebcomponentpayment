import { Component, Element, Event, Host, Prop, State, Watch, getAssetPath, h, EventEmitter } from '@stencil/core';
import { GetEnrollmentsApiResponse } from '../../interfaces/get-enrollments.interface';
import { HttpService } from '../../http';
import { GetEnrollmentsDetailApiResponse } from '../../interfaces/get-enrollments-detail.interface';
import { creditCardMask, encryptRsa, expiryInfo, getCardExpiry, getCardType, getCreditCardIcon, getPaymentMethodIcon, getPaymentMethods } from '../../utils/utils';
import { PaymentMethod } from '../../interfaces/payment-method.interface';
import { PAYMENT_METHOD_TYPE } from '../../constants';
import { GetEnrollmentsNewCardFormApiResponse } from '../../interfaces/get-enrollments-newcardform.interface';
import { ccExpiryInputInputHandler, ccExpiryInputKeyDownHandler, ccNumberInputInputHandler, ccNumberInputKeyDownHandler } from '../../utils/credit-card';
import { CreditCardFormData } from '../../interfaces/credit-card-form-data.interface';
import { PutEnrollmentsApiResponse } from '../../interfaces/put-enrollments.interface';
import Pristine from 'pristinejs';
import { WcData } from '../../interfaces/wc-data.interface';
@Component({
  tag: 'wc-auto-payment',
  styleUrl: 'wc-auto-payment.css',
  assetsDirs: ['assets'],
  shadow: true,
})
export class WcAutoPayment {
  @Element() el: HTMLElement;
  @Prop() wcData: string;
  @State() _wcData: WcData;
  @State() isAutopacksModalOpen: boolean = false;
  @State() isLoading: boolean = false;
  @State() getEnrollmentsApiResponse: GetEnrollmentsApiResponse;
  @State() step: number = 1;
  @State() getEnrollmentsDetailApiResponse: GetEnrollmentsDetailApiResponse;
  @State() isDeleteAutopayModalOpen: boolean = false;
  @State() postEnrollmentsData: GetEnrollmentsNewCardFormApiResponse;
  @State() selectedCreditCard: any;
  @State() creditCardFormData: CreditCardFormData;
  @State() putEnrollmentsApiResponse: PutEnrollmentsApiResponse;
  @State() isOrderDetailOpen: boolean = true;
  @State() getEncryptionCode: {publicKey: string};
  @Event() loading: EventEmitter<any>;
  @Event() wcMessage: EventEmitter<any>;
  @Event() wcRefreshToken: EventEmitter<any>;
  @Event() wcSegment: EventEmitter<any>;
  @Event() wcLoading: EventEmitter<any>;

  private paymentMethods: PaymentMethod[];
  private selectedPaymentMethod: string;
  private selectedAccountType: string = 'home';
  private pristineForm: Pristine;

  @Watch('wcData')
  parseWcDataProp(newValue: string) {
    if (newValue) this._wcData = JSON.parse(newValue);
  }

  private toggleDeleteAutopacksModal(data?: boolean): void {
    if (data) {
      this.deleteEnrollment();
    }
    this.isDeleteAutopayModalOpen = !this.isDeleteAutopayModalOpen;
  }

  private toggleOrderDetail(): void {
    this.isOrderDetailOpen = !this.isOrderDetailOpen;
  }

  async getEnrollments() {
    this.isLoading = true;
    this.loading.emit({
      eventName: 'loading',
      data: {
        stateLoading: true,
      }
    });
    await HttpService.getData(
      `/${this._wcData?.uuid}/recurringpayment/${this._wcData?.idType}/${this._wcData?.accountNumber}/enrollments`,
      this._wcData?.idToken,
      'GetEnrollmentsData'
    );
    this.getEnrollmentsApiResponse = HttpService.getEnrollmentsData;
    if (HttpService.getEnrollmentsData === undefined && HttpService.apiError) {
      this.handleApiError();
    }
    this.isLoading = false;
    this.loading.emit({
      eventName: 'loading',
      data: {
        stateLoading: false,
      }
    });
  }

  async deleteEnrollment() {
    this.isLoading = true;
    this.loading.emit({
      eventName: 'loading',
      data: {
        stateLoading: true,
      }
    });
    const enrollmentId = this.getEnrollmentsApiResponse?.data?.enrollments[0]?.id?.formattedValue;
    await HttpService.deleteData(
      `/${this._wcData?.uuid}/recurringpayment/${this._wcData?.idType}/${this._wcData?.accountNumber}/enrollment/${enrollmentId}`,
      this._wcData?.idToken,
      'deleteEnrollmentsData'
    );
    // this.getEnrollmentsApiResponse = HttpService.deleteEnrollmentsData;
    if (HttpService.deleteEnrollmentsData === undefined && HttpService.apiError) {
      this.handleApiError();
    } else {
      this.handleStepChange(1);
    }
    this.isLoading = false;
    this.loading.emit({
      eventName: 'loading',
      data: {
        stateLoading: false,
      }
    });
  }

  async getEnrollmentsDetailData() {
    this.handleStepChange(2);
    this.isLoading = true;
    await HttpService.getData(
      `/${this._wcData?.uuid}/recurringpayment/${this._wcData?.idType}/${this._wcData?.accountNumber}/enrollments/details`,
      this._wcData?.idToken,
      'GetEnrollmentsDetailApiResponse'
    );
    this.getEnrollmentsDetailApiResponse = HttpService.getEnrollmentsDetailData;
    if (HttpService.getEnrollmentsDetailData === undefined && HttpService.apiError) {
      this.handleApiError();
    }
    this.paymentMethods = getPaymentMethods(this.getEnrollmentsDetailApiResponse);
    this.isLoading = false;
  }

  async getEnrollmentsNewCardFormData() {
    this.isLoading = true;
    await HttpService.postData(
      `/${this._wcData?.uuid}/recurringpayment/${this._wcData?.idType}/${this._wcData?.accountNumber}/enrollments`,
      this._wcData?.idToken,
      {
        paymentMethodName: this.selectedPaymentMethod,
        deviceId: this._wcData?.deviceId,
        recurringpaymentType: 'autopayment'
      },
      'postEnrollmentsData'
    );
    this.postEnrollmentsData = HttpService.postEnrollmentsData;
    if (HttpService.postEnrollmentsData === undefined && HttpService.apiError) {
      this.handleApiError();
    }
    if (this.postEnrollmentsData?.config?.tokenizedCards?.length === 0) {
      this.selectedCreditCard = 'addNewCard';
    } else {
      this.selectedCreditCard = this.postEnrollmentsData?.config?.tokenizedCards?.[0];
    }
    this.isLoading = false;
  }

  async getEncryptionCodeDetail() {
    this.isLoading = true;
    this.wcLoading.emit({
      isLoading: true
    });
    await HttpService.getData(
      `/${this._wcData?.uuid}/${this._wcData?.idType}/${this._wcData?.channel}/${this._wcData?.channelType}/code`,
      this._wcData?.idToken,
      'GetEncryptionCode'
    );
    this.getEncryptionCode = HttpService.getEncryptionCode;
    if (HttpService.getEncryptionCode === undefined && HttpService.apiError) {
      this.handleApiError();
      this.isLoading = false;
    } else {
      this.getEnrollmentsNewCardFormData();
    }
    this.wcLoading.emit({
      isLoading: false
    });
  }

  async putEnrollmentsData() {
    this.handleStepChange(5);
    this.handleSegmentCall('Checkout Attempted');
    this.isLoading = true;
    this.wcLoading.emit({
      isLoading: true
    });
    const numberCard = this.creditCardFormData?.numberCard?.replace(/[^\d]/g, '');
    let body = {
      paymentMethodName: this.selectedPaymentMethod,
      recurringpaymentType: "autopayment",
      channel: this._wcData?.channel,
      channelType: this._wcData?.channelType,
      createPaymentToken: this.creditCardFormData?.rememberCard,
      deviceId: this._wcData?.deviceId,
    };
    if (this.selectedCreditCard === 'addNewCard') {
      body['cardType'] = getCardType(this.creditCardFormData?.numberCard)?.toUpperCase();
      body['customerName'] = this.creditCardFormData?.nameCard;
      body['expirationMonth'] = expiryInfo(this.creditCardFormData?.expirationDate, 'month');
      body['expirationYear'] = expiryInfo(this.creditCardFormData?.expirationDate, 'year');
      body['numberCard'] = encryptRsa(this.getEncryptionCode?.publicKey, numberCard);
      // body['numberCard'] = numberCard;
    } else {
      body['tokenizedCardId'] = this.selectedCreditCard?.tokenizedCardId?.formattedValue;
    }
    if (this.creditCardFormData?.cvv) {
      //body['cvv'] = this.creditCardFormData?.cvv;
      body['cvv'] = encryptRsa(this.getEncryptionCode?.publicKey, this.creditCardFormData?.cvv);
    }
    await HttpService.putData(
      `/${this._wcData?.uuid}/recurringpayment/${this._wcData?.idType}/${this._wcData?.accountNumber}/enrollments`,
      this._wcData?.idToken,
      body,
      'putEnrollmentsData'
    );
    this.putEnrollmentsApiResponse = HttpService.putEnrollmentsData;
    if (HttpService.putEnrollmentsData === undefined && HttpService.apiError) {
      this.putEnrollmentsApiResponse = undefined;
      this.handleApiError();
    }
    this.isLoading = false;
    this.wcLoading.emit({
      isLoading: false
    });
    this.handleSegmentCall('Checkout Started');
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

  private onCardValueChange(index, event): void {
    const el = event.target as HTMLSelectElement;
    if(typeof(index) === 'number') {
      this.selectedCreditCard = this.postEnrollmentsData?.config?.tokenizedCards?.[index];
    } else {
      this.selectedCreditCard = el.value;
    }
    this.pristineForm = undefined;
  }

  private handleCredirCardFromSubmit(e: Event): void {
    e.preventDefault();
    const isAddNewCardFromValid = this.pristineForm.validate();
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
    if (enrollMe) {
      this.toggleAutopacksModal();
    } else {
      (this.el.shadowRoot.querySelector('#addNewCardFrom') as HTMLFormElement)?.reset();
      this.handleStepChange(4);
    }
  }

  private cancleConfirmation(): void {
    if (this.postEnrollmentsData?.config?.tokenizedCards?.length === 0) {
      this.selectedCreditCard = 'addNewCard';
    } else {
      this.selectedCreditCard = this.postEnrollmentsData?.config?.tokenizedCards?.[0];
    }
    this.step = 3;
  }

  private toggleAutopacksModal(data?: boolean): void {
    this.isAutopacksModalOpen = !this.isAutopacksModalOpen;
    if (data === false) {
      this.handleSegmentCall('Automatic Payment Rejected');
      (this.el.shadowRoot.querySelector('#enrollMe') as HTMLInputElement).checked = false;
    } else if(data === true) {
      this.handleSegmentCall('Automatic Payment Activated');
      this.handleStepChange(4);
    }
  }

  private handleNumberQuotasSelect(event: Event): void {
    const el = event.target as HTMLSelectElement;
    console.log(el.value);
  }

  private handleSelectPaymentMethod(): void {
    this.selectedPaymentMethod = PAYMENT_METHOD_TYPE.CreditCard;
    this.getEncryptionCodeDetail();
    this.step += 1;
  }

  private handleStepChange(step: number): void {
    if (step === 2 || step === 1) {
      this.selectedPaymentMethod = undefined;
      this.selectedCreditCard = undefined;
      this.postEnrollmentsData = undefined;
    }
    if (step === 1) {
      this.getEnrollmentsApiResponse = undefined;
      this.getEnrollmentsDetailApiResponse = undefined;
      this.putEnrollmentsApiResponse = undefined;
      this.getEnrollments();
    }
    this.step = step;
  }

  private handleSegmentCall(segmentName: string): void {
    this.wcSegment.emit({
      name: segmentName,
      properties: {},
      eventType: 'track'
    });
  }

  componentWillLoad() {
    this.parseWcDataProp(this.wcData);
    this.getEnrollments();
  }

  componentDidUpdate() {
    const addNewCardFrom = this.el.shadowRoot.querySelector('#addNewCardFrom');
    if (addNewCardFrom && !this.pristineForm) {
      let defaultConfig = {
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
      this.pristineForm = new Pristine(addNewCardFrom, defaultConfig, true);
      const expirationDate: HTMLInputElement = this.el.shadowRoot.querySelector('#expirationDate');
      if (expirationDate) {
        this.pristineForm.addValidator(expirationDate, function(value) {
          if (value.match(/^((0[1-9]|1[0-2])\/\d{2})$/)) {
            const {0: month, 1: year} = value.split("/");
            const a = Number(`20${year}`);
            // get midnight of first day of the next month
            const expiry = new Date(a, month);
            const current = new Date();
            
            return expiry.getTime() > current.getTime();
            
          }
          return false;
          
        }, " sddd", 2, false);
      }
    }
  }

  render() {
    return (
      <Host>
        <link rel="stylesheet" href="https://atomic.tigocloud.net/sandbox/css/main-v1.2.3.min.css"/>
        {this.isLoading ?
        <div class="ml-card at-loading"><div class="at-medium-circular-progress-indicator loading"></div></div> : ''}

        {this.step === 1 && this.getEnrollmentsApiResponse ?
        <div class="ml-card">
          {this.getEnrollmentsApiResponse?.config?.title?.show ? <div class={'at-card-header'}>{this.getEnrollmentsApiResponse?.config?.title?.value}</div> : ''}
          {this.getEnrollmentsApiResponse?.data?.noData?.value === 'empty' ? <div class={'at-font-p'}>{this.getEnrollmentsApiResponse?.config?.description}</div> : ''}
          {this.getEnrollmentsApiResponse?.data?.noData?.value === 'empty' ? 
          <div class={'at-rw at-nodata-box'}>
              <div class={'at-cl s2'}>
              <img class="at-autopay-icon" src={getAssetPath('../assets/credit-card-icons/card_image_icon.svg')} alt="Auto Packs" />
              </div>
              <div class={'at-cl s10 right'}>
                <div class={'at-rw'}>
                  <div class={'at-cl'}>
                    <div class={'at-nodata-title at-font-p'}>
                      {this.getEnrollmentsApiResponse?.config?.message}
                    </div>
                  </div>
                </div>
                <div class={'at-rw end'}>
                  {this.getEnrollmentsApiResponse?.config?.actions?.addEnrollment?.show ? <button class="at-button-primary" onClick={() => this.getEnrollmentsDetailData()}>{this.getEnrollmentsApiResponse?.config?.actions?.addEnrollment?.label}</button> : ''}
                </div>
              </div>
          </div>
          : '' }
          {!this.getEnrollmentsApiResponse?.data?.noData ? 
          <div class={'at-card-detail-box'}>
            <div class={'at-rw at-card-number'}>
                <div class={'at-cl s1'}>
                  <img class="at-account-type-icon" src={getAssetPath(this.selectedAccountType === 'home' ? '../assets/imgs/home-theme.svg' : '../assets/imgs/blue-phone.svg')} alt={this.selectedAccountType} />
                </div>
                {this.getEnrollmentsApiResponse?.data?.enrollments[0]?.msisdn?.show ? 
                <div class={'at-cl s8 at-font-h4'}>
                  {this.getEnrollmentsApiResponse?.data?.enrollments[0]?.msisdn?.formattedValue}
                </div> : '' }
                <div class={'at-cl s3 at-action-cl'}>
                  {this.getEnrollmentsApiResponse?.config?.actions?.editEnrollment?.show ? 
                   <img class="at-account-edit-icon" onClick={() => this.getEnrollmentsDetailData()} src={getAssetPath('../assets/imgs/blue-pencil.svg')} alt='Edit' /> : ''}
                  {this.getEnrollmentsApiResponse?.config?.actions?.delete?.show ? 
                   <img  class="at-account-delete-icon" onClick={() => this.toggleDeleteAutopacksModal(false)} src={getAssetPath('../assets/imgs/blue-trash.svg')} alt='Delete' /> : ''}
                </div>
            </div>
            {this.getEnrollmentsApiResponse?.data?.enrollments[0]?.cardType?.show ? 
            <div class={'at-rw'}>
                <div class={'at-cl s1'}>
                  
                </div>
                <div class={'at-cl s5 at-card-lable'}>
                  {this.getEnrollmentsApiResponse?.data?.enrollments[0]?.cardType?.label}
                </div>
                <div class={'at-cl s5 at-card-text'}>
                <img class="at-card-icon" src={getCreditCardIcon(this.getEnrollmentsApiResponse?.data?.enrollments[0]?.cardType?.value?.toLowerCase())} alt='Delete' /> {this.getEnrollmentsApiResponse?.data?.enrollments[0]?.maskedCreditCardNumber?.formattedValue}
                </div>
            </div> : '' }
            {this.getEnrollmentsApiResponse?.data?.enrollments[0]?.expirationDate?.show ? 
            <div class={'at-rw'}>
                <div class={'at-cl s1'}>
                  
                </div>
                <div class={'at-cl s5 at-card-lable'}>
                  {this.getEnrollmentsApiResponse?.data?.enrollments[0]?.expirationDate?.label}
                </div>
                <div class={'at-cl s5 at-card-text'}>
                {this.getEnrollmentsApiResponse?.data?.enrollments[0]?.expirationDate?.formattedValue}
                </div>
            </div> : '' }
            {this.getEnrollmentsApiResponse?.data?.enrollments[0]?.customerName?.show ? 
            <div class={'at-rw'}>
                <div class={'at-cl s1'}>
                  
                </div>
                <div class={'at-cl s5 at-card-lable'}>
                  {this.getEnrollmentsApiResponse?.data?.enrollments[0]?.customerName?.label}
                </div>
                <div class={'at-cl s5 at-card-text'}>
                {this.getEnrollmentsApiResponse?.data?.enrollments[0]?.customerName?.formattedValue}
                </div>
            </div> : '' }
            {this.getEnrollmentsApiResponse?.data?.enrollments[0]?.email?.show ? 
            <div class={'at-rw'}>
                <div class={'at-cl s1'}>
                  
                </div>
                <div class={'at-cl s5 at-card-lable'}>
                  {this.getEnrollmentsApiResponse?.data?.enrollments[0]?.email?.label}
                </div>
                <div class={'at-cl s5 at-card-text'}>
                {this.getEnrollmentsApiResponse?.data?.enrollments[0]?.email?.formattedValue}
                </div>
            </div> : '' }
          </div> : ''
          }
        </div> : '' }

        {this.step === 2 && this.getEnrollmentsDetailApiResponse ?
        <div class="ml-card">
          {this.getEnrollmentsDetailApiResponse?.config?.title?.show ? <div class={'at-card-header'}>{this.getEnrollmentsDetailApiResponse?.config?.title?.value}</div> : ''}
          {this.getEnrollmentsDetailApiResponse?.data?.transactionType?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'}>{this.getEnrollmentsDetailApiResponse?.data?.transactionType.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'}>{this.getEnrollmentsDetailApiResponse?.data?.transactionType.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.getEnrollmentsDetailApiResponse?.data?.accountNumber?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'}>{this.getEnrollmentsDetailApiResponse?.data?.accountNumber.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'}>{this.getEnrollmentsDetailApiResponse?.data?.accountNumber.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.getEnrollmentsDetailApiResponse?.data?.accountToEnroll?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'}>{this.getEnrollmentsDetailApiResponse?.data?.accountToEnroll.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'}>{this.getEnrollmentsDetailApiResponse?.data?.accountToEnroll.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.getEnrollmentsDetailApiResponse?.data?.invoiceAmount?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'}>{this.getEnrollmentsDetailApiResponse?.data?.invoiceAmount.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'}>{this.getEnrollmentsDetailApiResponse?.data?.invoiceAmount.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.getEnrollmentsDetailApiResponse?.config?.note !== '' ? 
          <div class={'at-rw at-note-text'}>
              <div class={'at-cl'}>{this.getEnrollmentsDetailApiResponse?.config?.note}</div>
          </div> : ''
          }
        </div> : '' }

        {this.step === 2 && this.getEnrollmentsDetailApiResponse ?
        <div class="ml-card at-payment-list-card">
          {this.getEnrollmentsDetailApiResponse?.config?.title?.show ? <div class={this.paymentMethods?.length === 1 ? 'at-card-header at-single-paymentMethod-header':'at-card-header'}>{this.getEnrollmentsDetailApiResponse?.config?.title?.value}</div> : ''}
          {this.paymentMethods?.map((paymentMethod) => (
            <div key={paymentMethod?.label} class={this.paymentMethods?.length === 1 ? 'at-paymentMethod-item at-single-paymentMethod-item':'at-paymentMethod-item'} onClick={() => {this.handleSelectPaymentMethod()}}>
                <img src={getPaymentMethodIcon(paymentMethod?.paymentMethodName)} class="at-pay-icon" alt={paymentMethod.label}></img>
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

        {this.step === 3 && this.postEnrollmentsData ?
        <div class="ml-card">
          {this.postEnrollmentsData?.config?.title?.show ?
           <div class={'at-credit-card-row'}>
              <img src={getPaymentMethodIcon(this.selectedPaymentMethod)} class="at-payment-type-icon" alt="Payment Icon"></img>
              <span class="at-payment-method">{this.postEnrollmentsData?.config?.title?.value}</span>
          </div> : ''}
          {this.postEnrollmentsData?.config?.description ? 
          <div class="at-bill-pay-content-description at-bill-title">
            {this.postEnrollmentsData?.config?.description}
          </div> : ''}
          <form id='addNewCardFrom' class={'form-wrapper'} onSubmit={(e) => this.handleCredirCardFromSubmit(e)}>
            {this.postEnrollmentsData?.config?.tokenizedCards?.map((tokenizedCard, i) => (
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
            {this.postEnrollmentsData?.config?.tokenizedCards?.length > 0 ? 
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
              {this.postEnrollmentsData?.config?.forms?.newCardForm?.description?.show ? 
                <div class="at-rw">
                    <div class="at-cl at-font-h5 s12">
                      <span class={'at-font-p'}>{this.postEnrollmentsData?.config?.forms?.newCardForm?.description?.label}</span> 
                      {this.postEnrollmentsData?.config?.forms?.newCardForm?.numberCard?.validations?.allowedCreditCards?.map((item) => (
                        <img key={item} class="at-pay-accepted-card-icon" alt={item} src={getCreditCardIcon(item?.toLocaleLowerCase())}></img>
                      ))}
                    </div>
                    <div class={'at-pay-accepted-card s12 at-font-p'}>{this.postEnrollmentsData?.config?.forms?.newCardForm?.description?.details}</div>
                </div> : ''}
              {this.postEnrollmentsData?.config?.forms?.newCardForm?.numberCard?.show ? 
              <div class="at-rw">
                  <div class="at-cl">
                    <label class="at-input-label form-group">
                      <span>{this.postEnrollmentsData?.config?.forms?.newCardForm?.numberCard?.label}</span>
                      <input 
                        placeholder={this.postEnrollmentsData?.config?.forms?.newCardForm?.numberCard?.placeholder} 
                        type="text" 
                        id="numberCard"
                        name="numberCard" 
                        value=""
                        class="at-input-textfield card-number" 
                        data-pristine-required={this.postEnrollmentsData?.config?.forms?.newCardForm?.numberCard?.validations?.required}
                        maxlength={this.postEnrollmentsData?.config?.forms?.newCardForm?.numberCard?.validations?.maxLength}
                        minlength={this.postEnrollmentsData?.config?.forms?.newCardForm?.numberCard?.validations?.minLength}
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
                  {this.postEnrollmentsData?.config?.forms?.newCardForm?.expirationDate?.show ? 
                  <div class="at-cl s6">
                    <label class="at-input-label form-group">
                      <span>{this.postEnrollmentsData?.config?.forms?.newCardForm?.expirationDate?.label}</span>
                      <input 
                        placeholder={this.postEnrollmentsData?.config?.forms?.newCardForm?.expirationDate?.placeholder} 
                        type="text" 
                        name="expirationDate" 
                        id="expirationDate"
                        value="" 
                        class="at-input-textfield expiry"
                        data-pristine-required={this.postEnrollmentsData?.config?.forms?.newCardForm?.expirationDate?.validations?.required}
                        maxlength={this.postEnrollmentsData?.config?.forms?.newCardForm?.expirationDate?.validations?.maxLength}
                        minlength={this.postEnrollmentsData?.config?.forms?.newCardForm?.expirationDate?.validations?.minLength}
                        onKeyDown={ccExpiryInputKeyDownHandler}
                        onInput={ccExpiryInputInputHandler}
                        data-pristine-required-message="Fecha inválida"
                        data-pristine-minlength-message="Fecha inválida"
                        data-pristine-maxlength-message="Fecha inválida"
                        data-pristine-my-expiry="true"
                        ></input>
                    </label>
                  </div> : ''}
                  {this.postEnrollmentsData?.config?.forms?.newCardForm?.cvv?.show ? 
                  <div class="at-cl s6">
                    <label class="at-input-label form-group">
                      <span>{this.postEnrollmentsData?.config?.forms?.newCardForm?.cvv?.label}</span>
                      <input
                        placeholder={this.postEnrollmentsData?.config?.forms?.newCardForm?.cvv?.placeholder}
                        type="tel"
                        name="cvv"
                        id='cvv'
                        value=""
                        data-pristine-required={this.postEnrollmentsData?.config?.forms?.newCardForm?.cvv?.validations?.required}
                        maxlength={this.postEnrollmentsData?.config?.forms?.newCardForm?.cvv?.validations?.maxLength}
                        minlength={this.postEnrollmentsData?.config?.forms?.newCardForm?.cvv?.validations?.minLength}
                        class="at-input-textfield cvv"
                        data-pristine-required-message="CVV incorrecto"
                        data-pristine-minlength-message="CVV incorrecto"
                        data-pristine-maxlength-message="CVV incorrecto"
                        ></input>
                    </label>
                  </div> : ''}
              </div>
              <div class="at-rw">
                {this.postEnrollmentsData?.config?.forms?.newCardForm?.nameCard?.show ? 
                  <div class={this.postEnrollmentsData?.config?.forms?.newCardForm?.nameCard?.show && this.postEnrollmentsData?.config?.forms?.newCardForm?.numberQuotas?.show ? 'at-cl s8' : 'at-cl s12'}>
                    <label class="at-input-label form-group">
                      <span>{this.postEnrollmentsData?.config?.forms?.newCardForm?.nameCard?.label}</span>
                      <input placeholder={this.postEnrollmentsData?.config?.forms?.newCardForm?.nameCard?.placeholder}
                        type="text"
                        name="nameCard"
                        id="nameCard"
                        value=""
                        class="at-input-textfield"
                        data-pristine-required={this.postEnrollmentsData?.config?.forms?.newCardForm?.nameCard?.validations?.required}
                        maxlength={this.postEnrollmentsData?.config?.forms?.newCardForm?.nameCard?.validations?.maxLength}
                        minlength={this.postEnrollmentsData?.config?.forms?.newCardForm?.nameCard?.validations?.minLength}
                        data-pristine-required-message="Por favor ingresa tu nombre como sale en la tarjeta"
                        data-pristine-minlength-message="Por favor ingresa tu nombre como sale en la tarjeta"
                        data-pristine-maxlength-message="Por favor ingresa tu nombre como sale en la tarjeta"
                        ></input>
                    </label>
                  </div> : ''}
                  {this.postEnrollmentsData?.config?.forms?.newCardForm?.numberQuotas?.show ? 
                  <div class="at-cl s4">
                    <label class="at-selectlabel ic-expandir-mas form-group">
                      <span>{this.postEnrollmentsData?.config?.forms?.newCardForm?.numberQuotas?.label}</span>
                      <select class="at-input-select" onInput={this.handleNumberQuotasSelect.bind(this)} name='numberQuotas' id='numberQuotas'>
                        {this.postEnrollmentsData?.config?.forms?.newCardForm?.numberQuotas?.options.map(numberQuota => (
                          <option key={numberQuota.value} value={numberQuota.value} selected={numberQuota.value === this.postEnrollmentsData?.config?.forms?.newCardForm?.numberQuotas?.defaultValue}>{numberQuota.label}</option>
                        ))}
                      </select>
                    </label>
                  </div> : ''}
              </div>
              {this.postEnrollmentsData?.config?.forms?.newCardForm?.address?.show ? 
              <div class="at-rw">
                  <div class="at-cl">
                    <label class="at-input-label form-group">
                    <span>{this.postEnrollmentsData?.config?.forms?.newCardForm?.address?.label}</span>
                      <input placeholder={this.postEnrollmentsData?.config?.forms?.newCardForm?.address?.placeholder} type="text" name="address" id='address' value="" class="at-input-textfield"></input>
                    </label>
                  </div>
              </div> : ''}
              <div class="at-rw">
                  {this.postEnrollmentsData?.config?.forms?.newCardForm?.city?.show ? 
                    <div class="at-cl s8">
                      <label class="at-input-label form-group">
                        <span>{this.postEnrollmentsData?.config?.forms?.newCardForm?.city?.label}</span>
                        <input placeholder={this.postEnrollmentsData?.config?.forms?.newCardForm?.city?.placeholder} type="text" name="city" id='city' value="" class="at-input-textfield"></input>
                      </label>
                    </div>
                  : ''}
                  {this.postEnrollmentsData?.config?.forms?.newCardForm?.state?.show ? 
                    <div class="at-cl s4">
                      <label class="at-input-label form-group">
                        <span>{this.postEnrollmentsData?.config?.forms?.newCardForm?.state?.label}</span>
                        <input placeholder={this.postEnrollmentsData?.config?.forms?.newCardForm?.state?.placeholder} type="text" name="state" id='state' value="" class="at-input-textfield"></input>
                      </label>
                    </div>
                  : ''}
              </div>
              <div class="at-rw">
                  {this.postEnrollmentsData?.config?.forms?.newCardForm?.country?.show ? 
                    <div class="at-cl s8">
                      <label class="at-input-label form-group">
                        <span>{this.postEnrollmentsData?.config?.forms?.newCardForm?.country?.label}</span>
                        <input placeholder={this.postEnrollmentsData?.config?.forms?.newCardForm?.country?.placeholder} type="text" name="country" id='country' value="" class="at-input-textfield"></input>
                      </label>
                    </div>
                  : ''}
                  {this.postEnrollmentsData?.config?.forms?.newCardForm?.postalCode?.show ? 
                    <div class="at-cl s4">
                      <label class="at-input-label form-group">
                        <span>{this.postEnrollmentsData?.config?.forms?.newCardForm?.postalCode?.label}</span>
                        <input placeholder={this.postEnrollmentsData?.config?.forms?.newCardForm?.postalCode?.placeholder} type="text" name="postalCode" id='postalCode' value="" class="at-input-textfield"></input>
                      </label>
                    </div>
                  : ''}
              </div>
              <div class="at-rw">
                  {this.postEnrollmentsData?.config?.forms?.newCardForm?.identificationType?.show ? 
                    <div class="at-cl s4">
                      <label class="at-selectlabel ic-expandir-mas form-group">
                      <span>{this.postEnrollmentsData?.config?.forms?.newCardForm?.identificationType?.label}</span>
                      <select class="at-input-select" onInput={this.handleNumberQuotasSelect.bind(this)} name='identificationType' id='identificationType'>
                        {this.postEnrollmentsData?.config?.forms?.newCardForm?.identificationType?.options.map(identificationType => (
                          <option key={identificationType.value} value={identificationType.value} selected={identificationType.value === this.postEnrollmentsData?.config?.forms?.newCardForm?.identificationType?.defaultValue}>{identificationType.label}</option>
                        ))}
                      </select>
                    </label>
                    </div>
                    : ''}
                  {this.postEnrollmentsData?.config?.forms?.newCardForm?.identificationNumber?.show ? 
                    <div class="at-cl s8">
                      <label class="at-input-label form-group">
                        <span>{this.postEnrollmentsData?.config?.forms?.newCardForm?.identificationNumber?.label}</span>
                        <input placeholder={this.postEnrollmentsData?.config?.forms?.newCardForm?.identificationNumber?.placeholder} type="text" name="identificationNumber" id='identificationNumber' value="" class="at-input-textfield"></input>
                      </label>
                    </div>
                  : ''}
              </div>
              {this.postEnrollmentsData?.config?.forms?.newCardForm?.email?.show ? 
                <div class="at-rw">
                    <div class="at-cl">
                      <label class="at-input-label form-group">
                      <span>{this.postEnrollmentsData?.config?.forms?.newCardForm?.email?.label}</span>
                        <input placeholder={this.postEnrollmentsData?.config?.forms?.newCardForm?.email?.placeholder} type="email" name="email" id='email' value="" class="at-input-textfield"></input>
                      </label>
                    </div>
                </div>
                : ''}
              {this.postEnrollmentsData?.config?.forms?.newCardForm?.phone?.show ? 
                <div class="at-rw">
                    <div class="at-cl">
                      <label class="at-input-label form-group">
                      <span>{this.postEnrollmentsData?.config?.forms?.newCardForm?.phone?.label}</span>
                        <input placeholder={this.postEnrollmentsData?.config?.forms?.newCardForm?.phone?.placeholder} type="tel" name="phone" id='phone' value="" class="at-input-textfield"></input>
                      </label>
                    </div>
                </div>
                : ''}
              {this.postEnrollmentsData?.config?.forms?.newCardForm?.rememberCard?.show ? 
                <div class="at-rw at-checkbox-row">
                    <div class="at-cl">
                      <div class="at-input-checkbox form-group">
                        <input type="checkbox" name="rememberCard" id='rememberCard' checked={false}></input>
                        <label></label>
                        <span class="label at-font-p">{this.postEnrollmentsData?.config?.forms?.newCardForm?.rememberCard?.label}</span>
                      </div>
                    </div>
                </div>
                : ''}
              {this.postEnrollmentsData?.config?.forms?.newCardForm?.enrollMe?.show ? 
                <div class="at-rw at-checkbox-row">
                    <div class="at-cl">
                      <div class="at-input-checkbox">
                        <input type="checkbox" name="enrollMe" id='enrollMe' checked={false}></input>
                        <label></label>
                        <span class="label at-font-p">{this.postEnrollmentsData?.config?.forms?.newCardForm?.enrollMe?.label}</span>
                      </div>
                    </div>
                </div>
                : ''}
              {this.postEnrollmentsData?.config?.termsAndConditions?.show ? 
                <div class="at-rw">
                    <div class="at-cl at-terms">
                      {this.postEnrollmentsData?.config?.termsAndConditions?.prefix} 
                      <a class="at-link">{this.postEnrollmentsData?.config?.termsAndConditions?.label}</a>
                    </div>
                </div>
                : ''}
            </div> : ''}
            <div class={'at-button-row'}>
            {this.postEnrollmentsData?.config?.actions?.initCancel?.show ? 
              <button class="at-button-tertiary" type='button' onClick={() => this.handleStepChange(2)}>{this.postEnrollmentsData?.config?.actions?.initCancel?.label}</button>
              : ''}
            {this.postEnrollmentsData?.config?.actions?.initSubmit?.show ? 
              <button class="at-button-primary" type='submit' id="addNewCardFromSubmit">{this.postEnrollmentsData?.config?.actions?.initSubmit?.label}</button>
              : ''}
            </div>
          </form>
        </div> : '' }

        {this.step === 4 && this.postEnrollmentsData ?
        <div class="ml-card">
          {this.postEnrollmentsData?.config?.summary?.title?.show ? 
          <div class={'at-card-header'}>{this.postEnrollmentsData?.config?.summary?.title?.value}</div> : ''}
          {this.postEnrollmentsData?.config?.summary?.description !== '' ? 
          <div class={'at-rw at-font-p at-summary-description'}>
              <div class={'at-cl'}>{this.postEnrollmentsData?.config?.summary?.description}</div>
          </div> : ''
          }
          {this.postEnrollmentsData ? 
          <div class={'at-rw'}>
            <div class={'at-cl s6'}>
              <div class={'at-card-title'}>Detalles de afiliación:</div>
            </div>
          </div> : ''
          }
          {this.postEnrollmentsData?.data?.transactionType?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'}>{this.postEnrollmentsData?.data?.transactionType?.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'}>{this.postEnrollmentsData?.data?.transactionType?.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postEnrollmentsData?.data?.accountNumber?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'}>{this.postEnrollmentsData?.data?.accountNumber?.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'}>{this.postEnrollmentsData?.data?.accountNumber?.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postEnrollmentsData?.data?.accountToEnroll?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'}>{this.postEnrollmentsData?.data?.accountToEnroll?.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'}>{this.postEnrollmentsData?.data?.accountToEnroll?.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postEnrollmentsData?.data?.invoiceAmount?.show ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'}>{this.postEnrollmentsData?.data?.invoiceAmount.label}</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'}>{this.postEnrollmentsData?.data?.invoiceAmount.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postEnrollmentsData?.config?.summary?.note !== '' ? 
          <div class={'at-rw at-note-text'}>
              <div class={'at-cl'}>{this.postEnrollmentsData?.config?.summary?.note}</div>
          </div> : ''
          }
          {this.postEnrollmentsData ? 
          <div class={'at-rw at-edit-detail'}>
            <div class={'at-cl s6'}>
              <div class={'at-card-title'}>Forma de pago:</div>
            </div>
            <div class={'at-cl s6'}>
              <button class="at-button-tertiary" type='button' onClick={() => this.cancleConfirmation()}>CAMBIAR</button>
            </div>
          </div> : ''
          }
          {this.creditCardFormData?.numberCard || this.selectedCreditCard?.cardBrand?.formattedValue ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'}>Método de pago:</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'}>{this.selectedCreditCard === 'addNewCard' ? getCardType(this.creditCardFormData?.numberCard)?.toUpperCase() : this.selectedCreditCard?.cardBrand?.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.creditCardFormData?.nameCard || this.selectedCreditCard?.cardLabel?.formattedValue ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'}>Nombre:</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'}>{this.selectedCreditCard === 'addNewCard' ? this.creditCardFormData?.nameCard : this.selectedCreditCard?.cardLabel?.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.creditCardFormData?.numberCard || this.selectedCreditCard?.maskedCreditCardNumber?.formattedValue ?
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'}>Tarjeta:</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'}>{this.selectedCreditCard === 'addNewCard' ? creditCardMask(this.creditCardFormData?.numberCard) : this.selectedCreditCard?.maskedCreditCardNumber?.formattedValue}</div>
            </div>
          </div> : ''
          }
          {this.postEnrollmentsData ? 
          <div class={'at-row'}>
            <div class={'at-col'}>
              <div class={'at-card-lable'}>Vencimiento:</div>
            </div>
            <div class={'at-col'}>
              <div class={'at-card-text'}>{this.selectedCreditCard === 'addNewCard' ? this.creditCardFormData?.expirationDate : this.selectedCreditCard?.expirationMonth?.formattedValue + '/' + this.selectedCreditCard?.expirationYear?.formattedValue}</div>
            </div>
          </div> : ''}
          
          {this.postEnrollmentsData?.config?.termsAndConditions?.show ? 
            <div class="at-rw">
                <div class="at-cl at-terms">
                  {this.postEnrollmentsData?.config?.termsAndConditions?.prefix} 
                  <a class="at-link">{this.postEnrollmentsData?.config?.termsAndConditions?.label}</a>
                </div>
            </div>
            : ''}
          <div class={'at-button-row'}>
          {this.postEnrollmentsData?.config?.actions?.summaryCancel?.show ? 
            <button class="at-button-tertiary" type='button' onClick={() => this.cancleConfirmation()}>{this.postEnrollmentsData?.config?.actions?.summaryCancel?.label}</button>
            : ''}
          {this.postEnrollmentsData?.config?.actions?.summarySubmit?.show ? 
            <button class="at-button-primary" type='button' onClick={() => this.putEnrollmentsData()}>{this.postEnrollmentsData?.config?.actions?.summarySubmit?.label}</button>
            : ''}
          </div>
        </div> : '' }

        {this.step === 5 && this.putEnrollmentsApiResponse?.data ?
        <div class="ml-card at-order-status">
          <div class={'at-order-status-header'}>
            <div class={'at-rw center'}>
              <div class={'at-cl s8'}>
              {this.putEnrollmentsApiResponse?.config?.status === 'success' ? 
                  <img class="at-order-status-icon" src={getAssetPath('../assets/icons/ok.png')} alt="Status" />
                : ''}
                {this.putEnrollmentsApiResponse?.config?.status === 'error' ? 
                  <img class="at-order-status-icon" src={getAssetPath('../assets/icons/failure.svg')} alt="Status" />
                : ''}
                {this.putEnrollmentsApiResponse?.config?.status === 'warning' ? 
                  <img class="at-order-status-icon" src={getAssetPath('../assets/icons/warning.svg')} alt="Status" />
                : ''}
                <div class="at-text-primary">
                  {this.putEnrollmentsApiResponse?.config?.description?.title}
                </div>
                <div class="at-text-normal">
                  {this.putEnrollmentsApiResponse?.config?.description?.body}
                </div>
                {this.putEnrollmentsApiResponse?.config?.actions?.submit?.show ?
                <div class="at-status-btn">
                  <button class="at-button-primary" type='button' onClick={() => this.handleStepChange(1)}>{this.putEnrollmentsApiResponse?.config?.actions?.submit?.label}</button>
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
                  <h5>{this.putEnrollmentsApiResponse?.config?.title?.value}</h5>
                </div>
                <div class={'at-rw'} style={{display: this.isOrderDetailOpen ? 'flex' : 'none'}}>
                  <div class={'at-cl s12 m6'}>
                  {this.putEnrollmentsApiResponse?.data?.invoice?.accountNumber?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.putEnrollmentsApiResponse?.data?.invoice?.accountNumber?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.putEnrollmentsApiResponse?.data?.invoice?.accountNumber?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                  {this.putEnrollmentsApiResponse?.data?.invoice?.accountToEnroll?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.putEnrollmentsApiResponse?.data?.invoice?.accountToEnroll?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.putEnrollmentsApiResponse?.data?.invoice?.accountToEnroll?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                  {this.putEnrollmentsApiResponse?.data?.invoice?.invoiceAmount?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.putEnrollmentsApiResponse?.data?.invoice?.invoiceAmount?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.putEnrollmentsApiResponse?.data?.invoice?.invoiceAmount?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                  {this.putEnrollmentsApiResponse?.data?.invoice?.transactionType?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.putEnrollmentsApiResponse?.data?.invoice?.transactionType?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.putEnrollmentsApiResponse?.data?.invoice?.transactionType?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                  </div>
                  <div class={'at-cl s12 m6'}>
                    {this.putEnrollmentsApiResponse?.data?.enrollment?.cardType?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.putEnrollmentsApiResponse?.data?.enrollment?.cardType?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.putEnrollmentsApiResponse?.data?.enrollment?.cardType?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                    {this.putEnrollmentsApiResponse?.data?.enrollment?.maskedCreditCardNumber?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.putEnrollmentsApiResponse?.data?.enrollment?.maskedCreditCardNumber?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.putEnrollmentsApiResponse?.data?.enrollment?.maskedCreditCardNumber?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                    {this.putEnrollmentsApiResponse?.data?.enrollment?.expirationDate?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.putEnrollmentsApiResponse?.data?.enrollment?.expirationDate?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.putEnrollmentsApiResponse?.data?.enrollment?.expirationDate?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                    {this.putEnrollmentsApiResponse?.data?.enrollment?.email?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.putEnrollmentsApiResponse?.data?.enrollment?.email?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.putEnrollmentsApiResponse?.data?.enrollment?.email?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                    {this.putEnrollmentsApiResponse?.data?.enrollment?.customerName?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.putEnrollmentsApiResponse?.data?.enrollment?.customerName?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.putEnrollmentsApiResponse?.data?.enrollment?.customerName?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                    {this.putEnrollmentsApiResponse?.data?.enrollment?.enrollmentId?.show ? 
                    <div class={'at-row'}>
                      <div class={'at-col'}>
                        <div class={'at-card-lable'}>{this.putEnrollmentsApiResponse?.data?.enrollment?.enrollmentId?.label}</div>
                      </div>
                      <div class={'at-col'}>
                        <div class={'at-card-text'}>{this.putEnrollmentsApiResponse?.data?.enrollment?.enrollmentId?.formattedValue}</div>
                      </div>
                    </div> : ''
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> : '' }

        <div id="deleteAutopayModal" class="ml-popup" style={{display: this.isDeleteAutopayModalOpen ? 'block' : 'none'}}>
          <div class="popup-content">
            <div class="content-popup-header">
              <div class="content-popup-title">
                <h4 class="at-font-h4">¿Deseas eliminar esta afiliación a débito automático?</h4>
              </div>
            </div>
            <div class="content-popup-body">
              <p class="at-font-p">Podrás activarla de nuevo cuando quieras.</p>
            </div>
            <div class="content-popup-footer right">
              <button class="at-button-tertiary" onClick={() => this.toggleDeleteAutopacksModal(false)}>CANCELAR</button>
              <button class="at-button-tertiary at-button-danger" onClick={() => this.toggleDeleteAutopacksModal(true)}>BORRAR</button>
            </div>
          </div>
        </div>

        <div id="autopacksModal" class="ml-popup" style={{display: this.isAutopacksModalOpen ? 'block' : 'none'}}>
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
              <button class="at-button-primary" onClick={() => this.toggleAutopacksModal(true)}>ACTIVAR PAGO AUTOMÁTICO</button>
              <button class="at-button-secondary" onClick={() => this.toggleAutopacksModal(false)}>NO, GRACIAS</button>
            </div>
          </div>
        </div>
      </Host>
    );
  }

}
