$(function() {

  function scrollPosition(data){
    data = data.toString();
    var position = $("#"+data).position();
    $('body').scrollTop(position.top);
  };

  function addImage(data){
    data = data.toString();
    var datas = data.split(",");
    scrollPosition(datas[0]);
    var position = $("#"+datas[0]).position();
    var x = Number(position.left) + Number(datas[1]) - 50;
    var y = Number(position.top) + Number(datas[2]) - 50;
    $(".addImage-area").append("<div id="+datas[0]+"_"+x+"_"+y+" class='addImages' style='position: absolute;float:left;left: "+x+"px; top: "+y+"px;width:100px;height:100px; z-index: 999'><img src='images/"+datas[3]+"'/></div>");
  };
  
  $.subscribeToALMemoryEvent("imageAdd", function (data) {
    addImage(data);
  });

  $.subscribeToALMemoryEvent("imageChange", function (data) {
    scrollPosition(data);
  });
  
});
