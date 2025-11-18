/** 
  Jeong A Ra JS
  http://jeongara.com/
**/
/*

        공통영역 JS

*/
// ==========================
// 사이드메뉴
// ==========================
document.querySelectorAll(".aside-menu > li").forEach((li) => {
  li.addEventListener("click", (e) => {
    const asideMenu = li.querySelector(".aside-menu-sub ul");

    if (asideMenu && getComputedStyle(asideMenu).display === "none") {
      // 열기
      asideMenu.style.display = "block";
      document.querySelectorAll(".aside-menu > li").forEach((other) =>
        other.classList.remove("ov")
      );
      li.classList.add("ov");

      document.querySelectorAll(".aside-menu-sub ul").forEach((ul) => {
        if (ul !== asideMenu) ul.style.display = "none";
      });

      e.preventDefault();
    } else if (asideMenu) {
      // 닫기
      asideMenu.style.display = "none";
      document.querySelectorAll(".aside-menu > li").forEach((other) =>
        other.classList.remove("ov")
      );
    }
  });
});



// ==========================
// 스낵바 함수 (이미 있음)
// ==========================
let sbTimer;
function showSnackbar(msg) {
  const snackbar = document.querySelector('.snackbars');
  if (!snackbar) return;
  snackbar.textContent = msg || '완료되었습니다.';
  snackbar.classList.add('is-show');
  clearTimeout(sbTimer);
  sbTimer = setTimeout(() => snackbar.classList.remove('is-show'), 5000);
}