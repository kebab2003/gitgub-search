        const searchInput = document.getElementById('search-input');
        const autocompleteList = document.getElementById('autocomplete-list');
        const repoList = document.getElementById('repo-list');

        let timeoutId;

        
        function debounce(func, delay) {
            return function(...args) {

                clearTimeout(timeoutId);

                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        }

       
        const fetchAutocomplete = debounce(async () => {

            const searchTerm = searchInput.value;

            if (!searchTerm) {
                autocompleteList.style.display = 'none';
                return;
            }

            try {
                const response = await fetch(`https://api.github.com/search/repositories?q=${searchTerm}`);
                const data = await response.json();
                autocompleteList.innerHTML = ''; 
                autocompleteList.style.display = 'block';
                for (let i = 0;  i < data.items.length; i++) {

                    const repo = data.items[i];

                    const listItem = document.createElement('li');

                    listItem.textContent = repo.full_name;

                    listItem.addEventListener('click', () => {
                        addRepoToList(repo);
                        searchInput.value = '';
                        autocompleteList.style.display = 'none';
                    });
                    autocompleteList.appendChild(listItem);
                }

            } catch (error) {
                console.error('Ошибка:', error);
            }

        }, 500); 

        
        function addRepoToList(repo) {

            const listItem = document.createElement('li');

            listItem.innerHTML = `
                <span class="repo-name">${repo.full_name}</span>
                <span class="repo-details">Владелец: ${repo.owner.login}, Звёзды: ${repo.stargazers_count}</span>
                <button class="remove-button">Удалить</button>
            `;
            listItem.querySelector('.remove-button').addEventListener('click', () => {
                repoList.removeChild(listItem);
            });
            repoList.appendChild(listItem);
        }

       
        searchInput.addEventListener('input', fetchAutocomplete);