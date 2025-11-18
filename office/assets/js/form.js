/** 
  Jeong A Ra JS
  http://jeongara.com/
**/
/*

        폼 JS

*/
// ==========================
// 더보기 버튼 → 드롭다운 메뉴
// ==========================
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-more');
  if (btn) {
    const inner = btn.closest('.more-inner');
    inner?.classList.toggle('is-open');
    return;
  }

  // 바깥 클릭 → 닫기
  document.querySelectorAll('.more-inner.is-open').forEach(el => {
    if (!el.contains(e.target)) el.classList.remove('is-open');
  });
});


// ==========================
// 이메일 영어로 입력
// ==========================
const kor2eng = {
  'ㅂ': 'q', 'ㅈ': 'w', 'ㄷ': 'e', 'ㄱ': 'r', 'ㅅ': 't', 'ㅛ': 'y', 'ㅕ': 'u', 'ㅑ': 'i', 'ㅐ': 'o', 'ㅔ': 'p',
  'ㅁ': 'a', 'ㄴ': 's', 'ㅇ': 'd', 'ㄹ': 'f', 'ㅎ': 'g', 'ㅗ': 'h', 'ㅓ': 'j', 'ㅏ': 'k', 'ㅣ': 'l',
  'ㅋ': 'z', 'ㅌ': 'x', 'ㅊ': 'c', 'ㅍ': 'v', 'ㅠ': 'b', 'ㅜ': 'n', 'ㅡ': 'm'
};
const emailInput = document.getElementById('f_email');
emailInput?.addEventListener('input', function () {
  let converted = '';
  for (let char of this.value) {
    if (kor2eng[char]) {
      converted += kor2eng[char]; // 한글이면 영문으로 치환
    } else {
      converted += char; // 원래 영문, 숫자, 특수문자는 그대로
    }
  }
  this.value = converted;
});


// ==========================
// 연락처 입력 자동 하이픈
// ==========================
document.addEventListener('input', function (e) {
  if (!e.target.matches('.js-phone')) return;
  let v = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
  if (v.startsWith('02')) {
    v = v.slice(0, 10);
    if (v.length > 2 && v.length <= 5) v = v.slice(0, 2) + '-' + v.slice(2);
    else if (v.length > 5 && v.length <= 9) v = v.slice(0, 2) + '-' + v.slice(2, 5) + '-' + v.slice(5);
    else if (v.length > 9) v = v.slice(0, 2) + '-' + v.slice(2, 6) + '-' + v.slice(6, 10);
  } else {
    if (v.length > 3 && v.length <= 7) v = v.slice(0, 3) + '-' + v.slice(3);
    else if (v.length > 7) v = v.slice(0, 3) + '-' + v.slice(3, 7) + '-' + v.slice(7, 11);
  }
  e.target.value = v;
});


// ==========================
// 생년월일 자동 하이픈
// ==========================
document.addEventListener('input', function (e) {
  if (!e.target.matches('.js-birth')) return;
  let v = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
  if (v.length > 4 && v.length <= 6) v = v.slice(0, 4) + '-' + v.slice(4);
  else if (v.length > 6) v = v.slice(0, 4) + '-' + v.slice(4, 6) + '-' + v.slice(6, 8);
  e.target.value = v;
});


// ==========================
// 파일첨부
// ==========================
document.querySelectorAll('.form-filebox').forEach((box) => {
  const previewWrap = box.querySelector('.form-filebox');
  const preview = box.querySelector('.int-fileimg');
  if (!preview) return;

  // 기본 이미지 요소/경로 확보
  const baseImg = preview.querySelector('img');
  const placeholderSrc = baseImg ? baseImg.getAttribute('src') : '';

  // 숨은 파일 인풋이 없으면 동적 생성
  let fileInput = box.querySelector('input[type="file"].upload-hidden');
  if (!fileInput) {
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.className = 'upload-hidden';
    fileInput.style.display = 'none';
    box.appendChild(fileInput);
  }

  // 삭제 버튼 없으면 만들어 둠
  let removeBtn = preview.querySelector('.btn-file-remove');
  if (!removeBtn) {
    removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-file-remove';
    removeBtn.setAttribute('aria-label', '첨부파일 삭제');
    removeBtn.style.display = 'none';
    preview.appendChild(removeBtn);
  }

  // 미리보기 클릭 → 파일선택 (삭제버튼 클릭은 제외)
  preview.addEventListener('click', (e) => {
    if (e.target.closest('.btn-file-remove')) return;
    fileInput.click();
  });

  // 파일 선택 시: 이미지 교체 + 상태 표시
  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      // 선택 취소 시 아무 것도 안 함
      return;
    }
    if (file.type && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      if (baseImg) {
        baseImg.src = url; // 기존 <img>만 교체
        baseImg.onload = () => URL.revokeObjectURL(url);
      }
      preview.classList.add('has-file');
      removeBtn.style.display = 'block';
    } else {
      // 이미지가 아니면 초기화
      fileInput.value = '';
      if (baseImg && placeholderSrc) baseImg.src = placeholderSrc;
      preview.classList.remove('has-file');
      removeBtn.style.display = 'none';
    }
  });

  // 삭제 버튼 → 파일값 초기화 + 기본 이미지 복구
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // 클릭 시 파일선택창 안 뜨게
    fileInput.value = '';
    if (baseImg && placeholderSrc) baseImg.src = placeholderSrc;
    preview.classList.remove('has-file');
    removeBtn.style.display = 'none';
  });
});


// ==========================
// 사용 select 변경 시 스낵바 노출
// ==========================
document.addEventListener('DOMContentLoaded', () => {
  const useOnOff = document.getElementById('use_onoff');
  if (!useOnOff) return;

  useOnOff.addEventListener('change', () => {
    const value = useOnOff.options[useOnOff.selectedIndex].value;
    if (value && typeof showSnackbar === 'function') {
      showSnackbar(`${value}으로 변경되었습니다.`);
    }
  });
});


// ==========================
// 상세 버튼 토글
// ==========================
document.addEventListener('click', function (e) {
  if (!e.target.matches('.btn-form-toggle')) return;
  e.target.classList.toggle('is-active');
});


// ==========================
// textarea 자동 높이 조절 (최대 82px)
// ==========================
document.addEventListener('input', function (e) {
  if (!e.target.matches('.int-title')) return;
  const el = e.target;

  // 기본 높이 리셋 후 scrollHeight 측정
  el.style.height = '58px';
  const newHeight = Math.min(el.scrollHeight, 58);

  el.style.height = newHeight + 'px';
});


// ==========================
// 뒤로가기
// ==========================
document.addEventListener('click', function (e) {
  const backBtn = e.target.closest('.btn-back');
  if (!backBtn) return;

  // 2뎁스 내부면 여기선 무시 (위 2뎁스 코드가 처리)
  if (backBtn.closest('.details-2depth')) return;

  // ↓ 여기부터는 1뎁스 뒤로 로직
  e.preventDefault();
  closePanel();
  tbodyWrap?.querySelectorAll('.tr-infos.is-active').forEach(el => el.classList.remove('is-active'));
});


// ==========================
// form-create 필수값 체크 → 저장버튼 활성/비활성
// ==========================
document.addEventListener('DOMContentLoaded', () => {
  // 이 페이지에 있는 모든 등록 폼을 커버
  document.querySelectorAll('.popup-details .form-view.form-create form').forEach((form) => {
    const submitBtn = form.querySelector('.btn-form-submit');
    if (!submitBtn) return;

    // 시작은 확실히 비활성
    submitBtn.disabled = true;
    submitBtn.classList.add('disabled');

    const isSelectEmpty = (sel) => {
      const val = (sel.value ?? '').trim();
      const label = sel.options[sel.selectedIndex]?.text?.trim() ?? '';
      // 값이 비었거나, 라벨이 '선택'류면 미입력으로 처리
      return val === '' || /선택/i.test(label);
    };

    const isEmpty = (el) => {
      if (el.tagName === 'SELECT') return isSelectEmpty(el);
      return (el.value ?? '').trim() === '';
    };

    const validate = () => {
      const requiredEls = form.querySelectorAll('[required]');
      // 필수값이 하나라도 있고, 전부 채워졌을 때만 활성화
      const hasRequired = requiredEls.length > 0;
      const allFilled = hasRequired && Array.from(requiredEls).every(el => {
        if (el.disabled) return true;   // 비활성화된 필드는 패스
        if (el.type === 'file') return true; // 파일은 여기선 패스(별도 처리 시 추가)
        return !isEmpty(el);
      });
      submitBtn.disabled = !allFilled;
      submitBtn.classList.toggle('disabled', !allFilled);
    };

    // 변화에 반응
    form.addEventListener('input', validate);
    form.addEventListener('change', validate);
    form.addEventListener('keyup', validate);

    // 초기 1회 체크
    validate();
  });
});