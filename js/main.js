// main.js - Application entry point
import { debounce } from "./utils.js";
import { appState, getProcessedUsers } from "./state.js";
import { fetchUsers } from './api.js';
import {
    initUI,
    renderUsers,
    showLoadingState,
    hideLoadingState,
    showError,
    setLoadButtonState,
    resetUIControls,
    closeBurgerMenu,
    toggleBurgerMenu,
    isClickOutsideMenu
} from './ui.js';

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const elements = {
        userGrid: document.getElementById('userGrid'),
        loadBtn: document.getElementById('loadBtn'),
        searchName: document.getElementById('searchName'),
        searchEmail: document.getElementById('searchEmail'),
        resetBtn: document.getElementById('resetFilters'),
        sortSelector: document.getElementById('sortSelector'),
        state: document.getElementById('state'),
        status: document.getElementById('status'),
        loadingContainer: document.getElementById('loadingContainer'),
        emptyState: document.getElementById('emptyState'),
        err: document.getElementById('err'),
        burgerMenuBtn: document.getElementById('burgerMenuBtn'),
        controlsPanel: document.getElementById('controlsPanel'),
        confirmFiltersBtn: document.getElementById('confirmFiltersBtn'),
        mobileOverlay: document.getElementById('mobileOverlay'),
    };

    // Initialize UI with elements
    initUI(elements);

    // Destructure for easier access
    const {
        loadBtn, searchName, searchEmail, resetBtn, sortSelector,
        userGrid, burgerMenuBtn, confirmFiltersBtn, mobileOverlay
    } = elements;

    // State
    let selectedCardId = null;

    // Event Handlers
    async function handleFetchUsers() {
        showLoadingState();
        setLoadButtonState(true);

        const result = await fetchUsers();

        hideLoadingState();
        setLoadButtonState(false);

        if (result.success) {
            resetUIControls(searchName, searchEmail, sortSelector);
            appState.setSelectedCardId(null);
            renderUsers('', '', 'default', true);
        } else {
            showError(result.error);
            appState.reset();
            renderUsers('', '', 'default', false);
        }
    }

    function handleShowDetails(userId) {
        if (!appState.userExists(userId)) return;

        appState.toggleSelectedCard(userId);
        renderUsers(
            searchName?.value || '', 
            searchEmail?.value || '', 
            sortSelector?.value || 'default', 
            false
        );
    }

    const handleFilterChange = debounce(() => {
        const selectedCardId = appState.getSelectedCardId();

        if (selectedCardId) {
            const processedUsers = getProcessedUsers(appState.getUsers(), {
                name: searchName?.value || '',
                email: searchEmail?.value || '',
                sort: sortSelector?.value || 'default'
        });

            if (!processedUsers.some(u => u.id === selectedCardId)) {
                appState.setSelectedCardId(null);
            }
        }

        renderUsers(
            searchName?.value || '',
            searchEmail?.value || '', 
            sortSelector?.value || 'default',
            false
        );
    }, 300);

    const handleReset = () => {
            if (searchName) searchName.value = '';
            if (searchEmail) searchEmail.value = '';
            if (sortSelector) sortSelector.value = 'default';
            
            appState.setSelectedCardId(null);
            renderUsers('', '', 'default', false);
            closeBurgerMenu();
        };

    const handleSortChange = () => {
            renderUsers(
                searchName?.value || '', 
                searchEmail?.value || '', 
                sortSelector?.value || 'default', 
                false
            );
            closeBurgerMenu();
        };

    const handleCardClick = (e) => {
        const card = e.target.closest('.user-card');
        if (!card) return;

        const userId = Number(card.id);
        const detailsBtn = e.target.closest('.btn-details');
        
        if (detailsBtn) {
            e.preventDefault();
            e.stopPropagation();
        }

        handleShowDetails(userId);
    };

    const handleClickOutside = (e) => {
        if (window.innerWidth <= 768 && isClickOutsideMenu(e.target)) {
            closeBurgerMenu();
        }
    };

    // Event Listeners
    if (loadBtn) {
        loadBtn.addEventListener('click', handleFetchUsers);
    }
    
    if (searchName) {
        searchName.addEventListener('input', handleFilterChange);
    }
    
    if (searchEmail) {
        searchEmail.addEventListener('input', handleFilterChange);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', handleReset);
    }
    
    if (sortSelector) {
        sortSelector.addEventListener('change', handleSortChange);
    }
    
    if (userGrid) {
        userGrid.addEventListener('click', handleCardClick);
    }

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

    // Initialize app
    handleFetchUsers();
})