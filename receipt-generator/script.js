let selectedMenu = [];
let menuJson;

// 윈도우 로드시 fixed-header 사이즈 계산후 마진 추가
window.onload = function() {
  let headerHeight = document.getElementById('fixed-header').offsetHeight;
  document.getElementById('menu-container').style.marginTop = headerHeight + 'px';
  fetch('https://east-harmony.com/receipt-generator/menu.json') // 여기에 실제 JSON 파일의 경로를 입력해주세요.
  .then(response => response.json()) // 응답을 JSON으로 파싱합니다.
  .then(data => { // 파싱된 JSON 데이터를 받습니다.
    const menuSelectionDiv = document.getElementById('menu-items'); // 버튼을 추가할 div를 가져옵니다.
    menuJson = data;
    data.forEach(item => { // 각각의 메뉴 아이템에 대해 반복합니다.
      let newButton = document.createElement('button');
      newButton.className = 'menu-btn';
      newButton.id = item.id; // 아이템 ID를 ID로 사용합니다.
      newButton.textContent = item.name;
      newButton.onclick = addMenu;

      menuSelectionDiv.appendChild(newButton); // 버튼을 div에 추가합니다.
    });
  })
  .catch(error => console.error('Error:', error)); // 에러 발생 시 로그를 출력합니다.

}

// item 추가시 fixed-header 사이즈 계산후 마진 추가
window.onresize = function() {
  let headerHeight = document.getElementById('fixed-header').offsetHeight;
  document.getElementById('menu-container').style.marginTop = headerHeight + 'px';
}

// resize
function resize() {
  let headerHeight = document.getElementById('fixed-header').offsetHeight;
  document.getElementById('menu-container').style.marginTop = headerHeight + 'px';
}

function addMenu(event) {
  let newButton = document.createElement('button');
  newButton.className = 'selected-menu-btn';
  newButton.id = event.target.id;
  newButton.textContent = event.target.textContent + ' ×';
  newButton.onclick = deleteMenu;

  let selectedItems = document.getElementById('selected-items');
  let existingButtons = Array.from(selectedItems.getElementsByClassName('selected-menu-btn'));

  // 현재 선택된 메뉴와 같은 메뉴가 있는지 찾습니다.
  let sameMenuButtons = existingButtons.filter(button => button.id === newButton.id);

  if (sameMenuButtons.length > 0) {
    // 같은 메뉴가 이미 있다면, 가장 마지막에 추가된 같은 메뉴 다음에 새 메뉴를 추가합니다.
    let lastSameMenuButton = sameMenuButtons[sameMenuButtons.length - 1];
    selectedItems.insertBefore(newButton, lastSameMenuButton.nextSibling);
  } else {
    // 같은 메뉴가 없다면, 새 메뉴를 마지막에 추가합니다.
    selectedItems.appendChild(newButton);
  }
  resize();
}

function deleteMenu(event) {
  // 사용자에게 정말로 삭제할 것인지 확인
  if (confirm('메뉴를 취소하시겠습니까?')) {
    // 이벤트를 발생시킨 요소의 부모 노드에 접근
    let button = event.target;

    // 버튼의 투명도를 0으로 변경하여 서서히 사라지게 합니다.
    button.style.opacity = '0';

    // 1초 후에 버튼을 완전히 삭제합니다.
    setTimeout(() => {
      // 부모 노드에서 이벤트를 발생시킨 요소를 삭제
      button.parentNode.removeChild(button);
      resize();
    }, 200);
  }
}

function printReceipt() {

  calcPrice();
  const newCanvas = document.createElement('canvas');
  const context = newCanvas.getContext('2d');

  newCanvas.width = 500;

  newCanvas.height = 290 + 278 + (2 + selectedMenu.length) * 25;

  // HTML에 미리 로드된 이미지를 찾습니다.
  const receiptUp = document.getElementById('receiptUp');
  const receiptDown = document.getElementById('receiptDown')

  // 이미지가 이미 로드되어 있으므로, load 이벤트 대신에 바로 drawImage를 사용합니다.
  // console.log(selectedMenu);
  context.fillStyle = 'white';
  context.fillRect(0, 290, 500, (3 + selectedMenu.length) * 25 + 20);
  context.drawImage(receiptUp, 0, 0, 500, 290);
  context.drawImage(receiptDown, 0, 290 + (2 + selectedMenu.length) * 25, 500, 278);


  const textX = 52;
  const textY = 320;
  let i = 0;
  let totalPrice = 0;
  selectedMenu.forEach((item) => {
    context.font = '18px Inter';
    context.fillStyle = 'black';
    context.textAlign = 'start';
    context.fillText(item.name, textX, textY + 25 * i);
    context.textAlign = 'center'
    context.fillText(item.numItems, textX + 266, textY + 25 * i);
    context.textAlign = 'end';
    context.fillText(item.price * item.numItems, textX + 395, textY + 25 * i);
    totalPrice += item.price * item.numItems;
    i += 1;
  });

  context.fillStyle = 'black';
  context.fillRect(30, 290 + (1 + selectedMenu.length) * 25, 440, 2.3);
  context.fillRect(30, 290 + (2 + selectedMenu.length) * 25 + 2.3, 440, 2.3);

  context.font = '18px Inter';
  context.fillStyle = 'black';
  context.textAlign = 'start';
  context.fillText('total price', textX, textY + 25 * (i) + 16);
  context.textAlign = 'end';
  context.fillText(totalPrice, textX + 395, textY + 25 * (i) + 16);

  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  modalImage.src = newCanvas.toDataURL("image/png");
  setTimeout(() => {
    modal.style.display = "block";
  }, 100);
}

function calcPrice() {
  selectedMenu = [];

  const selectedItemsContainer = document.getElementById('selected-items');
  const selectedItems = selectedItemsContainer.querySelectorAll('button');

  selectedItems.forEach((item) => {
    if(selectedMenu.find(menu => menu.id == item.id)) {
      selectedMenu.find(menu => menu.id == item.id).numItems += 1;
    } else {
      const menu = {
        id: item.id,
        name: menuJson.find(elem => elem.id == item.id).name,
        price: menuJson.find(elem => elem.id == item.id).price,
        numItems: 1
      }
      selectedMenu.push(menu);
    }
  });
  
}

function closeModal() {
  modal.style.display = "none";
}