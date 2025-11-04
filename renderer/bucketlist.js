document.addEventListener("DOMContentLoaded", () => {
    displayBucketList();
    populateCountryOptions();
});

//display the countries and locations in a checklist format
//updated displayBucketList function with delete buttons
function displayBucketList(){
    const bucketList = JSON.parse(localStorage.getItem("bucketList")) || [];
    const bucketListDiv = document.getElementById("bucketList");
   bucketListDiv.innerHTML = "";

   if (bucketList.length === 0){
        bucketListDiv.innerHTML = `
            <div class ="country-section empty-state">
                <p>Your bucket list is empty. Add locations from country details or use the form below.</p>
            </div>
        `;
        return;
   }

    bucketList.forEach((country, countryIndex) => {
        const countrySection = document.createElement("div");
        countrySection.classList.add("country-section");

        const headerContainer = document.createElement("div");
        headerContainer.style.display = "flex";
        headerContainer.style.alignItems = "center";
        headerContainer.style.justifyContent = "space-between";

        const countryHeader = document.createElement("h2");
        countryHeader.textContent = country.countryName;

        const deleteCountryBtn = document.createElement("button");
        deleteCountryBtn.textContent="x";
        deleteCountryBtn.classList.add("delete-country");
        deleteCountryBtn.title = "Delete Country";
        deleteCountryBtn.onclick = (e) => {
            e.stopPropagation();
            deleteCountry(countryIndex);
        };
        headerContainer.appendChild(countryHeader);
        headerContainer.appendChild(deleteCountryBtn);

        const locationList = document.createElement("ul");
        locationList.classList.add("location-list");

        //if no locations
        if (!country.locations || country.locations.length === 0) {
            const emptyItem = document.createElement("li");
            emptyItem.textContent = "No locations yet";
            locationList.appendChild(emptyItem);
        }

        //locations
        country.locations.forEach((location,locationIndex) => {
            const locationItem = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = location.checked || false;
            checkbox.addEventListener("change", () => toggleLocation (countryIndex,locationIndex));

            const label = document.createElement("label");
            label.textContent = location.name;

            //create delete button for location
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "x";
            deleteButton.classList.add("delete-location");
            deleteButton.title = "Delete Location";
            deleteButton.onclick = (e) => {
                e.stopPropagation(); //prevent event from bubbling up
                deleteLocation(countryIndex, locationIndex);
            };

            locationItem.appendChild(checkbox);
            locationItem.appendChild(label);
            locationItem.appendChild(deleteButton);
            locationList.appendChild(locationItem);
        });

        countrySection.appendChild(headerContainer);
        countrySection.appendChild(locationList);
        bucketListDiv.appendChild(countrySection);
    });    
}

function toggleLocation(countryIndex,locationIndex){
    const bucketList = JSON.parse(localStorage.getItem("bucketList")) || [];
    bucketList[countryIndex].locations[locationIndex].checked = !bucketList[countryIndex].locations[locationIndex].checked;
    localStorage.setItem("bucketList", JSON.stringify(bucketList));
}

//populate country locations in the dropdown
function populateCountryOptions(){
    const bucketList = JSON.parse(localStorage.getItem("bucketList")) || [];
    const countrySelect = document.getElementById("countrySelect");

    countrySelect.innerHTML = "";

    //add a default "select country" option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Country";
    countrySelect.appendChild(defaultOption);

    bucketList.forEach((country, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = country.countryName;
        countrySelect.appendChild(option);
    });
}

//add a custom location or selected location
function addCustomLocation() {
    const selectedCountryIndex = parseInt(document.getElementById("countrySelect").value);
    const newLocationInput = document.getElementById("newLocation");
    const locationDropdown = document.getElementById("locationDropdown");

    //check if a new location was entered or selected from the dropdown
    const newLocation = newLocationInput.value.trim() || locationDropdown.value;

    if (newLocation && !isNaN(selectedCountryIndex)) {
        const bucketList = JSON.parse(localStorage.getItem("bucketList")) || [];
        bucketList[selectedCountryIndex].locations.push({ name: newLocation, checked: false});
        localStorage.setItem("bucketList", JSON.stringify(bucketList));
        newLocationInput.value = ""; // clear the input field
        displayBucketList();
    }
}

//delete country from bucket list
function deleteCountry (countryIndex) {
    const bucketList = JSON.parse(localStorage.getItem("bucketList")) || [];
    bucketList.splice(countryIndex,1);
    localStorage.setItem("bucketList", JSON.stringify(bucketList));
    displayBucketList();
    populateCountryOptions(); //update location options after deletion
}

//updated delete location function with confirmation
function deleteLocation(countryIndex, locationIndex) {
    const bucketList = JSON.parse(localStorage.getItem("bucketList")) || [];
    const location = bucketList[countryIndex].locations[locationIndex];

    if (confirm(`Are you sure you want to delete "${location.name}" from this country?`)) {
        bucketList[countryIndex].locations.splice(locationIndex,1);
        localStorage.setItem("bucketList", JSON.stringify(bucketList));
        displayBucketList();
    }
}

document.addEventListener('DOMContentLoaded', () => {

    //back to home button
    const backHomeBtn = document.getElementById('backHome');
    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
})