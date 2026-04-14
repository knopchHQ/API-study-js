// ui.js - DOM manipulation and rendering
import { escapeHTML, highlightText } from "./utils.js";
import { appState, getProcessedUsers } from "./state.js";

// DOM Elements cache
let elements = {};

export function initUI(elementsMap) {
    elements = elementsMap;
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

export function renderUsers(searchName, searchEmail, sortValue, shouldAnimate = false) {
    const { userGrid, state, status, emptyState } = elements;
    if (!userGrid) return;

    const usersToRender = getProcessedUsers(appState.getUsers(), {
        name: searchName,
        email: searchEmail,
        sort: sortValue
    });
    
    const count = usersToRender.length;
    const totalCount = appState.getTotalUserCount();

    if (state) {
        state.textContent = `Showing ${count} user${count !== 1 ? 's' : ''}`;
    }

    if (count === 0) {
        userGrid.innerHTML = '';
        if (emptyState) emptyState.classList.add('visible');
        
        if (status) {
            if (totalCount === 0) {
                status.textContent = 'No users loaded yet.';
            } else {
                status.textContent = `No matches found (filtered from ${totalCount} total)`;
            }
        }
        return;
    }
    
    if (emptyState) emptyState.classList.remove('visible');

    let html = '';
    usersToRender.forEach(user => {            
        const isExpanded = appState.isUserSelected(user.id);
        const highlightedName = highlightText(user.name, searchName);
        const highlightedEmail = highlightText(user.email, searchEmail);

        html += `
            <div class="user-card ${isExpanded ? 'expanded' : ''}" id="${user.id}">
                <div class="user-card-header">
                    <div class="user-icon">
                        <img class="icon-img" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233f37c9'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" alt="user">
                    </div>
                    <div class="user-basic">
                        <h3 class="user-name">${highlightedName}</h3>
                        <p class="user-email">${highlightedEmail}</p>
                    </div>
                    <button class="btn-details">
                        ${isExpanded ? 'Close' : 'Show Details'}
                    </button>
                </div>
                
                ${isExpanded ? `
                    <div class="user-details-expanded">
                        <div class="detail-row">
                            <span class="detail-label">Phone</span>
                            <span class="detail-value">${escapeHTML(user.phone) || '—'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Website</span>
                            <span class="detail-value">
                                ${user.website ? `<a href="https://${escapeHTML(user.website)}" target="_blank" rel="noopener noreferrer">${escapeHTML(user.website)}</a>` : '—'}
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
}

export function showLoadingState() {
    const { loadingContainer, userGrid, emptyState, err } = elements;
    if (err) err.classList.remove('visible');
    if (loadingContainer) loadingContainer.classList.add('visible');
    if (userGrid) userGrid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('visible');
}

export function hideLoadingState() {
    if (elements.loadingContainer) {
        elements.loadingContainer.classList.remove('visible');
    }
}

export function showError(message) {
    const { err, status } = elements;
    if (err) {
        err.classList.add('visible');
        err.textContent = `Error: ${message}`;
    }
    if (status) status.textContent = 'Failed to load users';
}

export function setLoadButtonState(disabled) {
    if (elements.loadBtn) {
        elements.loadBtn.disabled = disabled;
    }
}

export function resetUIControls(searchName, searchEmail, sortSelector) {
    if (searchName) searchName.value = '';
    if (searchEmail) searchEmail.value = '';
    if (sortSelector) sortSelector.value = 'default';
}

// Burger menu functions
export function openBurgerMenu() {
    if (window.innerWidth > 768) return;

    const { burgerMenuBtn, controlsPanel, mobileOverlay } = elements;

    if (burgerMenuBtn) burgerMenuBtn.classList.add('active');
    if (controlsPanel) controlsPanel.classList.add('visible');
    if (mobileOverlay) mobileOverlay.classList.add('visible');
    if (burgerMenuBtn) burgerMenuBtn.setAttribute('aria-expanded', 'true');

    const burgerText = burgerMenuBtn?.querySelector('.burger-text');
    if (burgerText) {
        burgerText.textContent = 'Close Menu';
    }
}

export function closeBurgerMenu() {
    if (window.innerWidth > 768) return;

    const { burgerMenuBtn, controlsPanel, mobileOverlay } = elements;
    
    if (burgerMenuBtn) burgerMenuBtn.classList.remove('active');
    if (controlsPanel) controlsPanel.classList.remove('visible');
    if (mobileOverlay) mobileOverlay.classList.remove('visible');
    if (burgerMenuBtn) burgerMenuBtn.setAttribute('aria-expanded', 'false');
    
    const burgerText = burgerMenuBtn?.querySelector('.burger-text');
    if (burgerText) {
        burgerText.textContent = 'Filters & Sort';
    }
}

export function toggleBurgerMenu() {
    const isVisible = elements.controlsPanel?.classList.contains('visible');
    if (isVisible) {
        closeBurgerMenu();
    } else {
        openBurgerMenu();
    }
}

export function isClickOutsideMenu(target) {
    const { burgerMenuBtn, controlsPanel } = elements;
    const isClickInside = controlsPanel?.contains(target) || burgerMenuBtn?.contains(target);
    return !isClickInside && controlsPanel?.classList.contains('visible');
}

export function getElements() {
    return elements;
}