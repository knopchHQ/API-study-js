document.addEventListener("DOMContentLoaded", () => {
    const err = document.getElementById('err');
    const status = document.getElementById('status');
    const userGrid = document.getElementById('userGrid');
    const loadBtn = document.getElementById('loadBtn');

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

            renderUsers(allUsers);
        } catch (error) {
            err.textContent = `Error: ${error.message}`;
        } finally {
            loadBtn.disabled = false;
        }
    });

    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', () => {
        const value = searchInput.value.toLowerCase();
        const filtered = allUsers.filter(user => {
            return user.name.toLowerCase().includes(value) || user.email.toLowerCase().includes(value);
        });
        currentUsers = filtered;
        renderUsers(currentUsers);
    });

    function renderUsers(users) {
        status.textContent = "";
        userGrid.textContent = ""; // Clear the content of the user grid before rendering new users

        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('user');
            userDiv.id = user.id;
            const id = user.id;

            userDiv.innerHTML = `
                <h3>${user.name}</h3>
                <p>${user.email}</p>
            `;

            if (openDetails.has(user.id)) {
                showDetails(user, userDiv);
            }

            const btn = document.createElement('button');
            btn.textContent = "Details";

            btn.addEventListener('click', (e) => {
                e.preventDefault();

                if (openDetails.has(user.id)) {
                    openDetails.delete(user.id);
                } else {
                    openDetails.add(user.id);
                }
                
                renderUsers(currentUsers);
            });

            userGrid.appendChild(userDiv);
            userDiv.appendChild(btn);
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
});