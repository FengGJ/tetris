window.onload = function () {
  var
    UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39, PAUSE = 80, START = 32, RESTART = 82,
    SPEED = 800,
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    pianyi = 3,
    xia = 0,
    maps = [
      [[0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [[1, 1],
        [1, 1]],

      [[0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],],
      [[1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],

      [[1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]],

      [[0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],],

      [[1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],]
    ],
    shape = maps[Math.floor(Math.random() * maps.length)],
    fengshu = 0,
    jibie = 1,
    shape_copy = shape,
    timerId, startFlag = true,
    remain = {};
  ctx.fillStyle = '#d6ffb2';
  var isPauseFlag = true;
  var executeOnce = true;
  localStorage.score=0;
  var shitu = document.getElementById('shitu'),
    ctx_next = shitu.getContext('2d');
  ctx_next.fillStyle = '#d6ffb2';

  //根据数据画形状
  function drawRemain() {
    for (var i in remain) {
      for (var j = 0; j < remain[i].length; j++) {
        drawBlock(i, remain[i][j]);
      }
    }
  }

  function drawBlock(x, y) {
    ctx.fillRect(y * 20 + 2, x * 21 + 3, 18, 18);
  }

  function drawShape() {
    for (var i = 0; i < shape.length; i++) {
      for (var j = 0; j < shape[i].length; j++) {
        if (shape[i][j] == 0) continue;//?
        var x = i + xia, y = j + pianyi;
        drawBlock(x, y);
      }
    }
  }

  function drawSence() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 16; j++) {
        ctx.fillRect(i * 20 + 9, j * 21 + 10, 2, 2);
      }
    }
    drawRemain();
    drawShape();
  }

  //显示下一个方块
  function drawnext() {
    ctx_next.clearRect(0, 0, shitu.offsetWidth, shitu.offsetHeight);
    shape_copy = maps[Math.floor(Math.random() * maps.length)];
    for (var i = 0; i < shape_copy.length; i++) {
      for (var j = 0; j < shape_copy[i].length; j++) {
        if (shape_copy[i][j] == 0) continue;
        ctx_next.fillRect(j * 20 + 2, i * 21 + 3, 18, 18);
      }
    }
  }

  drawnext()
  //四组判断
  function isZhuangqiang(c) {
    for (var i = 0; i < shape.length; i++) {
      for (var j = 0; j < shape[i].length; j++) {
        if (shape[i][j] == 0) continue;
        var x = i + xia, y = j + pianyi;
        if (y == c) {
          return true;
        }
      }
    }
    return false;
  }

  function isZhuangRemin(c) {
    for (var i = 0; i < shape.length; i++) {
      for (var j = 0; j < shape[i].length; j++) {
        if (shape[i][j] == 0) continue;
        var x = i + xia, y = j + pianyi + c;
        if (!remain[x]) {
          continue;
        }
        for (var h = 0; h < remain[x].length; h++) {
          if (y == remain[x][h]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function isReachBottom() {
    for (var i = 0; i < shape.length; i++) {
      for (var j = 0; j < shape[i].length; j++) {
        if (shape[i][j] == 0) continue;
        var x = i + xia;
        if (x == 15) {
          return true;
        }
      }
    }
    return false;
  }

  function isReachRemain() {
    for (var i = 0; i < shape.length; i++) {
      for (var j = 0; j < shape[i].length; j++) {
        if (shape[i][j] == 0) continue;
        var x = i + xia + 1, y = j + pianyi;
        if (!remain[x]) {
          continue;
        }
        for (var h = 0; h < remain[x].length; h++) {
          if (y == remain[x][h]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  //消除
  function xiaochu() {
    var len = 0;
    for (var i in remain) {
      if (remain[i].length == 10) {
        fengshu++;
        $(".fen").html(fengshu * 100);
        $(".line").html(fengshu);
        if (fengshu % 10 == 0) {
          jibie++;
          if (SPEED < 200) {
            SPEED = 200;
          } else {
            SPEED -= 200;
          }
          $(".jibie").html(jibie);
          clearInterval(timerId);
          timerId = setInterval(start, SPEED);
        }
        delete(remain[i]);
        continue;
      }
      len = len + 1;
    }
    var newremain = {};
    var j = 16 - len;
    for (var i in remain) {
      newremain[j] = [];
      for (var k = 0; k < remain[i].length; k++) {
        newremain[j].push(remain[i][k]);
      }
      j = j + 1;
    }
    remain = newremain;
  }
  //cookie
  function getCookie(c_name)
  {
    if (document.cookie.length>0)
    {
      c_start=document.cookie.indexOf(c_name + "=")
      if (c_start!=-1)
      {
        c_start=c_start + c_name.length+1
        c_end=document.cookie.indexOf(";",c_start);
        if (c_end==-1) c_end=document.cookie.length;
        return unescape(document.cookie.substring(c_start,c_end))
      }
    }
    return ""
  }

  function setCookie(c_name,value,expiredays)
  {
    var exdate=new Date()
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+
      ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
  }
  //计算得分
  var scoreTime;
  function score(){
    var score=getCookie('score')
    if(score<=fengshu){
      setCookie('score',fengshu*100,365);
      $(".maxScore .score").html(getCookie('score'));
    }
    scoreTime=setInterval(function () {
      if($(".maxScore").css("display")=="none"){
        $(".maxScore").show();
      }else if($(".maxScore").css("display")=="block"){
        $(".maxScore").hide();
      }
    },3000)
  }
  score();
  //出下一个块
  function next() {
    if (remain[0]) {
      return false;
    }
    for (var i = 0; i < shape.length; i++) {
      for (var j = 0; j < shape[i].length; j++) {
        if (shape[i][j] == 0) continue;
        var x = i + xia, y = j + pianyi;
        if (!remain[x]) {
          remain[x] = [];
        }
        remain[x].push(y);
      }
    }
    xiaochu();
    xia = 0;
    pianyi = 3;
    shape = shape_copy;
    drawnext();
    return true;
  }

  //块变形
  function bianxing() {
    //注释中的算法为原地转换数组，不引入外部变量
    /*var matrix = shape;
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
     }*/
    var tmp = [];
    for (var i = 0; i < shape.length; i++) {
      tmp[i] = [];
      for (var j = 0; j < shape[i].length; j++) {
        tmp[i][j] = shape[shape.length - 1 - j][i];
      }
    }
    shape = tmp;
  }

  function canBianxing() {
    var tmp = [];
    for (var i = 0; i < shape.length; i++) {

      tmp[i] = [];
      for (var j = 0; j < shape[i].length; j++) {
        tmp[i][j] = shape[shape.length - 1 - j][i];

      }
    }
    for (var i = 0; i < tmp.length; i++) {
      for (var j = 0; j < tmp[i].length; j++) {
        if (tmp[i][j] == 0) continue;
        var x = i + xia, y = j + pianyi;
        if (y == -1 || y == 10) {
          return false;
        }
        if (!remain[x]) {
          continue;
        }
        for (var h = 0; h < remain[x].length; h++) {
          if (y == remain[x][h]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function start() {
    if (!isReachBottom() && !isReachRemain()) {
      xia++;
    } else {
      if (!next()) {
        clearInterval(timerId);
        restart();
        console.log("lose");
        // alert('gameOver!');
        return;
      }
    }
    drawSence();
  }

  function pause(isPauseFlag) {
    if (isPauseFlag) {
      clearInterval(timerId);
    } else {
      timerId = setInterval(start, SPEED);
    }
  }

  function removePause() {
    clearInterval(timerId);
    timerId = setInterval(start, SPEED);
    isPauseFlag = true;
  }

  function restart() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    $(".startInterface").css("display", "block");
    shape = maps[Math.floor(Math.random() * maps.length)];
    remain = {};
    pianyi = 3;
    xia = 0;
    score();
    fengshu = 0;
    jibie = 1;
    startFlag = true;
    isPauseFlag = true;
    $(".fen").html(fengshu * 100);
    $(".line").html(fengshu);
    $(".jibie").html(jibie);
    clearInterval(timerId);
    drawnext();
  }

  function startOne() {
    drawSence();
    $(".maxScore").hide();
    clearInterval(scoreTime);
    if (startFlag) {
      $(".startInterface").css("display", "none");
      timerId = setInterval(start, SPEED);
      startFlag = false;
    }
  }

  document.onkeydown = function (ev) {
    ev.preventDefault();
    if (ev.keyCode == DOWN) {
      if (!isPauseFlag) {
        removePause();
      }
      $(".downmove").find("i").addClass("_23aw");
      if (!isReachBottom() && !isReachRemain()) {
        xia++;
      } else {
        if (!next()) {
          restart();

          console.log("lose!!");
          return;
        }
      }
      startOne();

    }
    if (ev.keyCode == LEFT) {
      if (!isPauseFlag) {
        removePause()
      }
      $(".leftMove").find("i").addClass("_23aw");

      if (!isZhuangqiang(0) && !isZhuangRemin(-1))
        pianyi--;
      startOne();

    }
    if (ev.keyCode == RIGHT) {
      if (!isPauseFlag) {
        removePause()
      }
      $(".rigthMove").find("i").addClass("_23aw");

      if (!isZhuangqiang(9) && !isZhuangRemin(1))
        pianyi++;
      startOne();


    }
    if (ev.keyCode == UP) {
      if (!isPauseFlag) {
        removePause()
      }
      $(".xuanzhuan").find("i").addClass("_23aw");

      if (canBianxing()) {
        bianxing();
      }
      startOne();

    }
    if (ev.keyCode == PAUSE) {
      $(".pauseBtn").find("i").addClass("_23aw");
      if (!startFlag) {
        pause(isPauseFlag);
        if (isPauseFlag) {
          isPauseFlag = false;
        } else {
          isPauseFlag = true;
        }
      }
    }
    if (ev.keyCode == RESTART) {
      $(".restartBtn").find("i").addClass("_23aw");
      $(".startInterface").css("display", "block");
      restart();
    }
    if (ev.keyCode == START) {
      $(".start").find("i").addClass("_23aw");
      startOne()
    }
  };
  document.onkeyup = function (ev) {
    ev.preventDefault();
    $("._1pg0").find("i").removeClass("_23aw");
  };
  $(".xuanzhuan").mouseup(function (e) {
    e.stopPropagation();
    $(this).find("i").removeClass("_23aw");
  })
  $(".xuanzhuan").mousedown(function (e) {
    if (!isPauseFlag) {
      removePause();
    }
    $(this).find("i").addClass("_23aw");
    e.stopPropagation();
    if (canBianxing()) {
      bianxing();
    }
    startOne()

  })
  $(".rigthMove").mouseup(function (e) {
    e.stopPropagation();
    $(this).find("i").removeClass("_23aw");

  })
  $(".rigthMove").mousedown(function (e) {
    if (!isPauseFlag) {
      removePause();
    }
    $(this).find("i").addClass("_23aw");
    e.stopPropagation();

    if (!isZhuangqiang(9) && !isZhuangRemin(1)) {
      pianyi++;
    }
    startOne()

  })
  $(".leftMove").mouseup(function (e) {
    e.stopPropagation();
    $(this).find("i").removeClass("_23aw");
  })
  $(".leftMove").mousedown(function (e) {
    if (!isPauseFlag) {
      removePause();
    }
    $(this).find("i").addClass("_23aw");
    e.stopPropagation();
    startOne()

    if (!isZhuangqiang(0) && !isZhuangRemin(-1))
      pianyi--;
  })
  $(".downmove").mouseup(function (e) {
    e.stopPropagation();
    $(this).find("i").removeClass("_23aw");
  })
  $(".downmove").mousedown(function (e) {
    if (!isPauseFlag) {
      removePause();
    }
    $(this).find("i").addClass("_23aw");
    e.stopPropagation();
    if (!isReachBottom() && !isReachRemain()) {
      xia++;
    } else {
      if (!next()) {
        restart();
        console.log("lose!!");
        return;
      }
    }
    startOne()

  })
  $(".restartBtn").mouseup(function (e) {
    e.stopPropagation();
    $(this).find("i").removeClass("_23aw");
  })
  $(".restartBtn").mousedown(function (e) {
    e.stopPropagation();
    $(this).find("i").addClass("_23aw");
    $(".startInterface").css("display", "block");
    restart();
  })
  $(".pauseBtn").mouseup(function (e) {
    e.stopPropagation();
    $(this).find("i").removeClass("_23aw");
  })
  $(".pauseBtn").mousedown(function (e) {
    $(this).find("i").addClass("_23aw");
    e.stopPropagation();
    pause(isPauseFlag);
    if (isPauseFlag) {
      isPauseFlag = false;
    } else {
      isPauseFlag = true;
    }
  })
  $(".start").mouseup(function (e) {
    e.stopPropagation();
    $(this).find("i").removeClass("_23aw");
  })
  $(".start").mousedown(function (e) {
    $(this).find("i").addClass("_23aw");
    e.stopPropagation();
    startOne()

  })


};
