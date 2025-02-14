document.addEventListener("DOMContentLoaded", function () {
  console.log("웹사이트가 로드되었습니다!");
  const allMenuContainer = document.getElementById("allMenuContainer");
  const mainMenuContainer = document.getElementById("mainMenuContainer");
  const backButton = document.querySelector(".backToAllMenu");

  // JSON 파일 불러오기
  fetch("bowmAllMenu.json")
    .then((response) => response.json())
    .then((data) => {
      // 베이커리 카테고리이면서 이용 가능한 메뉴만 필터링
      const bakeryMenus = data.filter(
        (menu) => menu.category === "베이커리" && menu.isAvailable === true
      );

      // allMenuContainer 비우기
      allMenuContainer.innerHTML = "";

      // 필터링된 메뉴들로 화면 구성
      bakeryMenus.forEach((menu) => {
        const menuItem = document.createElement("div");
        menuItem.className = "menuItemContainer";
        menuItem.innerHTML = `
          <img class="menuItemImg" src="${menu.menuImageUrl || "./기본이미지.png"}" />
          <div class="menuItemName">${menu.menuName}</div>
        `;

        // 각 메뉴 아이템 클릭 이벤트
        menuItem.addEventListener("click", () => {
          // 메인 메뉴 박스 업데이트
          const menuBox = mainMenuContainer.querySelector(".menuBox");
          menuBox.innerHTML = `
            <div class="menuInfo">
              <div class="menuName">${menu.menuName}</div>
              ${menu.description ? `<div class="menuDescription">${menu.description}</div>` : ""}
            </div>
            <div><img class="menuImg" src="${menu.menuImageUrl || "./기본이미지.png"}" /></div>
          `;

          // 추천 박스 업데이트 (프로필이 있을 때만)
          const recommendationBox =
            mainMenuContainer.querySelector(".recommendationBox");
          if (menu.profile && menu.profile.oneLineReview) {
            recommendationBox.innerHTML = `
              <div class="profile">
                <img class="memoji" src="${menu.profile.profileImage || "./chef_recommendation.png"}" />
                <div id="profileName">${menu.profile.profileName || "보움맨"}</div>
              </div>
              <div>｢ ${menu.profile.oneLineReview} ｣</div>
            `;
            recommendationBox.style.display = "flex";
          } else {
            recommendationBox.style.display = "none";
          }

          // 성분 정보 업데이트 (성분이 있을 때만)
          const ingredientBox =
            mainMenuContainer.querySelector(".ingredientBox");
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

          // 화면 전환
          allMenuContainer.style.display = "none";
          mainMenuContainer.style.display = "block";
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });

        allMenuContainer.appendChild(menuItem);
      });
    })
    .catch((error) => {
      console.error("메뉴 데이터를 불러오는데 실패했습니다:", error);
    });

  // 뒤로가기 버튼 클릭 이벤트
  backButton.addEventListener("click", () => {
    mainMenuContainer.style.display = "none";
    allMenuContainer.style.display = "grid";
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
