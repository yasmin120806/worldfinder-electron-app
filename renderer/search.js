//initialize the page by fetching continents and displaying initial search results
window.onload = () => {
    fetchContinents();
    searchCountry(); //optionally display all countries initially
};

//fetch continents and populate the continent filter dropdown
async function fetchContinents() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const continentFilter = document.getElementById('categoryFilter');
        

        //extract unique continents
        const continents = [...new Set (data.map(country => country.region).filter(Boolean))];

        //populate dropdown
        continents.forEach(continent => {
            const option = document.createElement('option');
            option.value = continent;
            option.textContent = continent;
            continentFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching continents:', error);
    }
}

//fetch and display countries based on serach input and selected continent 
async function searchCountry() {
    const query = document.getElementById('searchInput').value.trim();
    const selectedContinent = document.getElementById('categoryFilter').value;
    
    try{
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();

        //filter countries by continent and search query
        const filteredCountries = data.filter(country => {
            const matchesContinent = selectedContinent === '' || country.region === selectedContinent;
            const matchesQuery = query === '' || country.name.common.includes(query);
            return matchesContinent && matchesQuery;
        });

        displaySearchResults(filteredCountries);
    } catch (error) {
        console.error('Error searching countries:', error);
    }  
} 

//display search results in the grid
function displaySearchResults(countries) {
    const searchResultsDiv = document.getElementById('searchResults');
    const errorMessageDiv = document.getElementById('errorMessage');

    if (countries.length === 0) {
        //show error message if no countries are found
        errorMessageDiv.style.display = 'block';
        searchResultsDiv.innerHTML = ''; //clear previous results
    } else {
        //hide error message if meals are found
        errorMessageDiv.style.display = 'none';
        searchResultsDiv.innerHTML = countries.map((country) => `
        <div class = "country-card">
            <img src = "${country.flags.svg}" alt="${country.strCountry}" class="country-img"/>
            <div class "country-info"
                <h3>${country.strCountry}</h3>
                <button onclick ="viewCountryDetails('${country.idCountry}')">View Details</button>
            </div>
        </div>
        `).join('');
    }
}

//function to view country details by redirecting to the details page
function viewCountryDetails (countryId) {
    localStorage.setItem('selectedCountryId', countryId);
    window.location.href = 'country-details.html';
}