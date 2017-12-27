function GAInitialize() {
  //先计算所有城市之间的距离
  countDistances();
  //生成初代种群，产生POPULATION_SIZE条随机路径
  for(var i=0; i<POPULATION_SIZE; i++) {
    population.push(randomIndivial(points.length));
  }
  //找出目前的全局最优解，设置bestValue的值
  setBestValue();
}
//迭代下一代的函数
function GANextGeneration() {
  currentGeneration++;

  //选择出一代population
  selection();

  //让这代population进行交叉
  crossover();

  //让这代population进行突变
  mutation();

  //找出目前的全局最优解，设置bestValue的值
  setBestValue();
}

function selection() {
  var parents = new Array();
  var initnum = 4;
  //选择了四个父代，分别是 当前代数最优、目前全局最优的突变1、突变2，和本身
  parents.push(population[currentBest.bestPosition]);
  parents.push(doMutate(best.clone()));
  parents.push(pushMutate(best.clone()));
  parents.push(best.clone());

  //设置好轮盘
  setRoulette();
  //选择轮盘,随机选择
  for(var i=initnum; i<POPULATION_SIZE; i++) {
    parents.push(population[wheelOut(Math.random())]);
  }
  //这个就是选择出来的下一代
  population = parents;
}
//交叉过程queue是要交叉的队列
function crossover() {
  var queue = new Array();
  for(var i=0; i<POPULATION_SIZE; i++) {
    if( Math.random() < CROSSOVER_PROBABILITY ) {
      queue.push(i);
    }
  } 
  //随机两个交叉
  queue.shuffle();
  for(var i=0, j=queue.length-1; i<j; i+=2) {
    doCrossover(queue[i], queue[i+1]);
  }
}


//产生x和y的两个子代
function doCrossover(x, y) {
  child1 = getChild('next', x, y);
  child2 = getChild('previous', x, y);
  population[x] = child1;
  population[y] = child2;
}
//next和previous是两个函数，在utils.js中有定义
//next返回下一个点，previous返回前一个点
function getChild(fun, x, y) {
  solution = new Array();
  var px = population[x].clone();
  var py = population[y].clone();
  //parent x 和 parent y
  var dx,dy;
  // 从parent x中随便选择一个点推进解数组中
  var c = px[randomNumber(px.length)];
  solution.push(c);
  while(px.length > 1) {
    //dx和dy分别存储px,py中c的next或者previous的点
    dx = px[fun](px.indexOf(c));
    dy = py[fun](py.indexOf(c));
    px.deleteByValue(c);
    py.deleteByValue(c);
    //比较dx和dy哪个更优
    c = dis[c][dx] < dis[c][dy] ? dx : dy;
    solution.push(c);
  }
  return solution;
}

//突变操作
function mutation() {
  for(var i=0; i<POPULATION_SIZE; i++) {
    //小于突变的概率
    if(Math.random() < MUTATION_PROBABILITY) {
      //有两种不同的突变方式，各占百分五十
      if(Math.random() > 0.5) {
        population[i] = pushMutate(population[i]);
      } else {
        population[i] = doMutate(population[i]);
      }
      i--;
    }
  }
}

//突变1
function doMutate(seq) {
  mutationTimes++;
  // m和n都是index所以要在length以内
  // n要大于m才能跳出循环
  // m range from 0 to length-2, n range from 2...length-m
  do {
    m = randomNumber(seq.length - 2);
    n = randomNumber(seq.length);
  } while (m>=n)

  //从m到n的这段序列,前半段和后半段进行交换
    for(var i=0, j=(n-m+1)>>1; i<j; i++) {
      seq.swap(m+i, n-i);
    }
    return seq;
}
//突变2
function pushMutate(seq) {
  mutationTimes++;
  var m,n;
  //m在序列的前半段,n在m之后都可以
  do {
    m = randomNumber(seq.length>>1);
    n = randomNumber(seq.length);
  } while (m>=n)
  //将序列从m,n切开分成三段
  var s1 = seq.slice(0,m);
  var s2 = seq.slice(m,n)
  var s3 = seq.slice(n,seq.length);
  //本来的序列是s1s2s3现在换成s2s1s3
  return s2.concat(s1).concat(s3).clone();
}
//从当前的population数组中找看看有没有新的最优解（优于在这之前的所有代）
function setBestValue() {
  for(var i=0; i<population.length; i++) {
    values[i] = evaluate(population[i]);
  }
  currentBest = getCurrentBest();
  if(bestValue === undefined || bestValue > currentBest.bestValue) {
    best = population[currentBest.bestPosition].clone();
    bestValue = currentBest.bestValue;
  }
}

//获取当前population数组中的最优解
function getCurrentBest() {
  var bestP = 0,
  currentBestValue = values[0];

  for(var i=1; i<population.length; i++) {
    if(values[i] < currentBestValue) {
      currentBestValue = values[i];
      bestP = i;
    }
  }
  return {
    bestPosition : bestP
    , bestValue    : currentBestValue
  }
}

//设置轮盘
function setRoulette() {
  //计算适应性值，1除以values[i],所以路径最短的适应性值最高
  for(var i=0; i<values.length; i++) { fitnessValues[i] = 1.0/values[i]; }
  //roulette（轮盘）最后类似一个圆周,当前数组中的所有解,依照其适应性的不同，在轮盘中占据的扇形大小不同
  //在下面进行wheelOut的过程中,那些适应性强的解，被选中的概率最大
  var sum = 0;
  for(var i=0; i<fitnessValues.length; i++) { sum += fitnessValues[i]; }
  for(var i=0; i<roulette.length; i++) { roulette[i] = fitnessValues[i]/sum; }
  for(var i=1; i<roulette.length; i++) { roulette[i] += roulette[i-1]; }
}
//旋转轮盘,这是随机选择的过程,但是适应性高的解被选中的概率大
function wheelOut(rand) {
  var i;
  for(i=0; i<roulette.length; i++) {
    if( rand <= roulette[i] ) {
      return i;
    }
  }
}
//随机产生一条路径
function randomIndivial(n) {
  var a = [];
  for(var i=0; i<n; i++) {
    a.push(i);
  }
  return a.shuffle();
}
//计算某一条路径所要走过的距离总和
function evaluate(indivial) {
  var sum = dis[indivial[0]][indivial[indivial.length - 1]];
  for(var i=1; i<indivial.length; i++) {
    sum += dis[indivial[i]][indivial[i-1]];
  }
  return sum;
}

// 计算出dis[i][j]里面存着所有城市二者之间的距离
function countDistances() {
  var length = points.length;
  dis = new Array(length);
  for(var i=0; i<length; i++) {
    dis[i] = new Array(length);
    for(var j=0; j<length; j++) {
      dis[i][j] = ~~distance(points[i], points[j]); 
    }
  }
}
