document.addEventListener("DOMContentLoaded", () => {
    const err = document.getElementById('err');
    const status = document.getElementById('status');
    const userGrid = document.getElementById('userGrid');
    const loadBtn = document.getElementById('loadBtn');
    const sortByName = document.getElementById('sort-selector');
    const resetBtn = document.getElementById('reset-filters');
    const state = document.getElementById('state');

    let allUsers = [];
    let openDetails = new Set();
    let currentUsers = [];

    loadBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        err.textContent = "";
        userGrid.innerHTML = "";
        loadBtn.disabled = true;

        status.textContent = "Loading...";

        try {
            const res = await fetch("https://jsonplaceholder.typicode.com/users");

            if (!res.ok) throw new Error("Failed to load users");

            allUsers = await res.json();
            currentUsers = allUsers;

            renderUsers(currentUsers);
        } catch (error) {
            err.textContent = `Error: ${error.message}`;
        } finally {
            loadBtn.disabled = false;
        }
    });

    const searchInputName = document.getElementById('search-name');
    const searchInputEmail = document.getElementById('search-email');
    searchInputName.addEventListener('input', applyFilters);
    searchInputEmail.addEventListener('input', applyFilters);

    sortByName.addEventListener('change', renderUsers);

    function renderUsers(users) {
        status.textContent = "";
        userGrid.textContent = ""; // Clear the content of the user grid before rendering new users

        const usersToRender = [...users];

        if (sortByName.value === 'name-asc') {
            usersToRender.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        if (sortByName.value === 'name-desc') {
            usersToRender.sort((a, b) => b.name.localeCompare(a.name)); 
        }

        if (sortByName.value === 'default') {
            usersToRender.sort((a, b) => a.id - b.id);
        }

        state.textContent = `Showing: ${usersToRender.length} users`;

        usersToRender.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('user');
            userDiv.id = user.id;

            userDiv.innerHTML = `
                <h3>${user.name}</h3>
                <p>${user.email}</p>
            `;

            if (openDetails.has(user.id)) {
                showDetails(user, userDiv);
            }

            const btnDetails = document.createElement('button');
            btnDetails.textContent = openDetails.has(user.id) ? "Hide Details" : "Show Details";

            btnDetails.addEventListener('click', () => {
                if (openDetails.has(user.id)) {
                    openDetails.delete(user.id);
                } else {
                    openDetails.add(user.id);
                }
                
                renderUsers(currentUsers);
            });

            userDiv.appendChild(btnDetails);
            userGrid.appendChild(userDiv);
        });
    }

    function showDetails(user, container) {
        container.querySelectorAll('.user-detail').forEach(el => el.remove());

        for (const key in user) {
            if (typeof user[key] !== "object" && user[key]) {
                const p = document.createElement('p');
                p.classList.add('user-detail');
                p.textContent = `${key}: ${user[key]}`;
                container.appendChild(p);
            }
        }
    }

    function applyFilters() {
    const nameValue = searchInputName.value.toLowerCase();
    const emailValue = searchInputEmail.value.toLowerCase();

    currentUsers = allUsers.filter(user => {
        return (
            user.name.toLowerCase().includes(nameValue) &&
            user.email.toLowerCase().includes(emailValue)
        );
    });

    renderUsers(currentUsers);
    }
    
    resetBtn.addEventListener('click', () => {
        sortByName.value = 'default';
        searchInputName.value = '';
        searchInputEmail.value = '';
        currentUsers = allUsers;
        renderUsers(currentUsers);
    });
});

