const renderSettings = async () => {
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
        const username = userData.username;
        const timestamp = new Date().getTime();
        showAuthDiv(true);

        maincontent.innerHTML = `
            <link rel="stylesheet" href="styles/settings/style.css">
            
            <div role="alert" id="status-alert">
            </div>
            <div class="container d-flex justify-content-center align-items-center">
            <div class="card" id="settingCard">
                <div class="row no-gutters row-bordered row-border-light">
                    <div class="col-md-12">
                        <div class="card-body media align-items-center">
                            <img class="setAvatar" src="${apiIp}/media/avatars/${username}.jpg?t=${timestamp}" alt="" id="foto">
                            <form class id="profile-picture-form" enctype="multipart/form-data">
                                <input type="file" name="profile_picture" id="id_profile_picture" class="custom-file-input btn btn-primary mt-1">
                                <button class="btn btn-primary mt-1" type="submit" id="settings-upload">Upload</button>
                            </form>
                            <div id="preview"></div>
                            <div class="form-group settingsFormInput">
                                <label for="formNickName" id="usernameText" class="form-label">Nickname</label>
                                <input id="formNickName" type="text" class="form-control mb-1 username" value="${userData.nickname}">
                            </div>
                            <div class="form-group settingsFormInput">
                                <label for="formUserName" id="usernameText" class="form-label">Username</label>
                                <input id="formUserName" type="text" class="form-control mb-1 username" value="${userData.username}" readonly>
                            </div>
                            <div class="form-group">
                                <label for="userEmail" id="emailText" class="form-label">Email</label>
                                <input type="text" class="form-control useremail" id="userEmail" value="${userData.email}" readonly>
                            </div>
                            <div class="text-right mt-3">
                                <button type="button" class="btn btn-primary" id="EN" onclick="">EN</button>&nbsp;
                                <button type="button" class="btn btn-primary" id="TR" onclick="">TR</button>&nbsp;
                            </div>
                            <div id="settingBtnWrapper" class="text-right mt-3">
                                <button type="submit" class="btn btn-primary" id="SettingsButtonSave">Save changes</button>&nbsp;
                                <button type="button" class="btn btn-danger" id="DeleteUser">Delete account</button>&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `

        document.querySelector('#id_profile_picture').addEventListener('change', (e) => {
            const file = e.target.files[0];
            const preview = document.querySelector('#foto');

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        document.querySelector('#settings-upload').addEventListener('click', async (e) => {
            e.preventDefault();
        
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                navigateTo('/');
                return;
            }
            
            const userId = localStorage.getItem('user_id');
            const formData = new FormData();
            const avatarFile = document.querySelector('#id_profile_picture').files[0];

            if (avatarFile.size > 10485760) {
                showAlert('File size cannot be larger than 10 MB');
                //alert('Dosya boyutu 10 MB den büyük olamaz');
                return;
            }        

            formData.append('avatar', avatarFile);
        
            const response = await fetch(`http://localhost:8000/user/${userId}/upload-avatar/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData
            });
        
            if (response.ok) {
                showAlert('Photo uploaded successfully.');
                //showAlert('Avatar başarıyla yüklendi.');
            } else {
                showAlert('Failed to upload avatar.', 1);
                //showAlert('Avatar yükleme başarısız.', 1);
            }
        });

        document.querySelector('#SettingsButtonSave').addEventListener('click', async (e) => {
            e.preventDefault();
            let newNickName = document.querySelector('#formNickName').value;
            const userId = localStorage.getItem('user_id');
            const response = await fetch(`http://localhost:8000/user/${userId}/changenickname/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    'new_nickname' : newNickName
                })
            });

            if (!response.ok) {
                let errorMessage = await response.json();
                showAlert(errorMessage.message, 1);
                return;
            }
            showAlert('Nickname has been changed.');
        });

        document.querySelector('#DeleteUser').addEventListener('click', (e) => {
            e.preventDefault();
        })
    }catch(e)
    {
        showAlert('Nickname change failed.', 1);
        console.log("fetch error", e);
        navigateTo('/');
    }
}
