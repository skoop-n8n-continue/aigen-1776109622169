document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('current-time');
    const fullDateDisplay = document.getElementById('current-full-date');
    const monthDisplay = document.getElementById('month-display');
    const calendarGrid = document.getElementById('calendar-grid');

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let lastGeneratedDate = new Date().toDateString();

    function updateDateTime() {
        const now = new Date();

        // Update Time
        timeDisplay.textContent = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        // Update Full Date Header
        fullDateDisplay.textContent = now.toLocaleDateString([], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Check if day changed to regenerate calendar
        if (now.toDateString() !== lastGeneratedDate) {
            lastGeneratedDate = now.toDateString();
            renderCalendar();
        }
    }

    function renderCalendar() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        // Month and Year display
        const monthName = now.toLocaleDateString([], { month: 'long' });
        monthDisplay.textContent = `${monthName} ${year}`;

        // Clear existing days (keep day names)
        const dayNameElements = Array.from(calendarGrid.querySelectorAll('.day-name'));
        calendarGrid.innerHTML = '';
        dayNameElements.forEach(el => calendarGrid.appendChild(el));

        // Get first day of month (0-6)
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        // Get total days in month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // Get days from previous month to fill grid
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // Fill in previous month's trailing days
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const dayDiv = createDayElement(daysInPrevMonth - i, true);
            calendarGrid.appendChild(dayDiv);
        }

        // Fill in current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === now.getDate();
            const dayDiv = createDayElement(i, false, isToday);
            calendarGrid.appendChild(dayDiv);
        }

        // Fill in next month's leading days to complete the grid (usually 42 cells)
        const totalCells = calendarGrid.children.length - 7; // subtract day names
        const remainingCells = 42 - totalCells;
        for (let i = 1; i <= remainingCells; i++) {
            const dayDiv = createDayElement(i, true);
            calendarGrid.appendChild(dayDiv);
        }
    }

    function createDayElement(number, isOtherMonth, isToday) {
        const div = document.createElement('div');
        div.className = 'calendar-day';
        if (isOtherMonth) div.classList.add('other-month');
        if (isToday) div.classList.add('today');

        const span = document.createElement('span');
        span.className = 'day-number';
        span.textContent = number;

        div.appendChild(span);
        return div;
    }

    // Initial render
    updateDateTime();
    renderCalendar();

    // Start clock
    setInterval(updateDateTime, 1000);
});
