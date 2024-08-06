const API_URL = 'https://open.exchangerate-api.com/v6/latest';
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const $select1 = document.getElementById('currency-one');
const $select2 = document.getElementById('currency-two');
const $amount1 = document.getElementById('amount-one');
const $amount2 = document.getElementById('amount-two');
const $swapBtn = document.getElementById('swap');
const $displayCurrency = document.querySelector('#rate > span:nth-of-type(2)');
let rates = {};

// 소수점이 모두 0일 경우, 제외하고 표시. 그 이외에는 소수점 5자리까지 표시
const formatDecimal = (num) => {
  const formatNum = Number(num.toFixed(5));
  return formatNum % 1 === 0 ? Number(formatNum.toString()) : formatNum;
};

const createOptions = async () => {
  const data = await fetchData(API_URL);
  rates = data.rates;

  for (const country in rates) {
    $select1.innerHTML += `<option value=${country} data-rate=${
      rates[country]
    } ${country === 'USD' ? 'selected' : ''}>${country}</option>`;
    $select2.innerHTML += `<option value=${country} data-rate=${
      rates[country]
    } ${country === 'KRW' ? 'selected' : ''}>${country}</option>`;
  }

  $amount1.value = formatDecimal(rates['USD']);
  $amount2.value = formatDecimal(rates['KRW']);
  $displayCurrency.innerHTML = `${rates['USD']} USD = ${rates['KRW']} KRW`;
};

const updateInputValue = () => {
  const convertedValue = formatDecimal(
    $amount1.value * (rates[$select2.value] / rates[$select1.value]),
  );

  $amount2.value = convertedValue;
  $displayCurrency.innerHTML = `${$amount1.value} ${$select1.value} = ${$amount2.value} ${$select2.value}`;
};

const swapPosition = () => {
  const rate1 = rates[$select1.value];
  const rate2 = rates[$select2.value];
  const convertedValue = formatDecimal($amount2.value * (rate1 / rate2));

  [$select1.value, $select2.value] = [$select2.value, $select1.value];
  [$amount1.value, $amount2.value] = [$amount2.value, convertedValue];
  $displayCurrency.innerHTML = `${$amount1.value} ${$select1.value} = ${$amount2.value} ${$select2.value}`;
};

document.addEventListener('DOMContentLoaded', createOptions);
$select1.addEventListener('change', updateInputValue);
$select2.addEventListener('change', updateInputValue);
$amount1.addEventListener('input', updateInputValue);
$swapBtn.addEventListener('click', swapPosition);
