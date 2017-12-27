var originString = `
1北京 3639,1315      2上海 4177,2244       3天津 3712,1399
4保定 3569,1438      5承德 3757,1187       6邯郸 3493,1696
7秦皇岛 3904,1289    8石家庄 3488,1535     9唐山 3791,1339
10张家口 3506,1221   11长治  3374,1750     12大同 3376,1306
13临汾 3237,1764     14太原  3326,1556     15运城 3188,1881
16包头 3089,1251     17二连浩特 3258,911   18海拉尔 3814,261
19呼和浩特 3238,1229 20满洲里 3646,234     21锡林浩特 3583,864
22鞍山 4172,1125     23大连  4089,1387     24丹东  4297,1218
25锦州 4020,1142     26沈阳  4196,1044     27营口  4116,1187
28白城 4095,626      29长春  4312,790      30四平  4252,882
31通化 4403,1022     32图们  4685,830      33哈尔滨  4386,570
34黑河 4361,73       35鸡西  4720,557      36佳木斯  4643,404
37牡丹江 4634,654    38齐齐哈尔 4153,426   39同江  4784,279
40宝鸡 2846,1951     41汉中  2831,2099     42西安  3077,1970
43延安 3054,1710     44榆林  3086,1516     45敦煌  1828,1210
46兰州 2562,1756     47天水  2716,1924     48玉门  2061,1277
49张掖 2291,1403     50青铜峡  2751,1559  51银川  2788,1491
52德令哈 2012,1552   53格尔木  1779,1626  54西宁  2381,1676
55阿克苏 682,825     56阿勒泰  1478,267   57哈密  1777,892
58和田 518,1251      59喀什    278,890    60塔城  1064,284
61乌鲁木齐 1332,695  62济南    3715,1678  63济宁  3688,1818
64青岛 4016,1715     65荣成    4181,1574  66潍坊  3896,1656
67烟台 4087,1546     68连云港  3929,1892  69南京  3918,2179
70无锡 4062,2220     71徐州    3751,1945  72扬州  3972,2136
73杭州 4061,2370     74椒江    4207,2533  75金华  4029,2498
76宁波 4201,2397     77温州    4139,2615  78安庆  3766,2364
79蚌埠 3777,2095     80合肥    3780,2212  81黄山  3896,2443
82芜湖 3888,2261     83赣州    3594,2900  84景德镇 3796,2499
85九江 3678,2463     86南昌    3676,2578  87萍乡  3478,2705
88鹰潭 3789,2620     89福州    4029,2838  90龙岩  3810,2969
91三明 3862,2839     92厦门    3928,3029  93高雄  4167,3206
94台北 4263,2931     95台中    4186,3037  96安阳  3486,1755
97开封 3492,1901     98洛阳    3322,1916  99南阳  3334,2107
100信阳 3479,2198    101郑州   3429,1908  102黄石 3587,2417
103沙市 3318,2408    104十堰   3176,2150  105武汉 3507,2376
106襄樊 3296,2217    107宜昌   3229,2367  108常德 3264,2551
109长沙 3394,2643    110彬州   3402,2912  111衡阳 3360,2792
112怀化 3101,2721    113岳阳  3402,2510   114广州 3439,3201
115汕头 3792,3156    116韶关  3468,3018   117深圳 3526,3263
118湛江 3142,3421    119肇庆  3356,3212   120北海 3012,3394
121桂林 3130,2973    122柳州 3044,3081    123南宁 2935,3240
124凭祥 2765,3321    125海口 3140,3557    126三亚 3053,3739
127成都 2545,2357    128重庆 2769,2492    129攀枝花 2284,2803
130绵阳 2611,2275    131西昌 2348,2652    132宜宾 2577,2574
133锘匀 2860,2862    134贵阳 2778,2826    135六盘水 2592,2820
136遵义 2801,2700    137大理 2126,2896    138个旧 2401,3164
139昆明 2370,2975    140畹町 1890,3033    141拉萨 1304,2312
142日喀则 1084,2313  143香港 3538,3298    144澳门 3470,3304
`

function initCitysData(){
    var mpattern = /[\u4e00-\u9fa5]+\s+\d{1,4},\d{1,4}/g
    var realarr=originString.match(mpattern)
    data144=[]
    realarr.forEach((value)=>{
        var tempArr = value.split(/,|\s+/)
        var tempObj = {}
        tempObj.cityname = tempArr[0]
        tempObj.x = parseInt(tempArr[1])/6
        tempObj.y =  parseInt(tempArr[2])/6
        data144.push(tempObj)
    })
    console.log(data144)
    return data144
    
}
initCitysData()