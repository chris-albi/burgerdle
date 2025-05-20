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
      // Filter items by game number
      const filteredItems = data.filter(item => item.game === gameNumber);
      console.log(gameNumber);
      // Loop through each matched item and log the values
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

  // Create comparison feedback
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
   <div class="comparison-header">
    <p>Name</p>
    <p>Restaurant</p>
    <p>Type</p>
    <p>Cal.</p>
    <p>Vegan</p>
    <p>Gluten-Free</p>
    <p>Year</p>
    <p>Ingredients</p>
 </div>
  <div class="comparison-card">
    <div class="bubble ${compareClass(userItem.name, productName)}">${userItem.name}</div>
    <div class="bubble ${compareClass(userItem.restaurant, productRestaurant)}">${userItem.restaurant}</div>
    <div class="bubble ${compareClass(userItem.type, productType)}">${userItem.type}</div>
    <div class="bubble ${compareIntClass(userItem.calories, productCalories)}">${userItem.calories}</div>
    <div class="bubble ${compareClass(userItem.vegan, productVegan)}">${userItem.vegan ? "Yes" : "No"}</div>
    <div class="bubble ${compareClass(userItem.glutenFree, productGF)}">${userItem.glutenFree ? "Yes" : "No"}</div>
    <div class="bubble ${compareClass(userItem.yearOfRelease, productRelease)}">${userItem.yearOfRelease}</div>
    <div class="bubble ${compareIngredientsClass(userItem.ingredients, productIngredients)}">
      ${userItem.ingredients.join(", ")}<br>
      <small>${matchingIngredients.join(", ") || "None"}</small>
    </div>
</div>
`;
}

function displayComparisonTwo(userItem, mysteryItem) {
  const container = document.getElementById("comparison-2");

  // Create comparison feedback
  function compare(val1, val2) {
    return val1 === val2 ? "✅" : "❌";
  }

  function compareInt(val1, val2) {
    if (val1 < val2) {
      return "↑";
    }
    else if (val1 > val2) {
      return "↓";
    }
    else {
      return "✅";
    }
  }

  
  const matchingIngredients = getIngredientMatch(userItem.ingredients, productIngredients);
  
  
  container.innerHTML = `
  <div class="comparison-card">
    <div class="bubble">${userItem.name}</div>
    <div class="bubble">${userItem.restaurant} ${compare(userItem.restaurant, productRestaurant)}</div>
    <div class="bubble">${userItem.type} ${compare(userItem.type, productType)}</div>
    <div class="bubble">${userItem.calories} ${compareInt(userItem.calories, productCalories)}</div>
    <div class="bubble">${userItem.vegan ? "Yes" : "No"} ${compare(userItem.vegan, productVegan)}</div>
    <div class="bubble">${userItem.glutenFree ? "Yes" : "No"} ${compare(userItem.glutenFree, productGF)}</div>
    <div class="bubble">${userItem.yearOfRelease} ${compare(userItem.yearOfRelease, productRelease)}</div>
    <div class="bubble"> ${userItem.ingredients.join(", ")}<br>
      <small> ${matchingIngredients.join(", ") || "None"}</small>
    </div>
  </div>
`;
}

function displayComparisonThree(userItem, mysteryItem) {
  const container = document.getElementById("comparison-3");

  // Create comparison feedback
  function compare(val1, val2) {
    return val1 === val2 ? "✅" : "❌";
  }

  function compareInt(val1, val2) {
    if (val1 < val2) {
      return "↑";
    }
    else if (val1 > val2) {
      return "↓";
    }
    else {
      return "✅";
    }
  }

  
  const matchingIngredients = getIngredientMatch(userItem.ingredients, productIngredients);
  
  
  container.innerHTML = `
  <div class="comparison-card">
    <div class="bubble">${userItem.name}</div>
    <div class="bubble">${userItem.restaurant} ${compare(userItem.restaurant, productRestaurant)}</div>
    <div class="bubble">${userItem.type} ${compare(userItem.type, productType)}</div>
    <div class="bubble">${userItem.calories} ${compareInt(userItem.calories, productCalories)}</div>
    <div class="bubble">${userItem.vegan ? "Yes" : "No"} ${compare(userItem.vegan, productVegan)}</div>
    <div class="bubble">${userItem.glutenFree ? "Yes" : "No"} ${compare(userItem.glutenFree, productGF)}</div>
    <div class="bubble">${userItem.yearOfRelease} ${compare(userItem.yearOfRelease, productRelease)}</div>
    <div class="bubble"> ${userItem.ingredients.join(", ")}<br>
      <small> ${matchingIngredients.join(", ") || "None"}</small>
    </div>
  </div>
`;
}

function displayComparisonFour(userItem, mysteryItem) {
  const container = document.getElementById("comparison-4");

  // Create comparison feedback
  function compare(val1, val2) {
    return val1 === val2 ? "✅" : "❌";
  }

  function compareInt(val1, val2) {
    if (val1 < val2) {
      return "↑";
    }
    else if (val1 > val2) {
      return "↓";
    }
    else {
      return "✅";
    }
  }

  
  const matchingIngredients = getIngredientMatch(userItem.ingredients, productIngredients);
  
  
  container.innerHTML = `
  <div class="comparison-card">
    <div class="bubble">${userItem.name}</div>
    <div class="bubble">${userItem.restaurant} ${compare(userItem.restaurant, productRestaurant)}</div>
    <div class="bubble">${userItem.type} ${compare(userItem.type, productType)}</div>
    <div class="bubble">${userItem.calories} ${compareInt(userItem.calories, productCalories)}</div>
    <div class="bubble">${userItem.vegan ? "Yes" : "No"} ${compare(userItem.vegan, productVegan)}</div>
    <div class="bubble">${userItem.glutenFree ? "Yes" : "No"} ${compare(userItem.glutenFree, productGF)}</div>
    <div class="bubble">${userItem.yearOfRelease} ${compare(userItem.yearOfRelease, productRelease)}</div>
    <div class="bubble"> ${userItem.ingredients.join(", ")}<br>
      <small> ${matchingIngredients.join(", ") || "None"}</small>
    </div>
  </div>
`;
}

function displayComparisonFive(userItem, mysteryItem) {
  const container = document.getElementById("comparison-5");

  // Create comparison feedback
  function compare(val1, val2) {
    return val1 === val2 ? "✅" : "❌";
  }

  function compareInt(val1, val2) {
    if (val1 < val2) {
      return "↑";
    }
    else if (val1 > val2) {
      return "↓";
    }
    else {
      return "✅";
    }
  }

  
  const matchingIngredients = getIngredientMatch(userItem.ingredients, productIngredients);
  
  
  container.innerHTML = `
  <div class="comparison-card">
    <div class="bubble">${userItem.name} ${compare(userItem.name, productName)}</div>
    <div class="bubble">${userItem.restaurant} ${compare(userItem.restaurant, productRestaurant)}</div>
    <div class="bubble">${userItem.type} ${compare(userItem.type, productType)}</div>
    <div class="bubble">${userItem.calories} ${compareInt(userItem.calories, productCalories)}</div>
    <div class="bubble">${userItem.vegan ? "Yes" : "No"} ${compare(userItem.vegan, productVegan)}</div>
    <div class="bubble">${userItem.glutenFree ? "Yes" : "No"} ${compare(userItem.glutenFree, productGF)}</div>
    <div class="bubble">${userItem.yearOfRelease} ${compare(userItem.yearOfRelease, productRelease)}</div>
    <div class="bubble"> ${userItem.ingredients.join(", ")}<br>
      <small> ${matchingIngredients.join(", ") || "None"}</small>
    </div>
  </div>
`;
}

function displayComparisonSix(userItem, mysteryItem) {
  const container = document.getElementById("comparison-6");

  // Create comparison feedback
  function compare(val1, val2) {
    return val1 === val2 ? "✅" : "❌";
  }

  function compareInt(val1, val2) {
    if (val1 < val2) {
      return "↑";
    }
    else if (val1 > val2) {
      return "↓";
    }
    else {
      return "✅";
    }
  }

  
  const matchingIngredients = getIngredientMatch(userItem.ingredients, productIngredients);
  
  
  container.innerHTML = `
  <div class="comparison-card">
    <div class="bubble">${userItem.name}</div>
    <div class="bubble">${userItem.restaurant} ${compare(userItem.restaurant, productRestaurant)}</div>
    <div class="bubble">${userItem.type} ${compare(userItem.type, productType)}</div>
    <div class="bubble">${userItem.calories} ${compareInt(userItem.calories, productCalories)}</div>
    <div class="bubble">${userItem.vegan ? "Yes" : "No"} ${compare(userItem.vegan, productVegan)}</div>
    <div class="bubble">${userItem.glutenFree ? "Yes" : "No"} ${compare(userItem.glutenFree, productGF)}</div>
    <div class="bubble">${userItem.yearOfRelease} ${compare(userItem.yearOfRelease, productRelease)}</div>
    <div class="bubble"> ${userItem.ingredients.join(", ")}<br>
      <small> ${matchingIngredients.join(", ") || "None"}</small>
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
            openPopup();
          }
        }
        else if (guessNumber == 2) {
          displayComparisonThree(userItem, productName)
          guessNumber += 1;
          if (userItem.name == productName) {
            console.log("You win!") 
            openPopup();
          }
        }
        else if (guessNumber == 3) {
          displayComparisonFour(userItem, productName)
          guessNumber += 1;
          if (userItem.name == productName) {
            console.log("You win!") 
            openPopup();
          }
        }
        else if (guessNumber == 4) {
          displayComparisonFive(userItem, productName)
          guessNumber += 1;
          if (userItem.name == productName) {
            console.log("You win!") 
            openPopup();
          }
        }
        else if (guessNumber == 5) {
          displayComparisonSix(userItem, productName)
          guessNumber += 1;
          if (userItem.name == productName) {
            console.log("You win!") 
            openPopup();
          }
        }
        else if (guessNumber == 6) {
          console.log("You lose!")
          // add loss logic here (well actually 3 lines above here)
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

    






function openPopup() {
  popup.classList.add("open-popup");
}

function closePopup () {
  popup.classList.remove("open-popup");
}


// Search bar functionality

function filterItems() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const dropdown = document.getElementById('dropdown');
  dropdown.innerHTML = ''; // clear dropdown

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