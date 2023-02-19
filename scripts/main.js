
var msPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds per day
var solar_year = 0
var solar_month = 0
var solar_day = 0



function initArray() {
	this.length = initArray.arguments.length
	for (var i = 0; i < this.length; i++)
		this[i + 1] = initArray.arguments[i]
}


var goldTitles = new initArray("عنوان", "تاریخ خرید", "مقدار / گرم", "قیمت خرید", "گرم خرید", "گرم فروش", "آورده - فرخ", "آورده - آرمان", "سهم - فرخ",
	"سهم - آرمان", "مثقال آبشده نقدی", "پیش بینی نرخ سال", "فاکتور", "طلای کیوان");

var weekday = new initArray("يکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه");
var solar_days_of_month = new initArray(0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30);
var christ_names_of_month = new initArray("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

var myTable = document.getElementById('dateTimeTable');


function calcul_solar_date(today_date) {
	var days = 0
	var kabiseh = 0
	var i = 0

	days = Math.ceil((today_date.getTime() / msPerDay)) + 286
	solar_year = 48
	for (i = 1; i < 1000; i++) {
		if (i % 4 == 0)
			kabiseh = 1
		else
			kabiseh = 0

		if (days > 365 + kabiseh) {
			solar_year += 1
			days -= 365 + kabiseh
		}
		else
			break
	}

	solar_month = 0
	for (i = 1; i <= 12; i++) {
		if (solar_days_of_month[i] < days) {
			solar_month += 1
			days -= solar_days_of_month[i]
		}
	}
	solar_day = days

}




function moveover(txt) {
	window.status = txt;
	setTimeout("erase()", 1000);
}
function erase() {
	//window.status="";
	today = new Date()
	calcul_solar_date(today)
	if (solar_year > 99) {
		solar_year = 1400 + solar_year % 100;
	}
	else {
		solar_year += 1300;
	}
	moveover("  " + weekday[today.getDay() + 1] + "     " + today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getYear() + "     " + solar_year + "/" + solar_month + "/" + solar_day + "     " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds())
	var myTable = document.getElementById('dateTimeTable');
//	myTable.rows[0].cells[1].innerHTML = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//	document.form1.Time.value = "ساعـت :   " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
	myTable.rows[1].cells[1].innerHTML = weekday[today.getDay() + 1] + "     " + solar_year + "/" + solar_month + "/" + solar_day;
	var myYear = today.getYear();
	if (myYear > 99) {
		myYear = 2000 + myYear % 100;
	}
	else {
		myYear += 1900;
	}
	myTable.rows[2].cells[1].innerHTML = myYear + "/" + (today.getMonth() + 1) + "/" + today.getDate();
}

for (var i = 0; i < goldTitles.length; i++) { 
	myTable.rows[i + 3].cells[0].innerHTML = goldTitles[i+1];
}




function calcul_distant_a_solar_date_from_48(year, month, day, result) {
	var days = 0
	var kabiseh = 0
	var i = 0
	var base_year = 48
	var days_negative = 0
	var date_year = year.value
	var date_month = month.value
	var date_day = day.value


	if (date_year < 0 || date_year > 99) {
		alert("(خطا در ورود سال شمسي(0..99")
		return
	}

	if (date_month < 1 || date_month > 12) {
		alert("(خطا در ورود ماه شمسي(1..12")
		return
	}



	if (date_day < 1 || (date_month < 7 && date_day > 31) || (date_month > 6 && date_day > 30) || ((date_year % 4) != 3 && date_month == 12 && date_day == 30)) {
		alert("خطا در ورود روزشمسي")
		return
	}



	while (date_year < base_year) {
		base_year -= 4
		days_negative += 1461
	}


	if (date_year != base_year) {
		for (i = 1; i < 1000 && date_year > base_year; i++) {
			if (i % 4 == 0)
				kabiseh = 1
			else
				kabiseh = 0
			days += 365 + kabiseh
			base_year += 1
		}
	}

	if (days_negative > 0)
		days -= days_negative + 1

	for (i = 1; i <= 12; i++) {
		if (i <= date_month)
			days += solar_days_of_month[i]
		else
			break
	}

	days += Math.floor(date_day)
	result.value = days


}


function calcul_distant_2_solar_date(year1, month1, day1, result1, year2, month2, day2, result2) {

	calcul_distant_a_solar_date_from_48(year1, month1, day1, result1)

	calcul_distant_a_solar_date_from_48(year2, month2, day2, result2)

}

function convert_solar_2_christ(solar_year, solar_month, solar_day, christ_year, christ_month, christ_day, christ_day_of_weak) {

	var days = 0
	var back_year = 0
	var front_day_week = 0

	while (solar_year.value <= 48) {
		solar_year.value = Math.floor(solar_year.value) + 4
		back_year -= 4
		front_day_week += 2
	}

	calcul_distant_a_solar_date_from_48(solar_year, solar_month, solar_day, document.form1.dist1_from_48)
	solar_year.value = Math.floor(solar_year.value) + back_year

	days = document.form1.dist1_from_48.value - 287

	days *= msPerDay

	christ_date = new Date(days)

	christ_year.value = "سال    " + (christ_date.getFullYear() + back_year)
	christ_month.value = "ماه    " + (christ_date.getMonth() + 1) + " *****  " + christ_names_of_month[christ_date.getMonth() + 1]
	christ_day.value = "روز    " + christ_date.getDate()


	christ_day_of_weak.value = weekday[((christ_date.getDay() + front_day_week) % 7) + 1]
	//	christ_day_of_weak.value = (front_day_week)%7

}

//var myTable = document.getElementById('dateTimeTable');
//myTable.rows[0].cells[0].innerHTML = 'آرمان';
