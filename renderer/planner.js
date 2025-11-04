//display all countries saved in the monthly planner
document.addEventListener('DOMContentLoaded', () => {

    //back to home button
    const backHomeBtn = document.getElementById('backHome');
    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

 
    //load the monthlyplanner data from localstorage
    const planner = JSON.parse(localStorage.getItem("monthlyPlanner")) || {};

    //loop through each month and display its countries
    const allMonths = document.querySelectorAll('.month-section');
    allMonths.forEach(section => {
        const monthName = section.querySelector('.month-title').textContent;
        const container = section.querySelector('.country-container');
        container.innerHTML = "";

        const countries = planner[monthName] || [];

        if (countries.length === 0) {
            container.innerHTML = `<p class="empty-month">No countries in this month. Start planning Now!! </p>`;
            return;
        }

        countries.forEach((country) => {
                const card = document.createElement("div");
                card.classList.add("country-card");

                card.innerHTML = `
                    <img src ="${country.strCountryThumb || 'https://placehold.co/200x120?text=No+Flag'}" alt = "${country.strCountry}">
                    <h3>${country.strCountry}</h3>
                    <div class="card-buttons">
                        <button class="view-btn" data-id ="${country.idCountry}">View</button>
                        <button class="delete-btn" data-month="${monthName}" data-id ="${country.idCountry}">Delete</button>
                        <button class="edit-notes-btn" data-month="${monthName}" data-id="${country.idCountry}">Edit Notes</button>
                    </div>
                    <textarea class="country-note" placeholder="Add your notes here..." style="display:none;"></textarea>
                `;

                container.appendChild(card);
        });
    });
    
    //add button listeners (events handling)
    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("view-btn")) {
            const id = e.target.getAttribute("data-id");
            localStorage.setItem("selectedCountryCode", id);
            window.location.href = "country-details.html";      
        }

        if (e.target.classList.contains("delete-btn")) {
            const month = e.target.getAttribute("data-month");
            const id = e.target.getAttribute("data-id");

            const planner = JSON.parse(localStorage.getItem("monthlyPlanner")) || {};
            planner[month] = planner[month].filter((c) => c.idCountry !== id);
            localStorage.setItem("monthlyPlanner", JSON.stringify(planner));
            alert("Country removed from the planner.");
            location.reload();
        }

        if (e.target.classList.contains("edit-notes-btn")) {
            const month =e.target.getAttribute("data-month");
            const id =e.target.getAttribute("data-id"); 
            const card = e.target.closest(".country-card");

            if (!card) return;
            const noteField = card.querySelector(".country-note");
            if (!noteField) return;

            //toggle the textarea visibility if needed
            if (noteField.style.display === "none" || noteField.style.display === "") {
                noteField.style.display = "block";
                noteField.focus();

                const savedNotes = JSON.parse(localStorage.getItem("savedNotes")) || {};
                const key = `${month}_${id}`;
                if (savedNotes[key]) {
                    noteField.value = savedNotes[key];
                }
            }else {
                noteField.style.display = "none";
                
                const noteText = noteField.value.trim();
                const savedNotes = JSON.parse(localStorage.getItem("savedNotes")) || {};
                savedNotes[`${month}_${id}`] = noteText;
                localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
                alert("Notes saved succesfully!");
            }

            
        }
    });
});

