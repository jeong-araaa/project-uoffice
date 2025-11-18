/** 
  Jeong A Ra JS
  http://jeongara.com/
**/
/*

        테이블 JS

*/
// ==========================
// 1뎁스 상세 / 등록 / 수정 패널
// ==========================
const content = document.querySelector('.content__list');
const panelWrap = document.querySelector('.popup-details__inner');          // 페이지에 없을 수도 있음
const panel = panelWrap?.querySelector('.popup-details');
const btnAdd = document.querySelector('.table-head .btn-register');
const tbodyWrap = document.querySelector('.table-body');
const snackbar = document.querySelector('.snackbars');
const btnModify = panelWrap?.querySelector('.btn-modify');
const btnClose = panelWrap?.querySelector('.btn-close');

function openPanel() {
  if (!panelWrap) return;
  panelWrap.classList.add('is-open');
  content?.classList.add('shifted');
}
function closePanel() {
  if (!panelWrap) return;
  panelWrap.classList.remove('is-open');
  content?.classList.remove('shifted');
}

btnAdd?.addEventListener('click', (e) => {
  e.preventDefault();
  if (!panel) return;
  panel.classList.add('details-form');
  panel.classList.remove('details-infos');
  tbodyWrap?.querySelectorAll('.tr-infos.is-active').forEach(el => el.classList.remove('is-active'));
  openPanel();
});

tbodyWrap?.addEventListener('click', (e) => {
  if (!panel) return;
  if (e.target.closest('input, button, a, select, label')) return;
  const tr = e.target.closest('.tr-infos');
  if (!tr) return;

  // 251014 추가 : 2뎁스 열려있으면 닫기
  document.querySelectorAll('.details-2depth.is-open').forEach(layer => {
    if (typeof hideDetails2 === 'function') {
      hideDetails2(layer);
    } else {
      layer.classList.remove('is-open');
      layer.setAttribute('aria-hidden', 'true');
    }
  });

  panel.classList.add('details-infos');
  panel.classList.remove('details-form');

  tbodyWrap.querySelectorAll('.tr-infos.is-active').forEach(el => el.classList.remove('is-active'));
  tr.classList.add('is-active');
  openPanel();
});

btnModify?.addEventListener('click', (e) => {
  e.preventDefault();
  panel?.classList.add('details-form');
  panel?.classList.remove('details-infos');
});

panel?.querySelector('.btn-form-submit')?.addEventListener('click', (e) => {
  e.preventDefault();
  showSnackbar?.('저장 되었습니다.');
});

btnClose?.addEventListener('click', () => {
  closePanel();
  tbodyWrap?.querySelectorAll('.tr-infos.is-active').forEach(el => el.classList.remove('is-active'));
});


// ==========================
// 2뎁스 상세 패널 열기/닫기
// ==========================
const dim = document.querySelector('.popup-dim');

// 열기 / 닫기 위임
document.addEventListener('click', (e) => {
  // 열기
  const openBtn = e.target.closest('[data-details-open]');
  if (openBtn) {
    const id = openBtn.dataset.detailsOpen;
    const layer = document.getElementById(id);
    if (!layer) return;

    layer.classList.add('is-open');
    layer.setAttribute('aria-hidden', 'false');
    if (dim) dim.style.display = 'block';

    // 포커스 이동
    const focusTarget = layer.querySelector('.btn-close, .btn-back, button, [href], input, select, textarea');
    focusTarget?.focus({ preventScroll: true });
    return;
  }

  // 2뎁스 닫기/뒤로 (전파 차단!)
  const closeInDepth2 = e.target.closest('.details-2depth .btn-close, .details-2depth .btn-back');
  if (closeInDepth2) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation(); // 다른 전역 클릭핸들러까지 차단
    const layer = closeInDepth2.closest('.details-2depth');
    hideDetails2(layer);
    return;
  }

  // dim 클릭 시 2뎁스들만 닫기
  if (dim && e.target === dim) {
    document.querySelectorAll('.details-2depth.is-open')
      .forEach((layer) => hideDetails2(layer));
  }
});

// ESC 닫기(2뎁스만)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.details-2depth.is-open')
      .forEach((layer) => hideDetails2(layer));
  }
});

// 닫기 함수
function hideDetails2(layer) {
  if (!layer) return;
  layer.classList.remove('is-open');
  layer.setAttribute('aria-hidden', 'true');
  // 열려있는 2뎁스가 하나도 없으면 dim 숨김
  const anyOpen = document.querySelector('.details-2depth.is-open');
  if (!anyOpen && dim) dim.style.display = 'none';
}

// 완료 클릭 시 2뎁스 닫기
document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-details-submit]')) return;

  // 열려있는 2뎁스 닫기
  document.querySelectorAll('.details-2depth.is-open').forEach(layer => {
    if (typeof hideDetails2 === 'function') {
      hideDetails2(layer);
    } else {
      layer.classList.remove('is-open');
      layer.setAttribute('aria-hidden', 'true');
    }
  });

  // dim도 정리
  const dim = document.querySelector('.popup-dim');
  if (dim && !document.querySelector('.details-2depth.is-open')) {
    dim.style.display = 'none';
  }
});


// ==========================
// 추가 버튼 (지점/본사)
// ==========================
document.querySelectorAll('.register-group').forEach(box => {
  const btn = box.querySelector('.btn-registers');
  const list = box.querySelector('.btn__options');

  if (!btn || !list) return;

  // hover 시 열기
  btn.addEventListener('mouseenter', () => {
    list.classList.add('is-open');
  });

  // 영역 벗어나면 닫기
  box.addEventListener('mouseleave', () => {
    list.classList.remove('is-open');
  });

  // 옵션 클릭 → title-value 텍스트 변경
  list.addEventListener('click', (e) => {
    const opt = e.target.closest('.btn__option');
    if (!opt) return;

    const value = opt.dataset.value || opt.textContent.trim();
    const titleEl = document.querySelector('.popup-details .title-value');
    if (titleEl) {
      titleEl.textContent = value; // 텍스트 교체
    }

    // 닫기
    list.classList.remove('is-open');

    // 상세 패널 열기
    const panel = document.querySelector('.popup-details__inner .popup-details');
    if (panel) panel.classList.add('is-open');
  });
});


// ==========================
// table-head 없는 경우 no-head 추가
// ==========================
document.querySelectorAll('.table').forEach(table => {
  if (!table.querySelector('.table-head')) {
    table.classList.add('no-head');
  }
});


// ==========================
// 월/기간 선택
// ==========================
document.querySelectorAll('.form-dates').forEach(box => {
  const btn = box.querySelector('.dates__select');
  const list = box.querySelector('.dates__options');
  const valueEl = box.querySelector('.dates__value');
  const periodBox = box.querySelector('.period-inner');

  if (!btn || !list || !valueEl) return;

  const showPeriod = (show) => {
    if (!periodBox) return;
    periodBox.style.display = show ? '' : 'none';
  };

  // 버튼 hover → 옵션 열기
  btn.addEventListener('mouseenter', () => {
    list.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
  });

  // form-dates 전체에서 마우스 나가면 닫기
  box.addEventListener('mouseleave', () => {
    list.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  });

  // 옵션 클릭
  list.addEventListener('click', (e) => {
    const opt = e.target.closest('.dates__option');
    if (!opt) return;

    // 선택 상태 갱신
    list.querySelectorAll('.dates__option').forEach(li => {
      li.classList.toggle('is-selected', li === opt);
      li.setAttribute('aria-selected', li === opt ? 'true' : 'false');
    });

    // 값 반영
    valueEl.textContent = opt.textContent.trim();

    // 기간설정이면 period 박스 보이기
    showPeriod(opt.classList.contains('period'));

    // 선택 후 닫기
    list.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  });
});