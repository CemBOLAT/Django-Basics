const maincontent = document.querySelector('#indexcontent');
let userOnlineSocket = null;

const routes = {
    '/': renderIndex,
    '/signup': renderSignup,
    '/login': renderLogin,
    '/singlepong': renderSinglePong,
    '/main': renderMain,
    '/settings': renderSettings,
    '/profile': renderProfile,
    '/changepassword': renderChangePassword,
    '/friends': renderFriends,
    '/email-auth' : renderEmailAuth
};

function navigateTo(path) {
    history.pushState({}, path, window.location.origin + path);
    router();
}

function router() {
    const path = window.location.pathname;
    const route = routes[path];

    if (route) {
        route();
    } else {
        maincontent.innerHTML = `
        <style>
            body, html {
            height: 100%;
            }
            .bg-dark {
            
            }
            .centered {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            }
            .centered h1 {
            font-size: 10rem;
            color: #fff;
            }
            .centered h3 {
            color: #aaa;
            }
            .btn-home {
            margin-top: 30px;
            }
        </style>
        <div>
            <div class="centered">
                <h1>404</h1>
                <h3>Aradığınız Sayfa Bulunamadı</h3>
            </div>
        </div>`;
    }
}

window.onpopstate = router;

function main() {
    const navbarBtn = document.querySelector('#navbarBtn')

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        (async function(){
            try {
                let response = await fetch(`http://localhost:8000/auth/callback/?code=${code}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    if (userOnlineSocket)
                    {
                        userOnlineSocket.close();
                        userOnlineSocket = null;
                    }
                    return (console.log('Network response was not ok ' + response.statusText));
                }
                let data = await response.json();
                if (data.access) {
                    localStorage.setItem('access_token', data.access);
                    localStorage.setItem('refresh_token', data.refresh);
                    localStorage.setItem('user_id', data.user_id);
                    userOnlineSocket = userOnlineSocketStart(data.user_id);
                    navigateTo('/profile');
                } else {
                    console.error('Token alımı başarısız:', data);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        })();
    }


    navbarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/')
    });
    router();

    showAuthDiv(false);
    requireAuth(()=>{
        showAuthDiv(true);
    })

    document.querySelector('#g-logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
        showAuthDiv(false);
    })

    document.querySelector('#g-profile-btn').addEventListener('click', (e)=>{
        e.preventDefault();
        navigateTo('/profile');
    });

    document.querySelector("#g-friend-not-btn").addEventListener('click', (e)=>{
        e.preventDefault();
        navigateTo('/friends');
    });

    document.querySelector("#g-msg-not-btn").addEventListener('click', (e)=>{
        e.preventDefault();
        //navigateTo('/settings'); chata gidecek ama yapılmadı.
        navigateTo('/settings');
    });
}

main();
