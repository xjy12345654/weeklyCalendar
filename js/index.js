function weeklyCalendar(options) {
  var options = options || {};

  var supportsPassive = false;
  if (Object.defineProperty) {
    var opts = Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      },
    });
    window.addEventListener("test", null, opts);
  }

  var doc = document;
  var box = doc.querySelector("#week_cal_box");

  var move_num = -40;
  var flag = true;
  var month_num = box.querySelectorAll(".month_num");
  var change_month_num = Array.prototype.slice.call(month_num);
  var con1_li = change_month_num.slice(0, 7);
  var con2_li = change_month_num.slice(7, 14);
  var con3_li = change_month_num.slice(14, 21);
  var con4_li = change_month_num.slice(21, 28);
  var con5_li = change_month_num.slice(28, 35);

  var year_text = doc.querySelector("#year_text");
  var month_text = doc.querySelector("#month_text");
  month_num = null;

  var odd = 1;
  var start_x;
  var op2 = true;
  var week_n = -1;
  var sel_num = options["sel_tDate"];
  var get_time = sel_num ? new Date(sel_num) : new Date();
  var _today = new Date();
  var todytime = time_num_change(_today).date; //转换后当天日期
  var z_sel_num = time_num_change(get_time); //转换后指定日期

  function init(sel_num) {
    box.style = "transition:transform 0s; transform:translateX(-40%)";
    get_time = sel_num ? new Date(sel_num) : new Date();
    z_sel_num = time_num_change(get_time);
    move_num = -40;
    flag = true;
    odd = 1;
    op2 = true;
    week_n = -1;
    year_text.textContent = z_sel_num.year;
    month_text.textContent = z_sel_num.month;
    getWeek(week_n, con3_li);
    getWeek(week_n - 7, con2_li, con5_li);
    getWeek(week_n + 7, con1_li, con4_li);
  }

  getWeek(week_n, con3_li);
  getWeek(week_n - 7, con2_li, con5_li);
  getWeek(week_n + 7, con1_li, con4_li);

  year_text.textContent = z_sel_num.year;
  month_text.textContent = z_sel_num.month;


  function time_num_change(time) {
    var _time = new Date(time);
    var year = _time.getFullYear();
    var month =
      _time.getMonth() + 1 < 10
        ? "0" + (_time.getMonth() + 1)
        : _time.getMonth() + 1;
    var day = _time.getDate();
    var date = year + "-" + month + "-" + day;

    return {
      year: year,
      month: month,
      day: day,
      date: date,
    };
  }

  function time_transform(get_time, week_n) {
    var _week_num = week_n;
    var _t = get_time;
    var _time_stamp = new Date(
      _t.getTime() + 24 * 60 * 60 * 1000 * (_week_num - ((_t.getDay() + 6) % 7))
    );
    return time_num_change(_time_stamp);
  }

  function getWeek(week_n, el, el1) {
    var week_n = week_n;
    if (el1 == undefined) {
      for (var i = 0; i < 7; i++) {
        week_n++;
        var _time = time_transform(get_time, week_n);
        var el_c = el[i];
        el_c.textContent = _time.day;
        el_c.setAttribute("data-date", _time.date);
        _time.date == z_sel_num.date
          ? (el_c.className = "month_num selected_num")
          : (el_c.className = "month_num");
        _time.date == todytime ? (el_c.className = "month_num today") : "";
      }

    } else {
      for (var i = 0; i < 7; i++) {
        week_n++;
        var _time = time_transform(get_time, week_n);
        var el_c = el[i];
        var el_c1 = el1[i];
        el_c.textContent = _time.day;
        el_c1.textContent = _time.day;
        el_c.setAttribute("data-date", _time.date);
        el_c1.setAttribute("data-date", _time.date);
        _time.date == z_sel_num.date
          ? (el_c.className = "month_num selected_num")
          : (el_c.className = "month_num");
        _time.date == z_sel_num.date
          ? (el_c1.className = "month_num selected_num")
          : (el_c1.className = "month_num");

        _time.date == todytime ? (el_c.className = "month_num today") : "";
        _time.date == todytime ? (el_c1.className = "month_num today") : "";
      }

    }
    _time=null;
 
  }



  box.addEventListener(
    "touchstart",
    function (e) {
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

  box.addEventListener(
    "touchmove",
    function (e) {
      if (flag) {
        let end_x = e.touches[0].pageX;
        if (start_x - end_x < 0) {
          week_n = week_n - 7;
          move_num = move_num + 20;

          box.style =
            "transition:transform 0.7s; transform:translateX(" +
            move_num +
            "%)";

          if (odd % 3 == 1 && op2) {
            getWeek(week_n - 7, con1_li, con4_li);
          }

          if (move_num == -40) {
            getWeek(week_n - 7, con2_li, con5_li);
            odd = 0;
            op2 = true;
          }

    
          var _time = time_transform(get_time, week_n + 1);
          year_text.textContent = _time.year;
          month_text.textContent = _time.month;
        } else if (start_x - end_x > 0) {
          week_n = week_n + 7;
          move_num = move_num - 20;

          box.style =
            "transition:transform 0.7s; transform:translateX(" +
            move_num +
            "%)";

          if (odd % 3 == 1 && op2) {
            getWeek(week_n + 7, con2_li, con5_li);
          }

          if (move_num == -40) {
            getWeek(week_n + 7, con1_li, con4_li);
            op2 = true;
            odd = 0;
          }

          var _time = time_transform(get_time, week_n + 1);
      
          year_text.textContent = _time.year;
          month_text.textContent = _time.month;
        }
        odd++;
        flag = false;
      }
    },
    supportsPassive ? { passive: true } : false
  );

  box.addEventListener("touchend", function (e) {
    if (move_num == 0) {
      getWeek(week_n - 7, con3_li);
    } else if (move_num == -80) {
      getWeek(week_n + 7, con3_li);
    }
    flag = true;
  });

  /**
   * 用来控制匹配 指定查询日期的css样式
   * @param {*} sel_num 指定查询的日期
   */

  box.addEventListener("click", function (e) {
    e.stopPropagation();
    var target = e.target;
    if (target.tagName == "LI") {
      var s_date = target.getAttribute("data-date");
      sel_num = s_date;

      z_sel_num = time_num_change(sel_num);
      year_text.textContent = z_sel_num.year;
      month_text.textContent = z_sel_num.month;

      // var con_li = box.getElementsByClassName("month_num");
      var con_li = box.querySelectorAll(".month_num");

      var len = con_li.length;
      for (var i = 0; i < len; i++) {
        var con_d = con_li[i];
        con_d.className = "month_num";
        var con_d_date = con_d.getAttribute("data-date");
        con_d_date == todytime ? (con_d.className = "month_num today") : " ";
      }

      con_li=null;

      target.className = "month_num selected_num";
      options["clickDate"] && options["clickDate"](z_sel_num);
    }
  });

  return { init };
}
