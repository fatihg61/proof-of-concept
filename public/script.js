const expandButton = document.querySelector('header button')
expandButton.addEventListener('click', expand)

function expand () {
  document.body.classList.toggle('expand')
}

const apiUrl = 'https://api.example.com/online-users'; // Replace with your API URL

async function fetchOnlineUsers() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const onlineUsersContainer = document.getElementById('onlineUsers');

    data.forEach((user) => {
      const userElement = document.createElement('li');
      userElement.innerHTML = `<span>${user.name}</span>`;

      onlineUsersContainer.appendChild(userElement);
    });
  } catch (error) {
    console.error('Error fetching online users:', error);
  }
}

window.addEventListener('DOMContentLoaded', fetchOnlineUsers);


