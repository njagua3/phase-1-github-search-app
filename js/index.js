document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const toggleButton = document.getElementById('toggle-search-type');
  
    let searchType = 'user'; // Default search type
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const query = searchInput.value.trim();
      if (query === '') return;
  
      if (searchType === 'user') {
        // Clear previous results
        userList.innerHTML = '';
        reposList.innerHTML = '';
  
        // Fetch users
        try {
          const response = await fetch(`https://api.github.com/search/users?q=${query}`, {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          });
          const data = await response.json();
          displayUsers(data.items);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      } else {
        // Clear previous results
        reposList.innerHTML = '';
        userList.innerHTML = '';
  
        // Fetch repositories
        try {
          const response = await fetch(`https://api.github.com/search/repositories?q=${query}`, {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          });
          const data = await response.json();
          displayRepos(data.items);
        } catch (error) {
          console.error('Error fetching repositories:', error);
        }
      }
    });
  
    toggleButton.addEventListener('click', () => {
      searchType = searchType === 'user' ? 'repo' : 'user';
      toggleButton.textContent = searchType === 'user' ? 'Search Repos' : 'Search Users';
      searchInput.placeholder = searchType === 'user' ? 'Search for users' : 'Search for repos';
      // Clear search input
      searchInput.value = '';
      userList.innerHTML = '';
      reposList.innerHTML = '';
    });
  
    const displayUsers = (users) => {
      users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}"/>
          <a href="${user.html_url}" target="_blank">${user.login}</a>
        `;
        li.addEventListener('click', async () => {
          await displayReposForUser(user.login);
        });
        userList.appendChild(li);
      });
    };
  
    const displayRepos = (repos) => {
      repos.forEach(repo => {
        const li = document.createElement('li');
        li.innerHTML = `
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        `;
        reposList.appendChild(li);
      });
    };
  
    const displayReposForUser = async (username) => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        });
        const data = await response.json();
        displayRepos(data);
      } catch (error) {
        console.error('Error fetching repositories for user:', error);
      }
    };
  });
  