const renderEmailAuth = async () => {
    const user_id = localStorage.getItem('user_id');
    const access_token = localStorage.getItem('access_token');
    if (!user_id || !access_token) {
        navigateTo('/login');
        return;
    }

    maincontent.innerHTML = `
    <link rel="stylesheet" href="styles/login/style.css">
    <div role="alert" id="status-alert"></div>
    <div class="content">
        <div class="login-form">
            <form action="/submit-your-login-endpoint" method="post">
                <h2 class="text-center">Email Authentication</h2>
                <div class="form-group">
                    <input id="veriCode" type="text" class="form-control" placeholder="Code" required="required">
                </div>
                <div class="form-group">
                    <button id="emailAuthBtn" type="submit" class="btn btn-primary btn-block button-56">Submit</button>
                </div>
            </form>
        </div>
    </div>
    `;

    const emailAuthBtn = document.getElementById('emailAuthBtn');

    (async function() {
        try {
            let response = await fetch(`http://127.0.0.1:8000/auth/${user_id}/send-verification-code/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                let data = await response.json();
                console.log(data);
            } else {
                console.log('response error');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    })();

    emailAuthBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        (async function() {
            try {
                let veriCode = document.getElementById('veriCode').value;
                let response = await fetch(`http://127.0.0.1:8000/auth/${user_id}/verify-email/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        code: veriCode
                    }),
                });
                if (response.ok) {
                    let data = await response.json();
                    console.log(data);
                    showAuthDiv(true);
                    navigateTo('/profile');
                } else {
                    showAuthDiv(false);
                    navigateTo('/');
                    console.log('response error');
                }
            } catch (error) {
                console.log('error');
            }
        })();
    });
};
""