const catalog = document.getElementById('catalog');
const form = document.getElementById('createForm');
let itemsData = [];
let ascending = true; // для сортировки

// Загрузка всех товаров с сервера
async function loadData() {
  const res = await fetch('/api/items');
  itemsData = await res.json();
  renderCatalog(itemsData);
}

// Рендер каталога
function renderCatalog(items) {
  catalog.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerHTML = `
      <strong>${item.name}</strong><br>
      $${item.price}<br>
      Size: ${item.size || '-'}<br>
      Category: ${item.category || '-'}<br>
      <button onclick="editItem('${item._id}')">Edit</button>
      <button onclick="deleteItem('${item._id}')">Delete</button>
    `;
    catalog.appendChild(div);
  });
}

// Добавление товара
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newItem = {
    name: document.getElementById('name').value,
    price: document.getElementById('price').value,
    size: document.getElementById('size').value,
    category: document.getElementById('category').value
  };
  await fetch('/api/items', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(newItem)
  });
  form.reset();
  loadData();
});

// Удаление товара
async function deleteItem(id) {
  await fetch(`/api/items/${id}`, { method: 'DELETE' });
  loadData();
}

// Редактирование товара
async function editItem(id) {
  const item = itemsData.find(i => i._id === id);
  const newName = prompt('Name:', item.name);
  const newPrice = prompt('Price:', item.price);
  const newSize = prompt('Size:', item.size);
  const newCategory = prompt('Category:', item.category);

  if (!newName || !newPrice) return;

  await fetch(`/api/items/${id}`, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      name: newName,
      price: newPrice,
      size: newSize,
      category: newCategory
    })
  });
  loadData();
}

// Сортировка по цене
function sortItems() {
  ascending = !ascending;
  const sorted = [...itemsData].sort((a,b) => ascending ? a.price - b.price : b.price - a.price);
  renderCatalog(sorted);
}

// Изначальная загрузка данных
loadData();