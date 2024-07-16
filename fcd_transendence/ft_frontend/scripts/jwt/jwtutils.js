async function verifyToken(token) {
    try {
        const response = await fetch('http://localhost:8000/auth/verify/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token })
        });

        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
}

async function checkTokenAndRedirect() {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        const tokenValid = await verifyToken(accessToken);
        if (tokenValid) {
            navigateTo('/main');
            return true;
        } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    }
    return false;
}

async function requireAuth(callback) {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        const tokenValid = await verifyToken(accessToken);
        if (tokenValid) {
            callback();
        } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigateTo('/');
        }
    } else {
        navigateTo('/');
    }
}
