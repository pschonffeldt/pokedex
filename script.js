const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const randomButton = document.getElementById("random-button");
const clearButton = document.getElementById("clear-button");

const pokemonName = document.getElementById("pokemon-name");
const pokemonId = document.getElementById("pokemon-id");
const pokemonWeight = document.getElementById("weight");
const pokemonHeight = document.getElementById("height");
const weightText = document.getElementById("weight-text");
const heightText = document.getElementById("height-text");
const statsDivider = document.getElementById("stats-divider");

const pokemonTypes = document.getElementById("types");
const pokemonTypesText = document.getElementById("types-text");
const baseStats = document.getElementById("base-stats");
const spriteContainer = document.getElementById("sprite-container");
const statsContainer = document.getElementById("stats-container");
const statBarsWrapper = document.getElementById("stat-bars-wrapper"); // 🔥 new

const statLabels = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SATK",
  "special-defense": "SDEF",
  speed: "SPD",
};

const getPokemon = async () => {
  try {
    const pokemonNameOrId = searchInput.value.toLowerCase();
    if (!pokemonNameOrId) return;

    const res = await fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pokemonNameOrId}`);
    const data = await res.json();
    setPokemonInfo(data);
  } catch (err) {
    alert("Pokémon not found");
    console.error(err);
  }
};

const getRandomPokemon = () => {
  const MAX_ID = 1025;
  const randomId = Math.floor(Math.random() * MAX_ID) + 1;
  searchInput.value = randomId;
  getPokemon();
};

const setPokemonInfo = (data) => {
  const { name, id, weight, height, types, sprites, stats } = data;

  statsContainer.classList.remove("hidden");
  statBarsWrapper.classList.remove("hidden"); // 🔥 show bars when loading a Pokémon

  pokemonName.textContent = name.toUpperCase();
  pokemonId.textContent = `#${id}`;
  pokemonId.style.color = (id === 420) ? "green" : "black";

  spriteContainer.innerHTML = `<img id="sprite" class="fadeIn" style="animation-delay: 0.2s;" src="${sprites.front_default}" alt="${name}" />`;

  pokemonTypesText.textContent = "Type";
  pokemonTypes.innerHTML = "";
  types.forEach(({ type }) => {
    const span = document.createElement("span");
    span.classList.add("type", `type--${type.name.toLowerCase()}`);
    span.textContent = type.name[0].toUpperCase() + type.name.slice(1);
    pokemonTypes.appendChild(span);
  });

  pokemonWeight.textContent = `Weight: ${weight}`;
  pokemonHeight.textContent = `Height: ${height}`;
  if (statsDivider) statsDivider.style.display = "block";
  baseStats.textContent = "Base Stats";

  const statOrder = [
    "hp", "attack", "defense", "special-attack", "special-defense", "speed",
  ];

  statOrder.forEach((statName, i) => {
    const rawStatDiv = document.getElementById(statName);
    const visualRow = document.getElementById(`${statName}-visual`);
    if (!rawStatDiv || !visualRow) return;

    const baseValue = stats[i].base_stat;

    rawStatDiv.innerHTML = baseValue;

    const label = visualRow.querySelector(".stat-label");
    if (label) label.textContent = statLabels[statName];

    const fill = visualRow.querySelector(".fill");
    if (fill) {
      fill.style.width = "0%";
      void fill.offsetWidth;
      requestAnimationFrame(() => {
        fill.style.width = `${baseValue}%`;
      });
    }
  });
};

const clearPokemon = () => {
  pokemonName.textContent = "";
  pokemonId.textContent = "";
  spriteContainer.innerHTML = "";
  pokemonTypes.innerHTML = "";
  pokemonTypesText.textContent = "";
  pokemonWeight.textContent = "";
  pokemonHeight.textContent = "";
  weightText.textContent = "";
  heightText.textContent = "";

  baseStats.textContent = "";
  searchInput.value = "";
  if (statsDivider) statsDivider.style.display = "none";

  // Clear stat bars and hide wrapper
  document.querySelectorAll(".stat-row .fill").forEach(fill => fill.style.width = "0%");
  statBarsWrapper.classList.add("hidden"); // 🔥 hide bars on clear
  statsContainer.classList.add("hidden");
};

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  getPokemon();
});

randomButton.addEventListener("click", (e) => {
  e.preventDefault();
  getRandomPokemon();
});

clearButton.addEventListener("click", clearPokemon);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getPokemon();
  }
});
