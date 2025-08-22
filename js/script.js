document.addEventListener('DOMContentLoaded', () => {
    const currentMonthEl = document.getElementById('currentMonth');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const daysGrid = document.getElementById('daysGrid');
    const modal = document.getElementById('eventModal');
    const modalDateEl = document.getElementById('modalDate');
    const eventInput = document.getElementById('eventInput');
    const saveEventBtn = document.getElementById('saveEventBtn');
    const closeBtn = document.querySelector('.close-btn');

    let date = new Date();
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

    const renderCalendar = () => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();

        currentMonthEl.textContent = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        daysGrid.innerHTML = '';

        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day', 'empty');
            daysGrid.appendChild(emptyDay);
        }

        for (let i = 1; i <= lastDay; i++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day');
            dayEl.dataset.date = `${year}-${month + 1}-${i}`;

            const dayNumber = document.createElement('div');
            dayNumber.classList.add('day-number');
            dayNumber.textContent = i;
            dayEl.appendChild(dayNumber);

            const dayKey = `${year}-${month + 1}-${i}`;
            if (events[dayKey]) {
                const eventEl = document.createElement('div');
                eventEl.classList.add('event');
                eventEl.textContent = events[dayKey].trim().split('\n')[0]; // Muestra solo la primera línea
                dayEl.appendChild(eventEl);
            }

            dayEl.addEventListener('click', () => openModal(dayEl.dataset.date));
            daysGrid.appendChild(dayEl);
        }
    };

    const openModal = (dateStr) => {
        const dateObj = new Date(dateStr);
        modalDateEl.textContent = dateObj.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        modal.style.display = 'flex';
        eventInput.value = events[dateStr] || '';
        eventInput.dataset.date = dateStr;
    };

    const saveEvent = () => {
        const dateStr = eventInput.dataset.date;
        const eventText = eventInput.value.trim();

        if (eventText) {
            events[dateStr] = eventText;
        } else {
            delete events[dateStr];
        }

        localStorage.setItem('calendarEvents', JSON.stringify(events));
        renderCalendar();
        modal.style.display = 'none';
    };

    prevBtn.addEventListener('click', () => {
        date.setMonth(date.getMonth() - 1);
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        date.setMonth(date.getMonth() + 1);
        renderCalendar();
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    saveEventBtn.addEventListener('click', saveEvent);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    renderCalendar();
});