/** 
  Jeong A Ra JS
  http://jeongara.com/
**/
/*

        모달창 JS

*/
// ==========================
// Modal (open / close)
// ==========================
function getOpenModals() {
  return document.querySelectorAll('.modal.modal--active');
}

function lockScrollIfNeeded() {
  if (getOpenModals().length > 0) {
    document.body.classList.add('hidden');
  } else {
    document.body.classList.remove('hidden');
  }
}

function modalShowPop(id) {
  const layer = document.getElementById(id);
  if (!layer) return;
  layer.classList.add('modal--active');
  layer.setAttribute('aria-hidden', 'false');
  lockScrollIfNeeded();

  // (선택) 포커스 이동
  const focusTarget = layer.querySelector('[autofocus], .modal-area, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusTarget) focusTarget.focus({ preventScroll: true });
}

function modalHidePop(id) {
  const layer = document.getElementById(id);
  if (!layer) return;
  layer.classList.remove('modal--active');
  layer.setAttribute('aria-hidden', 'true');
  lockScrollIfNeeded();
}

// ==========================
// Delegated events
// ==========================
// 열기: data-modal-open="modalId"
document.addEventListener('click', function (e) {
  const opener = e.target.closest('[data-modal-open]');
  if (!opener) return;
  e.preventDefault();
  const targetId = opener.getAttribute('data-modal-open');
  modalShowPop(targetId);
});

// 닫기: data-modal-close (딤/닫기/취소 공통)
document.addEventListener('click', function (e) {
  const closer = e.target.closest('[data-modal-close]');
  if (!closer) return;
  e.preventDefault();
  const layer = closer.closest('.modal');
  if (layer && layer.id) modalHidePop(layer.id);
});

// 확인(Submit): data-modal-submit
document.addEventListener('click', function (e) {
  const submitBtn = e.target.closest('[data-modal-submit]');
  if (!submitBtn) return;
  e.preventDefault();

  // TODO: 여기서 실제 처리 로직 실행
  if (typeof showSnackbar === 'function') {
    showSnackbar('처리가 완료되었습니다.');
  }

  const layer = submitBtn.closest('.modal');
  if (layer && layer.id) modalHidePop(layer.id);
});

// ESC 닫기 (가장 위 모달부터)
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  const opened = Array.from(getOpenModals());
  if (opened.length === 0) return;
  const top = opened[opened.length - 1];
  if (top && top.id) modalHidePop(top.id);
});