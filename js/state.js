// state.js - Central state management
export const appState = {
    users: [],
    selectedCardId: null,

    // Getters
    getUsers() {
        return this.users;
    },

    getSelectedCardId() {
        return this.selectedCardId;
    },

    getTotalUserCount() {
        return this.users.length;
    },

    // Setters
    setUsers(users) {
        this.users = users;
    },
    
    setSelectedCardId(id) {
        this.selectedCardId = id;
    },

    toggleSelectedCard(id) {
        this.selectedCardId = (this.selectedCardId === id) ? null : id;
    },

    isUserSelected(userId) {
        return this.selectedCardId === userId;
    },

    userExists(userId) {
        return this.users.some(u => u.id === userId);
    },

    // Reset
    reset() {
        this.users = [];
        this.selectedCardId = null;
    }
};

// Filter and Sorting function
export function getProcessedUsers(users, { name, email, sort }) {
    let result = [...users];

    const nameValue = name?.trim().toLowerCase() || '';
    const emailValue = email?.trim().toLowerCase() || '';

    // Apply filters
    if (nameValue || emailValue) {
        result = result.filter(user => {
            const nameMatch = !nameValue || user.name.toLowerCase().includes(nameValue);
            const emailMatch = !emailValue || user.email.toLowerCase().includes(emailValue);
            return nameMatch && emailMatch;
        });
    }

    // Apply sorting
    if (sort === 'name-asc') {
        result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name-desc') {
        result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
}