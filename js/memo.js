const memoPosition = (() => {
  let left = 200;
  let top = 100;
  return {
    plusLeft() {
      return (left += 10);
    },
    plusTop() {
      return (top += 20);
    },
  };
})();

const createMemo1 = (memo) => {
  memo.style.display = "block"; // 숨기기했던 샘플 요소를 show
  memo.style.position = "absolute";
  memo.style.left = memoPosition.plusLeft() + "px";
  memo.style.top = memoPosition.plusTop() + "px";
  memo.style.zIndex = zIndex.increase(); //추가한 메모가 가장 위로

  memo.addEventListener("contextmenu", (event) => {
    event.stopPropagation(); // 메모 내부 클릭시엔 생성x
  });

  return memo;
};

window.onload = () => {
  const memoIcon = document.getElementsByClassName("memo_icon")[0];

  //더블클릭 - 새 메모창
  memoIcon.addEventListener("dblclick", () => {
    const copiedMemo = document
      .getElementsByClassName("memo")[0]
      .cloneNode(true);
    const newMemo = createMemo1(copiedMemo);
    const wrap = document.getElementsByClassName("wrap")[0];
    wrap.appendChild(newMemo);

    // 이벤트 등록
    deleteMemo(newMemo);
    dragMemo(newMemo);
    resizeMemo(newMemo);
  });
};
