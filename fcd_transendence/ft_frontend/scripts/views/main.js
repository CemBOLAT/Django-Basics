const renderMain = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        navigateTo('/');
        return;
    }

    try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`http://localhost:8000/user/${userId}/profile/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_id');
            navigateTo('/');
            return;
        }

        const userData = await response.json();
        showAuthDiv(true);
        maincontent.innerHTML = `
            <style>
                .centered-text {
                    text-align: center; /* Ortalar */
                    color: white; /* Beyaz renk */
                    font-family: 'Roboto', sans-serif; /* Roboto fontunu kullanır */
                }
            </style>
            <div class="container" id="signupdiv">
                <h3 class="centered-text">HI ${userData.nickname}</h3>
                <div class="row mt-5">
                    <button class="button-56 btn-block">Create Match</button>
                </div>
                <div class="row mt-5">
                    <button class="button-56 btn-block">Find Match</button>
                </div>
                <div class="row mt-5">
                    <button class="button-56 btn-block">Create Tournament</button>
                </div>
                <div class="row mt-5">
                    <button class="button-56 btn-block">Find Tournament</button>
                </div>
            </div>
        `;
    } catch (e) {
        console.log("fetch error", e);
        navigateTo('/');
    }
}
