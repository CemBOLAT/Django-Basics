function initiateOAuth() {
    const authUrl = `${apiIp}/auth/oauth/login/`;
    
    window.location.replace(authUrl);    
}