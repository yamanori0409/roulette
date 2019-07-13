/**
 * 人数入力ラベルのフォーカス取得時移動処理
 *
 * @param {*} array
 * @returns
 */
$(document).ready(function () {
	$('.nice-textbox').blur(function () {
		if ($(this).val().length === 0) {
			$('.nice-label').removeClass("focus");
		}
		else { }
	})
		.focus(function () {
			$('.nice-label').addClass("focus")
		});
});

/**
 * 配列のランダム入れ替え処理
 *
 * @param {*} array
 * @returns
 */
function shuffle(array) {
	for (let i = array.length - 1; i >= 0; i--) {
		let rand = Math.floor(Math.random() * (i + 1));
		// 配列の数値を入れ替える
		[array[i], array[rand]] = [array[rand], array[i]]
	}
	return array;
}

/**
 * 円グラフ内にデータラベルを描画する処理
 *
 */
var dataLabelPlugin = {
	afterDatasetsDraw: function (chart, easing) {
		var ctx = chart.ctx;
		chart.data.datasets.forEach(function (dataset, i) {
			var meta = chart.getDatasetMeta(i);
			if (!meta.hidden) {
				meta.data.forEach(function (element, index) {
					ctx.fillStyle = 'rgb(0, 0, 0)';

					var fontSize = 32;
					var fontStyle = 'bold';
					var fontFamily = 'Helvetica Neue';
					ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

					var dataString = chart.data.labels[index];

					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';

					var padding = -15;
					var position = element.tooltipPosition();
					ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
				})
			}
		})
	}
}

/**
 * 円グラフのインスタンスを共有する為のグローバル変数・・・
 *
 */
var ctx = document.getElementById("myPieChart");

/**
 * 円グラフの生成（コンストラクタ的なやつ）
 *
 */
var myPieChart = new Chart(ctx, {
	type: 'pie',
	options: {
		title: {
			display: false,
		},
		legend: {
			display: false,
		},
		tooltips: {
			enabled: false
		}
	},
	plugins: [dataLabelPlugin],
});

/**
 * 円グラフの背景色配列
 *
 */
var backgroundColorList = [
	"#1abc9c",
	"#2ecc71",
	"#3498db",
	"#9b59b6",
	"#34495e",
	"#f1c40f",
	"#e67e22",
	"#e74c3c",
	"#ecf0f1",
	"#95a5a6", // ベースEnd
	"#37e3c1",
	"#62dc96",
	"#6eb5e5",
	"#b788cb"
];

/**
 * 円グラフ描画処理
 * 人数入力に応じた系統数で出力する
 */
function drawPieChart() {
	var indexValue = document.getElementById('indexCount').value;
	index = parseInt(indexValue);

	labelList = new Array();
	dataList = new Array();

	var jikan = new Date();
	var second = jikan.getSeconds();
	var largeIndex = -1;

	// 秒が3の倍数の場合、どれか一つの系統だけ大きくする。
	if (second % 3 == 0) {
		largeIndex = Math.floor(Math.random() * index);
	}

	// 指定要素数の配列を作成する。
	for (let i = 1; i <= index; i++) {
		labelList.push(i);
		if (i == largeIndex) {
			dataList.push(index);
		}
		else {
			dataList.push(1);
		}
	}
	// 配列をランダムに入れ替える。
	labelList = shuffle(labelList);
	//backgroundColorList = shuffle(backgroundColorList);

	// その都度グラフインスタンスを生成するとメモリリークを起こすらしいので、
	// 不本意ながらグローバル変数で管理・・・
	var ctx = document.getElementById("myPieChart");
	if (!myPieChart) {
		myPieChart = new Chart(ctx, options);
	}

	// myPieChart.type = 'pie'; 
	myPieChart.data = {
		labels: labelList,
		datasets: [{
			backgroundColor: backgroundColorList,
			data: dataList,
		}]
	}

	// スタートボタン表示処理
	var startButton = document.getElementById('btn-start');
	startButton.style.display = "inline-block";

	var moveElement = document.getElementById('triangle-mark');
	moveElement.style.backgroundColor = "darkgray";
	moveElement.style.left = '0px';
	moveElement.style.top = '0px';

	myPieChart.update();
}

/**
 * 円グラフの回りに三角形を描画する処理
 *
 */
function drawCirclePlot() {
	// 円周上を移動する要素
	var moveElement = document.getElementById('triangle-mark');

	moveElement.style.display = "block";
	//moveElement.style.left = '0px';
	//moveElement.style.top = '0px';
	//moveElement.update;

	// 円の角度
	var angle = 0;

	// 乱数を生成
	var index = Math.floor(Math.random() * 19);
	// 移動の増分（1.00~1.18で乱数を生成すればいい具合にばらける）
	var incremental = 1 + index * 0.01;

	var incrementalSpan = 0.0006; 

	// アニメーションの実行
	var timer = setInterval(function () {
		circumference();
	}, 4);
	
	// アニメーションの処理
	function circumference() {
		
		if (moveElement.style.backgroundColor != "black") {
			moveElement.style.backgroundColor = "black";
		}

		// 円の中心座標
		var centerX = myPieChart.canvas.offsetLeft + myPieChart.width / 2 - 10;
		var centerY = myPieChart.height / 2 + 10;
		
		// 円の半径
		var radius = myPieChart.height / 2;

		// 角度毎の円周上の座標を取得
		var moveX = Math.cos(Math.PI / 180 * angle) * radius + centerX;
		var moveY = Math.sin(Math.PI / 180 * angle) * radius + centerY;
		
		// 座標位置に移動
		moveElement.style.left = moveX + 'px';
		moveElement.style.top = moveY + 'px';

		// 角速度を加算するが、少しづつ加算する量を減らす。
		angle += incremental;
		
		if (incremental >= 0) {
			// 角速度を一定量ずつ減らしていくことで減速し、最終的に移動を止める。
			incremental -= incrementalSpan;
		}
		else {
			// 止まったら停止。
			clearInterval(timer);

			drawResult();
		}
	}

	function getAbs(radius) {
		if (radius < 0) {
			radius += 2 * Math.PI;
		}
		return radius;
	}

	function drawResult() {
		// 円の中心座標
		var centerX = myPieChart.canvas.offsetLeft + myPieChart.width / 2 - 10;
		var centerY = myPieChart.height / 2 + 10;
		
		// 円の半径
		var radius = myPieChart.height / 2;

		var moveElement = document.getElementById('triangle-mark');
					
		var r = Math.atan2(moveElement.style.top.replace("px", "") - centerY, moveElement.style.left.replace("px", "") - centerX);
		r = getAbs(r);
		console.log(r);

		// 円の接点から当たり判定を行う。
		var ctx = myPieChart.ctx;
		myPieChart.data.datasets.forEach(function (dataset, i) {
			var meta = myPieChart.getDatasetMeta(i);
			if (!meta.hidden) {
				meta.data.forEach(function (element, index) {
					var start = getAbs(element._model.startAngle);
					var end = getAbs(element._model.endAngle);
					
					if (end === 0) {
						end = 10;
					}

					console.log(element._model.label + ":" + start + " - " + end);

					if (start <= r && r <= end) {
						var resultElement = document.getElementById('result');
						resultElement.innerText = element._model.label;

						$.magnificPopup.open({
							items: {src: '#small-dialog'},
							type: 'inline', 
							closeBtnInside: true,
							//modal: true,
						}, 0);

					}
				})
			}
		})
	}
}

$(document).ready(function() {
	$('.popup-with-zoom-anim').magnificPopup({
		type: 'inline',

		fixedContentPos: false,
		fixedBgPos: true,

		overflowY: 'auto',

		closeBtnInside: true,
		preloader: false,
		
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in'
	});
 });