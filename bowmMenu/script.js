// 스크롤 위치를 저장할 변수
let savedScrollPosition = 0;
let selectedMenuQuantity = 0;

// JSON 파일의 URL
const menuJsonUrl = 'https://east-harmony.com/receipt-generator/menu.json';

// JSON 데이터를 가져오는 함수
function fetchMenuData(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
        console.log(data);
        const coffeeItems = data.filter(item => item.category === 'coffee');
        const beverageItems = data.filter(item => item.category === 'beverage');

        generateMenuHTML(coffeeItems, 'Coffee');
        generateMenuHTML(beverageItems, 'Beverage');


    })
    .catch(error => {
      // 오류 처리
      console.error('Fetch error:', error);
    });
}

// 메뉴 데이터를 HTML로 변환
function generateMenuHTML(menuItems, categoryName) {
  const menuContainer = document.querySelector('.menu-container');

  // 카테고리 제목 추가
  const categoryTitle = document.createElement('h3');
  categoryTitle.textContent = categoryName;
  menuContainer.appendChild(categoryTitle);

  const eachCategoryContainer = document.createElement('div');
  eachCategoryContainer.className = 'each-category-container';
  menuContainer.appendChild(eachCategoryContainer);

  // 각 아이템에 대한 HTML 생성
  menuItems.forEach(item => {
    const itemContainer = document.createElement('div');
    itemContainer.className = 'item-container';

    const img = document.createElement('img');
    img.src = 'menuImg/' + item.imageURL;
    img.className = 'menu-img';
    itemContainer.appendChild(img);

    itemContainer.addEventListener('click', function() {
      showMenuDetails(item);
    });

    // const name = document.createElement('h4');
    // name.textContent = item.name;
    // itemContainer.appendChild(name);

    // const price = document.createElement('p');
    // price.textContent = `${item.price}원`;
    // itemContainer.appendChild(price);

    // const description = document.createElement('p');
    // description.textContent = item.description;
    // itemContainer.appendChild(description);

    eachCategoryContainer.appendChild(itemContainer);
  });
}

let quantity = 1;
let currentItem = null; // 현재 선택한 메뉴 아이템을 저장할 변수

// 세부 정보 화면을 표시하고 내용을 업데이트하는 함수
function showMenuDetails(item) {
  currentItem = item;

  savedScrollPosition = window.scrollY || document.documentElement.scrollTop;


  // 메뉴 목록 숨기기
  document.getElementById('main-display').style.display = 'none';

  // 세부 정보 화면 표시
  const menuSpecDisplay = document.getElementById('menu-spec-display');
  menuSpecDisplay.style.display = 'flex';
  window.scrollTo(0, 0);

  // 세부 정보 업데이트
  menuSpecDisplay.querySelector('.menu-spec-img').src = 'menuImg/' + item.imageURL;
  menuSpecDisplay.querySelector('.name-quantity h3').textContent = `${item.name} ${item.price}₩`;

  // reset
  quantity = 1;
  document.querySelectorAll('.option').forEach(option => {
    option.classList.remove('selected');
  });

  menuSpecDisplay.querySelector('#quantity').textContent = `${quantity}`;

  if (item.option.temperature) {
    menuSpecDisplay.querySelector('#temperature').style.display = 'flex';
  } else {
    menuSpecDisplay.querySelector('#temperature').style.display = 'none';
  }

  if (item.option.decaf) {
    menuSpecDisplay.querySelector('#decaf').style.display = 'flex';
  } else {
    menuSpecDisplay.querySelector('#decaf').style.display = 'none';
  }

  if (item.option.sparkling) {
    menuSpecDisplay.querySelector('#sparkling').style.display = 'flex';
  } else {
    menuSpecDisplay.querySelector('#sparkling').style.display = 'none';
  }

  if (item.option.addShot) {
    menuSpecDisplay.querySelector('#addShot').style.display = 'flex';
  } else {
    menuSpecDisplay.querySelector('#addShot').style.display = 'none';
  }
}

let selectedMenus = []; // 선택된 메뉴를 저장할 배열

function getCurrentSelection(item) {
  let selectedOptions = {};

  // 각 옵션 컨테이너에서 선택된 옵션 찾기
  document.querySelectorAll('.option-container').forEach(container => {
    let selected = container.querySelector('.option.selected');
    if (selected) {
      // 옵션 컨테이너의 ID를 키로 사용
      selectedOptions[container.id] = selected.id;
    }
  });

  return {
    item: item, // 현재 선택된 메뉴 아이템
    options: selectedOptions // 선택된 옵션들
  };
}

document.querySelector('#add-menu-btn').addEventListener('click', function() {
  // 현재 선택된 메뉴와 옵션 가져오기
  let currentSelection = getCurrentSelection(currentItem); // 'currentItem'은 현재 선택된 메뉴 아이템을 나타냄

  // 배열에 추가
  for (let i = 0; i < quantity; i++) {
    selectedMenus.push(currentSelection);
  }

  // 선택된 메뉴 배열을 콘솔에 출력 (또는 다른 처리)
  console.log(selectedMenus);

  selectedMenuQuantity = selectedMenus.length;
  document.getElementById('selected-menu-quantity').textContent = `${selectedMenuQuantity}`;

  document.getElementById('main-display').style.display = 'block';
  document.getElementById('menu-spec-display').style.display = 'none';

  window.scrollTo(0, savedScrollPosition);
});

document.querySelector('.close-btn').addEventListener('click', function() {
  document.getElementById('main-display').style.display = 'block';
  document.getElementById('menu-spec-display').style.display = 'none';

  window.scrollTo(0, savedScrollPosition);
});

document.querySelector('#decrease-quantity').addEventListener('click', function () {

  // 수량 감소 (단, 최소값을 1로 설정)
  if (quantity > 1) {
    quantity -= 1;
  }

  // 수량 표시를 업데이트
  document.querySelector('#quantity').textContent = `${quantity}`;
});

document.querySelector('#increase-quantity').addEventListener('click', function () {
  quantity += 1;

  // 수량 표시를 업데이트
  document.querySelector('#quantity').textContent = `${quantity}`;
});

// 페이지 로드 시 JSON 데이터 가져오기
document.addEventListener('DOMContentLoaded', () => {
  fetchMenuData(menuJsonUrl);
});

document.querySelectorAll('.option').forEach(option => {
  option.addEventListener('click', function() {
    // 해당 옵션의 선택 상태 토글
    this.classList.toggle('selected');

    // 동일한 옵션 그룹 내의 다른 옵션들의 선택 상태 해제
    let siblingOptions = this.parentElement.querySelectorAll('.option');
    siblingOptions.forEach(sibling => {
      if (sibling !== this && sibling.classList.contains('selected')) {
        sibling.classList.remove('selected');
      }
    });
  });
});
