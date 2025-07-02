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
let lastGuess;
let isPracticeGame = false;
let finalGuess;

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
  hasWon: false,
};


  // New game functionality
  function getGameNumber() {
    const currDate = new Date();
    let timeDifference = currDate.getTime() - startDate.getTime();
    let dayDifference = timeDifference / (1000 * 3600 * 24);
  
    return Math.ceil(dayDifference);
  }

openingScreen();



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


function dailyGame () {
  closeOpening();
  setTimeout(() => {
    playGame();
  }, 500);
}

function practiceGame (){
  isPracticeGame = true;
  playGame();
  closeOpening();
  closePopup();
}

function initHeader(){ 
  
}
function playGame() {
  if (isPracticeGame == true) {
    fetchGameData(Math.floor(Math.random() * 183) + 1);
  }
  else {
    fetchGameData(getGameNumber());
    console.log("hi");
  }
}

  
function initializeGame() {
  if (gameState.gameNumber !== gameNumber) {
    if (gameState.hasWon === false) {
      userStats.currentStreak = 0;
    }
    gameState.gameNumber = gameNumber;
    gameState.hasWon = false;
    userStats.numGames++;
    console.log("omg hi");
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
console.log(JSON.stringify(userItem.yearOfRelease));
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

function compareDecadeClass(val1, val2) {
  if (val1 < val2) {
    return "decade-lower"; 
  } else if (val1 > val2) {
    return "decade-higher"; 
  } else {
    return "decade-same";
  }
}

function compareIngredientsClass(userIngredients, productIngredients) {
  const userSet = new Set(userIngredients.map(i => i.toLowerCase()));
  const productSet = new Set(productIngredients.map(i => i.toLowerCase()));

  const matching = [...userSet].filter(ingredient => productSet.has(ingredient));
    console.log("Here");
    console.log(userSet.size);
    console.log(productSet.size);
  if (matching.length === 0) {
    return "ingredients-none";
  } else if (matching.length === userSet.size) {
      if (userSet.size == productSet.size) {
        return "ingredients-all";
      }
      else {
        return "ingredients-some";
      }
  } else {
    return "ingredients-some";
  }
}
  
  const matchingIngredients = getIngredientMatch(userItem.ingredients, productIngredients);
  
  
  container.innerHTML = `
  <div class="comparison-header" id="topheader">
    <p>Name</p>
    <p>Ingredients</p>
    <p>Restaurant</p>
    <p>Type</p>
    <p>Cal.</p>
    <p>Vegan</p>
    <p>Debut</p>
 </div>

<div class="comparison-card" id="comparisonbubbleone">
    <div class="bubble ${compareClass(userItem.name, productName)}" style="left: 225px; transform: translateX(-50%);">
      ${userItem.name}
    </div>
    <div class="bubble ${compareIngredientsClass(userItem.ingredients, productIngredients)}" style="left: 625px; transform: translateX(-50%);">
      ${userItem.ingredients.map(ingredient =>
        productIngredients.includes(ingredient)
          ? `<span class="match">${ingredient}</span>`
          : `<span class="no-match">${ingredient}</span>`
      ).join(", ")}
    </div>
    <div class="bubble ${compareClass(userItem.restaurant, productRestaurant)}" style="left: 955px; transform: translateX(-50%);">
      ${userItem.restaurant}
    </div>
    <div class="bubble ${compareClass(userItem.type, productType)}" style="left: 1200px; transform: translateX(-50%);">
      ${userItem.type}
    </div>
    <div class="bubble ${compareIntClass(userItem.calories, productCalories)}" style="left: 1400px; transform: translateX(-50%);">
      ${userItem.calories}
    </div>
    <div class="bubble ${compareClass(userItem.vegan, productVegan)}" style="left: 1600px; transform: translateX(-50%);">
      ${userItem.vegan ? "Vegan" : "Non-Vegan"}
    </div>
<div class="bubble ${compareDecadeClass(userItem.yearOfRelease, productRelease)}" style="left: 1800px; transform: translateX(-50%);">
  ${userItem.yearOfRelease}s
</div>
  </div>
`;
console.log(userItem.ingredients.join('').length);

  const offset = document.getElementById("comparisonbubbleone");
  if (userItem.ingredients.join('').length < 28 ) {
      offset.style.margin = "0px 0px 60px 0px";

  }
  else if (userItem.ingredients.join('').length < 52 ) {
      offset.style.margin = "0px 0px 80px 0px";
  }
  else {
       offset.style.margin = "0px 0px 100px 0px";
  }
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

function compareDecadeClass(val1, val2) {
  if (val1 < val2) {
    return "decade-lower"; 
  } else if (val1 > val2) {
    return "decade-higher"; 
  } else {
    return "decade-same";
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
    <div class="bubble ${compareClass(userItem.name, productName)}" style="left: 225px; transform: translateX(-50%);">
      ${userItem.name}
    </div>
    <div class="bubble ${compareIngredientsClass(userItem.ingredients, productIngredients)}" style="left: 625px; transform: translateX(-50%);">
      ${userItem.ingredients.map(ingredient =>
        productIngredients.includes(ingredient)
          ? `<span class="match">${ingredient}</span>`
          : `<span class="no-match">${ingredient}</span>`
      ).join(", ")}
    </div>
    <div class="bubble ${compareClass(userItem.restaurant, productRestaurant)}" style="left: 955px; transform: translateX(-50%);">
      ${userItem.restaurant}
    </div>
    <div class="bubble ${compareClass(userItem.type, productType)}" style="left: 1200px; transform: translateX(-50%);">
      ${userItem.type}
    </div>
    <div class="bubble ${compareIntClass(userItem.calories, productCalories)}" style="left: 1400px; transform: translateX(-50%);">
      ${userItem.calories}
    </div>
    <div class="bubble ${compareClass(userItem.vegan, productVegan)}" style="left: 1600px; transform: translateX(-50%);">
      ${userItem.vegan ? "Vegan" : "Non-Vegan"}
    </div>
<div class="bubble ${compareDecadeClass(userItem.yearOfRelease, productRelease)}" style="left: 1800px; transform: translateX(-50%);">
  ${userItem.yearOfRelease}s
</div>
  </div>
`;

  const offset = document.getElementById("comparisonbubbletwo");
  if (userItem.ingredients.join('').length < 28 ) {
      offset.style.margin = "0px 0px 60px 0px";
  }
  else if (userItem.ingredients.join('').length < 52  ) {
      offset.style.margin = "0px 0px 80px 0px";
  }
  else {
       offset.style.margin = "0px 0px 100px 0px";
  }
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

function compareDecadeClass(val1, val2) {
  if (val1 < val2) {
    return "decade-lower"; 
  } else if (val1 > val2) {
    return "decade-higher"; 
  } else {
    return "decade-same";
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
    <div class="bubble ${compareClass(userItem.name, productName)}" style="left: 225px; transform: translateX(-50%);">
      ${userItem.name}
    </div>
    <div class="bubble ${compareIngredientsClass(userItem.ingredients, productIngredients)}" style="left: 625px; transform: translateX(-50%);">
      ${userItem.ingredients.map(ingredient =>
        productIngredients.includes(ingredient)
          ? `<span class="match">${ingredient}</span>`
          : `<span class="no-match">${ingredient}</span>`
      ).join(", ")}
    </div>
    <div class="bubble ${compareClass(userItem.restaurant, productRestaurant)}" style="left: 955px; transform: translateX(-50%);">
      ${userItem.restaurant}
    </div>
    <div class="bubble ${compareClass(userItem.type, productType)}" style="left: 1200px; transform: translateX(-50%);">
      ${userItem.type}
    </div>
    <div class="bubble ${compareIntClass(userItem.calories, productCalories)}" style="left: 1400px; transform: translateX(-50%);">
      ${userItem.calories}
    </div>
    <div class="bubble ${compareClass(userItem.vegan, productVegan)}" style="left: 1600px; transform: translateX(-50%);">
      ${userItem.vegan ? "Vegan" : "Non-Vegan"}
    </div>
<div class="bubble ${compareDecadeClass(userItem.yearOfRelease, productRelease)}" style="left: 1800px; transform: translateX(-50%);">
  ${userItem.yearOfRelease}s
</div>
  </div>
`;
  const offset = document.getElementById("comparisonbubblethree");
  if (userItem.ingredients.join('').length < 28 ) {
      offset.style.margin = "0px 0px 60px 0px";
  }
  else if (userItem.ingredients.join('').length < 52  ) {
      offset.style.margin = "0px 0px 80px 0px";
  }
  else {
       offset.style.margin = "0px 0px 100px 0px";
  }
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

function compareDecadeClass(val1, val2) {
  if (val1 < val2) {
    return "decade-lower"; 
  } else if (val1 > val2) {
    return "decade-higher"; 
  } else {
    return "decade-same";
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
    <div class="bubble ${compareClass(userItem.name, productName)}" style="left: 225px; transform: translateX(-50%);">
      ${userItem.name}
    </div>
    <div class="bubble ${compareIngredientsClass(userItem.ingredients, productIngredients)}" style="left: 625px; transform: translateX(-50%);">
      ${userItem.ingredients.map(ingredient =>
        productIngredients.includes(ingredient)
          ? `<span class="match">${ingredient}</span>`
          : `<span class="no-match">${ingredient}</span>`
      ).join(", ")}
    </div>
    <div class="bubble ${compareClass(userItem.restaurant, productRestaurant)}" style="left: 955px; transform: translateX(-50%);">
      ${userItem.restaurant}
    </div>
    <div class="bubble ${compareClass(userItem.type, productType)}" style="left: 1200px; transform: translateX(-50%);">
      ${userItem.type}
    </div>
    <div class="bubble ${compareIntClass(userItem.calories, productCalories)}" style="left: 1400px; transform: translateX(-50%);">
      ${userItem.calories}
    </div>
    <div class="bubble ${compareClass(userItem.vegan, productVegan)}" style="left: 1600px; transform: translateX(-50%);">
      ${userItem.vegan ? "Vegan" : "Non-Vegan"}
    </div>
<div class="bubble ${compareDecadeClass(userItem.yearOfRelease, productRelease)}" style="left: 1800px; transform: translateX(-50%);">
  ${userItem.yearOfRelease}s
</div>
  </div>
`;
  const offset = document.getElementById("comparisonbubblefour");
  if (userItem.ingredients.join('').length < 28 ) {
      offset.style.margin = "0px 0px 60px 0px";
  }
  else if (userItem.ingredients.join('').length < 52  ) {
      offset.style.margin = "0px 0px 80px 0px";
  }
  else {
       offset.style.margin = "0px 0px 100px 0px";
  }
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

function compareDecadeClass(val1, val2) {
  if (val1 < val2) {
    return "decade-lower"; 
  } else if (val1 > val2) {
    return "decade-higher"; 
  } else {
    return "decade-same";
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
    <div class="bubble ${compareClass(userItem.name, productName)}" style="left: 225px; transform: translateX(-50%);">
      ${userItem.name}
    </div>
    <div class="bubble ${compareIngredientsClass(userItem.ingredients, productIngredients)}" style="left: 625px; transform: translateX(-50%);">
      ${userItem.ingredients.map(ingredient =>
        productIngredients.includes(ingredient)
          ? `<span class="match">${ingredient}</span>`
          : `<span class="no-match">${ingredient}</span>`
      ).join(", ")}
    </div>
    <div class="bubble ${compareClass(userItem.restaurant, productRestaurant)}" style="left: 955px; transform: translateX(-50%);">
      ${userItem.restaurant}
    </div>
    <div class="bubble ${compareClass(userItem.type, productType)}" style="left: 1200px; transform: translateX(-50%);">
      ${userItem.type}
    </div>
    <div class="bubble ${compareIntClass(userItem.calories, productCalories)}" style="left: 1400px; transform: translateX(-50%);">
      ${userItem.calories}
    </div>
    <div class="bubble ${compareClass(userItem.vegan, productVegan)}" style="left: 1600px; transform: translateX(-50%);">
      ${userItem.vegan ? "Vegan" : "Non-Vegan"}
    </div>
<div class="bubble ${compareDecadeClass(userItem.yearOfRelease, productRelease)}" style="left: 1800px; transform: translateX(-50%);">
  ${userItem.yearOfRelease}s
</div>
  </div>
`;
  const offset = document.getElementById("comparisonbubblefive");
  if (userItem.ingredients.join('').length < 28 ) {
      offset.style.margin = "0px 0px 60px 0px";
  }
  else if (userItem.ingredients.join('').length < 52  ) {
      offset.style.margin = "0px 0px 80px 0px";
  }
  else {
       offset.style.margin = "0px 0px 100px 0px";
  }
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

function compareDecadeClass(val1, val2) {
  if (val1 < val2) {
    return "decade-lower"; 
  } else if (val1 > val2) {
    return "decade-higher"; 
  } else {
    return "decade-same";
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
    <div class="bubble ${compareClass(userItem.name, productName)}" style="left: 225px; transform: translateX(-50%);">
      ${userItem.name}
    </div>
    <div class="bubble ${compareIngredientsClass(userItem.ingredients, productIngredients)}" style="left: 625px; transform: translateX(-50%);">
      ${userItem.ingredients.map(ingredient =>
        productIngredients.includes(ingredient)
          ? `<span class="match">${ingredient}</span>`
          : `<span class="no-match">${ingredient}</span>`
      ).join(", ")}
    </div>
    <div class="bubble ${compareClass(userItem.restaurant, productRestaurant)}" style="left: 955px; transform: translateX(-50%);">
      ${userItem.restaurant}
    </div>
    <div class="bubble ${compareClass(userItem.type, productType)}" style="left: 1200px; transform: translateX(-50%);">
      ${userItem.type}
    </div>
    <div class="bubble ${compareIntClass(userItem.calories, productCalories)}" style="left: 1400px; transform: translateX(-50%);">
      ${userItem.calories}
    </div>
    <div class="bubble ${compareClass(userItem.vegan, productVegan)}" style="left: 1600px; transform: translateX(-50%);">
      ${userItem.vegan ? "Vegan" : "Non-Vegan"}
    </div>
<div class="bubble ${compareDecadeClass(userItem.yearOfRelease, productRelease)}" style="left: 1800px; transform: translateX(-50%);">
  ${userItem.yearOfRelease}s
</div>
  </div>
`;
  const offset = document.getElementById("comparisonbubblesix");
  if (userItem.ingredients.join('').length < 28 ) {
      offset.style.margin = "0px 0px 60px 0px";
  }
  else if (userItem.ingredients.join('').length < 52  ) {
      offset.style.margin = "0px 0px 80px 0px";
  }
  else {
       offset.style.margin = "0px 0px 100px 0px";
  }
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
          guessNumber += 1;
          lastGuess = selectedName;
          displayComparisonOne(userItem, productName)
          if (userItem.name == productName) {
            openPopup();
            gameWon();
          }
        }
        else if (guessNumber == 1) {
          if (lastGuess != selectedName) {
            displayComparisonTwo(userItem, productName)
            guessNumber += 1;
            lastGuess = selectedName;
            if (userItem.name == productName) {
              openPopup();
              gameWon();
          }
        }
        }
        else if (guessNumber == 2) {
          if (lastGuess != selectedName) {
            displayComparisonThree(userItem, productName)
            guessNumber += 1;
            lastGuess = selectedName;
            if (userItem.name == productName) {
              openPopup();
              gameWon();
            }
          }
        }
        else if (guessNumber == 3) {
          if (lastGuess != selectedName) {
            displayComparisonFour(userItem, productName)
            guessNumber += 1;
            lastGuess = selectedName;
            if (userItem.name == productName) {
              openPopup();
              gameWon();
            }
          }
        }
        else if (guessNumber == 4) {
          if (lastGuess != selectedName) {
            displayComparisonFive(userItem, productName)
            guessNumber += 1;
            lastGuess = selectedName;
            if (userItem.name == productName) {
              openPopup();
              gameWon();
            }
        }
        }
        else if (guessNumber == 5) {
          if (lastGuess != selectedName) {
            displayComparisonSix(userItem, productName)
            if (userItem.name == productName) {
              guessNumber += 1;
              openPopup();
              gameWon();
            }
        
            else {
            guessNumber += 1;
            openPopup();
            gameLost();
          }   
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

function gameWon() {
  if(isPracticeGame = false) 
    {
    userStats.numWins++;
    userStats.currentStreak++;
    userStats.winsInNum[guessNumber-1]++;
    console.log(userStats.winsInNum);
    finalGuess = guessNumber;
    if (userStats.currentStreak > userStats.maxStreak) { 
      userStats.maxStreak = userStats.currentStreak;
    }
  }
  victoryheader.innerHTML += `<h2>You win! 🎉 </h2>`;
  victoryheader.innerHTML += `<p>Burgerdle guessed in ${guessNumber}/6 attempts!</p>`;
  victoryscreen.innerHTML += `<h2>Guess Distribution</h2>`;
  renderStatistics();
  finalDistribution();
}

function gameLost() {
  victoryheader.innerHTML += `<h2>You lost! </h2>`;
  victoryheader.innerHTML += `<p>The correct item was the ${productName} from ${productRestaurant}</p>`;
  victoryscreen.innerHTML += `<h2>Guess Distribution</h2>`;
  renderStatistics();
  finalDistribution();
  finalGuess = guessNumber;
}


function renderStatistics() {
  const numWinsElem = document.getElementById("number-wins");
  numWinsElem.innerHTML = `${userStats.numGames}`;

  const winPercentElem = document.getElementById("win-percent");
  if (userStats.numGames === 0) {
     winPercentElem.innerHTML = `0`;
  } else {
    winPercentElem.innerHTML = `${Math.round(
       (userStats.numWins / userStats.numGames) * 100
     )}`;    }

  const currentStreakElem = document.getElementById("current-streak");
  currentStreakElem.innerHTML = `${userStats.currentStreak}`;

   const maxStreakElem = document.getElementById("max-streak");
   maxStreakElem.innerHTML = `${userStats.maxStreak}`;
}

function graphDistribution() {
      userStats.winsInNum.forEach((value, index) => {
        console.log(index);
        console.log(value);
        const graphElem = document.getElementById(`graph-${index+1}`);
        if (userStats.numWins === 0) {
          graphElem.style = `width: 5%`;
        } else {
          graphElem.style = `width: ${
            Math.floor((value / userStats.numWins) * 0.95 * 100) + 5
          }%`;
        }
        graphElem.innerHTML = `${value}`;
      });
    }

function finalDistribution() {
      setTimeout(2000);
      userStats.winsInNum.forEach((value, index) => {
        console.log(index);
        console.log(value);
        const graphElem = document.getElementById(`finalgraph-${index+1}`);
        if (userStats.numWins === 0) {
          graphElem.style = `width: 5%`;
        } else {
          graphElem.style = `width: ${
            Math.floor((value / userStats.numWins) * 0.95 * 100) + 5
          }%`;
        }
        graphElem.innerHTML = `${value}`;
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
  document.getElementById("comparisonbubbleone").style.display = "none";
  document.getElementById("comparisonbubbletwo").style.display = "none";
  document.getElementById("comparisonbubblethree").style.display = "none";
  document.getElementById("comparisonbubblefour").style.display = "none";
  document.getElementById("comparisonbubblefive").style.display = "none";
  document.getElementById("comparisonbubblesix").style.display = "none";
  console.log(document.getElementById("reset"));
  document.getElementById("resetButton").style.display = "none";
  }

function brighten() {
  document.body.style.backgroundColor = "#DCDCDC";

  safelySetStyle("headercontainer", "borderColor", "gray");
  safelySetStyle("gameplay-section", "backgroundColor", "#DCDCDC");
  safelySetStyle("site-footer", "backgroundColor", "#DCDCDC");
  safelySetStyle("site-footer", "borderColor", "gray");
  safelySetStyle("topnav", "backgroundColor", "#DCDCDC");
  safelySetStyle("topheader", "backgroundColor", "white");
  safelySetStyle("topheader", "borderColor", "gray");

  safelySetStyle("comparisonbubbleone", "display", "");
  safelySetStyle("comparisonbubbletwo", "display", "");
  safelySetStyle("comparisonbubblethree", "display", "");
  safelySetStyle("comparisonbubblefour", "display", "");
  safelySetStyle("comparisonbubblefive", "display", "");
  safelySetStyle("comparisonbubblesix", "display", "");
  document.getElementById("resetButton").style.visibility = "visible";
}

function safelySetStyle(id, styleProp, value) {
  const el = document.getElementById(id);
  if (el) {
    el.style[styleProp] = value;
  } else {
    console.warn(`Element with ID "${id}" not found.`);
  }
}

function openingScreen() {
  setTimeout(() => {
  darken();
  }, 0);
  opening.classList.add("visible");
  opening.classList.remove("clickthrough");
}

function closeOpening() {
  opening.classList.remove("visible");
  opening.classList.add("clickthrough");
  brighten();
}


function openPopup() {
  popup.classList.add("visible");
  setTimeout(() => {
  darken();
  }, 0);
}

function showReset() {
  const resetDiv = document.getElementById("reset");
  if (resetDiv) {
    resetDiv.classList.remove("hidden"); 
    resetDiv.classList.add("visible"); 
  }
   console.log("showReset function triggered!"); 
}

function resetGame () {
  document.getElementById("comparison-1").innerHTML = "";
  document.getElementById("comparison-2").innerHTML = "";
  document.getElementById("comparison-3").innerHTML = "";
  document.getElementById("comparison-4").innerHTML = "";
  document.getElementById("comparison-5").innerHTML = "";
  document.getElementById("comparison-6").innerHTML = "";
  document.getElementById("victoryheader").innerHTML = "";
  document.getElementById("victoryscreen").innerHTML = "";
  guessNumber = 0;
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
  renderStatistics();
  graphDistribution();
}

function closeStats() {
  stats.classList.remove("visible");
  brighten();
}

function copyStats() {
    let output = `burgerdle #${gameNumber}`;
  if (finalGuess < 6) {
    output += ` ${finalGuess}/6\n`;
  } else {
    output += ` X/6\n`;
  }
  output += `https://burgerdle.com`;
  navigator.clipboard.writeText(output);
}
// Search bar functionality

function filterItems() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const dropdown = document.getElementById('dropdown');
  dropdown.innerHTML = '';  

if (!input) return;

  const filtered = items.filter(item => 
    item.name.toLowerCase().includes(input) ||
    (item.restaurant && item.restaurant.toLowerCase().includes(input))
  );

  
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
