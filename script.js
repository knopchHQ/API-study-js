document.addEventListener("DOMContentLoaded", () => {
    const err = document.getElementById('err');
    const status = document.getElementById('status');
    const userDiv = document.getElementById('user');
    const loadBtn = document.getElementById('loadBtn');

    loadBtn.addEventListener('click', loadUser);

    async function loadUser() {
        err.textContent = "";
        let loadingInterval = null;
        let dotCount = 1;

        loadingInterval = setInterval(() => {
            const dots = ".".repeat(dotCount);
            status.textContent = `Loading${dots}`;
            dotCount = (dotCount % 3) + 1;
        }, 100);
        
        userDiv.innerHTML = "";
        loadBtn.disabled = true;

        const randomId = Math.floor(Math.random() * 10) + 1;
        const userUrl = `https://jsonplaceholder.typicode.com/users/${randomId}`;

        try {
            const response = await fetch(userUrl);

            if (!response.ok) {
                throw new Error("User not found");
            }

            const data = await response.json();

            userDiv.innerHTML = `
                <h3>${data.name}</h3>
                <p>${data.email}</p>
            `;

            status.textContent = "";

        } catch (error) {
            err.textContent = `Error: ${error.message || error}`;
        } finally {
            clearInterval(loadingInterval);
            loadBtn.disabled = false;
        }
    }
});