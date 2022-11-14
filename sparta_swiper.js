// swiper 구형
// 네이버에선 jQuery 기반의 egjs 를 사용
// 우리는 직접 구현
// 참고 링크 ( https://d2.naver.com/helloworld/8618093 )

function swiper(selector, options = {}) {
  // 변수 선언
  const $eg_flick_viewports = $(selector);

  $eg_flick_viewports.each((index, eg_flick_viewport) => {
    const $eg_flick_viewport = $(eg_flick_viewport);
    const $eg_flick_camera = $eg_flick_viewport.find(".eg-flick-camera");
    const eg_flick_panel_length = $eg_flick_viewport.find(".eg-flick-panel").length;
    // eg-flick-panel-now 클래스 가 붙은 eg-flick-panel 위치 
    let panel_now_index = 0; 
    // 다음, 이전 버튼
    const $eg_flick_btns = $eg_flick_viewport.find('.eg-flick-btn');
    // 총페이지 버튼
    const $eg_flick_total = $eg_flick_viewport.find('.eg-flick-total');
    // 현재 페이지 버튼
    const $eg_flick_current = $eg_flick_viewport.find('.eg-flick-current');
    // 총 페이지
    let totalPage = eg_flick_panel_length;
    // 현재 페이지 
    let currentPage = 1;
 
    // eg-flick-camera_width
    const eg_flick_camera_width = $eg_flick_camera.width();
    // eg-flick-camera_height
    const eg_flick_camera_height = $eg_flick_camera.height();

    // 옵션 설정
    // 모드 horizon(디폴트), autoVertical
    // 시간 기본 5초
    options = Object.assign(
      {
        mode: "horizon",
        delay: 5000,
        time: 500,
        width: eg_flick_camera_width / eg_flick_panel_length,
        height: eg_flick_camera_height,
        btnType: null,
      },
      options
    );

    // panel_now_index 계산 함수
    const getPanelNowIndex = () => {
      const $eg_flick_panel = $eg_flick_camera.find('.eg-flick-panel');
      // eg-flick-panel-now 클래스를 달지 않으면
      // 첫번째 panel 에 eg-flick-panel-now 클래스 부여
      const isPanelNow = $eg_flick_camera.find('.eg-flick-panel-now').length;
      if(!isPanelNow){
        $eg_flick_panel.first().addClass('eg-flick-panel-now');
        return ;
      }
      $eg_flick_panel.each((index, item) => {    
        if($(item).hasClass('eg-flick-panel-now')){
          panel_now_index = index;
        }
      })
    }

    // horizon 모드에선 getPanelNowIndex 실행
    if(options.mode === 'horizon'){
      // 최초 실행
      getPanelNowIndex();
    }

    // eg-flick-panel 의 첫 번째 패널을 맨뒤로
    // 혹은 마지막 패널을 맨 앞으로 이동시키는 함수 
    const changePanelPosition = (direction = 'first-to-last') => {
      if(direction === "first-to-last"){
        const $eg_flick_first_panel = $eg_flick_camera
          .find(".eg-flick-panel")
          .first();
        const copyElement = $eg_flick_first_panel.clone();
        $eg_flick_camera.append(copyElement);
        $eg_flick_first_panel.remove();
      }else{
        const $eg_flick_last_panel = $eg_flick_camera
          .find(".eg-flick-panel")
          .last();
        const copyElement = $eg_flick_last_panel.clone();
        $eg_flick_camera.prepend(copyElement);
        $eg_flick_last_panel.remove();
      }
    }

    const pageCountSetting = (current, total) => {
      if(current > total){
        currentPage = 1;
      }else if(current <= 0){
        currentPage = total;
      }
      $eg_flick_current.text(currentPage);
      $eg_flick_total.text(total);
    }

    const changePanelNow = (direction = 'next') => {
      if(direction === 'next'){
        const $eg_flick_panel_now = $eg_flick_camera.find('.eg-flick-panel-now');
        const $panel_now = $eg_flick_panel_now.siblings('.eg-flick-panel-now + .eg-flick-panel');
        const $eg_flick_panel = $eg_flick_camera.find('.eg-flick-panel');
        $eg_flick_panel.removeClass('eg-flick-panel-now');
        $panel_now.addClass('eg-flick-panel-now');
      }else if(direction === 'prev'){
        const $eg_flick_panel_now = $eg_flick_camera.find('.eg-flick-panel-now');
        const $panel_now = $eg_flick_panel_now.prev();
        const $eg_flick_panel = $eg_flick_camera.find('.eg-flick-panel');
        $eg_flick_panel.removeClass('eg-flick-panel-now');
        $panel_now.addClass('eg-flick-panel-now');
      }    
    }

    const autoVertical = () => {
      $eg_flick_camera.animate(
        {
          yAxis: `${options.height}`,
        },
        {
          step: function (now, fx) {
            $(this).css({ transform: `translate3d(0px, -${now}px, 0px)`});
          },
          duration: options.time,
          queue: false,
          complete: function () {
            changeFlickPanel();
          },
        },
        "linear"
      );
    };

    const horizon = () => {     
      $eg_flick_camera.animate(
        {
          xAxis: `${options.width}`,
        },
        {
          step: function (now, fx) {
            if(options.btnType == 'next'){
              // 오른쪽 버튼(next) 눌렸을때
              // eg-flick-panel-now 다음에 eg-flick-panel 있는지 확인 
              // 있으면 아무동작 안함 없으면 맨 처음 eg-flick-panel을 맨뒤로 옮겨줌
              const $eg_flick_panel_now = $eg_flick_camera.find('.eg-flick-panel-now');
              const isNextPanel = $eg_flick_panel_now.siblings('.eg-flick-panel-now + .eg-flick-panel').length; // 있으면 1 없으면 0
              if(!isNextPanel){
                changePanelPosition();
                const distance = (eg_flick_panel_length -2) * options.width * -1;
                $(this).css({ transform: `translate3d(${distance}px, 0px, 0px)`, transition: 'transform 0s' });
              }
            }else if(options.btnType == 'prev'){
              // 왼쪽 버튼(prev) 눌렸을때
              // eg-flick-panel-now 전에 eg-flick-panel 있는지 확인 
              // 있으면 아무동작 안함 없으면(eg-flick-panel 첫번째 엘리먼트에 eg-flick-panel-now 클래스가 있다면)
              // 맨 마지막 eg-flick-panel을 맨 앞으로 옮겨줌            
              const isPrevPanel = !($eg_flick_camera.find('.eg-flick-panel').first().hasClass('eg-flick-panel-now'));
              if(!isPrevPanel){
                changePanelPosition('last');
                $(this).css({ transform: `translate3d(-${now}px, 0px, 0px)`, transition: 'transform 0s' });
              }
            }else{
              // 시작하자 마자 현재 eg-flick-panel-now 화면 보여줌
              now = now * panel_now_index; 
              $(this).css({ transform: `translate3d(-${now}px, 0px, 0px)`, transition: 'transform 0s' });
              // 현재 페이지, 총 페이지 셋팅하는 함수 실행
              currentPage = panel_now_index + 1;
              pageCountSetting(currentPage, totalPage);
            }
          },
          duration: 0,
          queue: false,
          complete: function () {
            // btnType 이 없으면(처음 horizon 실행) 조기 리턴 
            if(!options.btnType) return;
            const btnType = options.btnType;
            changeFlickPanel(btnType);
          },
        },
        "linear"
      );
    }

    const changeFlickPanel = (btnType) => {
      if (options.mode === "horizon") {
        if(btnType == 'next'){
          // 오른쪽 버튼(next) 눌렸을때
          // 현재 페이지, 총 페이지 셋팅하는 함수 실행
          currentPage = currentPage + 1;
          pageCountSetting(currentPage, totalPage);
          // eg-flick-panel-now 변경해주는 함수 실행  
          changePanelNow();
          // 현재 eg-flick-panel-now 를 찾는함수 실행
          getPanelNowIndex();

          $eg_flick_camera.animate(
            {
              xAxis: `${options.width}`,
            },
            {
              step: function (now, fx) {
                now = now * panel_now_index;
                $(this).css({
                  transform: `translate3d(-${now}px, 0px, 0px)`,
                  transition: `transform ${options.time}ms` 
                });
              },
              queue: false,           
            },
            "linear"
          );         
        }else{
          // 왼쪽 버튼(prev) 눌렸을때
          // 현재 페이지, 총 페이지 셋팅하는 함수 실행
          currentPage = currentPage - 1;
          pageCountSetting(currentPage, totalPage);
          // eg-flick-panel-now 변경해주는 함수 실행  
          changePanelNow('prev');
          // 현재 eg-flick-panel-now 를 찾는함수 실행
          getPanelNowIndex();

          // 왼쪽 버튼(prev) 눌렸을때
          $eg_flick_camera.animate(
            {
              xAxis: `${options.width}`,
            },
            {
              step: function (now, fx) {
                now = now * panel_now_index * -1;
                $(this).css({
                  transform: `translate3d(${now}px, 0px, 0px)`,
                  transition: `transform ${options.time}ms` 
                });
              },
              queue: false,
            },
            "linear"
          );   
        }
      } else if (options.mode === "autoVertical") {
        // eg-flick-panel 의 첫 번째 패널을 맨뒤로
        changePanelPosition();
        
        // eg-flick-camera translate3d 를 초기화
        $eg_flick_camera.animate(
          {
            yAxis: "0",
          },
          {
            step: function (now, fx) {
              $(this).css({
                transform: `translate3d(0px, ${now}px, 0px)`,
              });
            },
            duration: 0,
            queue: false,
          },
          "linear"
        );
      }
    };

    // loopTimer = ()
    const loopTimer = (callback, time) => {
      setInterval(() => {
        callback();
      }, time);
    };

    switch (options.mode) {
      case "autoVertical":
        loopTimer(autoVertical, options.delay);
        break;
      default: // horizon
        // type 이 horizon 일때 css 설정
        // setHorizonCss();
        // eg-flick-panel-now 로 이동하기 위해서 시작시 
        // 바로 한번 실행 
        horizon();

        // 버튼이 눌리면 horizon 함수 실행
        $eg_flick_btns.on('click', function(e){
          // a태그 기본 동작 막기
          e.preventDefault();
          options.btnType = $(this).hasClass('eg-flick-btn-prev') ? 'prev' : 'next';
          // horizon 함수 실행
          horizon();
        });
    }
  });
}