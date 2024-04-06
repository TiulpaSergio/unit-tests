async function fetchCurrentUser() {
    const userApiPath = '/api/getCurrentUser';
  
    try {
        const response = await fetch(userApiPath, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
      
        const data = await response.json();
      
        if (!response.ok || !data.user) {
            window.location.href = '/authorization';
        } else {
            const currentUsernameElement = document.getElementById('current-username');
            currentUsernameElement.textContent = data.user.username;
        }
    } catch (error) {
        console.error('Помилка:', error);
    }
}

async function fetchPosts() {
    const postsContainer = document.getElementById('posts-container');
  
    try {
        const postsResponse = await fetch('/api/posts');
        const postsData = await postsResponse.json();
      
        if (postsResponse.ok) {
            if (Array.isArray(postsData) && postsData.length > 0) {
                postsData.forEach(post => {
                    const postElement = createPostElement(post);
                    postsContainer.appendChild(postElement);
                });
            } else {
                console.log('Масив постів порожній або не є масивом:', postsData);
                postsContainer.innerHTML = '<p class="no-posts-message">На жаль, немає жодного поста.</p>';
            }
        } else {
            throw new Error(postsData.message || 'Помилка отримання постів');
        }
    } catch (error) {
        console.error('Помилка:', error);
    }
}

async function logout() {
    try {
        const logoutResponse = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
      
        const logoutData = await logoutResponse.json();
      
        if (logoutResponse.ok && logoutData.success) {
            console.log('Ви вийшли з системи');
            redirectTo('/authorization');
        } else {
            console.error('Помилка при виході:', logoutData.message || 'Не вдалося вийти з системи');
        }
    } catch (error) {
        console.error('Помилка при виході:', error);
    }
}

function redirectTo(url) {
    window.location.href = url;
}

function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.innerHTML = `
        <div class="post" id="post-${post._id}">
            <h2>${post.title}</h2>
            <p>${post.shortDescription}</p>
            <p>Автор: ${post.author}</p>
            <p>Коментарі: <span id="comments-count-${post._id}">${post.commentsCount}</span></p>
            <button onclick="openComments('${post._id}')">Переглянути коментарі</button>
        </div>
    `;
    return postElement;
}

function openComments(postId) {
    window.location.href = `/comments.html?postId=${postId}`;
}

module.exports = { logout };

fetchCurrentUser();
fetchPosts();
