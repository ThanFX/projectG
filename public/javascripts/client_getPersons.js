socket.on('persons', function(persons){
    persons_client = persons;
    var rowDiv = '<div class="row-person"></div>';
    var personDiv = '<div class="person" id="person-1">' +
                        '<div class="name"></div>' +
                        '<div class="general">' +
                            '<div class="state"></div>' +
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

    for (i = 0; i < persons.length; i++){
        var personDivCh = document.getElementById(persons[i].id);
        personDivCh.querySelector(".name").innerHTML = persons[i].name;
        personDivCh.querySelector(".state").innerHTML = persons[i].characterisitics.state;
        personDivCh.querySelector(".location").innerHTML = 'x: ' + persons[i].characterisitics.location.x +
        ', y: ' + persons[i].characterisitics.location.y;
        personDivCh.querySelector(".health").innerHTML = persons[i].characterisitics.item.health.value + '%';
        personDivCh.querySelector(".health").setAttribute('data-title', persons[i].characterisitics.item.health.title);
        personDivCh.querySelector(".fatigue").innerHTML = persons[i].characterisitics.item.fatigue.value + '%';
        personDivCh.querySelector(".fatigue").setAttribute('data-title', persons[i].characterisitics.item.fatigue.title);
        personDivCh.querySelector(".hunger").innerHTML = persons[i].characterisitics.item.hunger.value + '%';
        personDivCh.querySelector(".hunger").setAttribute('data-title', persons[i].characterisitics.item.hunger.title);
        personDivCh.querySelector(".thirst").innerHTML = persons[i].characterisitics.item.thirst.value + '%';
        personDivCh.querySelector(".thirst").setAttribute('data-title', persons[i].characterisitics.item.thirst.title);
        personDivCh.querySelector(".somnolency").innerHTML = persons[i].characterisitics.item.somnolency.value + '%';
        personDivCh.querySelector(".somnolency").setAttribute('data-title', persons[i].characterisitics.item.somnolency.title);
    }
});