let nav = 0;
let clicked = null;

// Events state af objekter. Tjekker om "events" eksistere i localStorage ved brug af "turnary operator", hvor man kan kalde JSON.parse(x) på vores events, hvis ikke det eksistere, skal den returnere et tomt array.
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
let findEvents = [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag'];
const timeslot = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

function openModal(date){
    
    clicked = date;
    document.getElementById("modalDate").value = date;

    const pickTime = document.getElementById("pickTime");
    const tableBody = document.querySelector('#timetable #tableBody');
    $('#tableBody').find("tr:gt(0)").remove();
    

    console.log('timeslot: ' + timeslot.length)
    timeslot.forEach(times => {
        let row = document.createElement('tr');
        let cell = document.createElement('td');
        
        let textNode = document.createTextNode(times);

        // console.log(findEvents.length)
        findEvents.forEach(e => {
            e.forEach(i => {
                // console.log(i);
                if (i.date === clicked) {

                    if (times === i.timeSlot) {
                        textNode.textContent = i.title;
                        row.style = "background-color: #fb6f6f;";
                    }
                }
            });
        });
        
        if (textNode.textContent !== "Tid taget"){
            row.addEventListener('click', () => {
                pickTime.innerText = row.textContent;
            });
        }
        
        cell.appendChild(textNode);
        row.appendChild(cell);
        
        tableBody.appendChild(row);
    });
    
    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    
    newEventModal.style.display = 'block';
    backDrop.style.display = 'block';
}

function load() {

    const dt = new Date();
    // console.log(dt);

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // console.log(daysInMonth + " dage i måned");

    const dateString = firstDayOfMonth.toLocaleDateString('da-dk', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    })
    // console.log(dateString + " Her");

    // splitter strengen dateString der består af (Weekday 1.1.2021) hvor vi skal bruge ugedagen/første dag i måneden. ** Forskel på da-dk og en-uk er at strengen deles med komma og mellemrum. **
    const paddingDays = weekdays.indexOf(dateString.split(' ')[0]);
    // console.log(paddingDays + " PaddingDays");

    document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('da-dk', {month: 'long'})} ${year}`
    
    // Sørger for at hver gang vi kalder load() funktionen, at vi ikke laver en ny kalender under den første.
    calendar.innerHTML = '';

    // Oprettelse af alle vores "dagblokke" således at vi laver x antal dage i kalenderen + de "tomme dage".
    // grundet dansk tidsmønster bliver vi nød til at lægge 1 til "daysInMonth", ellers fanger vi ikke den sidste dag i måneden.
    for (let i = 1; i < paddingDays + daysInMonth + 1; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        let dayHolder = i - paddingDays;
        let monthHolder = month + 1;
        const numberZero = "0";
        
        // Begge If statements sørger for at omskrive hhv. dag og måned int's så de passer ind i formatet til at kunne læses og indsættes på input=date i html formen
        if(0 < dayHolder && dayHolder < 10) {
            dayHolder = numberZero.concat(dayHolder);
            // console.log(dayHolder);
        }
        // console.log(dayHolder);

        if(0 < monthHolder && monthHolder < 10) {
            monthHolder = numberZero.concat(monthHolder);
        }
        // console.log(monthHolder);

        const dayString = `${year}-${monthHolder}-${dayHolder}`;
        // console.log(dayString + " daystring")

        // filtrere events array'et (muligvis lægger til hver gang)
        findEvents.push(events.filter(e => e.date === dayString));

        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;
            const eventForDay = events.find(e => e.date === dayString);

            if (i - paddingDays === day && nav === 0) {
                daySquare.id = 'currentDay';
            }
            // Her laves tekst for event på kalenderen
            if (eventForDay) {

                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = "Ledige tider tilbage";
                daySquare.appendChild(eventDiv);
            }
            
            daySquare.addEventListener('click', () => openModal(dayString));
        } else {
            daySquare.classList.add('padding');
        }
        // daySquare.addEventListener('click', () => console.log(clicked));
        calendar.appendChild(daySquare);
    }
};

function closeModal(){
        newEventModal.style.display = 'none';
        backDrop.style.display = 'none';
        clicked = null;
        findEvents = [];

        load();
}

function initButtons() {

    // knapper til at springe mellem månederne.
document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
});

document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
});

document.getElementById('saveButton').addEventListener('click', saveEvent);
document.getElementById('cancelButton').addEventListener('click', closeModal);


}

async function saveEvent() {

    const dateChosen = document.getElementById('modalDate').value;
    const timeSlotChosen = document.getElementById('pickTime').innerHTML;
    // const hairCutChosen = document.getElementById('hairCutCheckBox');
    // const colorChosen = document.getElementById('colorCheckBox');
    const messageChosen = document.getElementById('eventMessage').value;
    
    let checkStateHairCut = $("#hairCutCheckBox").is(":checked") ? "true" : "false";
    let checkStateColor = $("#colorCheckBox").is(":checked") ? "true" : "false";


    // console.log(`${dateChosen} + ${timeSlotChosen} + ${messageChosen} +  ${checkStateHairCut} + ${checkStateColor}`);
    
    await fetch('/api/users/createEvent', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            date: dateChosen,
            timeSlot: timeSlotChosen,
            hairCut: checkStateHairCut,
            color: checkStateColor,
            message: messageChosen,
        }),
    })
    .then( response => response.json())
    .then( response => {
        console.log("1");
        console.log(response);
        console.log("2");
        closeModal();
        return response;
    })
    .catch((error) => {
        console.log('Error: ', error);
    });
    findEvents = [];
};

async function loadAllEvents() {
    
    await fetch('/api/users/getAllEvents', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then( response => {
        return response.json();
    })
    .then(data => {
        // console.log(data.data.user);
        let loopArray = data.data.user;
        loopArray.forEach(element => {

            if(element.length === 0) {
                console.log('User has no events');
            } else {
                element.forEach(elementEvent => {
                    events.push(elementEvent);
                });
            }
        });     
        console.log(events);
        load();

    })
    .catch((error) => {
        console.log('Error: ', error);
    })
}

async function loadUsersEvents() {

    await fetch('/api/users/getAllEventsOnUser', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then( response => {
        return response.json();
    })
    .then(data => {
        console.log(data.data.user);
        let html = '';
        let count = 0;

        let array = data.data.user;
        array.forEach(el => {
            html = el.map(num => {
                count++;
                console.log(num);
                let cut = num.hairCut;
                let color = num.color;
                if (cut === true){
                    cut = 'Valgt';
                } else{
                    cut = 'Fravalgt';
                }

                if(color === true){
                        color = 'Valgt';
                } else{
                        color = 'Fravalgt'
                }
                
                return `
                <div id="userDiv">
                    <h3> Booking nr. ${count}</h3>
                    <p id="numDato"> Date: ${num.date} </p>
                    <p id="numTid"> Tidspunkt: ${num.timeSlot} </p>
                    <p id="numCut"> Hårklip: ${cut} </p>
                    <p id="numColor"> Farvning: ${color} </p>
                    <button type="submit" class"button" id="deleteButton" onclick="deleteEvent()">Slet</button>
                </div>
                `;
            }).join(" ");
            
        });
        
        // console.log(html);
        document.querySelector('#usersEventTableId').insertAdjacentHTML('afterbegin', html);

        
    })
    .catch((error) => {
        console.log('Error: ', error);
    })
}




// SKAL FIKSES I MORGEN!
async function deleteEvent(){


    await fetch('/api/users/deleteEvent', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            date: dateChosen,
            timeSlot: timeSlotChosen,
            hairCut: checkStateHairCut,
            color: checkStateColor,
            message: messageChosen,
            
        }),
    })
    .then( response => response.json())
    .then( response => {
        console.log("1");
        console.log(response);
        console.log("2");
        closeModal();
        return response;
    })
    .catch((error) => {
        console.log('Error: ', error);
    });
    findEvents = [];
};


document.addEventListener('DOMContentLoaded', async function () {
    try{
        await initButtons();
        await load();
        await loadAllEvents();
        await loadUsersEvents()
    } catch (error) {
        console.log("Something went wront - read error: " + error);
    } 
});

