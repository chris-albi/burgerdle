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
        console.log("Name:", item.name);
        console.log("Restaurant:", item.restaurant);
        console.log("Calories:", item.calories);
        console.log("Type:", item.type);
        console.log("Vegan:", item.vegan);
        console.log("Gluten Free:", item.glutenFree);
        console.log("Year of Release:", item.yearOfRelease);
        console.log("Ingredients:", item.ingredients.join(", "));
        console.log("Icon:", item.icon);
        console.log("--------------------------");
      });
    })
    .catch((error) => {
      console.error("Error fetching or parsing data:", error);
    });
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