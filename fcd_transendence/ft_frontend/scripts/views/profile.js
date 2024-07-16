const renderProfile = async () => {
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
            <link rel="stylesheet" href="styles/user/style.css">
            <div class="outerSite">
                <div id="outerUser" class="container">
                    <div class="row gutters-sm">
                        <div class="col-sm-2"></div>
                        <div class="col-md-3 mb-3">
                            <div class="card">
                                <div class="card-body profileCardBG" id="myusercard">
                                    <div class="d-flex flex-column align-items-center text-center">
                                        <img class="setAvatar" src="${apiIp}/media/avatars/${username}.jpg?t=${timestamp}" style="border-radius: 60%; border: 2px solid grey;" id="profileImage" class="rounded-circle" width="150">
                                        <div class="mt-3">
                                            <p class="text-muted mb-1" id="user">${userData.username}</p>
                                            <button class="btn btn-primary" id="change-avatar-btn">Upload Avatar</button>
                                        </div>
                                        <div id="online-status"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="card mt-3" id="userScore">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                        <h6 class="mb-0" id="profile-total-match">Total Match</h6>
                                        <span class="text-secondary">${Number(userData.win) + Number(userData.lose)}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                        <h6 class="mb-0" id="profile-win">Win</h6>
                                        <span class="text-secondary">${Number(userData.win)}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                        <h6 class="mb-0" id="profile-lose">Lose</h6>
                                        <span class="text-secondary">${Number(userData.lose)}</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="mt-3">
                                <button class="btn btn-primary" id="settings-btn">Settings</button>
                            </div>
                            <div class="friends mt-3" id="friend_list_content">
                                <div class="card">
                                    <div class="card-body profileCardBG" id="friendBox">
                                        <h5 class="card-title">Friends</h5>
                                        <hr>
                                        <ul class="list-group list-group-flush" id="friends-list">
                                        </ul>
                                        <div class="friends-box">
                                            <button class="btn btn-primary button-56" id="friends-btn">All friends</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6" >
                            <div class="card mb-3 profileCardBG">
                                <div class="card-body" id="card-inner">
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0" id="profile-username">Nick Name</h6>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="text-muted mb-0">${userData.nickname}</p>
                                            <button class="btn btn-primary btn-sm" id="change-username-btn">Change Username</button>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0" id="profile-email">Email</h6>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="text-muted mb-0">${userData.email}</p>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0" id="profile-firstname">User Name</h6>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="text-muted mb-0">${userData.username}</p>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0" id="profile-password">Password</h6>
                                        </div>
                                        <div class="col-sm-9">
                                            <button class="btn btn-danger btn-sm" id="change-password-btn">Change Password</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="card proCard mb-3 profileCardBG">
                                    <div class="card-body">
                                        <table class="table table-borderless card-table">
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col" id="profile-hs-user1">User</th>
                                                        <th scope="col" id="profile-hs-score1">Score</th>
                                                        <th scope="col" id="profile-hs-vs">VS</th>
                                                        <th scope="col" id="profile-hs-score2">Score</th>
                                                        <th scope="col" id="profile-hs-user2">User</th>
                                                        <th scope="col" id="profile-hs-date">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr id="match-history-1">
                                                        <th scope="row">1</th>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">VS</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0/0/0</td>
                                                    </tr>
                                                    <tr id="match-history-2">
                                                        <th scope="row">2</th>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">VS</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0/0/0</td>
                                                    </tr>
                                                    <tr id="match-history-3">
                                                        <th scope="row">3</th>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">VS</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0/0/0</td>
                                                    </tr>
                                                    <tr id="match-history-4">
                                                        <th scope="row">4</th>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">VS</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0/0/0</td>
                                                    </tr>
                                                    <tr id="match-history-5">
                                                        <th scope="row">5</th>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">VS</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0</td>
                                                        <td class="match-stats">0/0/0</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // user listesi
        const friendListContent = document.querySelector('#friends-list');
        const friendListResponse = await fetch(`${apiIp}/user/${localStorage.getItem('user_id')}/friendlist`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        const friendListData = await friendListResponse.json();

        for (let i = 0; i < friendListData.length; i++) {
            let username = friendListData[i].username;
            let isOnline = friendListData[i].is_online;
            let onlineStatusClass = isOnline ? 'online' : 'offline';
            
            console.log(isOnline);

            friendListContent.innerHTML += `
                <div class="friends-box">
                    <li class="list-group item">${username}</li>
                    <div class="online-status ${onlineStatusClass}"></div>
                </div>
                <hr>
            `;
        }

        document.querySelector('#change-avatar-btn').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('/settings');
        })

        document.querySelector('#settings-btn').addEventListener('click',(e) => {
            e.preventDefault();
            navigateTo('/settings');
        });

        document.querySelector('#change-username-btn').addEventListener('click',(e) => {
            e.preventDefault();
            navigateTo('/settings');
        })

        document.querySelector('#change-password-btn').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('/changepassword');
        });
        document.querySelector('#friends-btn').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('/friends');
        });
    } catch (e) {
        console.log("fetch error", e);
        navigateTo('/');
    }
}
