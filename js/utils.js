// utils.js - Shared utility functions
export function escapeHTML(str) {
    if (!str && str !== 0) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function highlightText(text, searchTerm) {
    if (!searchTerm || !text) return escapeHTML(text);
    
    const escapedText = escapeHTML(text);
    const trimmedSearch = searchTerm.trim();
    
    if (trimmedSearch === '') return escapedText;
    
    const escapedSearch = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearch})`, 'gi');
    
    return escapedText.replace(regex, '<mark class="highlight">$1</mark>');
}

export function debounce(callback, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => callback.apply(this, args), delay);
    };
}