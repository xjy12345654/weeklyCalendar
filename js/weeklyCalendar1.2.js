/**
 *
 * @param {*}
 */

function weeklyCalendar(options) {
	var options = options || {};

	// var doc = document;
	var week_wrapper_box = document.getElementsByClassName("week_wrapper_box")[0]; //整体外层
	var year_monthcec1 = week_wrapper_box.querySelector(".year_monthcec1"); //头部日期文本
	var week_cal_wrapper =
		week_wrapper_box.getElementsByClassName("week_cal_wrapper")[0]; //日期列表外层
	var box = week_wrapper_box.getElementsByClassName("week_cal_box")[0]; //日期列表box

	// var week_wrapper_box_width = week_wrapper_box.offsetWidth;
	var week_wrapper_box_width = week_wrapper_box.offsetWidth; //整体外层宽度

	var move_step = -(week_wrapper_box_width * 2); //滑动步长

	// 文档结构固定 可以使用querySelector选择器 来获取静态的结构 来进行循环操作
	var ul_content_arr = box.querySelectorAll(".week_content_grid");
	var move_border = 50; //  滑动距离边界  超过此值滚动到下一位置
	var curr_lindex = 0; //当前列表索引
	var touch_point_len = 0; //触摸点数量
	var sel_date = options["sel_date"];
	sel_date = sel_date ? new Date(sel_date) : new Date(); //选中日期
	var sel_date_obj = time_num_change(sel_date); //转换后当天日期
	var today_date_obj = time_num_change(new Date()); //转换后的今天日期
	var sel_da_year = sel_date_obj.year;
	var sel_da_month = sel_date_obj.month;
	var sel_da_day = sel_date_obj.day;
	year_monthcec1.textContent = format_date(
		sel_da_year,
		sel_da_month,
		sel_da_day
	);
	var week_n = -1;
	box.style = `transition:transform 0s; transform:translateX(${move_step}px)`;
	create_week_dom(ul_content_arr[0]);
	create_week_dom(ul_content_arr[1]);
	create_week_dom(ul_content_arr[2]);
	create_week_dom(ul_content_arr[3]);
	create_week_dom(ul_content_arr[4]);
	getWeek(week_n, ul_content_arr[2].children, "");
	getWeek(week_n - 7, ul_content_arr[1].children, ul_content_arr[4].children);
	getWeek(week_n + 7, ul_content_arr[0].children, ul_content_arr[3].children);

	function create_week_dom(el) {
		var doc = document;
		var fragment = doc.createDocumentFragment();
		for (var i = 0; i < 7; i++) {
			var li = doc.createElement("li");
			li.className = "month_num";
			li.textContent = "1";
			fragment.appendChild(li);
		}
		el.appendChild(fragment);
	}

	function getWeek(week_n, el, el1) {
		for (var i = 0; i < 7; i++) {
			week_n++;
			// console.log(sel_date);
			var _time = time_transform(sel_date, week_n);
			// console.log(_time);
			var el_c = el[i];
			el_c.textContent = _time.day;
			el_c.setAttribute("data-date", _time.date);

			el_c.className = "month_num";
			// if (  _time.date == today_date_obj.date) {
			//   el_c.className = "month_num today";
			//   console.log(222);
			// } else if (_time.date == sel_date_obj.date) {
			//   console.log(111);
			//   el_c.className = "month_num selected_num";
			// }

			if (_time.date == sel_date_obj.date) {
				el_c.className = "month_num selected_num";
			} else if (_time.date == today_date_obj.date) {
				el_c.className = "month_num today";
			}

			if (el1) {
				var el_c1 = el1[i];
				el_c1.textContent = _time.day;
				el_c1.setAttribute("data-date", _time.date);
				el_c1.className = "month_num";

				if (_time.date == sel_date_obj.date) {
					el_c1.className = "month_num selected_num";
				} else if (_time.date == today_date_obj.date) {
					el_c1.className = "month_num today";
				}
			}
		}
	}

	function time_transform(get_time, week_n) {
		// var _week_num = week_n;
		// var _t = get_time;
		var _time_stamp = new Date(
			get_time.getTime() +
			24 * 60 * 60 * 1000 * (week_n - ((get_time.getDay() + 7) % 7))
		);
		// console.log(time_num_change(_time_stamp));
		return time_num_change(_time_stamp);
	}

	function time_num_change(time) {
		var _time = new Date(time);
		var year = _time.getFullYear();
		var month = _time.getMonth() + 1;
		var day = _time.getDate();

		return {
			year: year,
			month: month,
			day: day,
			date: year + "/" + month + "/" + day,
		};
	}


	document.body.addEventListener('touchmove', (e) => {
		e.preventDefault();
	}, {
		passive: false
	});

	box.addEventListener(
		"touchstart",
		function(e) {
			touch_point_len = e.touches.length;
			if (touch_point_len == 1) {
				start_x = e.touches[0].pageX;
				start_y = e.touches[0].pageY;
				if (curr_lindex == -2) {
					move_step = -(week_wrapper_box_width * 3);
					box.style = `transition:transform 0s;transform:translateX(${move_step}px)`;
					curr_lindex = 1;
				} else if (curr_lindex == 2) {
					move_step = -week_wrapper_box_width;
					box.style = `transition:transform 0s;transform:translateX(${move_step}px)`;
					curr_lindex = -1;
				}
			}
			// else {
			//   e.preventDefault();
			// }
		}, {
			passive: true
		}
	);

	box.addEventListener(
		"touchmove",
		function(e) {

			touch_point_len = e.touches.length;
			// doc.getElementById("box").textContent ="move:"+ touch_point_len;
			if (touch_point_len == 1) {
				// var _move_x = start_x - e.changedTouches[0].pageX;
				box.style = ` transform:translateX(${
          move_step - (start_x - e.touches[0].pageX)
        }px)`;
			}
		}, {
			passive: true
		}
	);

	box.addEventListener("touchend", function(e) {
		// if (touch_point_len != 1) {
		//   e.preventDefault();
		//   return;
		// }
		if (touch_point_len == 1) {
			var _res_move = start_x - e.changedTouches[0].pageX;
			// var _res_movey = start_y - e.changedTouches[0].pageY;
			// console.log(_res_movey);
			// console.log(week_cal_wrapper_height);

			if (Math.abs(_res_move) > move_border) {
				if (_res_move < -move_border) {
					move_step = move_step + week_wrapper_box_width;
					curr_lindex--;
					week_n = week_n - 7;
					if (curr_lindex == -1) {
						getWeek(
							week_n - 7,
							ul_content_arr[0].children,
							ul_content_arr[3].children
						);
					} else if (curr_lindex == -2) {
						getWeek(week_n - 7, ul_content_arr[2].children, "");
					} else if (curr_lindex == 0) {
						getWeek(
							week_n - 7,
							ul_content_arr[1].children,
							ul_content_arr[4].children
						);
					}
				} else if (_res_move > move_border) {
					move_step = move_step - week_wrapper_box_width;
					curr_lindex++;
					week_n = week_n + 7;
					if (curr_lindex == 1) {
						getWeek(
							week_n + 7,
							ul_content_arr[1].children,
							ul_content_arr[4].children
						);
					} else if (curr_lindex == 2) {
						getWeek(week_n + 7, ul_content_arr[2].children, "");
					} else if (curr_lindex == 0) {
						getWeek(
							week_n + 7,
							ul_content_arr[0].children,
							ul_content_arr[3].children
						);
					}
				}
			}

			var _time = time_transform(sel_date, week_n + 2);
			var ac_list = ul_content_arr[curr_lindex + 2].children;
			for (var i = 0; i < 7; i++) {
				if (ac_list[i].getAttribute("data-date") == sel_date_obj.date) {
					_time.day = sel_date_obj.day;
				}
			}

			// console.log(_time);
			year_monthcec1.textContent = format_date(
				_time.year,
				_time.month,
				_time.day
			);
			box.style = `transition:transform  0.5s; transform:translateX(${move_step}px)`;
		}
	});

	function format_date(year, month, day) {
		return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
	}

	box.addEventListener("click", function(e) {
		var target = e.target;
		if (target.tagName == "LI") {
			var s_date = target.getAttribute("data-date");
			// sel_date = new Date(s_date) ;
			// console.log(new Date(s_date));
			sel_date_obj = time_num_change(s_date);

			// console.log(curr_lindex);
			year_monthcec1.textContent = format_date(
				sel_date_obj.year,
				sel_date_obj.month,
				sel_date_obj.day
			);

			// console.log(active_content);
			var con_li = box.getElementsByClassName("month_num");
			var len = con_li.length;
			for (var i = 0; i < len; i++) {
				var con_d = con_li[i];
				con_d.classList.remove("selected_num");
				var con_d_date = con_d.getAttribute("data-date");
				// con_d_date == today_date_obj.date
				//   ? (con_d.className = "month_num today")
				//   : " ";
				if (con_d_date == sel_date_obj.date) {
					con_d.className = "month_num selected_num";
				} else if (con_d_date == today_date_obj.date) {
					con_d.className = "month_num today";
				}
			}
			con_li = null;
			target.className = "month_num selected_num";
			options["clickDate"] && options["clickDate"](sel_date_obj);
		}
	});

	function init(sel_idate) {
		move_step = -(week_wrapper_box_width * 2);
		box.style = `transition:transform 0s; transform:translateX(${move_step}px)`;
		sel_date = sel_idate ? new Date(sel_idate) : new Date();
		sel_date_obj = time_num_change(sel_date);
		curr_lindex = 0;
		week_n = -1;
		var sel_year = sel_date_obj.year;
		var sel_month = sel_date_obj.month;
		var sel_day = sel_date_obj.day;
		// _todytime_month = sel_date_obj.month;
		year_monthcec1.textContent = format_date(sel_year, sel_month, sel_day);
		getWeek(week_n, ul_content_arr[2].children, "");
		getWeek(week_n - 7, ul_content_arr[1].children, ul_content_arr[4].children);
		getWeek(week_n + 7, ul_content_arr[0].children, ul_content_arr[3].children);
	}

	return {
		init
	}

}