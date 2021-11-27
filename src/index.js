import './css/styles.css';
import Notiflix from 'notiflix';
import { debounce } from 'lodash';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputSearchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputSearchBox.addEventListener(
  'input',
  debounce(evt => {
    if (!evt.target.value.trim()) {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      return;
    }
    fetchCountries(evt.target.value.trim())
      .then(data => {
        if (data.length === 1) {
          return createCard(data);
        }
        if (data.length >= 2 && data.length <= 10) {
          return renderCountries(data);
        } else {
          countryInfo.innerHTML = '';
          countryList.innerHTML = '';
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        }
      })
      .catch(showError);
  }, DEBOUNCE_DELAY),
);

function showError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  input.value = '';
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}

function renderCountries(countries) {
    console.log('data List', countries);
    countryInfo.innerHTML = '';
    countryList.innerHTML = countries
      .map(country => {
        return `<li class="country-item">
        <img class="flag-img" src="${country.flags.svg}">${country.name.official}
        </li>`;
      })
      .join('');
    Notiflix.Notify.info('Please enter a more specific name.');
  }

function createCard(country) {
  countryList.innerHTML = `<h2 class="country-name">${country[0].name.official}</h2>`;
  countryInfo.innerHTML = `
            <img class="big-flag-img" src="${country[0].flags.svg}">
            <li class="country-item"><span class="item-name">Capital:</span> ${
              country[0].capital
            }</li>
            <li class="country-item"><span class="item-name">Population:</span> ${
              country[0].population
            }</li>
            <li class="country-item"><span class="item-name">Languages:</span> ${Object.values(
              country[0].languages,
            )}</li>`;
  Notiflix.Notify.success(`Passed Country ${country[0].name.official}`);
}


