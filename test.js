var chunks = [
    {
        "_id":"55d20fe357ba812cd1096c73",
        "x":5,
        "y":-7,
        "isExplored":true,
        "terrains":{
            "roads":[
                {
                    "onRiver":"bottom",
                    "direction":"W-C",
                    "size":1
                },
                {
                    "onRiver":"across",
                    "direction":"S-N",
                    "size":2
                }
            ],
            "rivers":[
                {
                    "quality":1,
                    "bridge":3,
                    "direction":"W-E",
                    "size":1,
                    "percentArea":0.1
                }
            ],
            "meadow":
            {
                "quality":1,
                "passability":0.9,
                "type":"",
                "percentArea":69.9
            },
            "forest":
            {
                "quality":1,
                "passability":0.8,
                "type":"",
                "percentArea":15
            },
            "urban":
            {
                "onRiver":"across",
                "townId":"12314",
                "type":"village",
                "percentArea":15
            }
        }
    },
    {
        "_id":"55d449d5ccf209198edc341b",
        "x":6,
        "y":-7,
        "isExplored":true,
        "terrains": {
            "rivers": [
                {
                    "quality": 1,
                    "bridge": 0,
                    "direction": "W-E",
                    "size": 1,
                    "percentArea": 0.1
                }
            ],
            "meadow": {
                "quality": 2,
                "passability": 0.9,
                "type": "",
                "percentArea": 79.9
            },
            "forest": {
                "quality": 1,
                "passability": 0.8,
                "type": "",
                "percentArea": 20
            }
        }
    },
    {
        "_id":"55d44acfccf209198edc341d",
        "x":6,
        "y":-8,
        "isExplored":true,
        "terrains":{
            "meadow":{
                "quality":3,
                "passability":0.8,
                "type":"",
                "percentArea":95
            },
            "forest":{
                "quality":1,
                "passability":0.9,
                "type":"",
                "percentArea":5
            }
        }
    },
    {
        "_id":"55d44af8ccf209198edc341f",
        "x":6,
        "y":-9,
        "isExplored":true,
        "terrains":{
            "meadow":{
                "quality":3,
                "passability":0.8,
                "type":"",
                "percentArea":95
            },
            "forest":{
                "quality":1,
                "passability":0.9,
                "type":"",
                "percentArea":5
            }
        }
    },
    {
        "_id":"55d4585cccf209198edc3421",
        "x":5,
        "y":-8,
        "isExplored":true,
        "terrains":{
            "roads":[{"direction":"S-N","size":2}],"field":{"quality":2,"passability":0.9,"type":"","percentArea":45},"meadow":{"quality":1,"passability":0.9,"type":"","percentArea":50},"forest":{"quality":1,"passability":0.9,"type":"","percentArea":5}}},
    {
        "_id":"55d46262ccf209198edc3423",
        "x":5,
        "y":-9,
        "isExplored":true,
        "terrains":{
            "roads":[{"direction":"S-N","size":2}],"hill":{"quality":2,"passability":0.7,"type":"","percentArea":60},"meadow":{"quality":2,"passability":0.9,"type":"","percentArea":30},"forest":{"quality":1,"passability":0.9,"type":"","percentArea":10}}},
    {
        "_id":"55d462e2ccf209198edc3425",
        "x":4,
        "y":-9,
        "isExplored":true,
        "terrains":{
            "hill":{"quality":2,"passability":0.7,"type":"","percentArea":80},"meadow":{"quality":1,"passability":0.9,"type":"","percentArea":10},"forest":{"quality":1,"passability":0.9,"type":"","percentArea":10}}},
    {
        "_id":"55d462f9ccf209198edc3427",
        "x":3,
        "y":-9,
        "isExplored":true,
        "terrains":{
            "hill":{"quality":2,"passability":0.7,"type":"","percentArea":80},"meadow":{"quality":1,"passability":0.9,"type":"","percentArea":10},"forest":{"quality":1,"passability":0.9,"type":"","percentArea":10}}},
    {
        "_id":"55d463afccf209198edc3429",
        "x":4,
        "y":-8,
        "isExplored":true,
        "terrains":{
            "field":{"quality":3,"passability":0.8,"type":"","percentArea":90},"meadow":{"quality":1,"passability":0.9,"type":"","percentArea":5},"forest":{"quality":1,"passability":0.9,"type":"","percentArea":5}}},
    {
        "_id":"55d463c2ccf209198edc342b",
        "x":3,
        "y":-8,
        "isExplored":true,
        "terrains":{
            "field":{"quality":3,"passability":0.8,"type":"","percentArea":90},"meadow":{"quality":1,"passability":0.9,"type":"","percentArea":5},"forest":{"quality":1,"passability":0.9,"type":"","percentArea":5}}},
    {
        "_id":"55d467c1ccf209198edc342d",
        "x":4,
        "y":-7,
        "isExplored":true,
        "terrains":{
            "roads":[{"onRiver":"bottom","direction":"W-E","size":1}],"rivers":[{"quality":1,"bridge":0,"direction":"W-E","size":1,"percentArea":0.1}],"meadow":{"quality":2,"passability":0.8,"type":"","percentArea":29.9},"forest":{"quality":2,"passability":0.7,"type":"","percentArea":70}}},
    {
        "_id":"55d467d9ccf209198edc342f",
        "x":3,
        "y":-7,
        "isExplored":true,
        "terrains":{
            "roads":[{"onRiver":"bottom","direction":"W-E","size":1}],"rivers":[{"quality":1,"bridge":0,"direction":"W-E","size":1,"percentArea":0.1}],"meadow":{"quality":2,"passability":0.8,"type":"","percentArea":29.9},"forest":{"quality":2,"passability":0.7,"type":"","percentArea":70}}},
    {
        "_id":"55d46c8fccf209198edc3431",
        "x":7,
        "y":-9,
        "isExplored":true,
        "terrains":{
            "rivers":[{"quality":3,"bridge":0,"direction":"S-N","size":5,"percentArea":5}],"meadow":{"quality":2,"passability":0.9,"type":"","percentArea":5},"forest":{"quality":3,"passability":0.6,"type":"","percentArea":90}}},
    {
        "_id":"55d46c9dccf209198edc3433",
        "x":7,
        "y":-8,
        "isExplored":true,
        "terrains":{
            "rivers":[{"quality":3,"bridge":0,"direction":"S-N","size":5,"percentArea":5}],"meadow":{"quality":2,"passability":0.9,"type":"","percentArea":5},"forest":{"quality":3,"passability":0.6,"type":"","percentArea":90}}},
    {
        "_id":"55d46ca9ccf209198edc3435",
        "x":7,
        "y":-7,
        "isExplored":true,
        "terrains":{
            "rivers":[{"quality":3,"bridge":0,"direction":"S-N","size":5,"percentArea":5},{"quality":1,"bridge":0,"direction":"W-C","size":1,"percentArea":1}],"meadow":{"quality":2,"passability":0.9,"type":"","percentArea":4},"forest":{"quality":3,"passability":0.6,"type":"","percentArea":90}}},
    {
        "_id":"55d46f93ccf209198edc343d",
        "x":6,
        "y":-6,
        "isExplored":true,
        "terrains":{
            "meadow":{
                "quality":2,
                "passability":0.9,
                "type":"",
                "percentArea":5
            },
            "forest":{
                "quality":3,
                "passability":0.7,
                "type":"",
                "percentArea":95
            }
        }
    },
    {
        "_id":"55d46ce0ccf209198edc3437",
        "x":7,
        "y":-6,
        "isExplored":true,
        "terrains":{
            "rivers":[{"quality":3,"bridge":0,"direction":"S-N","size":5,"percentArea":5}],"swamp":{"quality":1,"passability":0.4,"type":"","percentArea":5},"forest":{"quality":4,"passability":0.5,"type":"","percentArea":90}}},
    {
        "_id":"55d46d99ccf209198edc3439",
        "x":6,
        "y":-5,
        "isExplored":true,
        "terrains":{
            "rivers":[{"quality":3,"bridge":0,"direction":"E-N","size":5,"percentArea":5}],"swamp":{"quality":2,"passability":0.4,"type":"","percentArea":10},"forest":{"quality":4,"passability":0.5,"type":"","percentArea":85}}},
    {
        "_id":"55d46de6ccf209198edc343b",
        "x":7,
        "y":-5,
        "isExplored":true,
        "terrains":{
            "rivers":[
                {
                    "quality":3,
                    "bridge":0,
                    "direction":"S-W",
                    "size":5,
                    "percentArea":5
                }
            ],
            "swamp":{
                "quality":3,
                "passability":0.3,
                "type":"",
                "percentArea":30
            },
            "forest":{
                "quality":4,
                "passability":0.5,
                "type":"",
                "percentArea":65
            }
        }
    },
    {
        "_id":"55d46fa1ccf209198edc343f",
        "x":4,
        "y":-6,
        "isExplored":true,
        "terrains":{
            "meadow":{
                "quality":1,
                "passability":0.9,
                "type":"",
                "percentArea":5
            },
            "forest":{
                "quality":3,
                "passability":0.7,
                "type":"",
                "percentArea":95
            }
        }
    },
    {
        "_id":"55d46fb2ccf209198edc3441",
        "x":3,
        "y":-6,
        "isExplored":true,
        "terrains":{
            "meadow":{
                "quality":1,
                "passability":0.9,
                "type":"",
                "percentArea":5
            },
            "forest":{
                "quality":3,
                "passability":0.7,
                "type":"",
                "percentArea":95
            }
        }
    },
    {
        "_id":"55d46ff8ccf209198edc3443",
        "x":3,
        "y":-5,
        "isExplored":true,
        "terrains":{
            "forest":{
                "quality":4,
                "passability":0.5,
                "type":"",
                "percentArea":100
            }
        }
    },
    {
        "_id":"55d47028ccf209198edc3445",
        "x":4,
        "y":-5,
        "isExplored":true,
        "terrains":{
            "forest":{
                "quality":4,
                "passability":0.5,
                "type":"",
                "percentArea":100
            }
        }
    },
    {
        "_id":"55d4704cccf209198edc3447",
        "x":5,
        "y":-5,
        "isExplored":true,
        "terrains":{
            "roads":[
                {
                    "direction":"S-N"
                    ,"size":2
                }
            ],
            "forest":{
                "quality":4,
                "passability":0.5,
                "type":"",
                "percentArea":100
            }
        }
    },
    {
        "_id":"55d470d7ccf209198edc3449",
        "x":5,
        "y":-6,
        "isExplored":true,
        "terrains":{
            "roads":[
                {
                    "direction":"S-N",
                    "size":2
                }
            ],
            "meadow":{
                "quality":1,
                "passability":0.9,
                "type":"",
                "percentArea":5
            },
            "forest":{
                "quality":3,
                "passability":0.7,
                "type":"",
                "percentArea":95
            }
        }
    }
];

var rand = function (min, max) {
    return Math.floor(min + Math.random()*(max +1 - min));
};

var virtualChunks = [];
// Пиздец какой хак, но я не нашел, как в этом блядском JS по другому объявить двумерный массив (((
virtualChunks[0] = [];
virtualChunks[1] = [];
virtualChunks[2] = [];
virtualChunks[3] = [];
virtualChunks[4] = [];

for(var i = 0; i < chunks.length; i++){
    virtualChunks[(+chunks[i].x) - 3][-5 - (+chunks[i].y)] = chunks[i]._id;
}

var mapInfo = document.querySelector('.map-info');

function getChunkById(id){
    for(var i = 0; i < chunks.length; i++){
        if(chunks[i]._id == id){
            return chunks[i];
        }
    }
}

function getMajorTerrain(chunkId) {
    var chunk = getChunkById(chunkId);
    var majorTerrains = '';
    var m = 0;
    for(key in chunk.terrains){
        if(key != 'urban' && key != 'roads' && key != 'rivers'){
            if (m < +chunk.terrains[key].percentArea) {
                m = +chunk.terrains[key].percentArea;
                majorTerrains = key;
            }
        }
    }
    return majorTerrains;
}

// Задаем цвет чанку, цвет зависит от преобладающей местности
function getChunkColor(x, y){
    var chunkColor = '';
    var terrainColor = {
        "forest": '#267F00',
        "meadow": '#4CFF00',
        "field": '#FFF71E',
        "hill": '#7F6A00',
        "swamp": '#B6FF00'
    };
    chunkColor = terrainColor[getMajorTerrain(virtualChunks[x][y])];
    return chunkColor?chunkColor:'#808080';
}

function drowRoadsAndRivers(x, y){
    var dir = {
        "N": {
            "x": chunkWidth/2,
            "y": 0
        },
        "E": {
            "x": chunkWidth,
            "y": chunkHeight/2
        },
        "S": {
            "x": chunkWidth/2,
            "y": chunkHeight
        },
        "W": {
            "x": 0,
            "y": chunkHeight/2
        },
        "C": {
            "x": chunkWidth/2,
            "y": chunkHeight/2
        }
    };
    var chunk = getChunkById(virtualChunks[x][y]);

    var isRoad = !!('roads' in chunk.terrains);
    var isRiver = !!('rivers' in chunk.terrains);

    var chunkStartX = startMapX + (x * chunkWidth);
    var chunkStartY = startMapY + (y * chunkHeight);




    if(isRoad){
        ctx.strokeStyle = '#654200';
        ctx.lineJoin = 'round';
        for(var i = 0; i < chunk.terrains.roads.length; i++){
            ctx.lineWidth = chunk.terrains.roads[i].size;
            ctx.beginPath();
            var roadBeginPath = chunk.terrains.roads[i].direction[0];
            var roadEndPath = chunk.terrains.roads[i].direction[2];
            // Координаты дополнительных точек (для "извилисости")
            var addPointX = chunkStartX + rand(chunkWidth*0.25, chunkWidth*0.75);
            var addPointY = chunkStartY + rand(chunkHeight*0.25, chunkHeight*0.75);
            var addPointX2 = chunkStartX + rand(chunkWidth*0.25, chunkWidth*0.75);
            var addPointY2 = chunkStartY + rand(chunkHeight*0.25, chunkHeight*0.75);
            //console.log(addPointX);
            //console.log(addPointY);

            ctx.moveTo(chunkStartX + dir[roadBeginPath].x, chunkStartY + dir[roadBeginPath].y);
            if(roadBeginPath == 'C' || roadEndPath == 'C'){
                ctx.lineTo(chunkStartX + dir[roadEndPath].x, chunkStartY + dir[roadEndPath].y);
            } else {
                ctx.bezierCurveTo(addPointX, addPointY, addPointX2, addPointY2,chunkStartX + dir[roadEndPath].x, chunkStartY + dir[roadEndPath].y);
            }
            //ctx.quadraticCurveTo(addPointX, addPointY, chunkStartX + dir[roadEndPath].x, chunkStartY + dir[roadEndPath].y);
            ctx.stroke();
        }
    }
    if(isRiver){
        ctx.strokeStyle = '#0026FF';
        ctx.lineJoin = 'round';
        for(i = 0; i < chunk.terrains.rivers.length; i++){
            var riverBeginPath = chunk.terrains.rivers[i].direction[0];
            var riverEndPath = chunk.terrains.rivers[i].direction[2];
            addPointX = chunkStartX + rand(chunkWidth*0.25, chunkWidth*0.75);
            addPointY = chunkStartY + rand(chunkHeight*0.25, chunkHeight*0.75);
            addPointX2 = chunkStartX + rand(chunkWidth*0.25, chunkWidth*0.75);
            addPointY2 = chunkStartY + rand(chunkHeight*0.25, chunkHeight*0.75);
            ctx.lineWidth = chunk.terrains.rivers[i].size;
            ctx.beginPath();
            ctx.moveTo(chunkStartX + dir[riverBeginPath].x, chunkStartY + dir[riverBeginPath].y);
            if(riverBeginPath == 'C' || riverEndPath == 'C'){
                ctx.lineTo(chunkStartX + dir[riverEndPath].x, chunkStartY + dir[riverEndPath].y);
            } else {
                ctx.bezierCurveTo(addPointX, addPointY, addPointX2, addPointY2, chunkStartX + dir[riverEndPath].x, chunkStartY + dir[riverEndPath].y);
            }
            //ctx.quadraticCurveTo(addPointX, addPointY, chunkStartX + dir[riverEndPath].x, chunkStartY + dir[riverEndPath].y);
            ctx.stroke();
        }
    }
}



// Простое форматирование данных чанка для облегчения понимания
function createFormattedChunkInfo(chunkId){
    var chunk = getChunkById(chunkId);
    var info = 'Координаты чанка<br>x: ' + chunk.x + ', y: ' + chunk.y + '<hr>';
    var towns = '';
    var rivers = '';
    var roads = '';
    var others = '';
    for(var key in chunk.terrains){
        if(key == 'urban'){
            towns = 'Населенный пункт:<br>' +
                    'Занимаемая площадь: ' + chunk.terrains.urban.percentArea + '%<br>' +
                    'Тип: ' + chunk.terrains.urban.type + '<br>' +
                    'Название: ' + chunk.terrains.urban.townId + '<hr>';
        } else if(key == 'roads'){
            roads = 'Дороги:<br>';
            for(i = 0; i < chunk.terrains.roads.length; i++){
                roads += (i + 1) + ': Размер: ' + chunk.terrains.roads[i].size +
                    ', направление: ' + chunk.terrains.roads[i].direction + '<br>';
            }
            roads += '<hr>';
        } else if(key == 'rivers'){
            rivers = 'Реки:<br>';
            for(i = 0; i < chunk.terrains.rivers.length; i++){
                rivers += (i + 1) + ': Размер: ' + chunk.terrains.rivers[i].size +
                ', направление: ' + chunk.terrains.rivers[i].direction +
                ', качество: ' + chunk.terrains.rivers[i].quality +
                ', мост: ' + chunk.terrains.rivers[i].bridge + '<br>';
            }
        } else {
            others += key + ':<br>' +
            'Занимаемая площадь: ' + chunk.terrains[key].percentArea + '%<br>' +
            'Проходимость: ' + chunk.terrains[key].passability + '<br>' +
            'Качество: ' + chunk.terrains[key].quality + '<hr>';
        }
    }

    info += towns + roads + others + rivers;
    return info;
}

// Крайне неоптимально, но сейчас пофиг
function showChunkInfo(e){
    //Честные координаты карты, очищенные от всего
    var mapX = e.pageX - canvas.offsetLeft - startMapX;
    var mapY = e.pageY - canvas.offsetTop - startMapY;
    var virtualChunkX = Math.floor(mapX / 128);
    var virtualChunkY = Math.floor(mapY / 128);
    //mapInfo.innerHTML = 'x: ' + virtualChunkX + ', y: ' + virtualChunkY;
    if(virtualChunkX >= 0 && virtualChunkX < 5 && virtualChunkY >= 0 && virtualChunkY < 5) {
        mapInfo.innerHTML = createFormattedChunkInfo(virtualChunks[virtualChunkX][virtualChunkY]);
    } else {
        mapInfo.innerHTML = '';
    }
}

var canvas = document.getElementById('canvas');
canvas.width = 700;
canvas.height = 700;
var chunkHeight = 128;
var chunkWidth = 128;
canvas.onclick = showChunkInfo;
var ctx = canvas.getContext('2d');
ctx.strokeStyle = '#cecece';
var startMapX = 30.5;
var startMapY = 30.5;

for(i = 0; i < 5; i++){
    for(var j = 0; j < 5; j++){
        ctx.fillStyle = getChunkColor(i, j);
        ctx.fillRect(startMapX + chunkWidth*i, startMapY + chunkHeight*j, chunkWidth, chunkHeight);
        drowRoadsAndRivers(i, j);
    }
}