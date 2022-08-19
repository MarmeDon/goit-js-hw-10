import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
   input: document.querySelector('#search-box'),
   list: document.querySelector('.country-list'),
   info: document.querySelector('.country-info')
}

const DEBOUNCE_DELAY = 300;
const BASE_URL = 'https://restcountries.com/v2';
const FILTER_RESPONSE = `name,capital,population,languages,flags`;

refs.input.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function fetchCountries(name) {
   return fetch(`${BASE_URL}/name/${name}?fields=${FILTER_RESPONSE}`)
      .then(response => {
         if (!response.ok) {
            throw new Error(response.status)
         }
         return response.json()
      }
  );
}

function onCountryInput(e) {
   if (!e.target.value.trim()) {
         return
      }
   fetchCountries(e.target.value.trim()).then(data => {
      
      if (data.length > 10) {
         Notify.info("Too many matches found. Please enter a more specific name.")
      }
      if (data.length <= 10) {
         refs.list.innerHTML = generateContent(data)
      }
      if (data.length === 1) {
         refs.list.innerHTML = '';
         refs.info.innerHTML = createCard(data[0]);
      }
   }).catch(error => Notify.failure("Oops, there is no country with that name"));
}

function createListItem(acc, country) {
   return acc + `
   <li>
      <img src="${country.flags.svg}" alt="${country.name}" width="50" />
      <h2>${country.name}</h2>
    </li>`;
}

function generateContent(array) {
   return array.reduce(createListItem, '')
}

function createCard(country) {
   const lang = country.languages.map(language => language.name).join(', ');
   return `<img src="${country.flags.svg}" alt="${country.name}" width="60" />
    <h2>${country.name}</h2>
    <p><b>Capital</b>: ${country.capital}</p>
    <p><b>Population</b>: ${country.population}</p>
    <p><b>Languages</b>: ${lang}</p>`
}
