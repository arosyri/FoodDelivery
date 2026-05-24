const API_URL = 'http://localhost:3000/api';

export const registerUser = async (data) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
            return {
                error: responseData.message || responseData.error || 'Registration failed',
                status: response.status
            };
        }

        return responseData;
    } catch (error) {
        console.error('Register error:', error);
        return { error: 'Network error. Server might be down.' };
    }
};

export const loginUser = async (data) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
            return {
                error: responseData.message || responseData.error || 'Login failed',
                status: response.status
            };
        }

        return responseData;
    } catch (error) {
        console.error('Login error:', error);
        return { error: 'Network error. Server might be down.' };
    }
};

export const createOrder = async (data, token) => {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
            return { error: responseData.message || responseData.error || 'Failed to create order' };
        }

        return responseData;
    } catch (error) {
        console.error('Create order error:', error);
        return { error: 'Network error. Server might be down.' };
    }
};

export const getOrders = async (token) => {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            headers: {
                'Authorization': token
            }
        });

        const responseData = await response.json();

        if (!response.ok) {
            return { error: responseData.message || responseData.error || 'Failed to get orders' };
        }

        return Array.isArray(responseData) ? responseData : [];
    } catch (error) {
        console.error('Get orders error:', error);
        return { error: 'Network error. Server might be down.' };
    }
};