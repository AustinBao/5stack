document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("friendSearch");
  const autocompleteList = document.getElementById("autocompleteList");
  const selectedFriendsContainer = document.getElementById("selectedFriends");
  const gamesContainer = document.getElementById("gamesContainer");

  // Keep track of selected friend SteamIDs
  let selectedFriendIDs = [];

  // Clear and rebuild autocomplete list based on current input
  function updateAutocompleteList(query) {
    autocompleteList.innerHTML = "";

    if (!query.trim()) return;

    const filtered = friends.filter(friend =>
      friend.personaname.toLowerCase().includes(query.toLowerCase()) &&
      !selectedFriendIDs.includes(friend.steamid) // exclude already selected
    );

    filtered.forEach(friend => {
      const li = document.createElement("li");
      li.classList.add("list-group-item", "list-group-item-action", "d-flex", "align-items-center", "gap-2");
      li.style.cursor = "pointer";
      li.innerHTML = `
        <img src="${friend.avatar}" alt="${friend.personaname}" style="width: 32px; height: 32px; border-radius: 50%;">
        <span>${friend.personaname}</span>
      `;

      li.addEventListener("click", () => {
        addFriendTag(friend);
        searchInput.value = "";
        autocompleteList.innerHTML = "";
        filterGamesBySelectedFriends();
      });

      autocompleteList.appendChild(li);
    });
  }

  // Add friend tag to selected list
  function addFriendTag(friend) {
    // Prevent duplicates
    if (selectedFriendIDs.includes(friend.steamid)) return;

    selectedFriendIDs.push(friend.steamid);

    const tag = document.createElement("span");
    tag.className = "badge bg-primary d-flex align-items-center gap-2 px-2 py-1";
    tag.id = `friend-${friend.steamid}`;
    tag.innerHTML = `
      <img src="${friend.avatar}" alt="${friend.personaname}" style="width: 20px; height: 20px; border-radius: 50%;">
      <span>${friend.personaname}</span>
      <button type="button" class="btn-close btn-close-white btn-sm" aria-label="Remove"></button>
    `;

    tag.querySelector("button").addEventListener("click", () => {
      tag.remove();
      selectedFriendIDs = selectedFriendIDs.filter(id => id !== friend.steamid);
      filterGamesBySelectedFriends();
    });

    selectedFriendsContainer.appendChild(tag);
  }

  // Render game cards
  function renderGames(gamesToRender) {
    gamesContainer.innerHTML = "";

    if (!gamesToRender.length) {
      gamesContainer.innerHTML = `<p class="text-white">No shared games found.</p>`;
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

  // Filter games by selected friends' shared games intersection
  function filterGamesBySelectedFriends() {
    if (selectedFriendIDs.length === 0) {
      renderGames(allGames);
      return;
    }

    // Get Sets of shared games for each friend
    const setsOfAppIDs = selectedFriendIDs.map(id => new Set(sharedGamesByFriend[id] || []));

    // Intersection of all selected friends' game appids
    const commonAppIDs = setsOfAppIDs.reduce((acc, set) =>
      new Set([...acc].filter(appid => set.has(appid)))
    );

    // Filter allGames by these common appids
    const filteredGames = allGames.filter(game => commonAppIDs.has(game.appid));

    renderGames(filteredGames);
  }

  // Input event to update autocomplete
  searchInput.addEventListener("input", e => {
    updateAutocompleteList(e.target.value);
  });

  // Click outside autocomplete closes the list
  document.addEventListener("click", e => {
    if (!autocompleteList.contains(e.target) && e.target !== searchInput) {
      autocompleteList.innerHTML = "";
    }
  });

  // Initial render of all games
  renderGames(allGames);
});
