import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import countryTemplate from './templates/countryWrapper.hbs';
import countryListTemplate from './templates/countryList.hbs';
import '../css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputRef: document.querySelector('#search-box'),
  countryListRef: document.querySelector('.country-list'),
  countryInfoRef: document.querySelector('.country-info'),
};

function clearMarkup() {
  refs.countryListRef.innerHTML = '';
  refs.countryInfoRef.innerHTML = '';
}

function onInput(e) {
  clearMarkup();

  const country = e.target.value.trim();

  if (country) {
    fetchCountries(country)
      .then(data => {
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }
        if (data.length > 1 && data.length <= 10) {
          refs.countryListRef.innerHTML = countryListTemplate(data);
          return;
        }
        refs.countryInfoRef.innerHTML = countryTemplate(data[0]);
      })
      .catch(err => Notify.failure(err.message));
  }
}

refs.inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
