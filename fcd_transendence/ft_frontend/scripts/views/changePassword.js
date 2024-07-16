const renderChangePassword = async () => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
        navigateTo('/');
        return;
    }

    try{
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`http://localhost:8000/user/${userId}/profile/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        });

        if (!response.ok) { // https status
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_id');
            navigateTo('/');
            return;
        }

        const userData = await response.json();
        showAuthDiv(true);

        maincontent.innerHTML = `
        <link rel="stylesheet" href="styles/user/confirmpassword.css">
        <div role="alert" id="status-alert">
        </div>
        <div class="confirmPassword mx-auto">
            <form action="#" method="post">
                <h2>Change Password</h2>
                <div class="form-group">
                    <input type="password" class="form-control" placeholder="Old Password" required="required" id="oldPassword">
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" placeholder="New Password" required="required" id="newPassword">
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" placeholder="Confirm Password" required="required"  id="passwordConfirm">
                </div>
                <div class="form-group">
                    <button type="submit" class="button-56 btn-block" id="confirmPasswordBtn">Change Password</button>
                </div>
            </form>
        </div>
        `

        document.querySelector('#confirmPasswordBtn').addEventListener('click', async (e) => {
            e.preventDefault();

            document.querySelector('#confirmPasswordBtn').disabled = true;
            document.querySelector('#confirmPasswordBtn').innerHTML = `
                <div class="spinner-border text-light" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            `;

            const oldPassword = document.querySelector('#oldPassword').value;
            const newPassword = document.querySelector('#newPassword').value;
            const passwordConfirm = document.querySelector('#passwordConfirm').value;
            const userId = localStorage.getItem('user_id');

            if (newPassword !== passwordConfirm) {
                showAlert('Passwords do not match', 1);
                return;
            }

            const response = await fetch(`http://localhost:8000/user/${userId}/changepassword/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword
                })
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                showAlert(errorMessage.error, 1);
                document.querySelector('#confirmPasswordBtn').disabled = false;
                document.querySelector('#confirmPasswordBtn').innerHTML = 'Change Password';
                
                return;
            }

            showAlert('Password has been changed', 0);
            navigateTo('/main');
        });
    } catch (err) {
        showAlert('Password change failed.', 1);
        console.log("fetch error", e);
        navigateTo('/');
    }
}