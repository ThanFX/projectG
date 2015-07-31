
var setDisplayTime = function(value){
    if(+value < 10){
        value = '0' + value;
    }
    return value;
};
socket.on('worldDate', function(worldDate){
    var wd = document.querySelector('.worldDate');
    var date = 'Сейчас '+ worldDate.day + ' день ' + worldDate.ten_day +
        ' декады ' + worldDate.month + ' месяца ' + worldDate.year +
        ' года, ' + setDisplayTime(worldDate.hour) + ':' +
        setDisplayTime(worldDate.minute);
    wd.innerHTML = date;
});