var canvas, ctx; //canvas画板
var WIDTH, HEIGHT;//canvas宽 高
var points = [];//城市点数组
var running;//算法运行状态
var canvasMinX, canvasMinY;

var POPULATION_SIZE; //种群大小

var CROSSOVER_PROBABILITY; //交叉概率
var MUTATION_PROBABILITY;//突变概率


var mutationTimes;
var dis;//存储城市之间距离的二维数组(144x144)
var bestValue, best;//最优解数值，最优解路径数组
var currentGeneration;//当前代数
var currentBest;//当前最优解
var population;//当前一代的种群
var values;//当前一代种群的路径距离数组
var fitnessValues;//当前一代种群的适应性数组
var roulette;//当前一代种群的轮盘

$(function() {
  init();
  initData();
  points = data144;
  $('#start_btn').click(function() { 
    initData();
    GAInitialize();
    running = true;
  });
  $('#stop_btn').click(function() {
    if(running === false && currentGeneration !== 0){
      if(best.length !== points.length) {
          initData();
          GAInitialize();
      }
      running = true;
    } else {
      running = false;
    }
  });
});
function init() {
  ctx = $('#canvas')[0].getContext("2d");
  WIDTH = $('#canvas').width();
  HEIGHT = $('#canvas').height();
  setInterval(draw, 10);//每隔10毫秒刷新一次数据
}


//初始化数据
function initData() {
  running = false;
  POPULATION_SIZE = 30;
  ELITE_RATE = 0.3;
  CROSSOVER_PROBABILITY = 0.9;
  MUTATION_PROBABILITY  = 0.01;
  UNCHANGED_GENS = 0;
  mutationTimes = 0;
  doPreciseMutate = true;

  bestValue = undefined;
  best = [];
  currentGeneration = 0;
  currentBest;
  population = []; //new Array(POPULATION_SIZE);
  values = new Array(POPULATION_SIZE);
  fitnessValues = new Array(POPULATION_SIZE);
  roulette = new Array(POPULATION_SIZE);
}

//画图上的点
function drawCircle(point) {
  ctx.fillStyle   = '#000';
  ctx.beginPath();
  ctx.arc(point.x, point.y, 3, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

//画连线
function drawLines(array) {
  ctx.strokeStyle = '#00f';
  ctx.lineWidth = 1;
  ctx.beginPath();

  ctx.moveTo(points[array[0]].x, points[array[0]].y);
  for(var i=1; i<array.length; i++) {
    ctx.lineTo( points[array[i]].x, points[array[i]].y )
  }
  ctx.lineTo(points[array[0]].x, points[array[0]].y);

  ctx.stroke();
  ctx.closePath();
}

//刷新canvas
function draw() {
  if(running) {
    GANextGeneration();
    $('#status').text("城市数:" + points.length + "   "
                      + "当前代数:" + currentGeneration 
                      + "变异次数:"+ mutationTimes 
                      + "最短距离: "+ ~~(bestValue*6));
  } else {
    $('#status').text("地图上总共有:" + points.length + "个城市. ")
  }
  clearCanvas();
  if (points.length > 0) {
    for(var i=0; i<points.length; i++) {
      drawCircle(points[i]);
    }
    if(best.length === points.length) {
      drawLines(best);
    }
  }
}
function clearCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}
