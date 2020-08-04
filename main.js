let globalPokemon = {};
const promises = [];
const fetchPokemon = () => {
  for (let i = 1; i <= 350; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url).then((response) => response.json()));
  }
  Promise.all(promises).then((results) => {
    const pokemon = results.map((data) => ({
      name: data.name,
      id: data.id,
      image: data.sprites["front_default"],
      height: data.height / 10,
      weight: data.weight / 10,
      abilities: data.abilities
        .map((ability) => {
          return ability.ability.name;
        })
        .join(", "),
      type: data.types.map((type) => {
        return type.type.name;
      }),
      genus: "",
    }));
    displayPokemon(pokemon);
    globalPokemon = pokemon;
  });
};

fetchPokemon();

window.addEventListener('scroll',function(e){
  const windowHeight = document.documentElement.clientHeight;
  console.log(windowHeight);
  const currentHeight = window.scrollY;
  console.log(currentHeight)
  if(windowHeight === currentHeight){
    alert("reached");
  }
  
})


const pokeContainer = document.getElementById("showPokemon");
const displayPokemon = (poke) => {
  const pokeCardOutput = poke
    .map(
      (pokemon) =>
        `
        <div class="pokemon-card" onclick="modal_popup(${pokemon.id})">
            <div class="poke-header">
                <div class="poke-img"><img src="${pokemon.image}" alt="${
          pokemon.name
        }"></div>
                <div class="poke-id">${
                  pokemon.id < 10
                    ? `#00${pokemon.id}`
                    : `${pokemon.id}` < 100
                    ? `#0${pokemon.id}`
                    : `#${pokemon.id}`
                }
                </div>
            </div>
            <div class="poke-name">
                ${pokemon.name}
            </div>
            <div class="poke-genus">
                
            </div>
            <div class="poke-type">
                ${
                  pokemon.type.length == 2
                    ? `<span class="poke-type-name -${pokemon.type[0]}">${pokemon.type[0]}</span> 
                     <span class="poke-type-name -${pokemon.type[1]}">${pokemon.type[1]}</span> 
                    `
                    : `
                    <span class="poke-type-name -${pokemon.type[0]}">${pokemon.type}</span> 
                    `
                }
            </div>
            <div class="poke-abilities">
                ${pokemon.abilities.replace(",", "")}
            </div>
            <div class="poke-height">
                ${pokemon.height}m
            </div>
            <div class="poke-weight">
                ${pokemon.weight}kg
            </div>
        </div>      
        `
    )
    .join(" ");
  pokeContainer.innerHTML = pokeCardOutput;

 
};


function checkDiv(){
  const pokeCardDiv = document.querySelectorAll('.pokemon-card');
  for(let i = 25; i < pokeCardDiv.length; i++){
    pokeCardDiv[i].style.display="none";
  }
}

async function modal_popup(id) {
  evolutionURL(id);
}

const evolutionURL = (id) =>{
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
  .then(response => response.json()).then(data=> {
    const evolChain = data.evolution_chain.url;
    getPokeEvolution (evolChain,id);
  });
}

const getPokeEvolution = (url,id) => {
  fetch(url).then(response => response.json()).then(data=>{
    const checkEvolution = data.chain.evolves_to;
      if(checkEvolution.length == 0){
        let evolutionChain = [];
        evolutionChain.push(data.chain.species.name);
        pokemonEvolution(evolutionChain,id);
      }
      else if(checkEvolution.length == 1){
          if(data.chain.evolves_to[0].evolves_to.length == 1){
                let evolutionChain = []     
                evolutionChain.push(data.chain.species.name);
                evolutionChain.push(data.chain.evolves_to[0].species.name);
                evolutionChain.push(data.chain.evolves_to[0].evolves_to[0].species.name);          
                pokemonEvolution(evolutionChain,id);
          }
          else{
              let evolutionChain = []     
              evolutionChain.push(data.chain.species.name);
              evolutionChain.push(data.chain.evolves_to[0].species.name);
              pokemonEvolution(evolutionChain,id);
          }
      }
  })
}

const pokemonEvolution = (evol,id) => {
    let promises_evolution = [];
    for(let i = 0; i < evol.length; i++){
      const url = `https://pokeapi.co/api/v2/pokemon/${evol[i]}`
      promises_evolution.push(fetch(url).then(res=>res.json()));
    }
    Promise.all(promises_evolution).then(results => {
      const pokeEvolution = results.map(result => ({
            name: result.name,
            id: result.id,
            image: result.sprites["front_default"],
            types: result.types.map(type=>
              type.type.name
            )
      }))
     poke_modal(pokeEvolution,id);
    });
  }

async function poke_modal(pokeEvolution, id){
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const poke_modal = await res.json();
  displayPopup(poke_modal , pokeEvolution);
}

const pokeApp = document.getElementById("poke-app");
const modalBox = document.querySelector(".modal-bg");

function displayPopup(poke_modal, pokeEvolution) {
  modalBox.classList.add("bg-active");
  const evolution = pokeEvolution;
  let evolutionHTML ='';
  if (evolution.length==3){
    evolutionHTML =  `<div class="evol-box">
    <div class="evol-title">
        <h1>Evolution</h1>
    </div>
    <div class="evol-cycle">
        <div class="evol-first">
            <img src="${evolution[0].image}" alt="">
            <span>${evolution[0].id < 10
                ? `#00${evolution[0].id}`
                : `${evolution[0].id}` < 100
                ? `#0${evolution[0].id}`
                : `#${evolution[0].id}`}</span>
            <span>${evolution[0].name}</span>
            <div>
              ${evolution[0].types.length == 2 
                ? `<span class="-${evolution[0].types[0]}" >${evolution[0].types[0]}</span> 
                  <span class="-${evolution[0].types[1]}">${evolution[0].types[1]}</span>
                ` :
                ` <span class="-${evolution[0].types[0]}" >${evolution[0].types[0]}</span> 
                `
              }
            </div>
        </div>
        <div class="evol-next">
            <div class="arrow">
                <svg class="poke-arrow" viewBox="0 0 26 13">
                    <path d="M 20.854 0.146 a 0.5 0.5 0 0 0 -0.707 0.707 L 24.293 5 L 0.5 5 a 0.5 0.5 0 0 0 0 1 h 23.793 l -4.146 4.145 a 0.5 0.5 0 0 0 0.708 0.707 l 5 -5 a 0.5 0.5 0 0 0 0 -0.707 L 20.854 0.146z"></path>
                </svg>
            </div>
            <div class="evol-next-info">
                  <img src="${evolution[1].image}" alt="">
                  <span>${evolution[1].id < 10
                      ? `#00${evolution[1].id}`
                      : `${evolution[1].id}` < 100
                      ? `#0${evolution[1].id}`
                      : `#${evolution[1].id}`}</span>
                  <span>${evolution[1].name}</span>
                  <div>
                    ${evolution[1].types.length == 2 
                      ? `<span class="-${evolution[1].types[0]}" >${evolution[1].types[0]}</span> 
                        <span class="-${evolution[1].types[1]}">${evolution[1].types[1]}</span>
                      ` :
                      ` <span class="-${evolution[1].types[0]}" >${evolution[1].types[0]}</span> 
                      `
                    }
                  </div>
            </div>
            
        </div>
      
        <div class="evol-next">
            <div class="arrow">
                <svg class="poke-arrow" viewBox="0 0 26 13">
                    <path d="M 20.854 0.146 a 0.5 0.5 0 0 0 -0.707 0.707 L 24.293 5 L 0.5 5 a 0.5 0.5 0 0 0 0 1 h 23.793 l -4.146 4.145 a 0.5 0.5 0 0 0 0.708 0.707 l 5 -5 a 0.5 0.5 0 0 0 0 -0.707 L 20.854 0.146z"></path>
                </svg>
            </div>
            <div class="evol-next-info">
                    <img src="${evolution[2].image}" alt="">
                    <span>${evolution[2].id < 10
                        ? `#00${evolution[2].id}`
                        : `${evolution[2].id}` < 100
                        ? `#0${evolution[2].id}`
                        : `#${evolution[2].id}`}</span>
                    <span>${evolution[2].name}</span>
                    <div>
                      ${evolution[2].types.length == 2 
                        ? `<span class="-${evolution[2].types[0]}" >${evolution[2].types[0]}</span> 
                          <span class="-${evolution[2].types[1]}">${evolution[2].types[1]}</span>
                        ` :
                        ` <span class="-${evolution[2].types[0]}" >${evolution[2].types[0]}</span> 
                        `
                      }
                    </div>
            </div>
            
        </div>
    </div>
  </div>`
  }
  else if(evolution.length==2){
    evolutionHTML =  `<div class="evol-box">
    <div class="evol-title">
        <h1>Evolution</h1>
    </div>
    <div class="evol-cycle">
        <div class="evol-first">
            <img src="${evolution[0].image}" alt="">
            <span>${evolution[0].id < 10
                ? `#00${evolution[0].id}`
                : `${evolution[0].id}` < 100
                ? `#0${evolution[0].id}`
                : `#${evolution[0].id}`}</span>
            <span>${evolution[0].name}</span>
            <div>
              ${evolution[0].types.length == 2 
                ? `<span class="-${evolution[0].types[0]}" >${evolution[0].types[0]}</span> 
                  <span class="-${evolution[0].types[1]}">${evolution[0].types[1]}</span>
                ` :
                ` <span class="-${evolution[0].types[0]}" >${evolution[0].types[0]}</span> 
                `
              }
            </div>
        </div>
        <div class="evol-next">
            <div class="arrow">
                <svg class="poke-arrow" viewBox="0 0 26 13">
                    <path d="M 20.854 0.146 a 0.5 0.5 0 0 0 -0.707 0.707 L 24.293 5 L 0.5 5 a 0.5 0.5 0 0 0 0 1 h 23.793 l -4.146 4.145 a 0.5 0.5 0 0 0 0.708 0.707 l 5 -5 a 0.5 0.5 0 0 0 0 -0.707 L 20.854 0.146z"></path>
                </svg>
            </div>
            <div class="evol-next-info">
                  <img src="${evolution[1].image}" alt="">
                  <span>${evolution[1].id < 10
                      ? `#00${evolution[1].id}`
                      : `${evolution[1].id}` < 100
                      ? `#0${evolution[1].id}`
                      : `#${evolution[1].id}`}</span>
                  <span>${evolution[1].name}</span>
                  <div>
                    ${evolution[1].types.length == 2 
                      ? `<span class="-${evolution[1].types[0]}" >${evolution[1].types[0]}</span> 
                        <span class="-${evolution[1].types[1]}">${evolution[1].types[1]}</span>
                      ` :
                      ` <span class="-${evolution[1].types[0]}" >${evolution[1].types[0]}</span> 
                      `
                    }
                  </div>
            </div>
            
        </div>
    </div>
  </div>`
  }
  else{
    evolutionHTML =`<div class="evol-box">
    <div class="evol-title">
        <h1>No evolution for this pokemon</h1>
    </div>
    <div class="evol-cycle">
        <div class="evol-first">
            <img src="${evolution[0].image}" alt="">
            <span>${evolution[0].id < 10
                ? `#00${evolution[0].id}`
                : `${evolution[0].id}` < 100
                ? `#0${evolution[0].id}`
                : `#${evolution[0].id}`}</span>
            <span>${evolution[0].name}</span>
            <div>
              ${evolution[0].types.length == 2 
                ? `<span class="-${evolution[0].types[0]}" >${evolution[0].types[0]}</span> 
                  <span class="-${evolution[0].types[1]}">${evolution[0].types[1]}</span>
                ` :
                ` <span class="-${evolution[0].types[0]}" >${evolution[0].types[0]}</span> 
                `
              }
            </div>
        </div>
    </div>
  </div>`
  }
  const htmlString = `
            <div class="modal">
                <div class="modal-pokemon-card">
                    <div class="poke-img">
                        <img src="${poke_modal.sprites.front_default}" alt="${
    poke_modal.name
  }">
                    </div>
                    <div class="poke-info">
                        <div class="poke-info-id">
                            ${
                              poke_modal.id < 10
                                ? `#00${poke_modal.id}`
                                : `${poke_modal.id}` < 100
                                ? `#0${poke_modal.id}`
                                : `#${poke_modal.id}`
                            }
                        </div>
                        <h2>${poke_modal.name}</h2>
                        <div class="poke-personality">
                            <div class="height">
                                <span class="personality-label">height</span>
                                <span class="height-number">${
                                  poke_modal.height / 10
                                }m</span>
                            </div>
                            <div class="weight">
                                <span class="personality-label">weight</span>
                                <span class="weight-number">${
                                  poke_modal.weight / 10
                                }kg</span>
                            </div>
                            <div class="types">
                                <span class="personality-label">types</span>
                                    ${
                                      poke_modal.types.length == 2
                                        ? `<span class="types-name -${poke_modal.types[0].type.name}">${poke_modal.types[0].type.name}</span> 
                                     <span class="types-name -${poke_modal.types[1].type.name}">${poke_modal.types[1].type.name}</span> 
                                    `
                                        : `
                                    <span class="types-name -${poke_modal.types[0].type.name}">${poke_modal.types[0].type.name}</span> 
                                    `
                                    }
                            </div>
                            <div class="abilities">
                                <span class="personality-label">abilities</span>
                                ${
                                  poke_modal.abilities.length == 2
                                    ? `<span class="ability-name">${poke_modal.abilities[0].ability.name}</span> 
                                     <span class="ability-name">${poke_modal.abilities[1].ability.name}</span> 
                                    `
                                    : `
                                    <span class="ability-name">${poke_modal.abilities[0].ability.name}</span> 
                                    `
                                }
                            </div>

                        </div>
                    </div>
                </div>
                <div class="modal-pokemon-stats">
                    <div class="stats-table">
                        <table>
                            <tr>
                                <th colspan="3">Stats</th>
                            </tr>
                            <tr>
                                <td>hp</td>
                                <td class="stats-num">${
                                  poke_modal.stats[0].base_stat
                                }</td>
                                <td><div class="stats-progress">
                                    <div class="stats"></div>
                                </div></td>
                            </tr>
                            <tr>
                                <td>defense</td>
                                <td class="stats-num">${
                                  poke_modal.stats[1].base_stat
                                }</td>
                                <td><div class="stats-progress">
                                    <div class="stats"></div>
                                </div></td>
                            </tr>
                            <tr>
                                <td>attack</td>
                                <td class="stats-num">${
                                  poke_modal.stats[2].base_stat
                                }</td>
                                <td><div class="stats-progress">
                                    <div class="stats"></div>
                                </div></td>
                            </tr>
                            <tr>
                                <td>spec. attack</td>
                                <td class="stats-num">${
                                  poke_modal.stats[3].base_stat
                                }</td>
                                <td><div class="stats-progress">
                                    <div class="stats"></div>
                                </div></td>
                            </tr>
                            <tr>
                                <td>spec. defense</td>
                                <td class="stats-num">${
                                  poke_modal.stats[4].base_stat
                                }</td>
                                <td><div class="stats-progress">
                                    <div class="stats"></div>
                                </div></td>
                            </tr>
                            <tr>
                                <td>speed</td>
                                <td class="stats-num">${
                                  poke_modal.stats[5].base_stat
                                }</td>
                                <td><div class="stats-progress">
                                    <div class="stats"></div>
                                </div></td>
                            </tr>
                        </table>       
                        </div>          
                    </div>
                  <div class="modal-pokemon-evolution">
                    ${evolutionHTML}
                  </div>
          </div>
    `;
  modalBox.innerHTML = htmlString;
  const stats = document.querySelectorAll(".stats-num");
  progressBar(stats);
  
}
modalBox.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-bg")) {
    modalBox.classList.remove("bg-active");
  }
});

const max_stats = {
  hp: "250",
  attack: "220",
  defense: "200",
  specialaatack: "200",
  specialdefense: "250",
  speed: "280",
  accuracy: "200",
  evasion: "150",
};

function progressBar(stats) {
  const progressbar = document.querySelectorAll(".stats");
  stats.forEach((stat, index) => {
    let stat_number = stat.textContent;
    let percentage = 0;
    if (index == 0) {
      percentage = (stat_number / max_stats.hp) * 100;
      progressBarColor(percentage, progressbar[index]);
    } else if (index == 1) {
      percentage = (stat_number / max_stats.attack) * 100;
      progressBarColor(percentage, progressbar[index]);
    } else if (index == 2) {
      percentage = (stat_number / max_stats.defense) * 100;
      progressBarColor(percentage, progressbar[index]);
    } else if (index == 3) {
      percentage = (stat_number / max_stats.specialaatack) * 100;
      progressBarColor(percentage, progressbar[index]);
    } else if (index == 4) {
      percentage = (stat_number / max_stats.specialdefense) * 100;
      progressBarColor(percentage, progressbar[index]);
    } else if (index == 5) {
      percentage = (stat_number / max_stats.speed) * 100;
      progressBarColor(percentage, progressbar[index]);
    }
  });
}

function progressBarColor(percentage, progressbar) {
  const poor = "#FC7348";
  const fair = "#EEBA36";
  const normal = "#86C349";
  const perfect = "#59AF02";
  progressbar.style.width = `${percentage}%`;
  if (percentage <= 20) {
    progressbar.style.background = poor;
  } else if (percentage <= 40) {
    progressbar.style.background = fair;
  } else if (percentage <= 60) {
    progressbar.style.background = normal;
  } else {
    progressbar.style.background = perfect;
  }
}

const button = document.querySelectorAll(".btn");
button.forEach((btn) => {
  btn.addEventListener("click", function () {
    const current = document.getElementsByClassName("-active");
    current[0].className = current[0].className.replace("-active", "");
    this.classList.add("-active");
    const filterName = btn.textContent.toLowerCase();
    if (filterName == "all") {
      displayPokemon(globalPokemon);
    } else {
      pokeFilter(filterName);
    }
  });
});

function pokeFilter(filterName) {
  const newPoke = globalPokemon.filter(
    (poke) => poke.type[0] == filterName || poke.type[1] == filterName
  );
  displayPokemon(newPoke);
}

