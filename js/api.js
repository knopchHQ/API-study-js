// api.js - Data fetching
import { appState } from "./state.js";

export async function fetchUsers() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        // Transform data
        const users = data.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            website: u.website,
            company: u.company?.name || ''
        }));
        
        appState.setUsers(users);
        return {
            success: true,
            data: users
        };
    } catch (error) {
        console.error('Fetch error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}