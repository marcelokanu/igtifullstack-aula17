let tabCountries = null;
let tabFavorites = null;

let allCountries = [];
let favoritesCountries = [];

let countContries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites = 0;

let numberFormat = null;

window.addEventListener("load", () => {
  tabCountries = document.querySelector("#tabCountries");
  tabFavorites = document.querySelector("#tabFavorites");

  countContries = document.querySelector("#countContries");
  countFavorites = document.querySelector("#countFavorites");

  totalPopulationList = document.querySelector("#totalPopulationList");
  totalPopulationFavorites = document.querySelector(
    "#totalPopulationFavorites"
  );

  numberFormat = Intl.NumberFormat("pt-BR");

  fetchCountries();
});

async function fetchCountries() {
  const res = await fetch("http://restcountries.eu/rest/v2/all");
  const json = await res.json();
  allCountries = json.map((country) => {
    const { numericCode, translations, population, flag } = country;
    return {
      id: numericCode,
      name: translations.pt,
      population,
      formattedNumber: formatNumber(population),
      flag,
    };
  });

  render();
}

function render() {
  renderCountryList();
  renderFavorites();
  renderSummary();
  handleCountryButtons();
}

function renderCountryList() {
  let countriesHTML = "<div>";

  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  })
  
  allCountries.forEach((country) => {
    const { name, flag, id, population } = country;

    const countryHTML = `
    <div class='country'>
      <div>
        <a id="${id}" class='waves-effect waves-light btn'>+</a>
      </div>
      <div>
        <img src="${flag}" alt="${name}" />
      </div>
      <div>
        <ul>
          <li>${name}</li>
          <li>${formatNumber(population)}</li>
        </ul>
      </div>
    </div>
    `;

    countriesHTML += countryHTML;
  });

  tabCountries.innerHTML = countriesHTML + "</div>";
}

function renderFavorites() {
  let favoritesHTML = "<div>";

  favoritesCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  })
  favoritesCountries.forEach((country) => {
    const { name, flag, id, population, formattedNumber } = country;

    const favoriteCountryHTML = `
      <div class='country'>
        <div>
          <a id="${id}" class='waves-effect waves-light btn red darken-4'>-</a>
        </div>
        <div>
          <img src="${flag}" alt="${name}" />
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedNumber}</li>
          </ul>
        </div>
      </div>
      `;
    favoritesHTML += favoriteCountryHTML;
  });

  tabFavorites.innerHTML = favoritesHTML + "</div>";
}
function renderSummary() {
  countContries.textContent = allCountries.length;
  countFavorites.textContent = favoritesCountries.length;

  const totalPopulation = allCountries.reduce((acc, current) => {
    return acc + current.population;
  }, 0);

  const totalFavorites = favoritesCountries.reduce((acc, current) => {
      return acc + current.population;
  }, 0)

  totalPopulationList.textContent = formatNumber(totalPopulation);
  totalPopulationFavorites.textContent = formatNumber(totalFavorites);
}
function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));
  
  countryButtons.forEach(button => {
    button.addEventListener('click', () => addToFavorites(button.id));
  })

  favoriteButtons.forEach(button => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  })
}

function addToFavorites(id) {
  const countryToAdd = allCountries.find(country => country.id === id);
  
  favoritesCountries = [...favoritesCountries, countryToAdd];
  
  allCountries = allCountries.filter(country => country.id !== id);

  render();
}
function removeFromFavorites(id) {
  const contryToRemove = favoritesCountries.find(country => country.id === id);

  allCountries = [...allCountries, contryToRemove];

  favoritesCountries = favoritesCountries.filter(country => country.id !== id);

  render();
}

function formatNumber(number) {
  return numberFormat.format(number);
}