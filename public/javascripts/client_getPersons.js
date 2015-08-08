socket.on('persons', function(persons){
    console.log(persons);
    var rowDiv = '<div class="row-person"></div>';
    var personDiv = '<div class="person" id="person-1">' +
                        '<div class="name"></div>' +
                        '<div class="general">' +
                            '<div class="state"></div>' +
                            '<div class="location"></div>' +
                        '</div>' +
                        '<div class="attributes">' +
                            '<div class="health" data-title="Здоровье"></div>' +
                            '<div class="fatigue" data-title="Усталость"></div>' +
                            '<div class="hunger" data-title="Голод"></div>' +
                            '<div class="thirst" data-title="Жажда"></div>' +
                            '<div class="somnolency" data-title="Сонливость"></div>' +
                        '</div>' +
                    '</div>';

    if(!isPersonCreated) {
        var rowCount = Math.ceil(persons.length / 4);
        for(var i = 0; i < rowCount; i++){
            var row = document.createElement('div');
            row.className = 'row-person';
            row.id = 'row-person-' + (i + 1);
            var rowPerson = document.body.appendChild(row);
            for(var j = 0; j < 4; j++){
                rowPerson.innerHTML += personDiv;
                document.getElementById('person-1').id = persons[i*4 + j].id;
            }
        }
        isPersonCreated = true;
    }
    for (var i = 0; i < persons.length; i++){
        var personDiv = document.getElementById(persons[i].id);
        personDiv.querySelector(".name").innerHTML = persons[i].name;
        personDiv.querySelector(".state").innerHTML = persons[i].characterisitics.state;
        personDiv.querySelector(".location").innerHTML = 'x: ' + persons[i].characterisitics.location.x +
        ', y: ' + persons[i].characterisitics.location.y;
        personDiv.querySelector(".health").innerHTML = persons[i].characterisitics.item[0].value + '%';
        personDiv.querySelector(".fatigue").innerHTML = persons[i].characterisitics.item[3].value + '%';
        personDiv.querySelector(".hunger").innerHTML = persons[i].characterisitics.item[4].value + '%';
        personDiv.querySelector(".thirst").innerHTML = persons[i].characterisitics.item[5].value + '%';
        personDiv.querySelector(".somnolency").innerHTML = persons[i].characterisitics.item[6].value + '%';
    }



});