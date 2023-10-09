import { getAssetPath } from '@stencil/core';
import { PaymentMethod } from '../interfaces/payment-method.interface';
import * as forge from 'node-forge';

let allowedPaymentSubscriptionMethods = [
  'Async_Wompi',
  'Async_Nequi',
  'creditCard',
  'bancard',
];

function filterPaymentMethodsAvailability(paymentObj, item) {
  if (paymentObj?.[item]?.show && filterPaymentSubscriptionsMethods(item)) {
    return true;
  } else {
    return false;
  }
}

function filterPaymentSubscriptionsMethods(item): boolean {
  return allowedPaymentSubscriptionMethods.some((data) => {
    if (data.toLowerCase() === item.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  });
}

export function getCreditCardIcon(type: string): string {
  let cardImage;
  switch (type) {
    case 'mastercard':
      cardImage = '../assets/credit-card-icons/mastercard.svg';
      break;
    case 'visa':
      cardImage = '../assets/credit-card-icons/visa.svg';
      break;
    case 'amex':
      cardImage = '../assets/credit-card-icons/amex.svg';
      break;
    case 'dinersclub':
      cardImage = '../assets/credit-card-icons/dinersclub.svg';
      break;
    case 'discover':
      cardImage = '../assets/credit-card-icons/discover.svg';
      break;
    default:
      cardImage = '../assets/credit-card-icons/card_image_icon.svg';
      break;
  }
  return getAssetPath(cardImage);
}

export function getSubscriptionIcon(paymentIcon: string): string {
  let imagePath = '';
  if (paymentIcon) {
    imagePath = getAssetPath(`../assets/bill-pay-icons/${paymentIcon}.png`);
  }
  return imagePath;
}

export function getPaymentMethodIcon(paymentType: string): string {
  let imagePath = '';
  if (paymentType) {
    imagePath = getAssetPath(`../assets/bill-pay-icons/${paymentType}.png`);
  }
  return imagePath;
}

export function getCardExpiry(expiryYear, expiryMonth, status): string | boolean {
  const expMonth = Number(expiryMonth) - 1;
  const expiryDate = new Date().setFullYear(expiryYear, expMonth);
  if (new Date().getTime() > expiryDate) {
    return status === 'expirystatus' ? true : 'Tarjeta vencida';
  } else {
    return status === 'expirystatus' ? false : `Expira ${expiryMonth}/${expiryYear}`;
  }
}

export const allowedPaymmentMethod: string[] = [
  'creditCard',
];

export function isPaymentMehtodAllowed(item: string): boolean {
  return allowedPaymmentMethod.some((data: string) => {
    if (data.toLowerCase() === item.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  });
}

export function creditCardMask(cardNumber: string): string {
  return `****  ${cardNumber?.slice(-4)}`;
}

export function getPaymentMethods(data): PaymentMethod[] {
  const paymentMethods = [];
  if (data?.config?.actions?.paymentMethods) {
    const paymentObj = data.config?.actions?.paymentMethods[0];
    if (paymentObj) {
      Object.keys(paymentObj).forEach((item) => {
        if (paymentObj?.[item] && paymentObj?.[item]?.show && isPaymentMehtodAllowed(item)) {
          paymentMethods.push(paymentObj[item]);
        }
      });
    }
  }
  return paymentMethods;
}

export function getAllowedPaymentSubscriptionsMethods(paymentSubscirption): any[] {
  const paymentSubscirptionsArray = [];
  if (paymentSubscirption) {
    Object.keys(paymentSubscirption).forEach((item) => {
      if (filterPaymentMethodsAvailability(paymentSubscirption, item)) {
        paymentSubscirptionsArray.push(paymentSubscirption[item]);
      }
    });
  }
  return paymentSubscirptionsArray;
}

export function encryptRsa(publicKeyValue: string, encryptText: string): string {
  const publicKeyWithHeaderAndFooter = `-----BEGIN PUBLIC KEY-----
  ${publicKeyValue}
  -----END PUBLIC KEY-----`;
  const publicKey = forge.pki.publicKeyFromPem(publicKeyWithHeaderAndFooter);
  const encrypted = publicKey.encrypt(encryptText, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha1.create(),
    },
  });
  return forge.util.encode64(encrypted);
}

export function expiryInfo(expiryDate: string, status: string): string {
  if (!expiryDate) {
    return '';
  }
  const expiryDetails = expiryDate.split('/');
  if (status === 'month') {
    return expiryDetails[0]?.trim();
  } else if (status === 'year') {
    return '20'+expiryDetails[1]?.trim();
  }
}


export function getCardType(number: string): string {
    // visa
    var re = new RegExp("^4");
    if (number.match(re) != null)
        return "Visa";

    // Mastercard 
    // Updated for Mastercard 2017 BINs expansion
     if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)) 
        return "Mastercard";

    // AMEX
    re = new RegExp("^3[47]");
    if (number.match(re) != null)
        return "AMEX";

    // Discover
    re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (number.match(re) != null)
        return "Discover";

    // Diners
    re = new RegExp("^36");
    if (number.match(re) != null)
        return "Diners";

    // Diners - Carte Blanche
    re = new RegExp("^30[0-5]");
    if (number.match(re) != null)
        return "Diners - Carte Blanche";

    // JCB
    re = new RegExp("^35(2[89]|[3-8][0-9])");
    if (number.match(re) != null)
        return "JCB";

    // Visa Electron
    re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
    if (number.match(re) != null)
        return "Visa Electron";

    return "";
}