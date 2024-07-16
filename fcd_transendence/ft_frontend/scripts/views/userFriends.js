const renderFriendRequests = async () => {
    const accessToken = localStorage.getItem('access_token');
    let userId = localStorage.getItem('user_id');

    if (!accessToken) {
        navigateTo('/');
        return;
    }

    try {
        const response = await fetch(`${apiIp}/user/${userId}/friendrequests/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const friendRequests = await response.json();
        const friendRequestsList = document.getElementById('friend-requests-list');
        const timestamp = new Date().getTime();
        friendRequestsList.innerHTML = '';

        friendRequests.forEach(user => {
            const li = document.createElement('li');
            li.className = 'friend-item';
            li.innerHTML = `
                <img src="${apiIp}/media/avatars/${user.from_user_username}.jpg?t=${timestamp}" alt="${user.from_user_username}" class="friend-avatar">
                <div class="friend-info">
                    <div class="friend-name">${user.from_user_username}</div>
                </div>
                <button class="button accept-friend" data-userid="${user.from_user_id}">Accept</button>
                <button class="button reject-friend" data-userid="${user.from_user_id}">Reject</button>
            `;
            friendRequestsList.appendChild(li);
        });

        document.querySelectorAll('.accept-friend').forEach(button => {
            button.addEventListener('click', async (event) => {
                const friendId = event.target.getAttribute('data-userid');
                await handleFriendRequest(friendId, 'accept');
                renderActiveFriendList();
                renderFriendRequests();
            });
        });

        document.querySelectorAll('.reject-friend').forEach(button => {
            button.addEventListener('click', async (event) => {
                const friendId = event.target.getAttribute('data-userid');
                await handleFriendRequest(friendId, 'reject');
            });
        });
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

const handleFriendRequest = async (friendId, action) => {
    const accessToken = localStorage.getItem('access_token');
    let userId = localStorage.getItem('user_id');
    if (!accessToken) {
        navigateTo('/');
        return;
    }

    try {
        const response = await fetch(`${apiIp}/user/${userId}/${action}friendrequest/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ friend_id: friendId })
        });

        if (response.ok) {
            showAlert('Friend request handled successfully.');
            renderFriendRequests();
        } else {
            showAlert('Failed to handle friend request.', 1);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

const renderActiveFriendList = async() => {
    const userId = localStorage.getItem('user_id');
    const friendListContent = document.querySelector('#active-friend-list');
    const accessToken = localStorage.getItem('access_token');
    const friendListResponse = await fetch(`${apiIp}/user/${userId}/friendlist`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const friendListData = await friendListResponse.json();
    const timestamp = new Date().getTime();
    
    friendListContent.innerHTML = '';

    for (let i = 0; i < friendListData.length; i++) {
        let username = friendListData[i].username;
        let friendId = Number(friendListData[i].id);

        friendListContent.innerHTML += `
            <li class="friend-item">
                <img src="${apiIp}/media/avatars/${username}.jpg?t=${timestamp}" alt="Friend 1" class="friend-avatar">
                <div class="friend-info">
                    <div class="friend-name">${username}</div>
                </div>
                <button class="button remove-friend" id="remove-friend-btn${i}" friend_id="${friendId}">Remove Friend</button>
            </li>
        `;
    }
    
    for (let i = 0; i < friendListData.length; i++) {
        document.querySelector(`#remove-friend-btn${i}`).addEventListener('click', async (e) => {
            e.preventDefault();
            let friendId = e.target.getAttribute('friend_id');

            const response = await fetch(`${apiIp}/user/${userId}/removefriend/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ friend_id: friendId })
            });

            if (response.ok) {
                showAlert('Friend removed successfully.');
                renderActiveFriendList();
            } else {
                showAlert('Failed to remove friend.', 1);
            }
        });
    }
}

const searchUser = async() => {
    const timestamp = new Date().getTime();
    let userId = localStorage.getItem('user_id');

    document.querySelector('#newfr-search-button').addEventListener('click', async () => {
        const query = document.querySelector('#newfr-search-input').value.trim();
        if (!query) return;
    
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            navigateTo('/');
            return;
        }
    
        try {
            const response = await fetch(`${apiIp}/user/searchusers/?query=${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            if (response.ok) {
                const users = await response.json();
                displayUsers(users);
            } else {
                console.error('Arama başarısız:', response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    });
    
    function displayUsers(users) {
        const friendList = document.querySelector('#search-friend-list');
        friendList.innerHTML = '';
        let counter = 0;

        for (let i = 0; i < users.length; i++)
        {
            let username = users[i].username;
           // let nickname = users[i].nickname;

            friendList.innerHTML += `
                <li class="friend-item">
                    <img src="${apiIp}/media/avatars/${username}.jpg?t=${timestamp}" alt="${username}" class="friend-avatar">
                    <div class="friend-info">
                        <div class="friend-name">${username}</div>
                    </div>
                    <button class="button add-friend" id="add-friend-btn${i}" userid="${users[i].id}">Add Friend</button>
                </li>
                `;
            counter++;
        }
        for (let i = 0;i < counter; i++)
        {
            document.querySelector(`#add-friend-btn${i}`).addEventListener('click', async (e)=>{
                e.preventDefault();
                const newFriendId = Number(e.target.getAttribute('userid'));
                await addFriend(newFriendId)
            });
        }
    }

    async function addFriend(friendId) {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            navigateTo('/');
            return;
        }

        try {
            const response = await fetch(`${apiIp}/user/${userId}/sendfriendrequest/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ friend_id: friendId })
            });
    
            if (response.ok) {
                showAlert('Arkadaşlık isteği gönderildi.');
            } else {
                showAlert('Arkadaşlık isteği gönderilemedi.', 1);
            }
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
}

const renderFriends = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        navigateTo('/');
        return;
    }

    try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`${apiIp}/user/${userId}/profile/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
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
        <link rel="stylesheet" href="styles/friends/style.css">
        <div role="alert" id="status-alert">
        </div>
        <div class="alignMid">
            <div class="addFriendDiv">
                <h1>Add Friend</h1>
                <div class="search">
                    <input type="text" class="search-input" id="newfr-search-input" placeholder="Search Friends">
                    <button class="button-56 search-button" id="newfr-search-button">Search</button>
                </div>
                <ul class="friend-list" id="search-friend-list">
                    
                </ul>
            </div>
            <hr>
            <div class="friendRequestsDiv">
                <h1>Friend Requests</h1>
                <ul class="friend-list" id="friend-requests-list">
                </ul>
            </div>
            <hr>
            <div>
                <h1>${userData.username} Friends</h1>
                <div class="search">
                    <input type="text" class="search-input" placeholder="Search Friends">
                    <button class="button-56 search-button">Search</button>
                </div>
                <ul class="friend-list" id="active-friend-list">
                </ul>
            </div>
        </div>
        `

        // friend request list
        renderFriendRequests();

        // friend list
        renderActiveFriendList();

        // search friend
        searchUser();
        

    } catch (e) {
        console.log("fetch error", e);
        navigateTo('/');
    }
}