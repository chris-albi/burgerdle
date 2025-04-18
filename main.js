let items = [];

window.onload = async function () {
  const response = await fetch('items.json');
  items = await response.json();
};

function filterItems() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const dropdown = document.getElementById('dropdown');
  dropdown.innerHTML = ''; // clear dropdown

  if (!input) return;

  const filtered = items.filter(item => item.name.toLowerCase().includes(input));
  
  filtered.slice(0, 5).forEach(item => {
    const option = document.createElement('div');
    option.textContent = item.name;
    option.onclick = () => {
      document.getElementById('searchInput').value = item.name;
      dropdown.innerHTML = '';
    };
    dropdown.appendChild(option);
  });

  const button = document.getElementById('popupButton');
  const menu = document.getElementById('popupMenu');
  
  button.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
  
  // Optional: hide menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !button.contains(event.target)) {
      menu.classList.add('hidden');
    }
  });
}