document.addEventListener("DOMContentLoaded", function () {
  console.log("웹사이트가 로드되었습니다!");
  const allMenuContainer = document.getElementById("allMenuContainer");
  const mainMenuContainer = document.getElementById("mainMenuContainer");
  const backButton = document.querySelector(".backToAllMenu");

  let bakeryMenus = []; // 전역으로 메뉴 데이터 저장

  // URL 해시가 변경될 때마다 실행되는 함수
  function handleRoute() {
    const menuName = decodeURIComponent(window.location.hash.slice(1));
    if (menuName) {
      const selectedMenu = bakeryMenus.find(
        (menu) => menu.menuName === menuName
      );
      if (selectedMenu) {
        showMenuDetail(selectedMenu);
      }
    } else {
      showAllMenus();
    }
  }

  // JSON 데이터 로드
  fetch("bowmAllMenu.json")
    .then((response) => response.json())
    .then((data) => {
      bakeryMenus = data.filter(
        (menu) => menu.category === "베이커리" && menu.isAvailable === true
      );

      allMenuContainer.innerHTML = "";

      bakeryMenus.forEach((menu) => {
        const menuItem = document.createElement("div");
        menuItem.className = "menuItemContainer";
        menuItem.innerHTML = `
          <img class="menuItemImg" src="${
            menu.menuImageUrl || "./기본이미지.png"
          }" />
          <div class="menuItemName">${menu.menuName}</div>
        `;

        // 클릭 시 URL 해시 변경
        menuItem.addEventListener("click", () => {
          window.location.hash = menu.menuName;
        });

        allMenuContainer.appendChild(menuItem);
      });

      // 초기 라우트 처리
      handleRoute();
    })
    .catch((error) => {
      console.error("메뉴 데이터를 불러오는데 실패했습니다:", error);
    });

  // 뒤로가기 버튼 클릭 시 해시 제거
  backButton.addEventListener("click", () => {
    window.location.hash = "";
  });

  // 해시 변경 이벤트 리스너
  window.addEventListener("hashchange", handleRoute);

  // 메뉴 상세 정보를 보여주는 함수
  function showMenuDetail(menu) {
    const menuBox = mainMenuContainer.querySelector(".menuBox");
    menuBox.innerHTML = `
      <div class="menuInfo">
        <div class="menuName">${menu.menuName}</div>
        ${
          menu.description
            ? `<div class="menuDescription">${menu.description}</div>`
            : ""
        }
      </div>
      <div><img class="menuImg" src="${
        menu.menuImageUrl || "./기본이미지.png"
      }" /></div>
    `;

    const recommendationBox =
      mainMenuContainer.querySelector(".recommendationBox");
    if (menu.profile && menu.profile.oneLineReview) {
      recommendationBox.innerHTML = `
        <div class="profile">
          <img class="memoji" src="${
            menu.profile.profileImage || "./chef_recommendation.png"
          }" />
          <div id="profileName">${menu.profile.profileName || "보움맨"}</div>
        </div>
        <div>｢ ${menu.profile.oneLineReview} ｣</div>
      `;
      recommendationBox.style.display = "flex";
    } else {
      recommendationBox.style.display = "none";
    }

    const ingredientBox = mainMenuContainer.querySelector(".ingredientBox");
    if (
      menu.ingredients &&
      menu.ingredients.length > 0 &&
      menu.ingredients[0] !== ""
    ) {
      ingredientBox.textContent = menu.ingredients.join(". ");
      ingredientBox.style.display = "block";
    } else {
      ingredientBox.style.display = "none";
    }

    allMenuContainer.style.display = "none";
    mainMenuContainer.style.display = "block";
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // 전체 메뉴 목록을 보여주는 함수
  function showAllMenus() {
    allMenuContainer.style.display = "grid";
    mainMenuContainer.style.display = "none";
  }
});
