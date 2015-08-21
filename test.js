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
    for(i = 0; i < chunks.length; i++){
        if(chunks[i]._id == id){
            return chunks[i];
        }
    }
}

function createFormattedChunkInfo(chunkId){
    var chunk = getChunkById(chunkId);

}

function showChunkInfo(e){
    //Честные координаты карты, очищенные от всего
    var mapX = e.pageX - canvas.offsetLeft - startX;
    var mapY = e.pageY - canvas.offsetTop - startY;
    var virtualChunkX = Math.floor(mapX / 128);
    var virtualChunkY = Math.floor(mapY / 128);
    //mapInfo.innerHTML = 'x: ' + virtualChunkX + ', y: ' + virtualChunkY;
    if(virtualChunkX >= 0 && virtualChunkX < 5 && virtualChunkY >= 0 && virtualChunkY < 5) {
        mapInfo.innerHTML = createFormattedChunkInfo(virtualChunks[virtualChunkX][virtualChunkY]);
    }
};

var canvas = document.getElementById('canvas');
canvas.width = 700;
canvas.height = 700;
canvas.onmousemove = showChunkInfo;
var ctx = canvas.getContext('2d');
ctx.strokeStyle = '#cecece';
var startX = 30.5;
var startY = 30.5;

for(i = 0; i < 5; i++){
    for(var j = 0; j < 5;j++){
        ctx.strokeRect(startX + 128*i, startY + 128*j, 128, 128);
    }
}















