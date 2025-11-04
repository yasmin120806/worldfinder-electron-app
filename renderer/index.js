const { ipcRenderer } = require('electron');
const apiUrl = `https://restcountries.com/v3.1/all?fields=name,flags,capital,cca3`;

//static popular countries ID
const popularCountryCodes = ["JPN", "FRA", "ITA", "ESP", "DEU", "CHN", "BRA", "AUS"];
//Static popular locations 
const popularLocations = ["Tokyo", "Paris", "Rome", "Madrid", "Berlin", "Beijing", "Rio de Janeiro", "Sydney"];

//fetch and display 8 static popular countries
async function fetchPopularCountries() {
  try {
    const allCountries = await fetch(apiUrl);
    const data = await allCountries.json();
    const countries = data.filter(c => popularCountryCodes.includes(c.cca3));
    displayItems(countries, "popularCountries", true);
  }catch (error) {
    console.error("Error fetching popular countries:",error);
  }
}

//fetch and display 8 random countries
async function fetchRandomCountries() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const randomCountries = data.sort(() => 0.5 - Math.random()).slice(0,9); 
    displayItems(randomCountries, "randomCountries", true);
  }catch (error) {
    console.error("Error fetching random countries:", error);
  }
}

//display items (countries or locations )
function displayItems(items, containerId, isCountry) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class = "card">
    <img src = "${isCountry ? item.flags.svg || 'https://placehold.co/180x120?text=No+Flag' : `https://placehold.co/180x120?text=${item}`}" alt="${isCountry ? item.name.common : item}" />
    <h3> ${isCountry ? item.name.common : item}</h3>
    ${isCountry ? `<button onclick="viewCountryDetails('${item.cca3}')">View Details</button>` : ""}
    </div>
  `).join('');
}

//fetch and display random locations
async function fetchRandomLocations() {
  try {
    const response = await fetch(apiUrl);
    console.log("Response URL:",response.url);
    console.log("Status: ", response.status);

    const data = await response.json();
    //shuffle and pick 8 random countries
    const randomCountries = data.sort(() => 0.5 - Math.random()).slice(0,8);

    //extract the capital name and flag for each
    const locations = randomCountries.map(country => ({
      name: country.capital?.[0] || "No capital",
      flag: country.flags?.svg ||"https://placehold.co/180x120?text=No+Flag",
      countryName: country.name.common,
      code: country.cca3
    }));

    //display them
    displayRandomLocations(locations);
  }catch (error) {
    console.error("Error fetching random locations:",error);
  }
}

//display random location
function displayRandomLocations(locations) {
  const container = document.getElementById("randomLocations");
  if (!container) return;

  container.innerHTML = locations.map(loc => `
    <div class ="card">
      <img src = "${loc.flag}" alt="${loc.name}"/>
      <h3>${loc.name}</h3>
      <p style="color:#777; font-size:0.9rem;">${loc.countryName || ''}</p>
      <button onclick = "viewCountryDetails('${loc.code}')">View Details</button>
    </div>
  `).join('');
}

//display popular locations 
async function displayPopularLocations() {
  const container = document.getElementById("popularLocations");
  if (!container) return;

  try{
    const response = await fetch(apiUrl);
    const data = await response.json();

    //keep pairs aligned by index
    const cards = popularCountryCodes.map((code, index) => {
      const country = data.find(c => c.cca3 === code);
      if (!country) return '';
      return `
      <div class = "card">
        <img src = "${country.flags.svg}" alt="${country.name.common}"/> 
        <h3>${popularLocations[index]}</h3>
        <p style ="color:#777; font-size:0.9rem;">${country.name.common}</p>
        <button onclick="viewCountryDetails('${country.cca3}')">View Details</button>
      </div>
      `;
    });

    container.innerHTML= cards.join('');
  }catch (error) {
    console.error("Error displaying popular locations:", error);
  }
} 


//redirect to country details page
function viewCountryDetails(countryCode) {
  console.log("Selected country: ",countryCode); //debug
  localStorage.setItem('selectedCountryCode', countryCode);
  window.location.href = 'country-details.html';
}


//add these new functions to your existing JavaScript

//dark mode toggle
function setupDarkMode() {
  const darkModeToggle = document.createElement('button');
  darkModeToggle.className = 'theme-toggle';
  darkModeToggle.innerHTML = '🌓';
  document.body.appendChild(darkModeToggle);

  if (localStorage.getItem('darkMode') === 'true'){
    document.body.classList.add('dark-mode');
  }

  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  });
}

//back to top button
function setupBackToTop(){
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '⬆';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll',() => {
    backToTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth'});
  });
}

//search 
async function searchCountries(query){
  if (!query){
    fetchPopularCountries();
    return;
  }

  const loader = document.querySelector('.loader');
  loader.style.display ='block';

  try{
    const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fields=name,flags,capital,cca3`);
    const data =await response.json();
      displayItems(data.slice(0,9), "popularCountries", true);
  } catch (error){
    console.error('Error searching countries:',error);
  } finally{
    loader.style.display = 'none';
  }
}

function setupSearch(){
  const SearchContainer = document.createElement('div');
  SearchContainer.className = 'search-container';

  const searchBar = document.createElement('input');
  searchBar.type = 'text';
  searchBar.className = 'search-bar';
  searchBar.placeholder = 'Search for countries...';

  SearchContainer.appendChild(searchBar);

  //add the search container right below the header
  document.querySelector('header').appendChild(SearchContainer);

  //add search behavior
  let debounceTimer;
  searchBar.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => { searchCountries(e.target.value.trim());}, 300);
  });

  searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchCountries(searchBar.value.trim());
    }  
  });
}

//add planner and bucket list buttons below the search bar
function setupPlannerBucketButtons(){
  const searchContainer = document.querySelector('.search-container');
  if (!searchContainer) return;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'planner-bucket-buttons';
  buttonsContainer.style.marginTop = '10px';
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.gap = '10px';

  const plannerBtn = document.createElement('button');
  plannerBtn.innerText = 'Planner';
  plannerBtn.className = 'planner-btn pink-btn';
  plannerBtn.onclick = () => window.location.href = 'planner.html';

  const bucketListBtn = document.createElement('button');
  bucketListBtn.innerText = 'Bucket List';
  bucketListBtn.className = 'bucketlist-btn pink-btn';
  bucketListBtn.onclick = () => window.location.href = 'bucketlist.html';

  buttonsContainer.appendChild(plannerBtn);
  buttonsContainer.appendChild(bucketListBtn);

  searchContainer.appendChild(buttonsContainer);
}

//initialize new features
window.onload = function() {
  fetchPopularCountries();
  fetchRandomCountries();
  displayPopularLocations();
  fetchRandomLocations();

  //initialize new features
  setupDarkMode();
  setupBackToTop();
  setupSearch();
  setupPlannerBucketButtons();

  //add loader
  const loader = document.createElement('div');
  loader.className = 'loader';
  document.querySelector('main').appendChild(loader);
};
