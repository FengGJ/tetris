window.onload = function(){
    //主对象
    function tetris (){
	var canvas = document.getElementById('canvas');
	this._ctx = canvas.getContext('2d');
	this._ctx.fillStyle = '#d6ffb2';
	this.xia = 0;
	this.zuoyou = 3;
	this.remain = [];
	this.eventsHandle();
	this.maps = [[[0,1,0], [1,1,1], [0,0,0],], [[1,1], [1,1]], [[0,1,0], [0,1,1], [0,0,1],], [[0,1,0], [1,1,0], [1,0,0],], [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]], [[0,1,0], [0,1,0], [0,1,1],], [[0,1,1], [0,1,0], [0,1,0],]];
    }

    //画主场景，致敬第一款俄罗斯方块的界面
    tetris.prototype.drawSence = function(){
	for ( var i = 0;  i < 16;  i++){
	    for ( var j=0; j<10; j++){
		var x = 20*j + 9;
		var y = 21*i + 10;
		this._ctx.fillRect(x,y,2,2);
	    }
	}
    };
    //根据坐标在画布中画出一个块
    tetris.prototype.drawBlock =function(i,j){
	this._ctx.fillRect(i*20+2,j*21+3,18,18);
    };

    //画出页面上未消除的块
    tetris.prototype.drawRemain = function(){
	for ( var i = 0;  i < this.remain.length;  i++){
	    this.drawBlock(this.remain[i][0],this.remain[i][1]);
	}
    };

    //随机选取一种形状
    tetris.prototype.born = function(){
	this.curentShape = this.maps[ Math.round( Math.random()* (this.maps.length-1) ) ];
    };

    //传入坐标x,y,判断页面中该位置上是否有已画好的块
    tetris.prototype.pandan =function(x,y){
	for ( var i = 0;  i < this.remain.length;  i++){
	    if( x == this.remain[i][0] && y == this.remain[i][1] ){
		return true;
	    }
	}
	return false;
    };
    //画形状中的各个块之前，先判断一下
    tetris.prototype.dapanduan = function(){
	for ( var i = 0;  i < this.curentShape.length;  i++){
	    for ( var j=0; j<this.curentShape[i].length; j++){
		if( this.curentShape[i][j] ){
		    var x = j + this.zuoyou,
			y = i + this.xia;
		    if( this.pandan(x,y) || y > 15 ){
			return false;
		    }
		}
	    }
	}
	return true;
    };

    //根据随机出现的形状，画出形状中的各个块
    tetris.prototype.drawShape = function(){
	var tmp = [];
	for ( var i = 0;  i < this.curentShape.length;  i++){
	    for ( var j=0; j< this.curentShape[i].length; j++){
		if(this.curentShape[i][j]){
		    var x = j+this.zuoyou,
			y = i+this.xia;
		    this.drawBlock( x, y);
		    tmp.push([x,y]);
		}
	    }
	}
	return tmp;
    };

    //(二维数组顺时针旋转90度)块变形的数据处理
    tetris.prototype.bianxing = function(){
	var matrix = this.curentShape;
	var n = matrix.length;
        var limit = (n-1)/2;
        for(var i=0;i<= limit; i++){
            for(var j=i;j<n-1-i;j++){
                var temp = matrix[i][j];
                matrix[i][j] = matrix[n-1-j][i];
                matrix[n-1-j][i] = matrix[n-1-i][n-1-j];
                matrix[n-1-i][n-1-j] = matrix[j][n-1-i];
                matrix[j][n-1-i] = temp;
            }
        }
	this._ctx.clearRect(0,0,202,339);
	this.drawSence();
	this.drawShape();
    };

    //处理操控事件
    tetris.prototype.eventsHandle = function(){
	var that = this;
	document.onkeydown = function(e){
	    if(e.keyCode == 37){
		that.zuoyou --;
	    }
	    if(e.keyCode == 39){
		that.zuoyou ++;
	    }
	    if(e.keyCode == 38){
		that.bianxing();
	    }
	    if(e.keyCode == 40){
		that.xia++;
	    }
	    that._ctx.clearRect(0,0,202,339);
	    that.drawSence();
	    that.drawRemain();
	    that.drawShape();
	    e.preventDefault();
	};
    };

    //处理块的消除
    tetris.prototype.positionToData = function(){
	this.remainData = {};
	for ( var i = 0;  i < this.remain.length;  i++){
	    this.remainData[ this.remain[i][1] ] = [];
	}
	for ( var i = 0;  i < this.remain.length;  i++){
	    this.remainData[ this.remain[i][1] ].push(this.remain[i][0]);
	}
    };

    tetris.prototype.xiaochu = function(){
	var t = [];
	for ( var i in this.remainData ){
	    if( this.remainData[i].length == 10){
		continue;
	    };
	    t.unshift( this.remainData[i] );
	}
	var tmp = {};
	if( t.length ){
	    for ( var i = 15;  i > ( 15 - t.length);  i--){
	      tmp[i] = t[15-i];
	    }
	}
	this.remainData = tmp;
	this.dataToPosition();
    };

    tetris.prototype.dataToPosition = function(){
	this.remain  = [];
	for ( var i in this.remainData ){
	    for ( var j = 0;  j < this.remainData[i].length;  j++){
		this.remain.push( [this.remainData[i][j],window.parseInt(i)] );
	    }
	}
    };

    //开始和暂停
    tetris.prototype.start = function(){
	this.born();
	var that = this;
	this.interId = setInterval(function(){
	    that._ctx.clearRect(0,0,202,339);
	    that.drawSence();
	    that.drawRemain();

    	    if( that.dapanduan() ){
		that.tmp = that.drawShape();
    		that.xia ++;
    	    }else{
		that.remain = that.remain.concat(that.tmp);
		for ( var i = 0;  i < that.tmp.length;  i++){
		    that.drawBlock(that.tmp[i][0],that.tmp[i][1]);
		}
		//消除
		that.positionToData();
		if(that.remainData[0]){
		    clearInterval(that.interId);
		    alert('gameOver!');
		}
		that.xiaochu();
		that.dataToPosition();

    		that.xia = 0;
    		that.zuoyou = 3;
    		that.born();
	    }
	},250);
    };
    tetris.prototype.pause = function(){
	clearInterval(this.interId);
    };

    var t = new tetris();
    t.start();
};
