socket.on('chunks', function(chunks) {
    chunks_client = chunks;
    drawChunks();
    getPersons();
});

socket.on('persons', function(persons) {
    persons_client = persons;
    drawAllPersons();
});

socket.on('person', function(person){
   drawPersonInfo(person);
});

function getChunks(){
    socket.emit('getChunks', function(chunks){
        //chunks_client = chunks;
    });
}

function getPersons(){
    socket.emit('getAllPersons');
}

function getPerson(personId){
    socket.emit('getPerson', personId);
}

var rand = function (min, max) {
    return Math.floor(min + Math.random()*(max +1 - min));
};

var mapInfo = document.querySelector('.map-info');
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
var virtualChunks = [];
// Пиздец какой хак, но я не нашел, как в этом блядском JS по другому объявить двумерный массив (((
virtualChunks[0] = [];
virtualChunks[1] = [];
virtualChunks[2] = [];
virtualChunks[3] = [];
virtualChunks[4] = [];

getChunks();

function drawChunks(){
    for (var i = 0; i < chunks_client.length; i++) {
        virtualChunks[(+chunks_client[i].x) - 3][-5 - (+chunks_client[i].y)] = chunks_client[i]._id;
    }
    for(i = 0; i < 5; i++){
        for(var j = 0; j < 5; j++){
            ctx.fillStyle = getChunkColor(i, j);
            ctx.fillRect(startMapX + chunkWidth*i, startMapY + chunkHeight*j, chunkWidth, chunkHeight);
            drawRoadsAndRivers(i, j);
        }
    }
}

function getChunkById(id){
    for(var i = 0; i < chunks_client.length; i++){
        if(chunks_client[i]._id == id){
            return chunks_client[i];
        }
    }
}

function getMajorTerrain(chunkId) {
    var chunk = getChunkById(chunkId);
    var majorTerrains = '';
    var m = 0;
    for(var key in chunk.terrains){
        if (!chunk.terrains.hasOwnProperty(key)) continue;
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
    var terrainColor = {
        "forest": '#267F00',
        "meadow": '#4CFF00',
        "field": '#FFF71E',
        "hill": '#7F6A00',
        "swamp": '#B6FF00'
    };
    var chunkColor = terrainColor[getMajorTerrain(virtualChunks[x][y])];
    return chunkColor?chunkColor:'#808080';
}

function drawRoadsAndRivers(x, y){
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
        if (!chunk.terrains.hasOwnProperty(key)) continue;
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
            for(var i = 0; i < chunk.terrains.rivers.length; i++){
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
    //Честные координаты карты, очищенные от всего (без учета прокрутки страницы!!!)
    var canvasRect = canvas.getClientRects();
    var mapX = e.pageX - canvasRect[0].left - startMapX;
    var mapY = e.pageY - canvasRect[0].top - startMapY;
    var virtualChunkX = Math.floor(mapX / 128);
    var virtualChunkY = Math.floor(mapY / 128);
    if(virtualChunkX >= 0 && virtualChunkX < 5 && virtualChunkY >= 0 && virtualChunkY < 5) {
        mapInfo.innerHTML = createFormattedChunkInfo(virtualChunks[virtualChunkX][virtualChunkY]);
    } else {
        mapInfo.innerHTML = '';
    }
}

//Криво до безумия, но пока пофиг!
function drawPersonInfo(person){
    var personDiv = '<div class="person-info-text">' +
        '<div class="name"></div>' +
        '<div class="general">' +
        '<div class="state"></div>' +
        '<div class="action"></div>' +
        '<div class="stage"></div>' +
        '<div class="location"></div>' +
        '</div>' +
        '<div class="attributes">' +
        '<div class="health"></div>' +
        '<div class="fatigue"></div>' +
        '<div class="hunger"></div>' +
        '<div class="thirst"></div>' +
        '<div class="somnolency"></div>' +
        '</div>' +
        '</div>';
    var personInfo = document.querySelector('.person-info');
    personInfo.innerHTML = personDiv;
    var personDivCh = document.querySelector('.person-info-text');
    personDivCh.querySelector(".name").innerHTML = person[0].name;
    personDivCh.querySelector(".state").innerHTML = person[0].characterisitics.state;
    personDivCh.querySelector(".action").innerHTML = person[0].characterisitics.action;
    personDivCh.querySelector(".stage").innerHTML = person[0].characterisitics.stage;
    personDivCh.querySelector(".location").innerHTML = 'x: ' + person[0].characterisitics.location.x +
    ', y: ' + person[0].characterisitics.location.y;
    personDivCh.querySelector(".health").innerHTML = person[0].characterisitics.item.health.value + '%';
    personDivCh.querySelector(".health").setAttribute('data-title', person[0].characterisitics.item.health.title);
    personDivCh.querySelector(".fatigue").innerHTML = person[0].characterisitics.item.fatigue.value + '%';
    personDivCh.querySelector(".fatigue").setAttribute('data-title', person[0].characterisitics.item.fatigue.title);
    personDivCh.querySelector(".hunger").innerHTML = person[0].characterisitics.item.hunger.value + '%';
    personDivCh.querySelector(".hunger").setAttribute('data-title', person[0].characterisitics.item.hunger.title);
    personDivCh.querySelector(".thirst").innerHTML = person[0].characterisitics.item.thirst.value + '%';
    personDivCh.querySelector(".thirst").setAttribute('data-title', person[0].characterisitics.item.thirst.title);
    personDivCh.querySelector(".somnolency").innerHTML = person[0].characterisitics.item.somnolency.value + '%';
    personDivCh.querySelector(".somnolency").setAttribute('data-title', person[0].characterisitics.item.somnolency.title);
}

function showPersonInfo(e){
    socket.emit('getPerson', e.target.id);
}

function drawAllPersons(){
    var mapHTML = document.querySelector('.map');
    // хардкодим центральный чанк
    var chunkStartX = startMapX + (2 * chunkWidth);
    var chunkStartY = startMapY + (2 * chunkHeight);
    for(var i = 0; i < persons_client.length; i++) {
        var pIcon = document.createElement('div');
        if(persons_client[i].job == 'fishing'){
            pIcon.className = 'person-job-icon';
        } else {
            pIcon.className = 'person-icon';
        }
        pIcon.id = persons_client[i].id;
        var mapPersonIcon = mapHTML.appendChild(pIcon);
        mapPersonIcon.style.top = chunkStartY + rand(8, 120) + 'px';
        mapPersonIcon.style.left = chunkStartX + rand(8, 120) + 'px';
        mapPersonIcon.addEventListener('click', showPersonInfo);
    }
}