const PAGE_SIZE = 4;
let currentPage = 1;
let totalPages = 0;
let allPokemonData = [];
let selectedIndexInPage = 0;
let searchResults = [];
let isSearching = false;
let searchPage = 1;

const tableBody = document.querySelector("#pokemon-table tbody ");
const tableHead = document.querySelector("#pokemon-table thead");
const pageLabel = document.getElementById("page-label");
const searchBar = document.getElementById("search-box");

async function fetchAllPokemon() {
  const limit = 1010; // Total known Pokémon as of Gen 9

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  const data = await res.json();

  const urls = data.results.map((p) => p.url); // Get URLs of all Pokémon

  // Fetch all in parallel (careful: this is heavy)
  const fetches = urls.map((url) => fetch(url).then((res) => res.json()));

  allPokemonData = await Promise.all(fetches);

  totalPages = Math.ceil(allPokemonData.length / PAGE_SIZE);
  renderPage(currentPage);
}

searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase();

  if (query === "") {
    isSearching = false;
    currentPage = 1;
    renderPage(currentPage);
    return;
  }

  isSearching = true;
  searchPage = 1;
  searchResults = allPokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(query)
  );

  renderSearchPage(searchPage);
});

function renderSearchPage(page) {
  tableBody.innerHTML = "";
  const start = (page - 1) * PAGE_SIZE;
  const pageData = searchResults.slice(start, start + PAGE_SIZE);

  pageData.forEach((pokemon, index) => {
    const row = document.createElement("tr");
    if (index === selectedIndexInPage) {
      row.classList.add("highlight");
    }

    const types = pokemon.types
      .map((t) => {
        const typeName = t.type.name;
        return `<span class="type ${typeName}">${typeName.toUpperCase()}</span>`;
      })
      .join(" ");

    const status = isCaught(pokemon.id) ? "CAUGHT" : "SEEN";

    row.innerHTML = `
        <td>#${pokemon.id.toString().padStart(3, "0")}</td>
        <td>${pokemon.name.toUpperCase()}</td>
        <td>${types}</td>
        <td class="status">${status}</td>
      `;

    tableBody.appendChild(row);
  });

  const totalSearchPages = Math.ceil(searchResults.length / PAGE_SIZE);
  pageLabel.textContent = `SEARCH PAGE ${searchPage}/${totalSearchPages}`;
}

function nextPage() {
  if (isSearching) {
    const totalSearchPages = Math.ceil(searchResults.length / PAGE_SIZE);
    if (searchPage < totalSearchPages) {
      searchPage++;
      selectedIndexInPage = 0;
      renderSearchPage(searchPage);
    }
  } else {
    if (currentPage < totalPages) {
      currentPage++;
      selectedIndexInPage = 0;
      renderPage(currentPage);
    }
  }
}

function prevPage() {
  if (isSearching) {
    if (searchPage > 1) {
      searchPage--;
      selectedIndexInPage = 0;
      renderSearchPage(searchPage);
    }
  } else {
    if (currentPage > 1) {
      currentPage--;
      selectedIndexInPage = 0;
      renderPage(currentPage);
    }
  }
}

function renderPage(page) {
  tableBody.innerHTML = "";
  const start = (page - 1) * PAGE_SIZE;
  const pageData = allPokemonData.slice(start, start + PAGE_SIZE);

  pageData.forEach((pokemon, index) => {
    const row = document.createElement("tr");
    if (index === selectedIndexInPage) {
      row.classList.add("highlight");
    }

    const types = pokemon.types
      .map((t) => {
        const typeName = t.type.name;
        return `<span class="type ${typeName}">${typeName.toUpperCase()}</span>`;
      })
      .join(" ");

    const status = isCaught(pokemon.id) ? "CAUGHT" : "SEEN";

    row.innerHTML = `
      <td>#${pokemon.id.toString().padStart(3, "0")}</td>
      <td>${pokemon.name.toUpperCase()}</td>
      <td>${types}</td>
      <td class="status">${status}</td>
    `;
    tableBody.appendChild(row);
  });

  pageLabel.textContent = `PAGE ${currentPage}/${totalPages}`;
}

function renderPage(page) {
  tableBody.innerHTML = "";
  const start = (page - 1) * PAGE_SIZE;
  const pageData = allPokemonData.slice(start, start + PAGE_SIZE);

  pageData.forEach((pokemon, index) => {
    const row = document.createElement("tr");
    if (index === selectedIndexInPage) {
      row.classList.add("highlight");
    }

    const types = pokemon.types
      .map((t) => {
        const typeName = t.type.name;
        return `<span class="type ${typeName}">${typeName.toUpperCase()}</span>`;
      })
      .join(" ");

    const status = isCaught(pokemon.id) ? "CAUGHT" : "SEEN";

    row.innerHTML = `
      <td>#${pokemon.id.toString().padStart(3, "0")}</td>
      <td>${pokemon.name.toUpperCase()}</td>
      <td>${types}</td>
      <td class="status">${status}</td>
    `;
    tableBody.appendChild(row);
  });

  pageLabel.textContent = `PAGE ${currentPage}/${totalPages}`;
}

function showPokemonCard(pokemon) {
  const card = document.getElementById("pokemon-card");

  const types = pokemon.types.map((t) => t.type.name.toUpperCase()).join(", "); // Abilities

  const abilities = pokemon.abilities
    .map((ab) => ab.ability.name.toUpperCase())
    .join(", "); // Base Stats (HP, Attack, Defense, etc.)

  const baseStats = pokemon.stats
    .map((stat) => {
      const name = stat.stat.name.toUpperCase();
      const value = stat.base_stat;
      return `<p>${name}: ${value}</p>`;
    })
    .join(""); // First 4 Moves

  const moves = pokemon.moves
    .slice(0, 4)
    .map((m) => m.move.name)
    .join(", "); // Status

  const status = isCaught(pokemon.id) ? "CAUGHT" : "SEEN"; // Build the card content

  card.innerHTML = `
        
    <div>
                  <h2>${pokemon.name.toUpperCase()}</h2>
                     
                  <img
                    src="${pokemon.sprites.front_default}"
                    alt="${pokemon.name}"
                  />
                  <p>
                  ID: #${pokemon.id.toString().padStart(3, "0")}
                  </p>
                   <p>Height: ${pokemon.height}</p>
                     
                  <p>Weight: ${pokemon.weight}</p>
                  <p>Types: ${types}</p>
                  </div>
                     
                 
        <div>
                    
                     
                 
                     
                  
                
                     
                  <p>
                    <strong>Base Experience:</strong> ${pokemon.base_experience}
                  </p>
                     
                  <p><strong>Status:</strong> ${status}</p>
                     
                  <h3>Base Stats</h3>
                      <span>${baseStats}</span>    
                  <p><em>Abilities:</em> <i>${abilities}</i></p>
                  <p><em>Moves:</em> <i>${moves}</i></p>
                </div>
      `; // Show card, hide table

  card.style.display = "flex";
  tableBody.style.display = "hidden";
  tableHead.style.display = "hidden";
}

function hidePokemonCard() {
  const card = document.getElementById("pokemon-card");

  card.style.display = "none";
  tableBody.style.display = "visible";
  tableHead.style.display = "visible";
}

function upPage() {
  if (selectedIndexInPage > 0) {
    selectedIndexInPage--;
    renderPage(currentPage);
  }
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    selectedIndexInPage = 0;
    renderPage(currentPage);
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    selectedIndexInPage = 0;
    renderPage(currentPage);
  }
}
function downPage() {
  if (selectedIndexInPage < PAGE_SIZE - 1) {
    selectedIndexInPage++;
    renderPage(currentPage);
  }
}
function pressPop() {
  const index = selectedIndexInPage;

  if (isSearching) {
    const start = (searchPage - 1) * PAGE_SIZE;
    const selectedPokemon = searchResults[start + index];
    if (selectedPokemon) showPokemonCard(selectedPokemon);
  } else {
    const start = (currentPage - 1) * PAGE_SIZE;
    const selectedPokemon = allPokemonData[start + index];
    if (selectedPokemon) showPokemonCard(selectedPokemon);
  }
}
function pressHide() {
  hidePokemonCard();
}

function isCaught(id) {
  const caught = JSON.parse(localStorage.getItem("caughtList")) || [];
  return caught.includes(id);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    if (selectedIndexInPage < PAGE_SIZE - 1) {
      selectedIndexInPage++;
      renderPage(currentPage);
    }
  } else if (e.key === "ArrowUp") {
    if (selectedIndexInPage > 0) {
      selectedIndexInPage--;
      renderPage(currentPage);
    }
  } else if (e.key === "ArrowRight") {
    nextPage();
  } else if (e.key === "ArrowLeft") {
    prevPage();
  }
});

fetchAllPokemon();
