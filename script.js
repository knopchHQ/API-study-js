document.addEventListener("DOMContentLoaded", () => {
    const userGrid = document.getElementById('userGrid');
    const loadBtn = document.getElementById('loadBtn');
    const searchName = document.getElementById('search-name');
    const searchEmail = document.getElementById('search-email');
    const resetBtn = document.getElementById('reset-filters');
    const sortSelector = document.getElementById('sort-selector');
    const state = document.getElementById('state');
    const status = document.getElementById('status');
    const emptyState = document.getElementById('empty-state');
    const err = document.getElementById('err');

    // footer year
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // App state
    let users = [];
    let filteredUsers = [];
    let selectedCardId = null;

    // update UI (render + status)
    function renderUsers() {
        const usersToRender = [...filteredUsers];

        if (sortSelector.value === 'name-asc') {
            usersToRender.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortSelector.value === 'name-desc') {
            usersToRender.sort((a, b) => b.name.localeCompare(a.name)); 
        } else {
            // default: keep as is
        }

        const count = usersToRender.length;
        state.textContent = `Showing: ${count} user${count !== 1 ? 's' : ''}`;

        if (count === 0) {
            if (users.length === 0) {
                emptyState.style.display = "block";
            } else {
                emptyState.style.display = 'none';
            }
        }
        
        if (count === 0) {
            userGrid.innerHTML = '';
            if (users.length && status) status.textContent = 'No users loaded yet.';
            else if (users.length > 0) status.textContent = 'No matches.';
            return
        }

        let html = '';
        usersToRender.forEach(user => {            
            const isExpanded = (selectedCardId === user.id);

            html += `
                <div class="user-card ${isExpanded ? 'expanded' : ''}"  id="${user.id}">
                    <div class="user-card-header">
                        <div class="user-icon">
                            <img class="icon-img" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233f37c9'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" alt="user">
                        </div>
                        <div class="user-basic">
                            <h3 class="user-name">${user.name}</h3>
                            <p class="user-email">${user.email}</p>
                        </div>
                        <button class="btn-details" id="${user.id}">
                            ${isExpanded ? 'Close' : 'Show Details'}
                        </button>
                    </div>
                    
                    ${isExpanded ? `
                        <div class="user-details-expanded">
                            <div class="detail-row">
                                <span class="detail-label">Phone</span>
                                <span class="detail-value">${user.phone || '__'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Website</span>
                                <span class="detail-value">
                                    ${user.website ? `<a href="https://${user.website}" target="_blank">${user.website}</a>` : '__'}
                                </span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Company</span>
                                <span class="detail-value">${user.company || '—'}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            
        });
        status.textContent = "";
        userGrid.innerHTML = html;
    };

    function applyFilters() {
        const nameValue = searchName.value.trim().toLowerCase();
        const emailValue = searchEmail.value.trim().toLowerCase();

        filteredUsers = users.filter(user => {
            return (
                user.name.toLowerCase().includes(nameValue) &&
                user.email.toLowerCase().includes(emailValue)
            );
        });

        if (selectedCardId && !filteredUsers.some(u => u.id === selectedCardId)) {
            selectedCardId = null;
        }

        renderUsers();
    };

    async function fetchUsers() {
        err.style.display = 'none';
        
        let dotCount = 1;

        const loadingInterval = setInterval(() => {
            const dots = ".".repeat(dotCount);
            status.textContent = `Loading${dots}`;
            dotCount = (dotCount % 3) + 1;
        }, 300);  // Loading... Animation

        try {
            const res = await fetch("https://jsonplaceholder.typicode.com/users");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            
            // transform date to user shape array
            users = data.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                phone: u.phone,
                website: u.website,
                company: u.company?.name || ''
            }));
            
            // reset filters
            searchName.value = '';
            searchEmail.value = '';
            sortSelector.value = 'default';
            filteredUsers = [...users];

            renderUsers();
        } catch (error) {
            console.log(error);
            err.style.display = 'block';
            err.textContent = `Error: ${error.message}`;
            status.textContent = 'Failed to load users';
            users = [];
            filteredUsers = [];
            renderUsers();
        } finally {
            loadBtn.disabled = false;
            clearInterval(loadingInterval);
        }
    }

    function showDetails(userId) {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        // Toggle
        if (selectedCardId === userId) {
            selectedCardId = null;
        } else {
            selectedCardId = userId;
        }

        renderUsers();
        console.log('showDetails')
    }

    function highlightText(text, match) {
        if (!match) return text;

        const regex = new RegExp(match, 'gi');
        return text.replace(regex, (match) => `<mark>${match}</mark>`);
    }

    function debounce(callback, delay) {
        let timer;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(() => {
                callback();
            }, delay);
        };
    };

    loadBtn.addEventListener('click', fetchUsers);

    const debounceApplyFilters = debounce(applyFilters, 400);
    searchName.addEventListener('input', debounceApplyFilters);
    searchEmail.addEventListener('input', debounceApplyFilters);

    resetBtn.addEventListener('click', () => {
        searchName.value = '';
        searchEmail.value = '';
        sortSelector.value = 'default';
        filteredUsers = users;
        renderUsers();
    });

    sortSelector.addEventListener('change', () => {
        renderUsers();
    });

    userGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.user-card');
        if(!card) return;
        const userId = Number(card.id);

        const detailsBtn = e.target.closest('.btn-details');
        if (detailsBtn) {
            e.preventDefault();
            showDetails(userId);
            return;
        }

        if (userId) {
            selectedCardId = userId;
            renderUsers();
        }
    });
    
    fetchUsers();
});