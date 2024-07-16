const renderSignup = async () => {
    if (await checkTokenAndRedirect()) return;

    maincontent.innerHTML = `
    <link rel="stylesheet" href="styles/login/style.css">
    <link rel="stylesheet" href="styles/signup/style.css">


    <div role="alert" id="status-alert">
    </div>
    
    
    <!-- Content -->
    <div class="content">
        <div class="signup-form">
            <form id="signupForm">
                <h2>Sign Up</h2>
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Username" required="required" id="userName">
                </div>
                <div class="form-group">
                    <input type="email" class="form-control" placeholder="Email" required="required" id="email">
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" placeholder="Password" required="required" id="password">
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" placeholder="Confirm Password" required="required" id="passwordConfirm">
                </div>
                <div class="form-group">
                    <button type="submit" class="button-56 btn-block" id="signUpBtn">Sign Up</button>
                </div>
            </form>
            <div class="register-link">
                <p>Already have an account? <a id="SignupPageLoginRef" class="refs" href="/login">Log in here</a></p>
            </div>
        </div>
    </div>
    `

    document.querySelector('#SignupPageLoginRef').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/login');
    });

    document.querySelector('#signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        document.querySelector('#signUpBtn').disabled = true;
        document.querySelector('#signUpBtn').innerHTML = `
            <div class="spinner-border text-light" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        `;

        const username = document.querySelector('#userName').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const passwordConfirm = document.querySelector('#passwordConfirm').value;

        if (password !== passwordConfirm) {
            showAlert('Passwords do not match',1);
            document.querySelector('#signUpBtn').disabled = false;
            document.querySelector('#signUpBtn').innerHTML = 'Sign Up';
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/auth/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password }),
                mode: 'cors'
            });

            if (!response.ok) {
                const errorData = await response.json();
                //console.log(errorData);
                showAlert(`Signup failed: ${errorData.email || errorData.username || 'Unknown error'}`, 1 );
                document.querySelector('#signUpBtn').disabled = false;
                document.querySelector('#signUpBtn').innerHTML = 'Sign Up';
                return;
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('user_id', data.user_id);
            userOnlineSocket = userOnlineSocketStart(data.user_id);
            navigateTo('/main');
            showAuthDiv(true);
        } catch (error) {
            showAlert('Signup failed: Unknown error', 1);
            document.querySelector('#signUpBtn').disabled = false;
            document.querySelector('#signUpBtn').innerHTML = 'Sign Up';
        }
    });
};
