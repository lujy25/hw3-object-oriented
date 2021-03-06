function getAllTables() {
	return document.getElementsByTagName("table");
}

function closure(table, col) {
	this.closure_event = function() {
		click_event(table, col);
	}
} 

function makeSortable(table) {
	var i, col;
	for (i = 0; i < table.rows[0].cells.length; i++) {
		/*通过闭包来完成事件绑定*/
		col = i;
		var test = new closure(table, col);
		table.rows[0].cells[i].onclick = test.closure_event;
	}
	return table;
}

function click_event(table, col, trs_num, cols_num) {
	var th = table.rows[0].cells[col];
	var trs_num = table.rows.length-1;
	var cols_num = table.rows[0].cells.length;
	 /*改变选中的标签的class，并将其他标签恢复class*/
	recovery_style(table, col, cols_num);  
	if (th.classList.contains('ascend')) {
		th.classList.remove('ascend');
		th.classList.add('descend');
	} else {
		th.classList.remove('descend');
		th.classList.add('ascend');
	}

	/*开始进行排序*/
	var is_ascend = (th.classList.contains('ascend'));    //决定进行升降序
	sort_table(table, col, is_ascend, trs_num);
}

function recovery_style(table, col, cols_num) {
	for (var index = 0; index < cols_num; index++) {
		if (index != col) {
			table.rows[0].cells[index].classList.remove("ascend");
			table.rows[0].cells[index].classList.remove("descend");
		}
	}
}

function sort_table(table, col, is_ascend, trs_num) {
	var i, j, temp;
	for (i = 1; i <= trs_num; i++) {
		for (j = 1; j <= trs_num-1; j++) {
			if (judge(table.rows[j].cells[col], table.rows[j+1].cells[col], is_ascend)) {
				swap(table.rows[j], table.rows[j+1]);
			}
		}
	}
}

/*判断是否需要改变位置*/
function judge(a, b, is_ascend) {

	var a_without_label = a.innerHTML.replace(/<.*?>/ig,"");
	var b_without_label = b.innerHTML.replace(/<.*?>/ig,"");

	/*先把该标签的HTML空格去除，以便下面正则表达式检查数字(sicily上的HTML某些数字左右是有空格的)*/
	var a_rm_white = a_without_label.replace(/(^\s+)|(\s+$)/g,"").replace(/\s/g,"");
	var b_rm_white = b_without_label.replace(/(^\s+)|(\s+$)/g,"").replace(/\s/g,"");
	/*用正则表达式来判断是否为数字(包括正负整数或浮点数)*/
	var re = /^(-?\d+)(\.\d+)?$/;
	if (re.test(a_rm_white)&&re.test(b_rm_white)) {
		if (is_ascend) {
			return parseFloat(a_rm_white) > parseFloat(b_rm_white);
		} else {
			return parseFloat(a_rm_white) < parseFloat(b_rm_white);
		}
	} else {
		if (is_ascend) {
			return a_without_label > b_without_label;
		} else {
			return a_without_label < b_without_label;
		}
	}
}

/*交换位置*/
function swap(a, b) {
	var temp = a.innerHTML;
	a.innerHTML = b.innerHTML;
	b.innerHTML = temp;
}

function getTableNum(table) {
	var tables = getAllTables();
	for (var i = 0; i < tables.length; i++) {
		if (tables[i] == table) return i;
	}
}


//先把table中的所有行复制
function getDataOfTable(table) {
	var dataArray = new Array();
	for (var i = 1; i < table.rows.length; i++) {
		dataArray.push(table.rows[i]);
	}
	return dataArray;
}


function makeFilterable(table) {
	var tabledata = getDataOfTable(table);

	//创建filter所需要输入框
	function addFilterInput(table) {
		var input = document.createElement('input');
		var parentNode = table.parentNode;
		var num = getTableNum(table);
		input.id = "table-filter-"+num;
		parentNode.insertBefore(input, table);
		return document.getElementById(input.id);
	}

	//删除table的所有行
	function empty_table() {
		var tablebody = table.getElementsByTagName('tbody')[0];
		var trs = table.getElementsByTagName('tr');
		var tempTr = [].slice.call(trs);
		var len = tempTr.length;
		for (var i = 1; i < len; i++) {
			tablebody.removeChild(tempTr[i]);
		}
	}

	//联合show_color使特定的字体可以突出
	function word_change(keyword, td) {
		var text = td.innerHTML;
		var newText = text.replace(keyword, ('<span>' + keyword + '</span>'));
		td.innerHTML = newText;
	}

	function show_color(table) {
		var all_keywords = table.getElementsByTagName('span');
		for (var i = 0; i < all_keywords.length; i++) {
			all_keywords[i].style.backgroundColor = "yellow";
		}
	}

	function filter_event() {
		var num = parseInt(this.id.replace("table-filter-", ""));
		var table = getAllTables()[num];
		var keyword = this.value;
		var matchRows = {};
		var matchTrs = [];
		for (var i = 0; i < tabledata.length; i++) {
			//在table原来的数据里进行判断操作
			var tempTr = tabledata[i].cloneNode(true);
			var allTd = tempTr.getElementsByTagName('td');
			for (var j = 0; j < allTd.length; j++) {
				if (allTd[j].innerHTML.indexOf(keyword) > -1) {
					word_change(keyword, allTd[j]);
					if (matchRows[i] == undefined) {
						matchRows[i] = tempTr;
					}
				}
			}
		}
		empty_table();
		var tablebody = table.getElementsByTagName('tbody')[0];
		for (var col in matchRows) {
			tablebody.appendChild(matchRows[col]);
		}
		show_color(table);
	}
	function init() {
		var input = addFilterInput(table);
		input.addEventListener('keyup', filter_event, false);
	}
	init();
	return table;
}

/*test
var test = getAllTables()[0];
test = makeSortable(makeFilterable(test));
*/