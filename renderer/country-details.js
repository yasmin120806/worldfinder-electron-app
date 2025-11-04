

let allCountries = [];
async function fetchAllCountries(){
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca3,borders');
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        allCountries = Array.isArray(data) ? data: [];
        console.log(`Loaded ${allCountries.length} countries`);
    } catch (error) {
        console.error('Failed to fetch all countries:', error);
        allCountries = [];
    }
}

//fetch country details using country code
async function fetchCountryDetails(){
    //get the selected country code from local storage
    const countryCode = localStorage.getItem('selectedCountryCode');
    if (!countryCode) {
        console.error("No country found in localStorage");
        return;
    }

    try {
        if (allCountries.length === 0) {
            await fetchAllCountries();
        }
 
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        const data = await response.json();

        if (data && data.length > 0){
            const country = data[0];
            displayCountryDetails(country);
            localStorage.setItem('currentCountryDetails',JSON.stringify(country));
        }else
            {console.log("Country not found");}
    }catch(error){
        console.error("Error fetching country details:",error);
    }
}

//display country details on the page
async function displayCountryDetails(country){
    const container = document.getElementById('countryDetails');
    if (!container) return;

    function getCountryNameFromCode(countryCode) {
        if (!Array.isArray(allCountries)) return countryCode;
        const match = allCountries.find(c => c.cca3 === countryCode);
        return match ? match.name.common : countryCode;
    }

    let nearbyCountriesHTML = '<p>N/A</p>';
    if (Array.isArray(country.borders) && country.borders.length > 0) {
        const uniqueBorders = [...new Set(country.borders)];
        nearbyCountriesHTML = `
        <ul class="nearby-list">
            ${uniqueBorders.map(code => {
                const name = getCountryNameFromCode(code);
                return `<li><a href="#" class="nearby-link" data-code="${code}">${name}</a></li>`;
            }).join('')}
        </ul>
        `;
    }

    //create the HTML content
    container.innerHTML =`
    <h2>${country.name?.common || 'N/A'}</h2>
    <div class = "country-images">
        <img src="${country.flags?.png || 'https://placehold.co/180x120?text=No+Flag'}" alt="${country.name?.common}" class="country-img"/>
        ${country.coatOfArms?.png? `<img src="${country.coatOfArms.png}" alt="Coat of Arms of ${country.name?.common}" class="coat-of-arms"/>` : ''}
    </div>

    <p>Area: ${country.area?.toLocaleString() || 'N/A'} km²</p>
    <p>Continents: ${country.continents?.join(', ') || 'N/A'}</p>
    <p>Region and Subregion: ${country.region || 'N/A'} - ${country.subregion || 'N/A'}</p>
    <p>Capital: ${country.capital?.join(', ') || 'N/A'}</p>
    <p>Languages: ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
    <p>Timezones: ${country.timezones?.join(', ') || 'N/A'}</p>
    <p>Maps: <a href="${country.maps?.googleMaps || '#'}" target="_blank">Google Maps</a> | <a href="${country.maps?.openStreetMaps || '#'}" target="_blank">OpenStreetMap</a></p>
    <p>Location: lat ${country.latlng?.[0] || 'N/A'}, lng ${country.latlng?.[1] || 'N/A'}</p>
    <p>Population: ${country.population?.toLocaleString() || 'N/A'}</p>
    <p>Nearby Countries: ${nearbyCountriesHTML}</p>
    `;

    // Add event listeners for the clickable nearby countries
    document.querySelectorAll('.nearby-link').forEach(link => {
        link.addEventListener('click',  async (e) => {
            e.preventDefault();
            const newCode = e.target.getAttribute('data-code');
            if (!newCode) return;
            localStorage.setItem('selectedCountryCode', newCode);

            const container = document.getElementById('countryDetails');
            if(container) container.innerHTML = '<p>Loading nearby country...</p>'
            await fetchCountryDetails(); // reload page content with new country
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

//function to show month selection dialog
function showMonthSelection(country){
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const dialogOverlay = document.createElement('div');
    dialogOverlay.className = 'dialog-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'month-selection-dialog';

    dialog.innerHTML = `
    <h3>Select a month to add "${country.name?.common || 'Unknown'}"</h3>
    <div class ="month-buttons">
        ${months.map(m => `<button class ="month-button" data-month="${m}">${m}</button>`).join('')}
    </div>
    <button class ="cancel-button">Cancel</button>
    `;

    dialogOverlay.appendChild(dialog);
    document.body.appendChild(dialogOverlay);

    //add event listeners for month selection
    dialog.querySelectorAll('.month-button').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const selectedMonth = event.target.getAttribute('data-month');
            console.log("selected month: ",selectedMonth);
            console.log("Country object: ",country);
            addCountryToMonth(country, selectedMonth);
            dialogOverlay.remove();
        });
    });

    //add event listener to cancel button
    dialog.querySelector('.cancel-button').addEventListener('click', () => dialogOverlay.remove()); 
}

//function to add country to a specific month
function addCountryToMonth(country, month){
    console.log("Adding to month:", month,"Country: ",country);
    //get existing monthly planner on initialize new one
    const planner = JSON.parse(localStorage.getItem('monthlyPlanner')) || {
        January: [],
        February: [],
        March: [],  
        April: [],
        May: [],
        June: [],
        July: [],
        August: [],
        September: [],
        October: [],
        November: [],
        December: []
    };

    //create a simplified country object
    const entry = {
        idCountry: country.cca3,
        strCountry: country.name?.common || 'N/A',
        strCountryThumb: country.flags?.png || '',
        notes: ""
    };

    //add country to selected month
    planner[month].push(entry);

    //save updated planner 
    localStorage.setItem('monthlyPlanner', JSON.stringify(planner));
    alert(`${entry.strCountry} has been added to ${month}`);
    window.location.href = "planner.html";
}    

//function to add country to bucket list
function addCountryToBucketList(){
    const country = JSON.parse(localStorage.getItem('currentCountryDetails'));
    if (!country) return alert("Country details not found.");

    //extract locations from country
    const locations = [];
    for (let i=1; i <= 20; i++) {
        const loc = country[`strLocations${i}`];
        if (loc && loc.trim()) locations.push({ name: loc.trim(), checked: false});
    }

    //get bucket list or initialize a new one
    const bucketList = JSON.parse(localStorage.getItem('bucketList')) || [];
    
    //check if country already on bucket list
    if (bucketList.some(item => item.countryName === country.name?.common)) {
        return alert(`${country.name?.common} is already in your bucket list!`);
    }

    //add new country with locations
    bucketList.push({countryName: country.name?.common, locations });
    localStorage.setItem('bucketList', JSON.stringify(bucketList));
    alert(`${country.name?.common} added to your bucket list!`);

    if (typeof displayBucketList === "function"){
        displayBucketList();
    }
}

//event listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchCountryDetails();

    //add click event listener for the save to planner button
    const saveBtn = document.getElementById('saveToPlanner');
    if (saveBtn){
        saveBtn.addEventListener('click', () => {
            const currentCountry = JSON.parse(localStorage.getItem('currentCountryDetails'));
            if (currentCountry) {
                showMonthSelection(currentCountry);
            } else
                {console.error('No country details found in localStorage');}
        });
    }

    const bucketBtn =document.getElementById('SavetoBucketList');
    if (bucketBtn){
        bucketBtn.addEventListener('click', () => {
            const currentCountry = JSON.parse(localStorage.getItem('currentCountryDetails'));
            if (currentCountry){
                addCountryToBucketList(currentCountry);
            }else {
                console.error('No country detais found in localStorage');
            }
        });
    }

    const backHomeBtn = document.getElementById('backHome');
    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});
