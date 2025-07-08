document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("friendSearch");
  const autocompleteList = document.getElementById("autocompleteList");
  const selectedFriendsContainer = document.getElementById("selectedFriends");
  const gamesContainer = document.getElementById("gamesContainer");

  let selectedFriendIDs = [];

  function updateAutocompleteList(query) {
    autocompleteList.innerHTML = "";  // clear previous results (eg. typing “a” might list 10 names. Typing “al” next would add more names on top of the old ones.)

    if (!query.trim()) return;  // stop if query is empty

    const filtered = friends.filter(friend =>
      friend.personaname.toLowerCase().includes(query.toLowerCase()) && 
      !selectedFriendIDs.includes(friend.steamid) // exclude already selected friends
    );

    filtered.forEach(friend => { // for each friend that matches the query, create a list item
      const li = document.createElement("li");
      li.classList.add("list-group-item", "list-group-item-action", "d-flex", "align-items-center", "gap-2");
      li.style.cursor = "pointer";
      li.innerHTML = `
        <img src="${friend.avatar}" alt="${friend.personaname}" style="width: 32px; height: 32px; border-radius: 50%;">
        <span>${friend.personaname}</span>`;

      li.addEventListener("click", () => {
        addFriendTag(friend);
        searchInput.value = "";
        autocompleteList.innerHTML = "";
        filterGamesBySelectedFriends();
      });

      autocompleteList.appendChild(li); // adds the list item to the search list
    });
  }

  function addFriendTag(friend) {
    if (selectedFriendIDs.includes(friend.steamid)) return; // Prevents duplicates

    selectedFriendIDs.push(friend.steamid);

    const tag = document.createElement("span");
    tag.className = "badge bg-primary d-flex align-items-center gap-2 px-2 py-1"; // Bootstrap badge class for styling. Literally perfect for this.
    tag.id = `friend-${friend.steamid}`;
    tag.innerHTML = `
      <img src="${friend.avatar}" alt="${friend.personaname}" style="width: 20px; height: 20px; border-radius: 50%;">
      <span>${friend.personaname}</span>
      <button type="button" class="btn-close btn-close-white btn-sm" aria-label="Remove"></button>`;

    tag.querySelector("button").addEventListener("click", () => {
      tag.remove();
      selectedFriendIDs = selectedFriendIDs.filter(id => id !== friend.steamid);
      filterGamesBySelectedFriends();
    });

    selectedFriendsContainer.appendChild(tag);
  }

  function renderGames(gamesToRender) {
    gamesContainer.innerHTML = "";

    if (!gamesToRender.length) {
      gamesContainer.innerHTML = `<h4 class="text-white">No shared games found.</h4>`;
      return;
    }

    gamesToRender.forEach(game => {
      const col = document.createElement("div");
      col.className = "col game-item";
      col.innerHTML = `
        <div class="card text-dark h-100">
          <img src="https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg" class="card-img-top" alt="${game.name}">
          <div class="card-body">
            <h5 class="card-title">${game.name}</h5>
            <p class="card-text">Played: ${Math.round(game.playtime_forever / 60)} hours</p>
          </div>
        </div>
      `;
      gamesContainer.appendChild(col);
    });
  }

  function filterGamesBySelectedFriends() {
    if (selectedFriendIDs.length === 0) {
      renderGames(allGames);
      return;
    }
    const setsOfAppIDs = selectedFriendIDs.map(id => new Set(sharedGamesByFriend[id] || [])); // puts selected friends' game lists in Sets (quicker + easier to check intersections).
    
    const commonAppIDs = setsOfAppIDs.reduce((acc, set) => 
      new Set([...acc].filter(appid => set.has(appid))) // finds common game IDs all selected friends share.
    ); 
    
    const filteredGames = allGames.filter(game => commonAppIDs.has(game.appid)); // filters your games list to only include games that are in the commonAppIDs set.

    renderGames(filteredGames);
  }

  searchInput.addEventListener("input", e => {
    updateAutocompleteList(e.target.value);
  });

  document.addEventListener("click", e => {
    if (!autocompleteList.contains(e.target) && e.target !== searchInput) {
      autocompleteList.innerHTML = "";
    }
  });
});
