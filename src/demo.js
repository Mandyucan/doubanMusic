//jquery功能写法 $.ajax();

// $.ajax({
// 	type: 'GET', //请求类型
// 	url: 'https://api.douban.com/v2/music/search?q=db', //访问路径
// 	// data:  传递的数据类型是什么格式（GET请求可直接拼接） json string 拼接等方式，一般是json格式
// 	dataType:'jsonp', //说明可以跨域
// 	// timeout:  8000,//请求超时时间 一般8s,根据用户心理 
// 	success: function (data) {   //访问成功之后返回的值
// 	console.log(JSON.parse(data));
// 	// },
// 	// error: function (err){
// 	// 	console.log(err); //返回失败的时候触发的函数
// 	// }
// 	// data: 'wd=s&cb=duyi',//也可以分开写，如下
// 	// data: 'wd=s',
// 	// jsonp: 'cb',//回调函数的名字,不固定，由接口文档确定， 用来替代在“callback=？”这种GET或POST请求中URL参数里的“callback”部分
// 	// jsonpCallback: 'duyi'//回调函数名
// });
// 	function duyi(data) {
// 		console.log(data);
// 	}
$('#input_box').on('input', function() {
    var value = this.value;
    $.ajax({
        type: 'GET', //请求类型
        url: 'https://api.douban.com/v2/music/search',
        dataType: 'jsonp',
        data: 'q=' + value + '&count=6',
        success: getData
    })
})

function getData(data) {
    console.log(data);
    var str = '',
        data = data.musics,
        len = data.length;
    data.forEach(function(ele, index) {
        str += '<li>\
					<a href="https://music.douban.com/subject/' + ele.id + '/">\
						<img src="' + ele.image + '" width = "40" />\
						<div>\
							<em>' + ele.title + '</em>\
							<p>' + ele.author[0].name + '</p>\
						</div>\
					</a>\
		        </li>';
    })
    $('#showlist').html(str);
    $('#showlist').css('display', 'block');
}
//轮播图
var nowIndex = null,
    len = 6, //6张不同的图片轮播，放7张
    itemWidth = 675,
    timer = null,
    flag = true; //加锁，狂点击会出问题
function init() {
    bindEvent();
    sliderAuto();
}
init();

//绑定事件
function bindEvent() {
    $('.order li').add('.prev_btn').add('.next_btn').on('click', function() {
        if ($(this).attr('class') == 'prev_btn') {
            move('prev');
        } else if ($(this).attr('class') == 'next_btn') {
            move('next');
        } else {
            var index = $(this).index();
            move(index);
        }
        changeStyle();
    })
    //翻页箭头（可用透明度但没有鼠标移入时间好）
    $('.slide_box')
        .on('mouseenter', function() {
            $('.btn').show();
            clearTimeout(timer);
        })
        .on('mouseleave', function() {
            $('.btn').hide();
            sliderAuto();
        })

}

function move(direction) {
    // console.log(direction);
    if (flag) {
        flag = false;
        var a = 1 //做标记，提取共用函数slider();
        if (direction == 'prev' || direction == 'next') {
            if (direction == 'prev') {
                if (nowIndex == 0) {
                    $('.slider').css({ left: -(len * itemWidth) }); //先闪现再滑动 秒回到最后一张位置
                    nowIndex = len - 1;
                    // // $('.slider').animate({left: -(nowIndex * itemWidth)}, function (){//动画结束之后再自东轮播
                    // // 	sliderAuto();
                    // // 	flag = true;
                    // });
                    // slider();
                } else {
                    nowIndex = nowIndex - 1;
                    // $('.slider').animate({left: -(nowIndex * itemWidth)}, function (){
                    // 	sliderAuto();
                    // 	flag = true;
                    // });
                    // slider();
                }
            } else { //往后翻
                if (nowIndex == 5) { //在最后一张图片时
                    a = 0;
                    $('.slider').animate({ left: -(len * itemWidth) }, function() { //先运动，再瞬间挪到第一位
                        $(this).css({ left: 0 });
                        sliderAuto();
                        flag = true;
                    })
                    nowIndex = 0;

                } else { //不是最后一张时
                    nowIndex = nowIndex + 1;
                    // $('.slider').animate({left: -(nowIndex * itemWidth)},function (){
                    // 	sliderAuto();
                    // 	flag = true;
                    // });
                    // slider();
                }
            }
        } else { //小圆点运动 index
            nowIndex = direction;
            // $('.slider').animate({left: -(nowIndex * itemWidth)}, function (){
            // 			sliderAuto();
            // 			flag = true;
            // 		});
            // slider();
        } //a=1
        slider();
    }
}
//优化代码，提取重复部分
function slider() {
    $('.slider').animate({ left: -(nowIndex * itemWidth) }, function() {
        sliderAuto();
        flag = true;
    });
}

//小圆点样式
function changeStyle() {
    $('.active').removeClass('active');
    $('.order li').eq(nowIndex).addClass('active');
}
//定时器 自动轮播
function sliderAuto() {
    clearTimeout(timer);
    timer = setTimeout(function() {
        move('next');
        changeStyle();
    }, 2000);
}