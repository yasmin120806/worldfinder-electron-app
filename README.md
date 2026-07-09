# Travel Planner & Bucket List

A desktop travel planning application built with **Electron.js**, **HTML**, **CSS**, and **JavaScript**. The application allows users to explore countries around the world, view detailed country information using the REST Countries API, organize future trips with a monthly travel planner, and maintain a personal travel bucket list.

---

## Overview

Travel Planner & Bucket List is designed for users who enjoy exploring destinations and planning future trips. By integrating live country data from the REST Countries API, users can easily browse countries, view detailed information, navigate to neighboring countries, and save destinations for future travel.

The application stores planner and bucket list data locally using the browser's Local Storage, allowing users to keep their travel plans even after closing the application.

---

## Features

### Country Explorer
- Browse countries from around the world.
- Search countries by name.
- View random country recommendations.
- Display country flags.

### Country Details
View detailed information including:
- Country flag
- Coat of Arms
- Capital city
- Population
- Area
- Region & Subregion
- Languages
- Timezones
- Geographic coordinates
- Google Maps link
- OpenStreetMap link
- Nearby (bordering) countries

### Nearby Country Navigation
- Displays neighboring countries as clickable links.
- Clicking a nearby country instantly loads its details without returning to the homepage.

### Monthly Travel Planner
- Add countries to any month of the year.
- Store travel plans locally.
- Organize future trips month-by-month.

### Travel Bucket List
- Save dream destinations.
- Prevent duplicate entries.
- Persistent storage using Local Storage.

### User Interface
- Dark Mode
- Back-to-Top button
- Responsive card layout
- Horizontal scrolling country sections
- Clean pink-themed modern interface

---

## Technologies Used

- Electron.js
- HTML5
- CSS3
- JavaScript (ES6)
- REST Countries API
- Local Storage

---

## API Used

### REST Countries API

The application retrieves live country information from:

https://restcountries.com/

Endpoints used:

```text
GET /v3.1/all?fields=name,flags,capital,cca3

GET /v3.1/all?fields=name,cca3,borders

GET /v3.1/alpha/{countryCode}
```

The API provides:

- Country names
- Flags
- Capitals
- Population
- Area
- Languages
- Timezones
- Regions
- Borders
- Maps
- Geographic coordinates

---

## 💾 CRUD Implementation

Although the application does not use a database, CRUD functionality is implemented using the browser's **Local Storage**.

### Create
Users can:
- Add countries to the Monthly Planner.
- Add countries to the Bucket List.

### Read
The application retrieves stored planner and bucket list data whenever the corresponding pages are opened.

### Update
Users can update planner information such as travel notes or modify saved travel plans.

### Delete
Users can remove countries from:
- Bucket List
- Monthly Planner

---

## Screenshots

- Home Page
  <img width="756" height="380" alt="image" src="https://github.com/user-attachments/assets/ab6e4bca-5ab6-4761-922e-2775dd85f73d" />


- Country Details
  <img width="733" height="369" alt="image" src="https://github.com/user-attachments/assets/c52dce03-64fa-4bbc-9087-fef658665fb6" />
  <img width="734" height="333" alt="image" src="https://github.com/user-attachments/assets/9dcfccd6-5308-41af-a1ff-6e645282280d" />

- Planner
  <img width="723" height="367" alt="image" src="https://github.com/user-attachments/assets/61955dcf-1a5c-4ac4-a9a9-bdd797c35680" />

- Bucket List
  <img width="704" height="354" alt="image" src="https://github.com/user-attachments/assets/07a47a46-f36f-4838-8854-01654e553bda" />


## 🎯 Learning Outcomes

This project demonstrates:

- REST API integration
- Asynchronous JavaScript (Fetch API)
- DOM manipulation
- Event handling
- Local Storage implementation
- CRUD operations
- Electron desktop application development
- Responsive user interface design

---

## Developer 

**Yasmin Suhaimi**

Diploma in Computer Science

---

## 📄 License

This project was developed for educational purposes.
