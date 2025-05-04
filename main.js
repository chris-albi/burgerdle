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

window.onload = async function () {
  const response = await fetch('items.json');
  items = await response.json();
};

const startDate = new Date("01/16/2025");
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

function checkUserSelection() {
  const selectedName = document.getElementById("searchInput").value;
  
  fetch("./items.json")
    .then((response) => response.json())
    .then((data) => {
      const userItem = data.find(item => item.name === selectedName);
      
      if (userItem && productName) {
        displayComparison(userItem, productName)
      }
      else {
        console.log("Item not found or mystery item not initialized.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
    }

function displayComparison(userItem, productName) {
  const container = document.getElementById("comparisonArea");
  container.innerHTML = `
    <div class="comparison-card">
      <h2>Your Pick</h2>
      <p><strong>${userItem.name}</strong></p>
      <p>Restaurant: ${userItem.restaurant}</p>
      <p>Calories: ${userItem.calories}</p>
      <p>Vegan: ${userItem.vegan}</p>
      <p>Gluten Free: ${userItem.glutenFree}</p>
      <p>Date of release: ${userItem.yearOfRelease}</p>
      <p>Ingredients: ${userItem.ingredients.join(", ")}</p>
    </div>
  `;
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