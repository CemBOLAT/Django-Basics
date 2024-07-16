const renderLogin = async () => {
    if (await checkTokenAndRedirect()) return;

    maincontent.innerHTML = `
    <link rel="stylesheet" href="styles/login/style.css">

    <div role="alert" id="status-alert">
    </div>
    <div class="content">
    <div class="login-form">
      <form id="loginForm">
        <h2 class="text-center">Login</h2>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Username" required="required" id="loginUsername">
        </div>
        <div class="form-group">
          <input type="password" class="form-control" placeholder="Password" required="required" id="loginPassword">
        </div>
        <div class="form-group">
          <button id="loginBtnInLoginPage" type="submit" class="button-56">Log in</button>
        </div>
      </form>
      <div class="forget-password text-center">
        <a class="refs" href="#">Forget password ?</a> <!-- Add link to forget password page -->
      </div>
      <div class="register-link">
        <p>Don't have an account? <a id="loginPageRegisterRef" class="refs" href="/signup">Register here</a></p> <!-- Add link to register page -->
      </div>
    </div>
  </div>
  </div>
    `

    document.querySelector('#loginPageRegisterRef').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/signup');
    });

    document.querySelector('#loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        document.querySelector('#loginBtnInLoginPage').disabled = true;

        /* Convert login button to loading button */
        document.querySelector('#loginBtnInLoginPage').innerHTML = `
        <div class="spinner-border text-light" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        `;


        const username = document.querySelector('#loginUsername').value;
        const password = document.querySelector('#loginPassword').value;

        try {
            const response = await fetch('http://localhost:8000/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                mode: 'cors'
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                // errorData.non_field_errors[0] = "No active account found with the given credentials"
                showAlert(`Login failed: ${errorData.non_field_errors[0] || 'Unknown error'}`, 1);
                document.querySelector('#loginBtnInLoginPage').disabled = false;

                /* Convert loading button back to login button */

                document.querySelector('#loginBtnInLoginPage').innerHTML = `Log in`;
                

                return;
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('user_id', data.user_id);
            userOnlineSocket = userOnlineSocketStart(data.user_id);
            navigateTo('/email-auth');
            //showAuthDiv(true);
        } catch (error) {
            showAlert('An error occurred while logging in.', 1);
            document.querySelector('#loginBtnInLoginPage').disabled = false;
            document.querySelector('#loginBtnInLoginPage').innerHTML = `Log in`;
        }
    });
};
