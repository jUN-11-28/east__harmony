// 예: 메뉴 아이템 동적 추가
const menuContainer = document.querySelector(".menu-container");

for (let i = 7; i <= 0; i++) {
  const newItem = document.createElement("div");
  newItem.className = "menu-item";
  newItem.textContent = `Menu ${i}`;
  menuContainer.appendChild(newItem);
}
