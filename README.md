# 🚀 User Loader App

Interactive web application for loading, filtering, and exploring user data from an external API.

## 🌐 Live Demo
https://knopchhq.github.io/API-study-js/

---

## 📌 Features

- 🔍 Search users by name and email (with debounce optimization)
- 🔄 Sorting (A → Z / Z → A)
- 📂 Expandable user cards with additional details
- ⚡ Dynamic rendering without page reload
- 📱 Fully responsive design (mobile + desktop)
- 🚦 UX states: loading, error, empty results
- 🧠 Smart filtering with real-time updates

---

## Tech Stack

- **JavaScript (ES6+)**
- Fetch API (async/await)
- DOM Manipulation
- Event Handling
- Debounce optimization
- localStorage (optional logic)
- HTML5 / CSS3
- Responsive Design (Flexbox, Grid)

---

## Architecture & Logic

- State-based rendering (`users`, `selectedCardId`)
- Data transformation layer (API → UI model)
- Separation of concerns:
  - data processing
  - rendering
  - UI interactions
- Debounced input handling for performance optimization

---

## 📷 Preview (clickable)

[![Desktop Preview](preview.png)](https://knopchhq.github.io/API-study-js/)

[![Mobile Preview](preview_m.png)](https://knopchhq.github.io/API-study-js/)

---

## Installation

```bash
git clone https://github.com/knopchHQ/API-study-js.git
cd API-study-js
open index.html
