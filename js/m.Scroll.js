function mScroll(init){
	if(!init.el){
		return;
	}
	var inner=init.el.children[0];

	var scrollBar=document.createElement('div');
	var startPoint = 0;
	var startEl=0;
	
	var disPre=0;
	var disLast=0;
	var timePre=0;
	var timeLast=0;
	var disMax=init.el.offsetHeight-inner.offsetHeight;
	
	if(!init.offBar){
		var scale=init.el.offsetHeight/inner.offsetHeight;
	
		//设置inner的最小高度
		inner.style.minHeight="100%";
		scrollBar.style.cssText="width: 6px;background:rgba(0,0,0,.5);border-radius: 3px;position: absolute;right:0;top:0; opacity: 0;transition: .5s opacity;border:1px solid #fff;"
	}
	
	
	
	document.addEventListener('touchstart',function(e){
		e.preventDefault();
	})
	
	//设置3d硬件加速
	css(inner,'translateZ',0.01);
	
	inner.addEventListener('touchstart',function(e){
		
		
		//手指按下的时候，先给最大可移动高度初始化一下
		disMax=init.el.offsetHeight-inner.offsetHeight;
		
		scale=init.el.offsetHeight/inner.offsetHeight;
		
		//开始先清除MTween动画
		clearInterval(inner.timer);
		
		//获得手指按下的初始位置
		startPoint=e.changedTouches[0].pageY;
		
		//开始touchstart时，先用css得到元素开始的translateY的值
		startEl=css(inner,'translateY');
//					console.log(startEl)
		
		//把开始的元素位置，赋给上一次的位置
		disPre=startEl;
		
		//获得现在的时间  .getTime();
		timePre=new Date().getTime();
		
		//touchstart时，最后一次的时间和距离  初始为0
		timeLast=disLast=0;
		if(!init.offBar){
			if(disMax>=0){
				scrollBar.style.display="none";
			}else{
				scrollBar.style.display="block";
			}
			
			init.el.appendChild(scrollBar);
			scrollBar.style.opacity=1;
			scrollBar.style.height=init.el.offsetHeight*scale+"px";
		}
	})
	
	
	inner.addEventListener('touchmove',function(e){
		//touchmove时，获得现在的时间
		var timeNow=new Date().getTime();
		
		//获得move后的位置
		var movePoint=e.changedTouches[0].pageY;
		
		//移动的距离disL
		var disL=movePoint-startPoint;
		
		//translateY:移动后元素的translateY
		var translateY=disL+startEl;
		
		//设置元素的translateY
		css(inner,'translateY',translateY);
		
		(init.offBar) || css(scrollBar,'translateY',-translateY*scale);
//					init.el.style.top=disL+startEl+"px";
		
		//元素最后一次移动的距离=现在元素的位置-上一次元素的位置
		disLast=translateY-disPre;
		
		//disLast赋值后，把现在元素的位置赋值给上一次元素
		disPre=translateY;
		
		//时间也是如此，先用timenow-timepre，结果赋值给timeLast，然后把timenow赋值给timepre
		timeLast=timeNow-timePre;
		timePre=timeNow;
	})
	inner.addEventListener('touchend',function(e){
		var type="easeOut"
		//这儿的timeLast有可能==0，所以要监测一下
		var speed = Math.round(disLast / timeLast*10);
		speed = timeLast <= 0 ? 0 : speed;
		
		//缓冲后元素的所在的位置
		var bufferDis = Math.round(speed*40 + css(inner,'translateY'));
		//console.log(speed);
		//console.log(bufferDis);
		
		if(bufferDis>0){
			bufferDis=0;
			type="backOut";
		}else if(bufferDis<disMax){
			bufferDis=disMax;
			type="backOut";
		}
		
		MTween({
			el:inner,
			target:{
				translateY:bufferDis
			},
			//bufferDis-touchend时的css(inner,"translateY")的值，这样time才不会为零
			time:Math.round(Math.abs(parseInt(bufferDis-css(inner,'translateY')))*1.3),
			type:type,
			callBack:function(){
				(init.offBar) || (scrollBar.style.opacity=0);
			},
			callIn:function(){
				var translateY=css(inner,'translateY');
				(init.offBar) || css(scrollBar,'translateY',-translateY*scale);
			}
		})
		
	})

}