{
  interface ElementRefs {
    currencyOne: HTMLSelectElement;
    currencyTwo: HTMLSelectElement;
    amountOne: HTMLInputElement;
    amountTwo: HTMLInputElement;
    rateEl: HTMLDivElement;
    swap: HTMLButtonElement;
  }

  interface CurrencyRates {
    [currency: string]: number;
  }

  const getElement = <T extends HTMLElement>(id: string): T => {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Element with ID ${id} is missing in the DOM`);
    }
    return element as T;
  };

  // 초기화 null 체크
  const initElements = (): ElementRefs => ({
    currencyOne: getElement<HTMLSelectElement>('currency-one'),
    currencyTwo: getElement<HTMLSelectElement>('currency-two'),
    amountOne: getElement<HTMLInputElement>('amount-one'),
    amountTwo: getElement<HTMLInputElement>('amount-two'),
    rateEl: getElement<HTMLDivElement>('rate'),
    swap: getElement<HTMLButtonElement>('swap'),
  });

  const refs = initElements();

  const fetchRates = async (): Promise<CurrencyRates> => {
    const res = await fetch('https://open.exchangerate-api.com/v6/latest');
    if (!res.ok) throw new Error('Failed to fetch currency rates');
    const { rates } = await res.json();
    return rates;
  };

  const createOption = (currency: string, rate: number) => {
    const option = document.createElement('option');
    [option.value, option.innerText] = [currency, currency];
    option.dataset.rate = rate.toString();
    return option;
  };

  const setOptionList = async () => {
    const rates = await fetchRates();
    const { currencyOne, currencyTwo } = refs;

    for (const currency in rates) {
      const rate = rates[currency];
      currencyOne.appendChild(createOption(currency, rate));
      currencyTwo.appendChild(createOption(currency, rate));
    }
    currencyOne.value = 'USD';
    currencyTwo.value = 'KRW';
    calculate();
  };

  const calculate = () => {
    const { currencyOne, currencyTwo, rateEl, amountOne, amountTwo } = refs;

    const currency_one = currencyOne.value;
    const currency_two = currencyTwo.value;

    const rate_one = parseFloat(
      currencyOne.selectedOptions[0]?.dataset.rate ?? '0',
    );
    const rate_two = parseFloat(
      currencyTwo.selectedOptions[0]?.dataset.rate ?? '0',
    );

    const rate = rate_two / rate_one;
    rateEl.innerText = `1 ${currency_one} = ${rate.toFixed(4)} ${currency_two}`;

    amountTwo.value = (parseFloat(amountOne.value) * rate).toFixed(2);
  };

  const initEventHandlers = () => {
    const { currencyOne, currencyTwo, amountOne, amountTwo, swap } = refs;

    currencyOne.addEventListener('change', calculate);
    amountOne.addEventListener('input', calculate);
    currencyTwo.addEventListener('change', calculate);
    amountTwo.addEventListener('input', calculate);
    swap.addEventListener('click', () => {
      [currencyOne.value, currencyTwo.value] = [
        currencyTwo.value,
        currencyOne.value,
      ];
      [amountOne.value, amountTwo.value] = [amountTwo.value, amountOne.value];
      calculate();
    });
  };

  const initialize = async () => {
    await setOptionList();
    initEventHandlers();
  };

  initialize();
}
