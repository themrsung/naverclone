// 변수 선언
// gnd
const $gnb = $("#gnb");
// ly_service
const isLyService = $(".ly_service");
// btn_more
const $btn_more = $("#gnb .btn_more");

// 더보기 버튼 클릭시
// 더보기 => 접기, 접기 => 더보기 로 텍스트 변경
// ly_service 영역 보여주기
$btn_more.on("click", function () {
  const $moreBtn = $(this);
  const btnString = $moreBtn.text();
  if (btnString === "더보기") {
    $moreBtn.text("접기");
  } else {
    $moreBtn.text("더보기");
  }

  // ly_open 클래스로 더보기 영역 제어
  // gnb toggle class ly_open
  $gnb.toggleClass("ly_open");
});

// swpier 함수 실행

swiper("#NM_WEATHER .eg-flick-viewport", {
  mode: "autoVertical",
  delay: 3000,
});