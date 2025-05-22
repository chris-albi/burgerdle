let items = [];
var maxheight = 400;

// Item info variables

let productName;
let productRestaurant;
let productCalories;
let productType;
let productVegan;
let productGF;
let productRelease; 
let productIngredients;
let guessNumber = 0;
window.onload = async function () {
  const response = await fetch('items.json');
  items = await response.json();
};

const startDate = new Date("01/17/2025");
const gameNumber = getGameNumber();

//User stats object
const userStats = JSON.parse(localStorage.getItem("stats")) || {
  numGames: 0,
  numWins: 0,
  winsInNum: [0, 0, 0, 0, 0, 0, 0, 0],
  currentStreak: 0,
  maxStreak: 0,
};

//User game state
const gameState = JSON.parse(localStorage.getItem("state")) || {
  gameNumber: -1,
  guesses: [],
  hasWon: false,
};


  // New game functionality
  function getGameNumber() {
    const currDate = new Date();
    let timeDifference = currDate.getTime() - startDate.getTime();
    let dayDifference = timeDifference / (1000 * 3600 * 24);
  
    return Math.ceil(dayDifference);
  }

  
playGame();

function playGame() {
  fetchGameData(getGameNumber());
}

function fetchGameData(gameNumber) {
  fetch("./items.json")
    .then((response) => response.json())
    .then((data) => {
      const filteredItems = data.filter(item => item.game === gameNumber);
      console.log(gameNumber);
      filteredItems.forEach(item => {
        productName = item.name;
        productRestaurant = item.restaurant;
        productCalories = item.calories;
        productType = item.type;
        productVegan = item.vegan;
        productGF = item.glutenFree;
        productRelease = item.yearOfRelease;
        productIngredients = item.ingredients;
        console.log(item.restaurant);
        console.log(productRestaurant);
        initializeGame();
      });
    })
    .catch((error) => {
      console.error("Error fetching or parsing data:", error);
    });
  }

  
function initializeGame() {
  // Reset game state and track new game if user last played on a different day
  if (gameState.gameNumber !== gameNumber) {
    if (gameState.hasWon === false) {
      userStats.currentStreak = 0;
    }
    gameState.gameNumber = gameNumber;
    gameState.guesses = [];
    gameState.hasWon = false;
    userStats.numGames++;

    localStorage.setItem("stats", JSON.stringify(userStats));
    localStorage.setItem("state", JSON.stringify(gameState));
  }
}

document.getElementById("submitButton").addEventListener("click", checkUserSelection);

function getIngredientMatch(userIngredients, mysteryIngredients) {
  if (!Array.isArray(userIngredients) || !Array.isArray(mysteryIngredients)) {
    return [];
  }
  return userIngredients.filter(i => mysteryIngredients.includes(i));
}

//guess containers begin

function displayComparisonOne(userItem, mysteryItem) {
  const container = document.getElementById("comparison-1");

function compareClass(val1, val2) {
  return val1 == val2 ? "match" : "no-match";
}

function compareIntClass(val1, val2) {
  if (val1 < val2) {
    return "calorie-lower"; 
  } else if (val1 > val2) {
    return "calorie-higher"; 
  } else {
    return "calorie-same";
  }
}

function compareIngredientsClass(userIngredients, productIngredients) {
  const userSet = new Set(userIngredients.map(i => i.toLowerCase()));
  const productSet = new Set(productIngredients.map(i => i.toLowerCase()));

  const matching = [...userSet].filter(ingredient => productSet.has(ingredient));

  if (matching.length === 0) {
    return "ingredients-none";
  } else if (matching.length === userSet.size) {
    return "ingredients-all";
  } else {
    return "ingredients-some";
  }
}
  
  const matchingIngredients = getIngredientMatch(userItem.ingredients, productIngredients);
  
  
  container.innerHTML = `
   <div class="comparison-header" id="topheader">
    <p>Name</p>
    <p>Restaurant</p>
    <p>Type</p>
    <p>Cal.</p>
    <p>Vegan</p>
    <p>Year</p>
    <p>Ingredients</p>
 </div>
  <div class="comparison-card" id="comparisonbubble">
    <div class="bubble ${compareClass(userItem.name, productName)}">${userItem.name}</div>
    <div class="bubble ${compareClass(userItem.restaurant, productRestaurant)}">${userItem.restaurant}</div>
    <div class="bubble ${compareClass(userItem.type, productType)}">${userItem.type}</div>
    <div class="bubble ${compareIntClass(userItem.calories, productCalories)}">${userItem.calories}</div>
    <div class="bubble ${compareClass(userItem.vegan, productVegan)}">${userItem.vegan ? "Yes" : "No"}</div>
    <div class="bubble ${compareClass(userItem.yearOfRelease, productRelease)}">${userItem.yearOfRelease}</div>
    <div class="bubble ${compareIngredientsClass(userItem.ingredients, productIngredients)}">
      ${userItem.ingredients.map(ingredient =>
        productIngredients.includes(ingredient)
          ? `<span class="match">${ingredient}</span>`
          : `<span class="no-match">${ingredient}</span>`
      ).join(", ")}
    </div>
</div>
`;
}

function displayComparisonTwo(userItem, mysteryItem) {
  const container = document.getElementById("comparison-2");

function compareClass(val1, val2) {
  return val1 == val2 ? "match" : "no-match";
}

function compareIntClass(val1, val2) {
  if (val1 < val2) {
    return "calorie-lower"; 
  } else if (val1 > val2) {
    return "calorie-higher"; 
  } else {
    return "calorie-same";
  }
}

function compareIngredientsClass(userIngredients, productIngredients) {
  const userSet = new Set(userIngredients.map(i => i.toLowerCase()));
  const productSet = new Set(productIngredients.map(i => i.toLowerCase()));

  const matching = [...userSet].filter(ingredient => productSet.has(ingredient));

  if (matching.length === 0) {
    return "ingredients-none";
  } else if (matching.length === userSet.size) {
    return "ingredients-all";
  } else {
    return "ingredients-some";
  }
}
  
  const matchingIngredients = getIngredientMatch(userItem.ingredients, productIngredients);
  
  
  container.innerHTML = `
  <div class="comparison-card" id="comparisonbubbletwo">
    <div class="bubble ${compareClass(userItem.name, productName)}">${userItem.name}</div>
    <div class="bubble ${compareClass(userItem.restaurant, productRestaurant)}">${userItem.restaurant}</div>
    <div class="bubble ${compareClass(userItem.type, productType)}">${userItem.type}</div>
    <div class="bubble ${compareIntClass(userItem.calories, productCalories)}">${userItem.calories}</div>
    <div class="bubble ${compareClass(userItem.vegan, productVegan)}">${userItem.vegan ? "Yes" : "No"}</div>
    <div class="bubble ${compareClass(userItem.yearOfRelease, productRelease)}">${userItem.yearOfRelease}</div>
    <div class="bubble ${compareIngredientsClass(userItem.ingredients, productIngredients)}">
      ${userItem.ingredients.map(ingredient =>
        productIngredients.includes(ingredient)
          ? `<span class="match">${ingredient}</span>`
          : `<span class="no-match">${ingredient}</span>`
      ).join(", ")}
    </div>
</div>
`;
}

function displayComparisonThree(userItem, mysteryItem) {
  const container = document.getElementById("comparison-3");

function compareClass(val1, val2) {
  return val1 == val2 ? "match" : "no-match";
}

function compareIntClass(val1, val2) {
  if (val1 < val2) {
    return "calorie-lower"; 
  } else if (val1 > val2) {
    return "calorie-higher"; 
  } else {
    return "calorie-same";
  }
}

function compareIngredientsClass(userIngredients, productIngredients) {
  const userSet = new Set(userIngredients.map(i => i.toLowerCase()));
  const productSet = new Set(productIngredients.map(i => i.toLowerCase()));

  const matching = [...userSet].filter(ingredient => productSet.has(ingredient));

  if (matching.length === 0) {
    return "ingredients-none";
  } else if (matching.length === userSet.size) {
    return "ingredients-all";
  } else {
    return "ingredients-some";
  }
}
  
  const matchingIngredients = getIngredientMatch(userItem.ingredients, productIngredients);
  
  
  container.innerHTML = `
  <div class="comparison-card" id="comparisonbubblethree">
    <div class="bubble ${compareClass(userItem.name, productName)}">${userItem.name}</div>
    <div class="bubble ${compareClass(userItem.restaurant, productRestaurant)}">${userItem.restaurant}</div>
    <div class="bubble ${compareClass(userItem.type, productType)}">${userItem.type}</div>
    <div class="bubble ${compareIntClass(userItem.calories, productCalories)}">${userItem.calories}</div>
    <div class="bubble ${compareClass(userItem.vegan, productVegan)}">${userItem.vegan ? "Yes" : "No"}</div>
    <div class="bubble ${compareClass(userItem.yearOfRelease, productRelease)}">${userItem.yearOfRelease}</div>
    <div class="bubble ${compareIngredientsClass(userItem.ingredients, productIngredients)}">
      ${userItem.ingredients.map(ingredient =>
        productIngredients.includes(ingredient)
          ? `<span class="match">${ingredient}</span>`
          : `<span class="no-match">${ingredient}</span>`
      ).join(", ")}
    </div>
</div>
`;
}

function displayComparisonFour(userItem, mysteryItem) {
  const container = document.getElementById("comparison-4");

function compareClass(val1, val2) {
  return val1 == val2 ? "match" : "no-match";
}

function compareIntClass(val1, val2) {
  if (val1 < val2) {
    return "calorie-lower"; 
  } else if (val1 > val2) {
    return "calorie-higher"; 
  } else {
    return "calorie-same";
  }
}

function compareIngredientsClass(userIngredients, productIngredients) {
  const userSet = new Set(userIngredients.map(i => i.toLowerCase()));
  const productSet = new Set(productIngredients.map(i => i.toLowerCase()));

  const matching = [...userSet].filter(ingredient => productSet.has(ingredient));

  if (matching.length === 0) {
    return "ingredients-none";
  } else if (matching.length === userSet.size) {
    return "ingredients-all";
  } else {
    return "ingredients-some";
  }
}
  
  const matchingIngredients = getIngredientMatch(userItem.ingredients, productIngredients);
  
  
  container.innerHTML = `
  <div class="comparison-card" id="comparisonbubblefour">
    <div class="bubble ${compareClass(userItem.name, productName)}">${userItem.name}</div>
    <div class="bubble ${compareClass(userItem.restaurant, productRestaurant)}">${userItem.restaurant}</div>
    <div class="bubble ${compareClass(userItem.type, productType)}">${userItem.type}</div>
    <div class="bubble ${compareIntClass(userItem.calories, productCalories)}">${userItem.calories}</div>
    <div class="bubble ${compareClass(userItem.vegan, productVegan)}">${userItem.vegan ? "Yes" : "No"}</div>
    <div class="bubble ${compareClass(userItem.yearOfRelease, productRelease)}">${userItem.yearOfRelease}</div>
    <div class="bubble ${compareIngredientsClass(userItem.ingredients, productIngredients)}">
      ${userItem.ingredients.map(ingredient =>
        productIngredients.includes(ingredient)
          ? `<span class="match">${ingredient}</span>`
          : `<span class="no-match">${ingredient}</span>`
      ).join(", ")}
    </div>
</div>
`;
}

function displayComparisonFive(userItem, mysteryItem) {
  const container = document.getElementById("comparison-5");

function compareClass(val1, val2) {
  return val1 == val2 ? "match" : "no-match";
}

function compareIntClass(val1, val2) {
  if (val1 < val2) {
    return "calorie-lower"; 
  } else if (val1 > val2) {
    return "calorie-higher"; 
  } else {
    return "calorie-same";
  }
}

function compareIngredientsClass(userIngredients, productIngredients) {
  const userSet = new Set(userIngredients.map(i => i.toLowerCase()));
  const productSet = new Set(productIngredients.map(i => i.toLowerCase()));

  const matching = [...userSet].filter(ingredient => productSet.has(ingredient));

  if (matching.length === 0) {
    return "ingredients-none";
  } else if (matching.length === userSet.size) {
    return "ingredients-all";
  } else {
    return "ingredients-some";
  }
}
  
  const matchingIngredients = getIngredientMatch(userItem.ingredients, productIngredients);
  
  
  container.innerHTML = `
  <div class="comparison-card" id="comparisonbubblefive">
    <div class="bubble ${compareClass(userItem.name, productName)}">${userItem.name}</div>
    <div class="bubble ${compareClass(userItem.restaurant, productRestaurant)}">${userItem.restaurant}</div>
    <div class="bubble ${compareClass(userItem.type, productType)}">${userItem.type}</div>
    <div class="bubble ${compareIntClass(userItem.calories, productCalories)}">${userItem.calories}</div>
    <div class="bubble ${compareClass(userItem.vegan, productVegan)}">${userItem.vegan ? "Yes" : "No"}</div>
    <div class="bubble ${compareClass(userItem.yearOfRelease, productRelease)}">${userItem.yearOfRelease}</div>
    <div class="bubble ${compareIngredientsClass(userItem.ingredients, productIngredients)}">
      ${userItem.ingredients.map(ingredient =>
        productIngredients.includes(ingredient)
          ? `<span class="match">${ingredient}</span>`
          : `<span class="no-match">${ingredient}</span>`
      ).join(", ")}
    </div>
</div>
`;
}

function displayComparisonSix(userItem, mysteryItem) {
  const container = document.getElementById("comparison-6");

function compareClass(val1, val2) {
  return val1 == val2 ? "match" : "no-match";
}

function compareIntClass(val1, val2) {
  if (val1 < val2) {
    return "calorie-lower"; 
  } else if (val1 > val2) {
    return "calorie-higher"; 
  } else {
    return "calorie-same";
  }
}

function compareIngredientsClass(userIngredients, productIngredients) {
  const userSet = new Set(userIngredients.map(i => i.toLowerCase()));
  const productSet = new Set(productIngredients.map(i => i.toLowerCase()));

  const matching = [...userSet].filter(ingredient => productSet.has(ingredient));

  if (matching.length === 0) {
    return "ingredients-none";
  } else if (matching.length === userSet.size) {
    return "ingredients-all";
  } else {
    return "ingredients-some";
  }
}
  
  const matchingIngredients = getIngredientMatch(userItem.ingredients, productIngredients);
  
  
  container.innerHTML = `
  <div class="comparison-card" id="comparisonbubblesix">
    <div class="bubble ${compareClass(userItem.name, productName)}">${userItem.name}</div>
    <div class="bubble ${compareClass(userItem.restaurant, productRestaurant)}">${userItem.restaurant}</div>
    <div class="bubble ${compareClass(userItem.type, productType)}">${userItem.type}</div>
    <div class="bubble ${compareIntClass(userItem.calories, productCalories)}">${userItem.calories}</div>
    <div class="bubble ${compareClass(userItem.vegan, productVegan)}">${userItem.vegan ? "Yes" : "No"}</div>
    <div class="bubble ${compareClass(userItem.yearOfRelease, productRelease)}">${userItem.yearOfRelease}</div>
    <div class="bubble ${compareIngredientsClass(userItem.ingredients, productIngredients)}">
      ${userItem.ingredients.map(ingredient =>
        productIngredients.includes(ingredient)
          ? `<span class="match">${ingredient}</span>`
          : `<span class="no-match">${ingredient}</span>`
      ).join(", ")}
    </div>
</div>
`;
}
// guess containers end please forgive me...


function checkUserSelection() {
  const selectedName = document.getElementById("searchInput").value;
  
  fetch("./items.json")
    .then((response) => response.json())
    .then((data) => {
      const userItem = data.find(item => item.name === selectedName);
      
      if (userItem && productName) {
        if ( guessNumber == 0 ) {
          displayComparisonOne(userItem, productName)
          if (userItem.name == productName) {
            console.log(document.getElementById("submitButton"));
            document.getElementById("submitButton").disabled = true;
            console.log("You win!") 
            openPopup();
          }
          guessNumber += 1;
        }
        else if (guessNumber == 1) {
          displayComparisonTwo(userItem, productName)
          guessNumber += 1;
          if (userItem.name == productName) {
            console.log("You win!") 
            document.getElementById("submitButton").disabled = true;
            openPopup();
          }
        }
        else if (guessNumber == 2) {
          displayComparisonThree(userItem, productName)
          guessNumber += 1;
          if (userItem.name == productName) {
            console.log("You win!") 
            document.getElementById("submitButton").disabled = true;
            openPopup();
          }
        }
        else if (guessNumber == 3) {
          displayComparisonFour(userItem, productName)
          guessNumber += 1;
          if (userItem.name == productName) {
            console.log("You win!") 
            document.getElementById("submitButton").disabled = true;
            openPopup();
          }
        }
        else if (guessNumber == 4) {
          displayComparisonFive(userItem, productName)
          guessNumber += 1;
          if (userItem.name == productName) {
            console.log("You win!") 
            document.getElementById("submitButton").disabled = true;
            openPopup();
          }
        }
        else if (guessNumber == 5) {
          displayComparisonSix(userItem, productName)
          if (userItem.name == productName) {
            console.log("You win!") 
            document.getElementById("submitButton").disabled = true;
            openPopup();
          }
          else {
            guessNumber += 1;
            console.log("You lose!")
            const victoryHeading = document.querySelector(".victory-screen h2");
            victoryHeading.textContent = "you are loser :(";
            openPopup();
          }   
        }
        else {
          console.log("You broke the game!")
        }
        console.log(guessNumber);
      }
      else {
        console.log("Item not found or mystery item not initialized.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
    }

    




function darken() {
  document.body.style.backgroundColor = "#3B3B3B";
  document.getElementById("headercontainer").style.borderColor = "black";
  document.getElementById("gameplay-section").style.backgroundColor = "#3B3B3B"
  document.getElementById("site-footer").style.backgroundColor = "#3B3B3B"
  document.getElementById("topnav").style.backgroundColor = "#3B3B3B"
  document.getElementById("site-footer").style.borderColor = "black";
  document.getElementById("topheader").style.backgroundColor = "#3B3B3B"
  document.getElementById("topheader").style.borderColor = "#3B3B3B";
  document.getElementById("topheader").style.color = "#3B3B3B";
  document.getElementById("comparisonbubble").style.display = "none";
  document.getElementById("comparisonbubbletwo").style.display = "none";
  document.getElementById("comparisonbubblethree").style.display = "none";
  document.getElementById("comparisonbubblefour").style.display = "none";
  document.getElementById("comparisonbubblefive").style.display = "none";
  document.getElementById("comparisonbubblesix").style.display = "none";
  }

function brighten (){
  document.body.style.backgroundColor = "#DCDCDC";
  document.getElementById("headercontainer").style.borderColor = "gray";
  document.getElementById("gameplay-section").style.backgroundColor = "#DCDCDC";
  document.getElementById("site-footer").style.backgroundColor = "#DCDCDC";
  document.getElementById("topnav").style.backgroundColor = "#DCDCDC";
  document.getElementById("site-footer").style.borderColor = "gray";
  document.getElementById("topheader").style.backgroundColor = "white";
  document.getElementById("topheader").style.borderColor = "gray";
  document.getElementById("comparisonbubble").style.display = "";
  document.getElementById("comparisonbubbletwo").style.display = "";
  document.getElementById("comparisonbubblethree").style.display = "";
  document.getElementById("comparisonbubblefour").style.display = "";
  document.getElementById("comparisonbubblefive").style.display = "";
  document.getElementById("comparisonbubblesix").style.display = "";
}

function openPopup() {
  popup.classList.add("visible");
  setTimeout(() => {
  darken();
  }, 0);
}

function closePopup () {
  popup.classList.remove("visible");
  brighten();
}

function openInfo() {
  info.classList.add("visible");
  setTimeout(() => {
  darken();
  }, 0);
}

function closeInfo () {
  info.classList.remove("visible");
  brighten();
}

function openStats() {
  stats.classList.add("visible");
  setTimeout(() => {
  darken();
  }, 0);
}

function closeStats() {
  stats.classList.remove("visible");
  brighten();
}

// Search bar functionality

function filterItems() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const dropdown = document.getElementById('dropdown');
  dropdown.innerHTML = '';  

  if (!input) return;

  const filtered = items.filter(item => item.name.toLowerCase().includes(input));
  
  filtered.slice(0, 100).forEach(item => {
    const option = document.createElement('div');
    option.className = 'dropdown-item';

    const icon = document.createElement('img');
    icon.src = item.icon;
    icon.className = 'dropdown-icon';
    const label = document.createElement('span');
    option.textContent = item.name;
    option.onclick = () => {
      document.getElementById('searchInput').value = item.name;
      dropdown.innerHTML = '';
    };
    option.appendChild(icon);
    option.appendChild(label);
    dropdown.appendChild(option);
  });
}
