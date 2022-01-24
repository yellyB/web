// 드래그, 메모 생성시 상단으로 설정 위해
// (단순히 변수로 값을 관리하면 추후에 코드 양이 많아졌을때
//  해당 값이 의도치않게 변경되거나 하는 오류가 있을 수 있어
//  클로저로 관리)
const zIndex = (() => {
  let index = 1;
  return {
    increase() {
      return ++index;
    },
  };
})();

const createMemo = (memo, x, y) => {
  memo.style.position = "absolute";
  memo.style.left = x + "px";
  memo.style.top = y + "px";
  memo.style.zIndex = zIndex.increase(); //추가한 메모가 가장 위로

  memo.addEventListener("contextmenu", (event) => {
    event.stopPropagation(); // 메모 내부 클릭시엔 생성x
  });

  return memo;
};

// [이벤트 1] 메모 삭제
const deleteMemo = (memo) => {
  const closeBtn = memo.getElementsByClassName("btn_close")[0];
  closeBtn.onclick = () => {
    const parent = document.getElementsByClassName("wrap")[0];
    parent.removeChild(memo); // 부모 요소에서 메모 제거
  };
};

// [이벤트 2] 드래그
const dragMemo = (memo) => {
  const header = memo.getElementsByClassName("header")[0];
  // 헤더 클릭
  header.onmousedown = (event) => {
    // 요소크기-뷰포트 상대적 위치 구하기
    const shiftX = event.clientX - memo.getBoundingClientRect().left;
    const shiftY = event.clientY - memo.getBoundingClientRect().top;

    // 인덱스를 최상위로 설정
    memo.style.zIndex = zIndex.increase();

    // 마우스 이동에 따라 요소 함께 이동
    // (1회 사용하는 함수이기때문에 즉시 실행 함수 사용)
    const onMouseMove = (event) => {
      ((pageX, pageY) => {
        memo.style.left = pageX - shiftX + "px";
        memo.style.top = pageY - shiftY + "px";
      })(event.pageX, event.pageY);
    };

    document.addEventListener("mousemove", onMouseMove);

    // 드롭 - 마우스 이동 이벤트 리스너 제거
    memo.onmouseup = () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  };
};

// [이벤트 3] 크기조절
const resizeMemo = (memo) => {
  const sizeBtn = memo.getElementsByClassName("btn_size")[0];
  const textarea = memo.getElementsByClassName("textarea")[0];
  // 사이즈조절 클릭
  sizeBtn.onmousedown = (event) => {
    // 요소크기-뷰포트 상대적 위치 구하기
    const shiftX = event.clientX - memo.getBoundingClientRect().left;
    const shiftY = event.clientY - memo.getBoundingClientRect().top;

    //클릭한 위치의 좌표
    const x = event.x;
    const y = event.y;
    const onMouseMove = (event) => {
      ((pageX, pageY) => {
        const newX = x - pageX + 20; //증가분 계산
        const newY = y - pageY + 30;

        textarea.style.width = shiftX - newX + "px"; //원래좌표+증가분
        textarea.style.height = shiftY - newY + "px";
      })(event.pageX, event.pageY);
    };

    document.addEventListener("mousemove", onMouseMove);

    // 드롭 - 마우스 이동 이벤트 리스너 제거
    memo.onmouseup = () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  };
};

window.onload = () => {
  const prevMemo = localStorage.getItem("memos");
  // starage에 메모가 있으면 가져오고 없으면 기본 메모 띄우기
  if (prevMemo !== "") {
    const wrap = document.getElementsByClassName("wrap")[0];
    wrap.innerHTML = prevMemo; //storage에서 가져온 string -> html
  }

  // 메모들에 이벤트 등록
  const memos = document.getElementsByClassName("memo");
  for (const memo of memos) {
    deleteMemo(memo);
    dragMemo(memo);
    resizeMemo(memo);

    memo.addEventListener("contextmenu", (event) => {
      event.stopPropagation(); // 메모 내부 클릭시엔 생성x
    });
  }
};

// 종료 전 로컬스토리지에 정보 저장
window.onbeforeunload = () => {
  if (document.getElementsByClassName("memo").length > 0) {
    const wrap = document.getElementsByClassName("wrap")[0];
    const memos = wrap.innerHTML; // html -> string
    localStorage.setItem("memos", memos);
  } else {
    // 현재 창에 메모가 없으면 빈 값 저장
    localStorage.setItem("memos", "");
  }
};

// 새 메모 추가
const onContextMenu = (event) => {
  event.preventDefault(); // 버블링 방지

  // 기존 메모 복사
  const copiedMemo = document.getElementsByClassName("memo")[0].cloneNode(true);

  // 우클릭 좌표를 새로 추가할 메모에 적용
  const x = event.x;
  const y = event.y;

  const newMemo = createMemo(copiedMemo, x, y);

  // wrap에 새메모 추가
  const wrap = document.getElementsByClassName("wrap")[0];
  wrap.appendChild(newMemo);

  deleteMemo(newMemo);
  dragMemo(newMemo);
  resizeMemo(newMemo);
};

//우클릭 이벤트 - 메모 추가
document.addEventListener("contextmenu", onContextMenu);
