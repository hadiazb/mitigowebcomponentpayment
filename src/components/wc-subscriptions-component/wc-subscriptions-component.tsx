import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, getAssetPath, h } from '@stencil/core';
import { WcData } from '../../interfaces/wc-data.interface';
import { encryptRsa, expiryInfo, getAllowedPaymentSubscriptionsMethods, getCardExpiry, getCardType, getCreditCardIcon, getPaymentMethodIcon, getSubscriptionIcon } from '../../utils/utils';
import { GetSubscriptionApiResponse } from '../../interfaces/get-subscription.interface';
import { HttpService } from '../../http';
import { PaymentMethod } from '../../interfaces/payment-method.interface';
import { PostSubscriptionApiResponse } from '../../interfaces/post-subscription-api-response.interface';
import { ccExpiryInputInputHandler, ccExpiryInputKeyDownHandler, ccNumberInputInputHandler, ccNumberInputKeyDownHandler } from '../../utils/credit-card';
import { CreditCardFormData } from '../../interfaces/credit-card-form-data.interface';
import Pristine from 'pristinejs';

@Component({
  tag: 'wc-subscriptions-component',
  styleUrl: 'wc-subscriptions-component.css',
  assetsDirs: ['assets'],
  shadow: true,
})
export class WcSubscriptionsComponent {

  @Element() el: HTMLElement;
  @Prop() wcData: string;
  @State() _wcData: WcData;
  @State() isSubscriptionModalOpen: boolean = false;
  @State() isLoading: boolean = false;
  @State() getSubscriptionApiResponse: GetSubscriptionApiResponse;
  @State() postSubscriptionApiResponse: PostSubscriptionApiResponse;
  @State() putSubscriptionApiResponse: any;
  @State() creditCardFormData: CreditCardFormData;
  @State() step: number = 1;
  @State() isDeleteSubscriptionModalOpen: boolean = false;
  @State() isOrderDetailOpen: boolean = true;
  @State() getEncryptionCode: {publicKey: string};
  @State() deleteSubscriptionNumberIndex;
  @Event() loading: EventEmitter<any>;
  @Event() wcMessage: EventEmitter<any>;
  @Event() wcRefreshToken: EventEmitter<any>;
  @Event() wcSegment: EventEmitter<any>;
  @Event() wcLoading: EventEmitter<any>;

  @Watch('wcData')
  parseWcDataProp(newValue: string) {
    if (newValue) this._wcData = JSON.parse(newValue);
  }

  private paymentMethods: PaymentMethod[];
  private selectedPaymentMethod: string;
  private pristineForm: Pristine;

  async getSubscription() {
    this.isLoading = true;
    this.loading.emit({
      eventName: 'loading',
      data: {
        stateLoading: true,
      }
    });
    await HttpService.getData(
      `/${this._wcData?.uuid}/${this._wcData?.idType}/subscription`,
      this._wcData?.idToken,
      'GetSubscriptionData'
    );
    this.getSubscriptionApiResponse = HttpService.getSubscriptionData;
    if (HttpService.getSubscriptionData === undefined && HttpService.apiError) {
      this.handleApiError();
    }
    this.paymentMethods = getAllowedPaymentSubscriptionsMethods(this.getSubscriptionApiResponse?.config?.allowedPaymentMethods[0]);
    this.isLoading = false;
    this.loading.emit({
      eventName: 'loading',
      data: {
        stateLoading: false,
      }
    });
  }

  async deleteSubscription() {
    this.isLoading = true;
    this.loading.emit({
      eventName: 'loading',
      data: {
        stateLoading: true,
      }
    });
    const deleteSubscriptionNumber = this.getSubscriptionApiResponse?.data?.subscriptionAccounts[this.deleteSubscriptionNumberIndex]?.tokenizedCardId?.formattedValue;
    await HttpService.deleteData(
      `/${this._wcData?.uuid}/${this._wcData?.idType}/subscription/${deleteSubscriptionNumber}`,
      this._wcData?.idToken,
      'deleteSubscriptionData'
    );
    if (HttpService.deleteSubscriptionData === undefined && HttpService.apiError) {
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

  async postSubscription() {
    this.isLoading = true;
    this.wcLoading.emit({
      isLoading: true
    });
    await HttpService.postData(
      `/${this._wcData?.uuid}/${this._wcData?.idType}/subscription`,
      this._wcData?.idToken,
      {
        paymentMethodName: this.selectedPaymentMethod,
        deviceId: this._wcData?.deviceId
      },
      'postSubscriptionData'
    );
    this.postSubscriptionApiResponse = HttpService.postSubscriptionData;
    if (HttpService.postSubscriptionData === undefined && HttpService.apiError) {
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
      `/${this._wcData?.uuid}/${this._wcData?.idType}/${this._wcData?.channel}/${this._wcData?.channelType}/code`,
      this._wcData?.idToken,
      'GetEncryptionCode'
    );
    this.getEncryptionCode = HttpService.getEncryptionCode;
    if (HttpService.getEncryptionCode === undefined && HttpService.apiError) {
      this.handleApiError();
      this.isLoading = false;
    } else {
      this.postSubscription();
    }
    this.wcLoading.emit({
      isLoading: false
    });
  }

  async putSubscriptionData() {
    this.handleSegmentCall('Checkout Attempted');
    this.isLoading = true;
    this.wcLoading.emit({
      isLoading: true
    });
    const numberCard = this.creditCardFormData?.numberCard?.replace(/[^\d]/g, '');
    let body = {
      paymentMethodName: this.selectedPaymentMethod,
      accountNumber: this._wcData?.accountNumber,
      accountType: this._wcData?.idType,
      channel: this._wcData?.channel,
      channelType: this._wcData?.channelType,
      deviceId: this._wcData?.deviceId,
      cardType: getCardType(this.creditCardFormData?.numberCard)?.toUpperCase(),
      customerName: this.creditCardFormData?.nameCard,
      expirationMonth: expiryInfo(this.creditCardFormData?.expirationDate, 'month'),
      expirationYear: expiryInfo(this.creditCardFormData?.expirationDate, 'year'),
      //numberCard: numberCard,
      numberCard: encryptRsa(this.getEncryptionCode?.publicKey, numberCard),
      //cvv: this.creditCardFormData?.cvv,
      cvv: encryptRsa(this.getEncryptionCode?.publicKey, this.creditCardFormData?.cvv),
    };
    
    await HttpService.putData(
      `/${this._wcData?.uuid}/${this._wcData?.idType}/subscription`,
      this._wcData?.idToken,
      body,
      'putSubscriptionData'
    );
    this.putSubscriptionApiResponse = HttpService.putSubscriptionData;
    if (HttpService.putSubscriptionData === undefined && HttpService.apiError) {
      this.putSubscriptionData = undefined;
      this.handleApiError();
    }
    if (this.putSubscriptionApiResponse?.data) {
      this.handleStepChange(1);
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

  private handleStepChange(step: number): void {
    if (step === 1) {
      this.getSubscriptionApiResponse = undefined;
      this.postSubscriptionApiResponse = undefined;
      this.getSubscription();
    }
    if (step === 2 && this.paymentMethods.length === 1) {
      this.step += 1;
      this.handleSelectPaymentMethod(this.paymentMethods[0]?.paymentMethodName);
      return;
    }
    this.step = step;
  }

  private toggleDeleteSubscriptionModal(data: number): void {
    if (data >= 0) {
      this.deleteSubscriptionNumberIndex = data;
      this.deleteSubscription();
    } else {
      this.deleteSubscriptionNumberIndex = undefined;
    }
    this.isDeleteSubscriptionModalOpen = !this.isDeleteSubscriptionModalOpen;
  }

  private showDeleteSubscriptionModal(data: number): void {
    this.deleteSubscriptionNumberIndex = data;
    this.isDeleteSubscriptionModalOpen = !this.isDeleteSubscriptionModalOpen;
  }

  private handleSelectPaymentMethod(paymentMethod: string): void {
    this.selectedPaymentMethod = paymentMethod;
    this.getEncryptionCodeDetail();
    this.step += 1;
  }

  private handleNumberQuotasSelect(event: Event): void {
    const el = event.target as HTMLSelectElement;
    console.log(el.value);
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
    };
    this.putSubscriptionData();
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
    this.getSubscription();
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
          
        }, "Fecha inválida", 2, false);
      }
    }
  }

  render() {
    return (
      <Host>
        <link rel="stylesheet" href="https://atomic.tigocloud.net/sandbox/css/main-v1.2.3.min.css"/>
        {this.isLoading ?
        <div class="ml-card at-loading"><div class="at-medium-circular-progress-indicator loading"></div></div> : ''}

        {this.step === 1 && this.getSubscriptionApiResponse ?
        <div class="ml-card">
          {this.getSubscriptionApiResponse?.config?.title?.show ? <div class={'at-card-header'}>{this.getSubscriptionApiResponse?.config?.title?.value}</div> : ''}
          {this.getSubscriptionApiResponse?.data?.subscriptionAccounts?.length === 0 ? 
          <div class={'at-rw at-nodata-box'}>
              <div class={'at-cl'}>
              <div class={'at-rw'}>
                <div class={'at-cl at-nodata-card-icon'}>
                  {this.paymentMethods?.map((paymentMethod) => (
                    <img key={paymentMethod?.label} src={getSubscriptionIcon(paymentMethod?.paymentMethodName)} alt={paymentMethod?.paymentMethodName} />
                  ))}
                </div>
              </div>
              <div class={'at-rw'}>
                <div class={'at-cl at-nodata-description'}>
                  {this.getSubscriptionApiResponse?.config?.description} 
                </div>
              </div>
              
              <div class={'at-rw'}>
                <div class={'at-cl'}>
                {this.getSubscriptionApiResponse?.config?.actions?.add?.show ? 
                <button id='subscriptionAddeBtn' class="at-button-primary" type='button' onClick={() => this.handleStepChange(2)}>{this.getSubscriptionApiResponse?.config?.actions?.add?.label}</button>
                : ''}
                </div>
              </div>
              </div>
          </div>
          : '' }
          {this.getSubscriptionApiResponse?.data?.subscriptionAccounts?.length >= 1 ? 
          <div class={'at-card-detail-box'}>
            {this.getSubscriptionApiResponse?.config?.paymentMethodsTitle?.description !== '' ? 
            <div class={'at-card-description'}>
              {this.getSubscriptionApiResponse?.config?.paymentMethodsTitle?.description}
            </div> : '' }

            {this.getSubscriptionApiResponse?.config?.paymentMethodsTitle?.label !== '' ? 
            <div class={'at-card-list-title'}>
              {this.getSubscriptionApiResponse?.config?.paymentMethodsTitle?.label}
            </div> : '' }
            
            {this.getSubscriptionApiResponse?.data?.subscriptionAccounts?.map((subscriptionAccount, index) => (  
            <div key={subscriptionAccount?.tokenizedCardId?.formattedValue} class={'at-rw at-subscription-account-item'}>
              <div class={'at-cl s2'}>
                <img class="at-autopay-icon" src={subscriptionAccount?.maskedCreditCardNumber?.value ? 
                      getCreditCardIcon(subscriptionAccount?.cardBrand?.value?.toLocaleLowerCase()) :
                      getSubscriptionIcon(subscriptionAccount?.cardBrand?.value?.toLocaleLowerCase())} alt={subscriptionAccount?.maskedCreditCardNumber?.value} />
                {subscriptionAccount?.cardLabel?.show ? 
                <span class="at-card-type">
                    {subscriptionAccount?.cardLabel?.formattedValue}
                  </span> : '' }
              </div>
              <div class={'at-cl s8 at-card-detail'}>
                <div class={'at-credit-card-number'}>
                  {subscriptionAccount.maskedCreditCardNumber.formattedValue}
                </div>
                <div class={getCardExpiry(subscriptionAccount.expirationYear.formattedValue, subscriptionAccount.expirationMonth.formattedValue, 'expirystatus') ? 'at-credit-card-expire at-expired-text' : 'at-credit-card-expire at-non-expired-text'}>
                  {getCardExpiry(subscriptionAccount.expirationYear.formattedValue, subscriptionAccount.expirationMonth.formattedValue, '')}
                </div>
              </div>
              {this.getSubscriptionApiResponse?.config?.actions?.delete?.show ? 
              <div class={'at-cl s2'}>
                <img  class="at-account-delete-icon" onClick={() => this.showDeleteSubscriptionModal(index)} src={getAssetPath('../assets/imgs/blue-trash.svg')} alt='Delete' />
              </div> : ''}
            </div>
          ))}
          {this.getSubscriptionApiResponse?.config?.actions?.add?.show ? 
            <button id='subscriptionAddeBtn' class="at-button-primary" type='button' onClick={() => this.handleStepChange(2)}>{this.getSubscriptionApiResponse?.config?.actions?.add?.label}</button>
            : ''}
          </div> : ''
          }
        </div> : '' }

        {this.step === 2 && this.getSubscriptionApiResponse ?
        <div class="ml-card">
          {this.getSubscriptionApiResponse?.config?.paymentMethodsTitle?.label !== '' ? <div class={'at-card-header'}>{this.getSubscriptionApiResponse?.config?.paymentMethodsTitle?.label}</div> : ''}
          <div class={'at-card-detail-box'}>
            <div class={'at-rw'}>
              {this.paymentMethods?.map((paymentMethod, index) => (
              <div id={`paymentMethodBtn`+ index} key={paymentMethod?.label} class={'at-cl s4 at-paymentMethod-item'} onClick={() => {this.handleSelectPaymentMethod(paymentMethod?.paymentMethodName)}}>
                  <img src={getSubscriptionIcon(paymentMethod?.paymentMethodName)} class="at-payment-option-icon" alt={paymentMethod?.paymentMethodName}></img>
                  <div class="at-payment-option-name">
                    {paymentMethod?.label}
                  </div>
              </div>
              ))}
            </div>
          </div>
        </div> : '' }

        {this.step === 3 && this.postSubscriptionApiResponse ?
        <div class="ml-card">
          {this.postSubscriptionApiResponse?.config?.title?.show ?
           <div class={'at-credit-card-row'}>
              <img src={getPaymentMethodIcon(this.selectedPaymentMethod)} class="at-payment-type-icon" alt="Payment Icon"></img>
              <span class="at-payment-method">{this.postSubscriptionApiResponse?.config?.title?.value}</span>
          </div> : ''}
          {this.postSubscriptionApiResponse?.config?.description ? 
          <div class="at-bill-pay-content-description at-bill-title">
            {this.postSubscriptionApiResponse?.config?.description}
          </div> : ''}
          <form id='addNewCardFrom' class={'form-wrapper'} onSubmit={(e) => this.handleCredirCardFromSubmit(e)}>
          {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.description?.show ? 
                <div class="at-rw">
                    <div class="at-cl at-font-h5 s12">
                      <span class={'at-font-p'}>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.description?.label}</span> 
                      {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.numberCard?.validations?.allowedCreditCards?.map((item) => (
                        <img key={item} class="at-pay-accepted-card-icon" alt={item} src={getCreditCardIcon(item?.toLocaleLowerCase())}></img>
                      ))}
                    </div>
                </div> : ''}
          {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.numberCard?.show ? 
            <div class="at-rw">
                <div class="at-cl">
                  <label class="at-input-label form-group">
                    <span>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.numberCard?.label}</span>
                    <input 
                      placeholder={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.numberCard?.placeholder} 
                      type="text" 
                      id="numberCard"
                      name="numberCard" 
                      value=""
                      class="at-input-textfield card-number" 
                      data-pristine-required={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.numberCard?.validations?.required}
                      maxlength={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.numberCard?.validations?.maxLength}
                      minlength={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.numberCard?.validations?.minLength}
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
                {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.expirationDate?.show ? 
                <div class="at-cl s6">
                  <label class="at-input-label form-group">
                    <span>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.expirationDate?.label}</span>
                    <input 
                      placeholder={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.expirationDate?.placeholder} 
                      type="text" 
                      name="expirationDate" 
                      id="expirationDate"
                      value="" 
                      class="at-input-textfield expiry"
                      data-pristine-required={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.expirationDate?.validations?.required}
                      maxlength={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.expirationDate?.validations?.maxLength}
                      minlength={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.expirationDate?.validations?.minLength}
                      onKeyDown={ccExpiryInputKeyDownHandler}
                      onInput={ccExpiryInputInputHandler}
                      data-pristine-required-message="Fecha inválida"
                      data-pristine-minlength-message="Fecha inválida"
                      data-pristine-maxlength-message="Fecha inválida"
                      data-pristine-my-expiry="true"
                      ></input>
                  </label>
                </div> : ''}
                {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.cvv?.show ? 
                <div class="at-cl s6">
                  <label class="at-input-label form-group">
                    <span>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.cvv?.label}</span>
                    <input
                      placeholder={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.cvv?.placeholder}
                      type="tel"
                      name="cvv"
                      id='cvv'
                      value=""
                      data-pristine-required={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.cvv?.validations?.required}
                      maxlength={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.cvv?.validations?.maxLength}
                      minlength={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.cvv?.validations?.minLength}
                      class="at-input-textfield cvv"
                      data-pristine-required-message="CVV incorrecto"
                      data-pristine-minlength-message="CVV incorrecto"
                      data-pristine-maxlength-message="CVV incorrecto"
                      ></input>
                  </label>
                </div> : ''}
            </div>
            <div class="at-rw">
              {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.nameCard?.show ? 
                <div class={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.nameCard?.show && this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.numberQuotas?.show ? 'at-cl s8' : 'at-cl s12'}>
                  <label class="at-input-label form-group">
                    <span>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.nameCard?.label}</span>
                    <input placeholder={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.nameCard?.placeholder}
                      type="text"
                      name="nameCard"
                      id="nameCard"
                      value=""
                      class="at-input-textfield"
                      data-pristine-required={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.nameCard?.validations?.required}
                      maxlength={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.nameCard?.validations?.maxLength}
                      minlength={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.nameCard?.validations?.minLength}
                      data-pristine-required-message="Por favor ingresa tu nombre como sale en la tarjeta"
                      data-pristine-minlength-message="Por favor ingresa tu nombre como sale en la tarjeta"
                      data-pristine-maxlength-message="Por favor ingresa tu nombre como sale en la tarjeta"
                      ></input>
                  </label>
                </div> : ''}
                {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.numberQuotas?.show ? 
                <div class="at-cl s4">
                  <label class="at-selectlabel ic-expandir-mas form-group">
                    <span>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.numberQuotas?.label}</span>
                    <select class="at-input-select" onInput={this.handleNumberQuotasSelect.bind(this)} name='numberQuotas' id='numberQuotas'>
                      {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.numberQuotas?.options.map(numberQuota => (
                        <option key={numberQuota.value} value={numberQuota.value} selected={numberQuota.value === this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.numberQuotas?.value}>{numberQuota.label}</option>
                      ))}
                    </select>
                  </label>
                </div> : ''}
            </div>
            {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.address?.show ? 
            <div class="at-rw">
                <div class="at-cl">
                  <label class="at-input-label form-group">
                  <span>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.address?.label}</span>
                    <input placeholder={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.address?.placeholder} type="text" name="address" id='address' value="" class="at-input-textfield"></input>
                  </label>
                </div>
            </div> : ''}
            <div class="at-rw">
                {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.city?.show ? 
                  <div class="at-cl s8">
                    <label class="at-input-label form-group">
                      <span>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.city?.label}</span>
                      <input placeholder={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.city?.placeholder} type="text" name="city" id='city' value="" class="at-input-textfield"></input>
                    </label>
                  </div>
                : ''}
                {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.state?.show ? 
                  <div class="at-cl s4">
                    <label class="at-input-label form-group">
                      <span>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.state?.label}</span>
                      <input placeholder={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.state?.placeholder} type="text" name="state" id='state' value="" class="at-input-textfield"></input>
                    </label>
                  </div>
                : ''}
            </div>
            <div class="at-rw">
                {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.country?.show ? 
                  <div class="at-cl s8">
                    <label class="at-input-label form-group">
                      <span>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.country?.label}</span>
                      <input placeholder={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.country?.placeholder} type="text" name="country" id='country' value="" class="at-input-textfield"></input>
                    </label>
                  </div>
                : ''}
                {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.postalCode?.show ? 
                  <div class="at-cl s4">
                    <label class="at-input-label form-group">
                      <span>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.postalCode?.label}</span>
                      <input placeholder={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.postalCode?.placeholder} type="text" name="postalCode" id='postalCode' value="" class="at-input-textfield"></input>
                    </label>
                  </div>
                : ''}
            </div>
            <div class="at-rw">
                {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.identificationType?.show ? 
                  <div class="at-cl s4">
                    <label class="at-selectlabel ic-expandir-mas form-group">
                    <span>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.identificationType?.label}</span>
                    <select class="at-input-select" onInput={this.handleNumberQuotasSelect.bind(this)} name='identificationType' id='identificationType'>
                      {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.identificationType?.options.map(identificationType => (
                        <option key={identificationType.value} value={identificationType.value} selected={identificationType.value === this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.identificationType?.value}>{identificationType.label}</option>
                      ))}
                    </select>
                  </label>
                  </div>
                  : ''}
                {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.identificationNumber?.show ? 
                  <div class="at-cl s8">
                    <label class="at-input-label form-group">
                      <span>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.identificationNumber?.label}</span>
                      <input placeholder={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.identificationNumber?.placeholder} type="text" name="identificationNumber" id='identificationNumber' value="" class="at-input-textfield"></input>
                    </label>
                  </div>
                : ''}
            </div>
            {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.email?.show ? 
              <div class="at-rw">
                  <div class="at-cl">
                    <label class="at-input-label form-group">
                    <span>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.email?.label}</span>
                      <input placeholder={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.email?.placeholder} type="email" name="email" id='email' value="" class="at-input-textfield"></input>
                    </label>
                  </div>
              </div>
              : ''}
            {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.phone?.show ? 
              <div class="at-rw">
                  <div class="at-cl">
                    <label class="at-input-label form-group">
                    <span>{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.phone?.label}</span>
                      <input placeholder={this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.phone?.placeholder} type="tel" name="phone" id='phone' value="" class="at-input-textfield"></input>
                    </label>
                  </div>
              </div>
              : ''}
            {this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.rememberCard?.show ? 
              <div class="at-rw at-checkbox-row">
                  <div class="at-cl">
                    <div class="at-input-checkbox form-group">
                      <input type="checkbox" name="rememberCard" id='rememberCard' checked={false}></input>
                      <label></label>
                      <span class="label at-font-p">{this.postSubscriptionApiResponse?.config?.forms?.newCardForm?.rememberCard?.label}</span>
                    </div>
                  </div>
              </div>
              : ''}
            <div class={'at-button-row'}>
            {this.postSubscriptionApiResponse?.config?.actions?.accept?.show ? 
              <button class="at-button-primary" type='submit' id="addNewCardFromSubmit">{this.postSubscriptionApiResponse?.config?.actions?.accept?.label}</button>
              : ''}
            </div>
          </form>
        </div> : '' }

        <div id="deleteAutopayModal" class="ml-popup" style={{display: this.isDeleteSubscriptionModalOpen ? 'block' : 'none'}}>
          <div class="popup-content">
            <div class="content-popup-header">
              <div class="content-popup-title">
                <h4 class="at-font-h4">{this.getSubscriptionApiResponse?.config?.deleteConfirmation?.title}</h4>
              </div>
            </div>
            <div class="content-popup-body">
              <p class="at-font-p">{this.getSubscriptionApiResponse?.config?.deleteConfirmation?.description} {this.getSubscriptionApiResponse?.data?.subscriptionAccounts[this.deleteSubscriptionNumberIndex]?.cardBrand?.formattedValue} {this.getSubscriptionApiResponse?.data?.subscriptionAccounts[this.deleteSubscriptionNumberIndex]?.maskedCreditCardNumber?.formattedValue}?</p>
            </div>
            <div class="content-popup-footer right">
              {this.getSubscriptionApiResponse?.config?.deleteConfirmation?.options?.cancel?.show ? 
              <button class="at-button-tertiary" onClick={() => this.toggleDeleteSubscriptionModal(-1)}>{this.getSubscriptionApiResponse?.config?.deleteConfirmation?.options?.cancel?.label}</button> : '' }
              {this.getSubscriptionApiResponse?.config?.deleteConfirmation?.options?.confirm?.show ? 
              <button class="at-button-tertiary at-button-danger" onClick={() => this.toggleDeleteSubscriptionModal(this.deleteSubscriptionNumberIndex)}>{this.getSubscriptionApiResponse?.config?.deleteConfirmation?.options?.confirm?.label}</button> : '' }
            </div>
          </div>
        </div>
      </Host>
    );
  }

}
