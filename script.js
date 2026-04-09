document.addEventListener("DOMContentLoaded", () => {
    const err = document.getElementById('err');
    const status = document.getElementById('status');
    const userGrid = document.getElementById('userGrid');
    const loadBtn = document.getElementById('loadBtn');

    loadBtn.addEventListener('click', loadUsers);

    async function loadUsers() {
        err.textContent = "";
        userGrid.innerHTML = "";
        loadBtn.disabled = true;

        status.textContent = "Loading...";

        try {
            const res = await fetch("https://jsonplaceholder.typicode.com/users");

            if (!res.ok) throw new Error("Failed to load users");

            const users = await res.json();

            users.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.classList.add('user');
                userDiv.id = user.id;

                userDiv.innerHTML = `
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                `;

                const btn = document.createElement('button');
                btn.textContent = "Details";

                btn.addEventListener('click', () => {
                    showDetails(user, userDiv);
                });

                userDiv.appendChild(btn);
                userGrid.appendChild(userDiv);
            });

            status.textContent = "";

        } catch (error) {
            err.textContent = `Error: ${error.message}`;
        } finally {
            loadBtn.disabled = false;
        }
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