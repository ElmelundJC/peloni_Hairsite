let nav = 0;
let clicked = null;

// Events state af objekter. Tjekker om "events" eksistere i localStorage ved brug af "turnary operator", hvor man kan kalde JSON.parse(x) på vores events, hvis ikke det eksistere, skal den returnere et tomt array.
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag'];
const timeslot = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function openModal(date){
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);
// Tjekker for om der er et event for dagen..
    if(eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteEventModal.style.display = 'block'
    } else {
        newEventModal.style.display = 'block';
    }

    backDrop.style.display = 'block';
}

function load() {
    const dt = new Date();

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    console.log(daysInMonth + " dage i måned");

    const dateString = firstDayOfMonth.toLocaleDateString('da-dk', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    })
    console.log(dateString + " Her");

    // splitter strengen dateString der består af (Weekday 1.1.2021) hvor vi skal bruge ugedagen/første dag i måneden. ** Forskel på da-dk og en-uk er at strengen deles med komma og mellemrum. **
    const paddingDays = weekdays.indexOf(dateString.split(' ')[0]);
    console.log(paddingDays + " PaddingDays");

    document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('da-dk', {month: 'long'})} ${year}`
    
    // Sørger for at hver gang vi kalder load() funktionen, at vi ikke laver en ny kalender under den første.
    calendar.innerHTML = '';

    // Oprettelse af alle vores "dagblokke" således at vi laver x antal dage i kalenderen + de "tomme dage".
    // grundet dansk tidsmønster bliver vi nød til at lægge 1 til "daysInMonth", ellers fanger vi ikke den sidste dag i måneden.
    for (let i = 1; i < paddingDays + daysInMonth + 1; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;
        console.log(dayString + " daystring")

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
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
            }

            daySquare.addEventListener('click', () => openModal(dayString));
        } else {
            daySquare.classList.add('padding');
        }

        calendar.appendChild(daySquare);
    }
};

function closeModal() {
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    load();
}

function saveEvent() {
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error');

        events.push({
            date: clicked,
            title: eventTitleInput.value,
        });
// Restore objektet til local storage som et event ! vigtigt! for her skal vi arbejde med AJAX/FETCH til server side!
        localStorage.setItem('events', JSON.stringify(events));
        closeModal();
    } else {
        eventTitleInput.classList.add('error');
    }
}

function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));

    closeModal();
}

// Funktion til at springe mellem månederne.
function initButtons() {
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

    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();
load();