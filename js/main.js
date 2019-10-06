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

	// 秒が3の倍数の場合、どれか一つの系統だけ大きくする。（ネタ仕様）
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
	// 色をランダムにする。
	//backgroundColorList = shuffle(backgroundColorList);

	// その都度グラフインスタンスを生成するとメモリリークを起こすらしいので、
	// 不本意ながらグローバル変数で管理・・・
	var ctx = document.getElementById("myPieChart");
	if (!myPieChart) {
		myPieChart = new Chart(ctx, options);
	}

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

	// ルーレットの結果マーク設定
	var moveElement = document.getElementById('triangle-mark');
	moveElement.style.left = '0px';
	moveElement.style.top = '0px';
	moveElement.style.backgroundColor = "darkgray";

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

	// 円の角度
	var angle = 0;

	// 乱数を生成（1.00~1.18で乱数を生成すればいい具合にばらけるので）
	var index = Math.floor(Math.random() * 19);
	// 移動距離
    var incremental = 1 + index * 0.01;
    
    // 移動距離の増分を乱数から生成
    var incrementalIndex = Math.floor(Math.random() * 3);
	// 移動距離の増分
	var incrementalSpan = -0.0001 * (incrementalIndex + 4); 

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
		
		// 座標位置に結果マークを移動
		moveElement.style.left = moveX + 'px';
		moveElement.style.top = moveY + 'px';

		// 角速度を加算する。
		angle += incremental;
		
		if (incremental >= 0) {
			// 角速度に加算する値を一定量ずつ減らしていくことで減速し、最終的に移動を止める。
			incremental += incrementalSpan;
		}
		else {
			// 止まったら停止。
			clearInterval(timer);

			// 結果の描画処理
			drawResult();
		}
	}

	/**
	 * ラジアンを正の数値に補正
	 * @param {*} radius 
	 */
	function getAbs(radius) {
		if (radius < 0) {
			radius += 2 * Math.PI;
		}
		return radius;
	}

	/**
	 * 結果描画処理
	 */
	function drawResult() {
		// 円の中心座標
		var centerX = myPieChart.canvas.offsetLeft + myPieChart.width / 2 - 10;
		var centerY = myPieChart.height / 2 + 10;
		
		var moveElement = document.getElementById('triangle-mark');

		// 結果マークが止まった位置のラジアン
		var r = Math.atan2(moveElement.style.top.replace("px", "") - centerY, moveElement.style.left.replace("px", "") - centerX);
        r = getAbs(r);

		// 円の接点から当たり判定を行う。
		myPieChart.data.datasets.forEach(function (dataset, i) {
			var meta = myPieChart.getDatasetMeta(i);
			if (!meta.hidden) {
				meta.data.forEach(function (element) {
					var start = element._model.startAngle;
					var end = element._model.endAngle;
                    var start2 = 0.0;
                    var end2 = -1.0;

                    // 負の数の場合（円の右上領域の場合、１周分補正する（Math.atan2 と chart.jsのstartAngle・endAngleの仕様差を吸収する為））
                    if (start < 0.0 && end < 0.0) {
                        start += Math.PI * 2;
                        end += Math.PI * 2;
                    // 0をまたいだ場合、正の数の範囲と負の数の範囲を分割する（いずれかの範囲に収まった場合に当たり判定をする）
                    } else if (start < 0.0 && end >= 0.0) {
                        start += Math.PI * 2;
                        end2 = end;
                        end = Math.PI * 2;
                    }

					if ((start <= r && r <= end) || (start2 <= r && r <= end2)) {
						var resultElement = document.getElementById('result');
						resultElement.innerText = element._model.label;

						$.magnificPopup.open({
							items: {src: '#small-dialog'},
							type: 'inline', 
							closeBtnInside: true,
                        }, 0);
                    }
				})
			}
		})
	}
}