"use strict"
var startParams = {
    hunger: 0,
    thirst: 0,
    fatigue: 0,
    somnolency: 0,
    minute: 0,
    hour: 5,
    day: 1,
    state: 'sleep'
};

var curParams = {
    hunger: 0,
    thirst: 0,
    fatigue: 0,
    somnolency: 0,
    minute: 0,
    hour: 5,
    day: 1,
    state: 'sleep'
};

var changePerHour = {
    sleep: {
        hunger: 0.5,
        thirst: 2.0,
        fatigue: -30.0,
        somnolency: -6.0
    },
    rest: {
        hunger: 1.0,
        thirst: 2.0,
        fatigue: -24.0,
        somnolency: 2.0
    },
    chores: {
        hunger: 1.5,
        thirst: 3.0,
        fatigue: 6.0,
        somnolency: 2.5
    },
    move: {
        hunger: 1.5,
        thirst: 3.0,
        fatigue: 3.0,
        somnolency: 2.5
    },
    work: {
        hunger: 2.0,
        thirst: 4.0,
        fatigue: 12.0,
        somnolency: 3.0
    }
};

function nextStep(){
    let period = +document.querySelector('input[type="radio"]:checked').value;

    curParams.hunger += changePerHour[curParams.state].hunger / period;
    curParams.thirst += changePerHour[curParams.state].thirst / period;
    curParams.fatigue += changePerHour[curParams.state].fatigue / period;
    (curParams.fatigue < 0)?curParams.fatigue = 0:1;
    curParams.somnolency += changePerHour[curParams.state].somnolency / period;
    (curParams.somnolency < 0)?curParams.somnolency = 0:1;

    curParams.minute += (60 / period);
    if(curParams.minute >= 60) {
        curParams.minute -=60;
        curParams.hour++;
        if(curParams.hour > 23) {
            curParams.hour = 0;
            curParams.day++;
        }
    }

    let msg = "";

    // Сон и бодрствование
    if((curParams.hour >= 22 || curParams.hour < 6) &&
        curParams.somnolency > 30 &&
        (curParams.state == 'rest' || curParams.state == 'chores')){
        curParams.state = 'sleep';
        msg += "Засыпаем|";
    }
    if((curParams.hour >= 6 && curParams.hour < 22) &&
        curParams.somnolency < 4 &&
        curParams.state == 'sleep'){
        curParams.state = 'rest';
        msg += "Просыпаемся|";
    }
    // Едим и пьём
    if((curParams.state == 'rest' || curParams.state == 'chores') &&
        curParams.hunger > 6){
        curParams.thirst = 0;
        curParams.hunger = 0;
        msg += "Едим и пьём|";
    }
    if((curParams.state == 'rest' || curParams.state == 'move' ||
        curParams.state == 'chores' || curParams.state == 'work') &&
        curParams.thirst > 6){
        curParams.thirst = 0;
        msg += "Пьём|";
    }
    //Работаем
    if(curParams.state != 'sleep' && curParams.hunger <= 6 && curParams.thirst <= 6 &&
        curParams.somnolency <= 8 && curParams.fatigue <= 10){
        curParams.state = 'work';
        msg += "Начинаем работать|";
    }
    if(curParams.state == 'work' && curParams.fatigue > 60 && curParams.somnolency <= 26) {
        curParams.state = 'rest';
        msg += "Перерыв в работе|";
    }
    if(curParams.state == 'rest' && curParams.somnolency <= 26 && curParams.fatigue < 40){
        curParams.state = 'work';
        msg += "Закончили перерыв, продолжаем работать|";
    }
    if(curParams.state == 'work' && curParams.somnolency > 26 && curParams.fatigue > 80) {
        curParams.state = 'rest';
        msg += "Закончили работать|";
    }
    // Едим и пьём
    if((curParams.state == 'rest' || curParams.state == 'chores') &&
        curParams.hunger > 6){
        curParams.thirst = 0;
        curParams.hunger = 0;
        msg += "Едим и пьём|";
    }
    if((curParams.state == 'rest' || curParams.state == 'move' ||
        curParams.state == 'chores' || curParams.state == 'work') &&
        curParams.thirst > 6){
        curParams.thirst = 0;
        msg += "Пьём|";
    }

    writeCurParam(msg);
}

function writeCurParam(msg){
    let hunger = Math.floor(curParams.hunger * 100) / 100;
    let thirst = Math.floor(curParams.thirst * 100) / 100;
    let fatigue = Math.floor(curParams.fatigue * 100) / 100;
    let somnolency = Math.floor(curParams.somnolency * 100) / 100;
    let minutes = (curParams.minute < 10)?('0' + curParams.minute):curParams.minute;
    let hours = (curParams.hour < 10)?('0' + curParams.hour):curParams.hour;
    let days = curParams.day;
    let state = curParams.state;

    text.value += `${days} день, ${hours}:${minutes} | Состояние: ${state} | голод: ${hunger}, жажда: ${thirst}, усталость: ${fatigue}, сонливость: ${somnolency} | ${msg}\n`;
    text.scrollTop = text.scrollHeight;
}

var button = document.getElementById("button");
var text = document.getElementById("text");
writeCurParam("");
button.onclick = nextStep;