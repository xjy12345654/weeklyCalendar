
/**
 * 
 * @param {*} 
 */


 function weeklyCalendar(options) {
  var options = options || {};

  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      },
    });
    window.addEventListener("test", null, opts);
  } catch (e) {}


  let doc = document;

  let box = doc.getElementsByClassName("week_cal_box")[0];
  let move_num = -40;
  let flag = true;


  let content1 = doc.getElementById("content1");
  let con1_li = content1.getElementsByClassName("m_num_sty");

  let content2 = doc.getElementById("content2");
  let con2_li = content2.getElementsByClassName("m_num_sty");

  let content3 = doc.getElementById("content3");
  let con3_li = content3.getElementsByClassName("m_num_sty");

  let content4 = doc.getElementById("content4");
  let con4_li = content4.getElementsByClassName("m_num_sty");

  let content5 = doc.getElementById("content5");
  let con5_li = content5.getElementsByClassName("m_num_sty");

/**
 * odd 控制 哪些 ul变化
 * op2 控制 哪些 ul变化
 * start_x 记录触摸开始时的坐标 用来处理左右滑动判断
 */

  let odd = 1;
  let start_x;
  let op2 = true;

  let m_num_sty = box.getElementsByClassName("m_num_sty");

    //  初始化获取周日期
    let week_n = -1;              

    let sel_num=options["sel_tDate"];
    
    let get_time = sel_num ?new Date(sel_num) :new Date();

    let _today = new Date();
    let todytime = time_num_change(_today).date;//转换后当天日期
  
    let z_sel_num = time_num_change(get_time);//转换后指定日期
 
    getWeek(week_n, con3_li);
    getWeek(week_n - 7, con2_li, con5_li);
    getWeek(week_n + 7, con1_li, con4_li);
  

  let year_text = doc.getElementById("year_text");
  let month_text = doc.getElementById("month_text");

  year_text.textContent = z_sel_num.year;
  month_text.textContent = z_sel_num.month;
  

  /**
   * 转换日期时间  
   *  
   * @param {String} time  new date返回的日期格式 或日期字符串 如"2021-08-01"
   */

  function time_num_change(time) {
    
    let _time = new Date(time);
    let year = _time.getFullYear() //+ "-";
    let month = (_time.getMonth() + 1 < 10 ? "0" + (_time.getMonth() + 1) : _time.getMonth() + 1) //+ "-";
    let day = _time.getDate();
    let date = year+"-" + month+"-"+ day;
    // h = date.getHours() + ':';
    // m = date.getMinutes() + ':';
    // s = date.getSeconds();
    // return Y + M + D+h+m+s;
    return {
      year: year,
      month: month,
      day: day,
      date: date
    }
    
  }

  /**
   * 日期变化  用来控制每周显示的日期 (需转换)
   * @param {String} get_time 用户输入的日期
   * @param {Number} week_n  周的变量
   */
  function time_transform(get_time,week_n){
    var _week_num= week_n;
    var _t=get_time;
    var _time_stamp = new Date(_t.getTime() + 24 * 60 * 60 * 1000 * (_week_num - ((_t.getDay() + 6) % 7)));
    return  time_num_change(_time_stamp);
  }





/**
 * 
 * @param {Number} week_n 周的控制变量 
 * @param {object} el   (ul)元素 
 * @param {object} el1 (ul)元素
 */

  function getWeek(week_n, el, el1) {
    var week_n=week_n;

    if (el1 == undefined) {
      for (let i = 0; i < 7; i++) {
        week_n++;
       var _time=  time_transform(get_time,week_n);
        el[i].textContent = _time.day;
        el[i].setAttribute("data-date", _time.date);

      }

    } else {
      for (let i = 0; i < 7; i++) {
        week_n++;
        var _time= time_transform(get_time,week_n);
         el[i].textContent = _time.day;
         el1[i].textContent = _time.day
         el[i].setAttribute("data-date", _time.date);
         el1[i].setAttribute("data-date", _time.date);
      }

    }

  }


  box.addEventListener("touchstart", function (e) {

    start_x = e.touches[0].pageX;

    if (move_num == 0) {
      box.style = "transition:transform 0s;transform:translateX(-60%)";
      move_num = -60;
      op2 = false;
    } else if (move_num == -80) {
      box.style = "transition:transform 0s;transform:translateX(-20%)";
      move_num = -20;
      op2 = false;
    }
  },
    supportsPassive ? { passive: true } : false
  );


  box.addEventListener("touchmove", function (e) {

    if (flag) {

     let end_x = e.touches[0].pageX;
      if (start_x - end_x < 0) {

        week_n = week_n - 7;
        move_num = move_num + 20;
        box.style = "transition:transform 0.7s; transform:translateX(" + move_num + "%)";

        if (odd % 3 == 1 && op2) {
          getWeek(week_n - 7, con1_li, con4_li);

        }

        if (move_num == -40) {
          getWeek(week_n - 7, con2_li, con5_li);
          odd = 0;
          op2 = true;
          check_date(sel_num);
        }

        // 获取 每周星期一的 年份 月份
        var _time= time_transform(get_time,week_n+1);
        year_text.textContent = _time.year;
        month_text.textContent = _time.month;

      } else if (start_x - end_x > 0) {
        week_n = week_n + 7;
        move_num = move_num - 20;
        box.style = "transition:transform 0.7s; transform:translateX(" + move_num + "%)";

        if (odd % 3 == 1 && op2) {
          getWeek(week_n + 7, con2_li, con5_li);
        }

        if (move_num == -40) {
          getWeek(week_n + 7, con1_li, con4_li);
          op2 = true;
          odd = 0;
          check_date(sel_num);
        }

         // 获取 每周星期一的 年份 月份
        var _time= time_transform(get_time,week_n+1);
        year_text.textContent = _time.year;
        month_text.textContent = _time.month;

      }
      odd++;
      flag = false;
    }
  },
    supportsPassive ? { passive: true } : false
  );

  box.addEventListener("touchend", function () {
    if (move_num == 0) {
      getWeek(week_n - 7, con3_li);
      check_date(sel_num);
    } else if (move_num == -80) {
      getWeek(week_n + 7, con3_li);
      check_date(sel_num);
    }
    flag = true;
  });



  check_date(sel_num);

  /**
   * 用来控制匹配 指定查询日期的css样式
   * @param {*} sel_num 指定查询的日期 
   */


 
  function check_date(sel_num) {
     
    if (sel_num == undefined) {
      for (let i = 0; i < 7; i++) {
        var num1 = con3_li[i].getAttribute("data-date");
        num1 == todytime ? con3_li[i].className = "m_num_sty today" : con3_li[i].className = "m_num_sty";
      }

    } else {

      for (let i = 0, len = m_num_sty.length; i < len; i++) {

        let num1 = m_num_sty[i].getAttribute("data-date");
        num1 == z_sel_num.date ? m_num_sty[i].className = "m_num_sty selected_num" : m_num_sty[i].className = "m_num_sty";
        num1 == todytime ? m_num_sty[i].className = "m_num_sty today" : m_num_sty[i].classList.remove("today");
      }

    }

  }


  box.addEventListener("click",function(e){

    let target=e.target;
    if(target.tagName=="SPAN"){
     let s_date=  target.getAttribute("data-date");
     sel_num=s_date;
     z_sel_num = time_num_change(sel_num);


     year_text.textContent = z_sel_num.year;
     month_text.textContent = z_sel_num.month;

     check_date(sel_num);


     options["clickDate"] && options["clickDate"](z_sel_num);



  
    
    
    }
    
  });
 

 
  
 


}

