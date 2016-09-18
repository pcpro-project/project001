$(function() {

	var datas = [];
	var images = [];

	// タブレット画像の切り替え
	function scrollPosition(data){
		data = data.toString();
		var position = $("#"+data).position();
		$('body').scrollTop(position.top).scrollLeft(position.left);
	};

	$.subscribeToALMemoryEvent("imageChange", function (data) {
		scrollPosition(data);
	});

	// ボタン画像の切り替え
	function changeButton(){
		//画像ＵＲＬ
		var url="images/button_images/" + datas[0];
		//imgPreloaderオブジェクトを作る
		var imgPreloader=new Image();
		//onloadイベントハンドラ追加
		imgPreloader.onload=function() {
			//ロード完了で画像を表示
			$("#"+datas[1]).children("img").attr({'src':url});
		}
		imgPreloader.src=url;
	};

	$.subscribeToALMemoryEvent("changeButton", function (data) {
		datas = String(data).split(",");
		changeButton();
	});

	// ボタン画像のリセット
	function resetButton(){
		for(i=0; i<images.length; i++){
			(function(i) {
				var url="images/button_images/" + images[i];
				var imgPreloader=new Image();
				imgPreloader.onload=function() {
					$("#box"+(i+1).toString()).children("img").attr({'src':url});
				}
				imgPreloader.src=url;
			})(i);
		}
	};

	$.subscribeToALMemoryEvent("resetButton", function (data) {
		images = String(data).split(",");
		resetButton();
	});

/**	
	// 画像のオーバーレイ
	function overlayOn(data){
		data = data.toString();
		$('#overlay').css('background-image', 'url(images/overlay_images/'+ data +')').fadeIn(5);
	};

	$.subscribeToALMemoryEvent("overlayOn", function (data) {
		overlayOn(data);
	});
	
	// オーバーレイ画像を取り除く
	function overlayOff(){
		$('#overlay').fadeOut(5);
	};

	$.subscribeToALMemoryEvent("overlayOff", function (data) {
		overlayOff();
	});

	//ボタンがフェードアウトして消える
	function disappearButton(datas){
		$('#'+datas[1]).fadeOut(datas[0]);
	};

	$.subscribeToALMemoryEvent("disappearButton", function (data) {
		datas = String(data).split(",");
		disappearButton(datas);
	});
**/
});
