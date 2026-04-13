document.addEventListener("DOMContentLoaded", () => {
    const userGrid = document.getElementById('userGrid');
    const loadBtn = document.getElementById('loadBtn');
    const searchName = document.getElementById('search-name');
    const searchEmail = document.getElementById('search-email');
    const resetBtn = document.getElementById('reset-filters');
    const sortSelector = document.getElementById('sort-selector');
    const state = document.getElementById('state');
    const status = document.getElementById('status');
    const loadingContainer = document.getElementById('loading-container')
    const emptyState = document.getElementById('empty-state');
    const err = document.getElementById('err');
    const burgerMenuBtn = document.getElementById('burgerMenuBtn');
    const controlsPanel = document.getElementById('controlsPanel');
    const confirmFiltersBtn = document.getElementById('confirmFiltersBtn');
    const mobileOverlay = document.getElementById('mobileOverlay');

    // footer year
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // App state
    let users = [];
    let selectedCardId = null;

    // Functions
    function getProcessedUsers() {
        let result = [...users];

        const nameValue = searchName.value.trim().toLowerCase();
        const emailValue = searchEmail.value.trim().toLowerCase();

        // Apply filters
        if (nameValue || emailValue) {
            result = result.filter(user => {
                const nameMatch = !nameValue || user.name.toLowerCase().includes(nameValue);
                const emailMatch = !emailValue || user.email.toLowerCase().includes(emailValue);
                return nameMatch && emailMatch;
            });
        }

        // Apply sorting
        const sortValue = sortSelector.value;
        if (sortValue === 'name-asc') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortValue === 'name-desc') {
            result.sort((a, b) => b.name.localeCompare(a.name));
        }

        return result;
    }

    function isUserSelected(userId) {
        return selectedCardId === userId;
    }

    function getTotalUserCount() {
        return users.length;
    }

    function getFilteredUserCount() {
        return getProcessedUsers().length;
    }

    function escapeHTML(str) {
        if (!str && str !== 0) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')

    }

    function highlightText(text, searchTerm) {
        if (!searchTerm || !text) return escapeHTML(text);

        const escapedText = escapeHTML(text).toLowerCase();
        const trimmedSearch = searchTerm.trim();

        if (trimmedSearch === '') return escapedText;

        const escapedSearch = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        const regex = new RegExp(`(${escapedSearch})`, 'gi');

        return escapedText.replace(regex, '<mark class="highlight">$1</mark>');
    };

    function debounce(callback, delay) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => callback.apply(this, args), delay);
        };
    };

    function openBurgerMenu() {
        if (window.innerWidth > 768) return;

        burgerMenuBtn.classList.add('active');
        controlsPanel.classList.add('visible');
        if (mobileOverlay) mobileOverlay.classList.add('visible');
        burgerMenuBtn.setAttribute('aria-expanded', 'true');

        const burgerText = burgerMenuBtn.querySelector('.burger-text');
        if (burgerText) {
            burgerText.textContent = 'Close Menu';
        }

        document.body.style.overflow = 'hidden';
    };

    function closeBurgerMenu() {
        if (window.innerWidth > 768) return;
        
        burgerMenuBtn.classList.remove('active');
        controlsPanel.classList.remove('visible');
        if (mobileOverlay) mobileOverlay.classList.remove('visible');
        burgerMenuBtn.setAttribute('aria-expanded', 'false');
        
        const burgerText = burgerMenuBtn.querySelector('.burger-text');
        if (burgerText) {
            burgerText.textContent = 'Filters & Sort';
        }
        
        document.body.style.overflow = '';
    };

    function toggleBurgerMenu() {
        const isVisible = controlsPanel.classList.contains('visible');
        if (isVisible) {
            closeBurgerMenu();
        } else {
            openBurgerMenu();
        }
    };

    // update UI (render)
    function renderUsers(shouldAnimate = false) {
        const usersToRender = getProcessedUsers();
        const count = usersToRender.length;
        const totalCount = getTotalUserCount();
        const nameSearchTerm = searchName.value.trim();
        const emailSearchTerm = searchEmail.value.trim();

        state.textContent = `Showing: ${count} user${count !== 1 ? 's' : ''}`;

        if (count === 0) {
            userGrid.innerHTML = '';
            emptyState.classList.add('visible');
            
            if (totalCount === 0) {
                status.textContent = 'No users loaded yet.';
            } else {
                status.textContent = `No matches found (filtered from ${totalCount} total)`;
            }
            return;
        }
        
        emptyState.classList.remove('visible');

        let html = '';
        usersToRender.forEach(user => {            
            const isExpanded = isUserSelected(user.id);
            const highlightedName = highlightText(user.name, nameSearchTerm);
            const highlightedEmail = highlightText(user.email, emailSearchTerm);

            html += `
                <div class="user-card ${isExpanded ? 'expanded' : ''}"  id="${user.id}">
                    <div class="user-card-header">
                        <div class="user-icon">
                            <img class="icon-img" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233f37c9'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" alt="user">
                        </div>
                        <div class="user-basic">
                            <h3 class="user-name">${highlightedName}</h3>
                            <p class="user-email">${highlightedEmail}</p>
                        </div>
                        <button class="btn-details" id="${user.id}">
                            ${isExpanded ? 'Close' : 'Show Details'}
                        </button>
                    </div>
                    
                    ${isExpanded ? `
                        <div class="user-details-expanded">
                            <div class="detail-row">
                                <span class="detail-label">Phone</span>
                                <span class="detail-value">${escapeHTML(user.phone) || '__'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Website</span>
                                <span class="detail-value">
                                    ${user.website ? `<a href="https://${escapeHTML(user.website)}" target="_blank">${escapeHTML(user.website)}</a>` : '__'}
                                </span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Company</span>
                                <span class="detail-value">${escapeHTML(user.company) || '—'}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;            
        });
        
        userGrid.innerHTML = html;

        if (shouldAnimate) {
            userGrid.classList.add('animate');
            setTimeout(() => {
                userGrid.classList.remove('animate');
            }, 1000);
        }
    };

    // Fetch users
    async function fetchUsers() {
        err.classList.remove('visible');
        loadBtn.disabled = true;
        
        loadingContainer.classList.add('visible');
        userGrid.innerHTML = '';
        emptyState.classList.remove('visible');

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
            
            // reset UI controls
            searchName.value = '';
            searchEmail.value = '';
            sortSelector.value = 'default';
            selectedCardId = null;

            loadingContainer.classList.remove('visible');
            renderUsers(true);
        } catch (error) {
            console.log('Fetch error:', error);            
            loadingContainer.classList.remove('visible');
            err.classList.add('visible');
            err.textContent = `Error: ${error.message}`;
            status.textContent = 'Failed to load users';
            users = [];
            renderUsers(false);
        } finally {
            loadBtn.disabled = false;
        }
    };

    function showDetails(userId) {
        const userExists = users.some(u => u.id === userId);
        if (!userExists) return;

        // Toggle
        selectedCardId = (selectedCardId === userId) ? null : userId;
        renderUsers(false);
    };

    const handleFilterChange = debounce(() => {
        if (selectedCardId) {
            const processedUsers = getProcessedUsers();
            if (!processedUsers.some(u => u.id === selectedCardId)) {
                selectedCardId = null;
            }
        }
        renderUsers(false);
    }, 300);

    const handleReset = () => {
        searchName.value = '';
        searchEmail.value = '';
        sortSelector.value = 'default';
        selectedCardId = null;
        renderUsers(false);
        closeBurgerMenu();
    };

    const handleSortChange = () => {
        renderUsers(false);
        closeBurgerMenu();
    }

    const handleCardClick = (e) => {
        const card = e.target.closest('.user-card');
        if(!card) return;

        const userId = Number(card.id);
        const detailsBtn = e.target.closest('.btn-details');
        
        if (detailsBtn) {
            e.preventDefault();
            e.stopPropagation();
        }

        showDetails(userId);
    };

    const handleClickOutside = (e) => {
        if (window.innerWidth <= 768) {
            const isClickInside = controlsPanel.contains(e.target) || 
                                burgerMenuBtn.contains(e.target);
            
            if (!isClickInside && controlsPanel.classList.contains('visible')) {
                closeBurgerMenu();
            }
        }
    };

    // Event Listeners
    loadBtn.addEventListener('click', fetchUsers);
    searchName.addEventListener('input', handleFilterChange);
    searchEmail.addEventListener('input', handleFilterChange);
    resetBtn.addEventListener('click', handleReset);
    sortSelector.addEventListener('change', handleSortChange);
    userGrid.addEventListener('click', handleCardClick);

    if (burgerMenuBtn) {
        burgerMenuBtn.addEventListener('click', toggleBurgerMenu);
    }

    if (confirmFiltersBtn) {
        confirmFiltersBtn.addEventListener('click', closeBurgerMenu);
    }

    if (mobileOverlay) {        
        mobileOverlay.addEventListener('click', closeBurgerMenu);
    }

    document.addEventListener('click', handleClickOutside);

    fetchUsers();
});