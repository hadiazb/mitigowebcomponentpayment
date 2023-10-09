const ccNumberPattern: RegExp = /^\d{0,16}$/g;
const ccNumberSeparator: string = ' ';
let ccNumberInputOldValue: string;
let ccNumberInputOldCursor: number;

const ccExpiryPattern: RegExp = /^\d{0,4}$/g;
const ccExpirySeparator: string = '/';
let ccExpiryInputOldValue: string;



function unmask(value: string): string {
  return value.replace(/[^\d]/g, '');
}

function checkSeparator(position: number, interval: number): number {
  return Math.floor(position / (interval + 1));
}

function highlightCC(el: HTMLElement, ccValue: string): void {
  let ccCardType: string = '';
  let ccCardTypePatterns: { [key: string]: RegExp } = {
    amex: /^3/,
    visa: /^4/,
    mastercard: /^5/,
    dinersclub: /^6/,
    genric: /(^1|^2|^7|^8|^9|^0)/,
  };
  let classes = ['amex', 'visa', 'mastercard', 'dinersclub', 'genric'];

  for (const cardType in ccCardTypePatterns) {
    if (ccCardTypePatterns[cardType].test(ccValue)) {
      ccCardType = cardType;
      break;
    }
  }

  if (ccCardType) {
    el.classList.add(ccCardType);
  } else {
    classes.forEach(c => {
      if (el.classList.contains(c)) {
        el.classList.remove(c);
      }
    });
  }
}

function mask(value: string, limit: number, separator: string): string {
  var output: string[] = [];
  for (let i = 0; i < value.length; i++) {
    if (i !== 0 && i % limit === 0) {
      output.push(separator);
    }
    output.push(value[i]);
  }
  return output.join('');
}

export function ccExpiryInputKeyDownHandler(e: Event): void {
  let el = e.target as HTMLInputElement;
  ccExpiryInputOldValue = el.value;
}

export function ccExpiryInputInputHandler(e: Event): void {
  let el = e.target as HTMLInputElement,
    newValue = el.value;

  newValue = unmask(newValue);
  if (newValue.match(ccExpiryPattern)) {
    newValue = mask(newValue, 2, ccExpirySeparator);
    el.value = newValue;
  } else {
    el.value = ccExpiryInputOldValue;
  }
}

export function ccNumberInputKeyDownHandler(e: Event): void {
  let el = e.target as HTMLInputElement;
  ccNumberInputOldValue = el.value;
  ccNumberInputOldCursor = el.selectionEnd;
}

export function ccNumberInputInputHandler(e: Event): void {
  let el = e.target as HTMLInputElement,
    newValue = unmask(el.value),
    newCursorPosition;

  if (newValue.match(ccNumberPattern)) {
    newValue = mask(newValue, 4, ccNumberSeparator);

    newCursorPosition =
      ccNumberInputOldCursor -
      checkSeparator(ccNumberInputOldCursor, 4) +
      checkSeparator(ccNumberInputOldCursor + (newValue.length - ccNumberInputOldValue.length), 4) +
      (unmask(newValue).length - unmask(ccNumberInputOldValue).length);

    el.value = newValue !== '' ? newValue : '';
  } else {
    el.value = ccNumberInputOldValue;
    newCursorPosition = ccNumberInputOldCursor;
  }

  el.setSelectionRange(newCursorPosition, newCursorPosition);
  highlightCC(el, el.value);
}
