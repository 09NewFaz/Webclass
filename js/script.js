document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const mainContent = document.getElementById('main-content');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const errorMessage = document.getElementById('error-message');

    const monthYearEl = document.getElementById('month-year');
    const datesGridEl = document.getElementById('dates-grid');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    const modal = document.getElementById('event-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalDateEl = document.getElementById('modal-date');
    const editableArea = document.getElementById('editable-area');
    const eventInput = document.getElementById('event-input');
    const saveEventBtn = document.getElementById('save-event');
    const savedEventsContainer = document.getElementById('saved-events');

    let currentDate = new Date(2025, 7, 1); // Agosto de 2025 es el mes 7 (índice 0)
    let selectedDate = null;
    let isEditor = false;

    // Usuarios y contraseñas autorizados (SOLO AQUÍ SE CAMBIA)
    const authorizedUsers = {
        'amanda': '123456',
        'simon': 'hola123'
    };

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Funciones de control de la interfaz de usuario
    function showCalendar() {
        loginContainer.style.display = 'none';
        mainContent.style.display = 'flex';
    }

    function hideCalendar() {
        loginContainer.style.display = 'flex';
        mainContent.style.display = 'none';
        usernameInput.value = '';
        passwordInput.value = '';
        errorMessage.style.display = 'none';
    }

    // Lógica de autenticación
    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value.toLowerCase().trim();
        const password = passwordInput.value.trim();

        if (authorizedUsers[username] && authorizedUsers[username] === password) {
            isEditor = true;
            localStorage.setItem('currentUser', username);
            showCalendar();
            renderCalendar();
        } else {
            isEditor = false;
            localStorage.setItem('currentUser', 'visitor');
            showCalendar();
            renderCalendar();
            if (username && password) {
                errorMessage.textContent = 'Usuario o contraseña incorrectos.';
                errorMessage.style.display = 'block';
            }
        }
    });

    logoutBtn.addEventListener('click', () => {
        isEditor = false;
        localStorage.removeItem('currentUser');
        hideCalendar();
    });

    // Lógica del calendario y eventos
    function renderCalendar() {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
    
        if (year === 2025 && (month < 7 || month > 11)) {
            currentDate = new Date(2025, 7, 1);
        } else if (year !== 2025) {
             currentDate = new Date(2025, 7, 1);
        }

        monthYearEl.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        datesGridEl.innerHTML = '';

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let firstDayAdjusted = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        for (let i = 0; i < firstDayAdjusted; i++) {
            const emptyBox = document.createElement('div');
            emptyBox.classList.add('date-box', 'inactive');
            datesGridEl.appendChild(emptyBox);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateBox = document.createElement('div');
            dateBox.classList.add('date-box');
            
            const dateNumber = document.createElement('span');
            dateNumber.classList.add('date-number');
            dateNumber.textContent = i;
            dateBox.appendChild(dateNumber);
            
            const fullDate = `${year}-${month + 1}-${i}`;
            const savedEvent = localStorage.getItem(fullDate);
            if (savedEvent) {
                const eventIndicator = document.createElement('div');
                eventIndicator.classList.add('event-indicator');
                dateBox.appendChild(eventIndicator);
            }

            dateBox.addEventListener('click', () => {
                selectedDate = fullDate;
                showModal();
            });
            
            datesGridEl.appendChild(dateBox);
        }
    }

    function showModal() {
        modal.style.display = 'flex';
        modalDateEl.textContent = selectedDate;

        const savedEvent = localStorage.getItem(selectedDate);
        displaySavedEvents(savedEvent);

        if (isEditor) {
            editableArea.style.display = 'block';
            eventInput.value = savedEvent || '';
        } else {
            editableArea.style.display = 'none';
        }
    }

    function displaySavedEvents(eventText) {
        savedEventsContainer.innerHTML = '';
        if (eventText) {
            const eventItem = document.createElement('div');
            eventItem.classList.add('event-item');
            eventItem.textContent = eventText;
            savedEventsContainer.appendChild(eventItem);
        } else {
            const noEventItem = document.createElement('div');
            noEventItem.textContent = "No hay eventos en esta fecha.";
            savedEventsContainer.appendChild(noEventItem);
        }
    }

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    saveEventBtn.addEventListener('click', () => {
        if (selectedDate && eventInput.value.trim() !== '') {
            localStorage.setItem(selectedDate, eventInput.value.trim());
        } else if (selectedDate) {
            localStorage.removeItem(selectedDate);
        }
        modal.style.display = 'none';
        renderCalendar();
    });

    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Cargar estado al inicio
    const userStatus = localStorage.getItem('currentUser');
    if (userStatus && (userStatus === 'amanda' || userStatus === 'simon')) {
        isEditor = true;
        showCalendar();
        renderCalendar();
    } else if (userStatus === 'visitor') {
        isEditor = false;
        showCalendar();
        renderCalendar();
    } else {
        hideCalendar();
    }
});
