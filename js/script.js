document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const mainContent = document.getElementById('main-content');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const backToCalendarBtn = document.getElementById('back-to-calendar');
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

    let currentDate = new Date(2025, 7, 1);
    let selectedDate = null;
    let isEditor = false;

    // Usuarios y contraseñas autorizados
    const authorizedUsers = {
        'amanda': '123456',
        'simon': 'hola123'
    };

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Lógica para alternar entre el calendario y el formulario de login
    function showCalendar() {
        loginContainer.style.display = 'none';
        mainContent.style.display = 'flex';
        // Mostrar u ocultar botones según el tipo de usuario
        if (isEditor) {
            logoutBtn.style.display = 'block';
            showLoginBtn.style.display = 'none';
        } else {
            logoutBtn.style.display = 'none';
            showLoginBtn.style.display = 'block';
        }
    }

    function showLogin() {
        loginContainer.style.display = 'flex';
        mainContent.style.display = 'none';
    }

    // Manejadores de eventos de los botones
    showLoginBtn.addEventListener('click', showLogin);
    backToCalendarBtn.addEventListener('click', showCalendar);

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
            errorMessage.textContent = 'Usuario o contraseña incorrectos.';
            errorMessage.style.display = 'block';
        }
    });

    logoutBtn.addEventListener('click', () => {
        isEditor = false;
        localStorage.removeItem('currentUser');
        showCalendar();
        renderCalendar(); // Renderiza de nuevo para ocultar elementos de edición
    });

    // Lógica del calendario y eventos
    function renderCalendar() {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
    
        // Ocultar botones si el mes está en el rango límite
        if (month === 7 && year === 2025) { // Agosto
            prevBtn.style.visibility = 'hidden';
        } else {
            prevBtn.style.visibility = 'visible';
        }

        if (month === 11 && year === 2025) { // Diciembre
            nextBtn.style.visibility = 'hidden';
        } else {
            nextBtn.style.visibility = 'visible';
        }
    
        monthYearEl.textContent = `${months[month]} ${year}`;
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

    // Lógica para la carga inicial
    const userStatus = localStorage.getItem('currentUser');
    if (userStatus && (userStatus === 'amanda' || userStatus === 'simon')) {
        isEditor = true;
        showCalendar();
    } else {
        isEditor = false;
        showCalendar();
    }
    renderCalendar(); // Renderiza el calendario al cargar la página
});
