const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

// Initially get a default user profile
getUser("Mianhassam96");

async function getUser(username) {
    main.innerHTML = `<h3>Loading...</h3>`; // Show loading message

    try {
        const resp = await fetch(APIURL + username);
        if (!resp.ok) throw new Error("User not found");
        
        const respData = await resp.json();
        createUserCard(respData);

        getRepos(username);
    } catch (error) {
        main.innerHTML = `<h3>${error.message}</h3>`; // Display error message if user not found
    }
}

async function getRepos(username) {
    try {
        const resp = await fetch(APIURL + username + "/repos");
        const respData = await resp.json();

        addReposToCard(respData);
    } catch (error) {
        main.innerHTML = `<h3>Unable to fetch repositories</h3>`; // Handle repo fetch errors
    }
}

function createUserCard(user) {
    const cardHTML = `
        <div class="card">
            <div>
                <img class="avatar" src="${user.avatar_url}" alt="${user.name}" />
            </div>
            <div class="user-info">
                <h2>${user.name}</h2>
                <p>${user.bio || "No bio available."}</p>

                <ul class="info">
                    <li>${user.followers}<strong>Followers</strong></li>
                    <li>${user.following}<strong>Following</strong></li>
                    <li>${user.public_repos}<strong>Repos</strong></li>
                </ul>

                <div id="repos"></div>
            </div>
        </div>
    `;

    main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");

    repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10)
        .forEach((repo) => {
            const repoEl = document.createElement("a");
            repoEl.classList.add("repo");

            repoEl.href = repo.html_url;
            repoEl.target = "_blank";
            repoEl.innerText = repo.name;

            reposEl.appendChild(repoEl);
        });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = search.value.trim();

    if (user) {
        getUser(user);
        search.value = "";
    }
});
