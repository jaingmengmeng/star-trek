// JavaScript Document
//1.0基本功能实现
//1.1增加了计分器和升级功能
//1.2增添了随分数改变的难度级别
//1.3增加了帮助和退出功能
//2.0增加了动画效果和判断框以及开始界面
//2.1增添了移动和吞噬特效
//2.2修复了边界判断问题
//2.3提高了行星运动轨迹的美观度

	var context;
	var arr = new Array();
	var starCount = 200;
	//背景星星上限
	var rains = new Array();
	var rainCount =20;
	//背景流星上限
	var image = new Image();
		image.src = "image/name.png";
	var hole = new Image();
		hole.src = "image/hole in.png";
	var holein = new Image();
		holein.src = "image/hole.png";
	var image_x = 80;
	var image_y = 20;
	var dy = 1;
	//跳动图片纵向速度
	var change = 1;
	var judge = 1;
	var big=1;
	var jump = 0;
	//黑洞大小
	var backDom = document.createElement('canvas'),
		backCtx = backDom.getContext("2d");
		backDom.width = window.innerWidth;
		backDom.height = window.innerHeight;
	//设置轨迹重叠效果
	var remember_x;
	var remember_y;
	//黑洞位置记忆
	var planet = new Array();
	var score = 0;
	var gojudge = 0;
	//闪烁漩涡计数
	function show(){
		document.getElementById("pop").style.display="block";
	}
    //显示提示框
	function newgame(){
		document.getElementById("pop").style.display="none";
		into();
	}
    //开始新游戏
	function out(){
		document.getElementById("pop").style.display="none";
	}
    //提示框关闭
    function init(){
		var stars = document.getElementById("stars");
		document.getElementById("stars").style.background = "black";
        stars.width=window.innerWidth;
	    stars.height=window.innerHeight;
        context = stars.getContext("2d");
		var top = document.getElementById("top");
        top.width=window.innerWidth;
	    top.height=window.innerHeight;
        contexttop=top.getContext("2d");
		var mid = document.getElementById("mid");
        mid.width=window.innerWidth;
	    mid.height=window.innerHeight;
        contextmid=mid.getContext("2d");
     }
	 //初始化画布，设置三层，底层流星背景，中层行星出现，顶层黑洞
     var Star = function (){
        this.x = window.innerWidth * Math.random();
        this.y = window.innerHeight * Math.random();
		this.text=".";
		//代替星星
        this.color = "white";
        this.getColor=function(){
        	var _r = Math.random();
			if(_r<0.5){
                this.color = "#333";
           	}else{
                this.color = "white";
            }
		 }
		 //明暗颜色达到闪烁效果
         this.init=function(){
             this.getColor();
         }
         this.draw=function(){
           	 context.fillStyle=this.color;
             context.fillText(this.text,this.x,this.y);
         }
    }
	//创建一个星星对象
	function playStars(){
         for (var n = 0; n < starCount; n++){  
             arr[n].getColor();  
             arr[n].draw();  
         }  
    }
	//星星重绘
	var MeteorRain = function(){
	  this.x = -1;
	  this.y = -1;
	  //流星位置
	  this.length = -1;
	  this.angle = 30; 
	  this.width = -1;
	  this.height = -1;
	  //流星所占区域
	  this.speed = 1;
	  this.offset_x = -1;
	  this.offset_y = -1;
	  //速度及位置偏移量
	  this.alpha = 1;
	  this.color1 = "";
	  this.color2 = "black";
	  //渐变色
      this.init = function (){
          this.getPos();
          this.getRandomColor();
          this.length = Math.ceil(Math.random() * 80 + 150);
          this.speed = Math.ceil(Math.random()+0.5);
          var cos = Math.cos(this.angle*3.14/180);
          var sin = Math.sin(this.angle*3.14/180);
          this.width = this.length*cos; 
          this.height = this.length*sin;
          this.offset_x = this.speed*cos;
          this.offset_y = this.speed*sin;
		  //获取随机位置
    }
    this.getRandomColor = function (){
          var a = Math.ceil(255-240* Math.random()); 
          this.color1 = "rgba("+a+","+a+","+a+",1)";
		  //黑灰色系实现尾部消失
    }
    this.countPos = function (){
        this.x = this.x - this.offset_x;
        this.y = this.y + this.offset_y;
    }
	//改变流星位置
    this.getPos = function (){      
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
    }
	//随机流星位置
    this.draw = function (){
        context.save();
        context.beginPath();
        context.lineWidth = 1;
        context.globalAlpha = this.alpha;
        var line = context.createLinearGradient(this.x, this.y, 
            this.x + this.width, this.y - this.height);     
        //分段渐变设置颜色
        line.addColorStop(0, "white");
        line.addColorStop(0.3, this.color1);
        line.addColorStop(0.6, this.color2);
        context.strokeStyle = line;
        context.moveTo(this.x, this.y);
        context.lineTo(this.x + this.width, this.y - this.height);
        context.closePath();
        context.stroke();
		//流星绘制
        context.restore();
    }
    this.move = function(){
        var x = this.x+this.width-this.offset_x;
        var y = this.y-this.height;
        context.clearRect(x-3,y-3,this.offset_x+5,this.offset_y+5); 
		//清空流星位置
        this.countPos();
		//重新计算位置，往左下移动
        this.alpha -= 0.002;
        this.draw(); 
    }
	//实现流星位置的移动
  }
  //绘制流星并添加效果选项
  function playRains(){
	  for (var n = 0; n < rainCount; n++){  
		  var rain = rains[n];
          rain.move();
          if(rain.y>window.innerHeight){
             context.clearRect(rain.x,rain.y-rain.height,rain.width,rain.height);
             rains[n] = new MeteorRain();
             rains[n].init();
          }
		 //超范围清空
      }  
   }
  //流星雨变化
    function into() {
		  document.getElementById("one").innerHTML="Game over!";
		  var changeid = document.getElementById("one");
		  changeid.id = "two";
		  document.getElementById("span1").onclick = function(){ 
			  location.reload();   
		  }; 
		document.getElementById("span2").onclick = function(){ 
			  window.close();
		  };
		  //处理提示框内容
		  var el = document.getElementById('figure');
 		  el.parentNode.removeChild(el);
		  //处理使开场内容消失
          init();
          for (var i=0;i<starCount;i++) {
              var star = new Star();
              star.init();
              star.draw();
              arr.push(star);
          }
		  //背景星星绘制
          for (var i=0;i<rainCount;i++) {
			  var rain = new MeteorRain();
			  rain.init();
			  rain.draw();
			  rains.push(rain);
	      }
		  //流星绘制
          setInterval(playStars,300);
		  setInterval(playRains,10);
		  //设置闪烁
		  setTimeout(function(){var act=setInterval(showout,20);},1500);	
		  //游戏图标出现
		  setTimeout(function(){contexttop.clearRect(0,0,window.innerWidth,window.innerHeight);
								contexttop.fillStyle = "white";
    							contexttop.fillRect(0,0,window.innerWidth,window.innerHeight);
							   },5000);
		  //骤白处理
		 setTimeout(function(){contexttop.clearRect(0,0,window.innerWidth,window.innerHeight);
							   contexttop.globalAlpha = 0.90;
							   setInterval(adjust,90);
							   judge=0;},5400);
		 setTimeout(function(){setInterval(create,50);},5450);
		//创造黑洞及星球
      	}

  var item = function(){
	  this.x=-1;
	  this.y=-1;
	  this.dx=0;
	  this.ax=0;
	  this.dy=0;
	  this.ay=0;
	  //坐标及速度
	  this.r=0;
	  this.judge=-1;
	  //判断边界条件
	  this.big=-1;
	  //物体大小比较
	  this.grade=0;
	  //计分
	  this.first=10;
	  //判断初次出现碰撞事件
	  this.createit = function(){
		  this.judge=0;
		  var diff = 18;
		  if(big==2){diff = 23;}
		  if(big==3){diff = 32;}
		  if(score>7000){diff = score/200;}
		  var random1 = Math.random()*diff;
		  var random2;
		  //随机出现
		  if(random1<=9.0){
			  this.picture=new Image();
			  this.picture.src="image/planet2.png";
			  this.big=0;
			  this.grade=100;
			  this.r=80;
			  this.x=Math.random()*window.innerWidth;
			  this.y=Math.random()*window.innerHeight;
			  random2=Math.random();
			  if(random2<0.5){
				  this.dx=Math.random();
				  this.ay=-0.1*Math.random();				  
			  }else{
				  this.dy=-Math.random();
				  this.ax=0.1*Math.random();
			  }
		  }
		  //对每一个星球设置不同的出现概率、出现位置、速度随机，计分及大小
		  if(random1>9.0&&random1<=14.0){
			  this.picture=new Image();
			  this.picture.src="image/planet3.png";
			  this.big=1;
			  this.grade=400;
			  this.r=160;
			  this.getposition();
		  }
		  if(random1>14.0&&random1<=17.0){
			  this.picture=new Image();
			  this.picture.src="image/planet4.png";
			  this.big=2;
			  this.grade=800;
			  this.r=240;
			  this.getposition();
		  }
		  if(random1>17.0){
			  this.picture=new Image();
			  this.picture.src="image/planet5.png";
			  this.big=3;
			  this.r=288;
			  this.getposition();
		  }
	  }
	  this.getposition = function(){
		  random2= Math.random();
		  if(random2<0.5){
			  this.x=-64;
			  this.dx=1;
			  this.ax=0.08*Math.random();
		  }else{
			  this.x=window.innerWidth+64;
			  this.dx=-1;
			  this.ax=-0.08*Math.random();
		  }
		  random2= Math.random();
		  if(random2<0.5){
			  this.y=-64;
			  this.ay=0.08*Math.random();
		  }else{
			  this.y=window.innerHeight+64;
			  this.ay=-0.08*Math.random();
		  }
	  }
	  //随机位置和速度
  }
  function showout(){
		if(change==1){
			image_x+=2.2;
			dy+=0.02;
			image_y+=dy * dy;
			if(image_y>=window.innerHeight/2-30){change=2;}
		}
		if(change==2){
			image_x+=1.9;
			dy-=0.03;
			image_y-=dy * dy;
			if(image_y<=window.innerHeight/2-180){change=3;}
		}
		if(change==3){
			image_x+=1.9;
			dy+=0.02;
			image_y+=dy * dy;
			if(image_y>=window.innerHeight/2-60){clearInterval(act);}
		}
	  	//三段抛物线轨迹
		contexttop.clearRect(0,0,window.innerWidth,window.innerHeight);
		contexttop.drawImage(image,image_x,image_y,980,180);
	}
	//设置图标出现路径
	function mousePos(e){ 
    	var x,y;   
    	var e = e||window.event;   
    	return {   
    		x:e.clientX+document.body.scrollLeft + document.documentElement.scrollLeft,   
    		y:e.clientY+document.body.scrollTop + document.documentElement.scrollTop   
  	    };   
    }
	//获取鼠标位置 
	function draw(e){
		if(judge){return;}
    	var c=document.getElementById("top");   
		backCtx.globalCompositeOperation = 'copy';
    	backCtx.drawImage(c, 0, 0, window.innerWidth,window.innerHeight);
		contexttop.clearRect(0,0,c.width,c.height);
		//保留图像进行运动轨迹处理
		remember_x = mousePos(e).x;
		remember_y = mousePos(e).y;
		//保留位置进行刷新及碰撞处理
		switch(big)
		{
			case 1:
			contexttop.drawImage(hole,mousePos(e).x-64,mousePos(e).y-64,128,128);
			break;
			case 2:
			contexttop.drawImage(hole,mousePos(e).x-80,mousePos(e).y-80,160,160);
			break;
			case 3:
			contexttop.drawImage(hole,mousePos(e).x-96,mousePos(e).y-96,192,192);
			break;
			case 4:
			contexttop.drawImage(hole,mousePos(e).x-128,mousePos(e).y-128,256,256);
			break;
		}			
		//根据黑洞大小区别绘制
		contexttop.drawImage(backDom,0,0,window.innerWidth,window.innerHeight);
		//运动轨迹
	}
	function adjust(){
		contexttop.clearRect(0,0,window.innerWidth,window.innerHeight);
		switch(big){
			case 1:
				contexttop.drawImage(hole,remember_x-64,remember_y-64,128,128);
				break;
			case 2:
				contexttop.drawImage(hole,remember_x-80,remember_y-80,160,160);
				break;
			case 3:
				contexttop.drawImage(hole,remember_x-104,remember_y-104,208,208);
				break;
		}
		if(score>=1500){
			big=2;
			if(score>=5000){big=3;}
		}
		//计分进行黑洞升级
	}
		//刷新因鼠标停留而保留轨迹的页面
	function compare(i){
		var distance=(remember_x-planet[i].x-planet[i].r/2)*(remember_x-planet[i].x-planet[i].r/2)+(remember_y-planet[i].y-planet[i].r/2)*(remember_y-planet[i].y-planet[i].r/2);
		var rr;
		var useit=planet[i].r-8;
		if(planet[i].big==3){useit-=16;}
		//根据图片实际大小放宽碰撞条件
		switch(big){
			case 1:
				rr=(useit/2+32)*(useit/2+32);
				break;
			case 2:
				rr=(useit/2+40)*(useit/2+40);
				break;
			case 3:
				rr=(useit/2+52)*(useit/2+52);
				break;
		}
		if(distance<=rr){if(planet[i].first<=0){return 1;}}
		return 0;
	}
	//计算黑洞与星体是否发生碰撞

	function go(){
		if(gojudge==50){clearInterval(godo);}
		gojudge++;
		contexttop.clearRect(0,0,window.innerWidth,window.innerHeight);
		switch(big){
			case 1:
				contexttop.drawImage(holein,remember_x-64,remember_y-64,128,128);
				break;
			case 2:
				contexttop.drawImage(holein,remember_x-80,remember_y-80,160,160);
				break;
			case 3:
				contexttop.drawImage(holein,remember_x-104,remember_y-104,208,208);
				break;
		}
		//设置黑洞吞噬特效
	}

	function create(){
		var count = 0;
		for(var i=0;i<planet.length;i++){
			if(planet[i].x<-88||planet[i].x>(window.innerWidth+88)){planet[i].judge=-1;}
			if(planet[i].y<-128||planet[i].y>(window.innerHeight+88)){planet[i].judge=-1;}
			//判断是否出界
			if(planet[i].judge==0){
			if(compare(i)){
				if(planet[i].big<big){
					planet[i].judge=-1;
					score+=planet[i].grade;
					gojudge=0;
					var godo=setInterval(go,15);
					///判断发生吞噬
				}else{
					show();
					score=0;
					big=1;
					done[0] = 0;
					done[1] = 0;
					planet.splice(0,planet.length);
					contextmid.clearRect(0,0,window.innerWidth,window.innerHeight);
					//判断游戏结束
				}
			}
			else{
				planet[i].first--;
				count++;
			}
		  }
		}
		if(count<9){
			var newone = new item();
			newone.createit();
			planet.push(newone);	
		}
		//增添
		contextmid.clearRect(0,0,window.innerWidth,window.innerHeight);
		for(i=0;i<planet.length;i++){
			if(planet[i].judge==0){
		  		planet[i].dx=planet[i].dx+planet[i].ax;
		  		planet[i].dy=planet[i].dy+planet[i].ay;
		  		planet[i].x=planet[i].x+planet[i].dx;
		  		planet[i].y=planet[i].y+planet[i].dy;
		  		contextmid.drawImage(planet[i].picture,planet[i].x,planet[i].y,planet[i].r,planet[i].r);
			}
			//位置变更及绘制
		}
		var word1 = score.toString();
		var word2;
		switch(big){
			case 1:
				word2="Small Hole";
				break;
			case 2:
				word2="Super Hole";
				break;
			case 3:
				word2="Crazy Hole";
				break;
		}
		contextmid.font = "40pt Calibri";
        contextmid.fillStyle = "white";
        contextmid.fillText(word2+"  "+word1, window.innerWidth/2-180, 40);
		//分数计算绘制
		for(i=0;i<planet.length;i++){if(planet[i].judge==-1){planet.slice(i,i);}}
		//清除出界行星
	}