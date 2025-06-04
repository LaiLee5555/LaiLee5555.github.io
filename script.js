const colorLimits = { Blue: 50, Green: 50, Yellow: 50, Red: 50 };
let isReset = true;
let is4x8Randomized = false;
let is4x4Randomized = false;
let timerInterval;

function getRandomColor() {
    const colors = Object.keys(colorLimits).filter(color => colorLimits[color] > 0);
    if (colors.length === 0) return null; // No colors left
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    colorLimits[randomColor]--;
    return randomColor;
}

function randomize4x8() {
    if (!isReset) {
        alert('You must reset before generating a new pattern.');
        return;
    }

    const boxes = document.querySelectorAll('.grid-4x8 .box');
    boxes.forEach(box => {
        const color = getRandomColor();
        if (color) {
            box.style.backgroundColor = color.toLowerCase();
        }
    });

    is4x8Randomized = true;
    checkIfNextCanBeEnabled();
}

function randomize4x4() {
    if (!is4x8Randomized) {
        alert('You must randomize the 4x8 pattern first.');
        return;
    }

    const boxes = document.querySelectorAll('.grid-4x4 .box');
    boxes.forEach(box => {
        const color = getRandomColor();
        if (color) {
            box.style.backgroundColor = color.toLowerCase();
        }
    });

    is4x4Randomized = true;
    checkIfNextCanBeEnabled();
}

function start() {
    const matchNumber = document.getElementById('matchNumber').value.trim();
    const team1 = document.getElementById('team1').value.trim();
    const team2 = document.getElementById('team2').value.trim();

    // Validate inputs
    if (!matchNumber || !team1 || !team2) {
        alert('Please fill in all the inputs before starting.');
        return;
    }

    // Disable the Start button
    document.getElementById('start').disabled = true;

    // Randomize 4x8 pattern
    randomize4x8();

    // Start the timer
    startTimer(5 * 60); // 5 minutes in seconds
}

function startTimer(duration) {
    const timerElement = document.getElementById('timer');
    let timeRemaining = duration;

    // Disable the Next button at the start of the timer
    document.getElementById('next').disabled = true;

    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeRemaining === 120) { // Last 2 minutes
            randomize4x4();
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);

            // Enable the Next button after the timer ends
            document.getElementById('next').disabled = false;
        }

        timeRemaining--;
    }, 1000);
}

function checkIfNextCanBeEnabled() {
    // Ensure the Next button is disabled until explicitly enabled by the timer
    document.getElementById('next').disabled = true;
}

function resetPatterns() {
    if (confirm('Are you sure you want to reset the patterns?')) {
        const boxes = document.querySelectorAll('.box');
        boxes.forEach(box => {
            box.style.backgroundColor = '#ccc'; // Reset to default color
        });

        // Reset color limits
        Object.keys(colorLimits).forEach(color => {
            colorLimits[color] = 50;
        });

        // Reset flags
        isReset = true;
        is4x8Randomized = false;
        is4x4Randomized = false;

        // Disable the Next button
        document.getElementById('next').disabled = true;

        // Reset input fields
        document.getElementById('matchNumber').value = '';
        document.getElementById('team1').value = '';
        document.getElementById('team2').value = '';

        // Reset timer
        clearInterval(timerInterval);
        document.getElementById('timer').textContent = '05:00';

        // Enable the Start button
        document.getElementById('start').disabled = false;
    }
}

function saveAndReset() {
    if (!is4x8Randomized || !is4x4Randomized) {
        alert('You must complete both randomizations before saving.');
        return;
    }

    // Get match number and team names from input fields
    const matchNumber = document.getElementById('matchNumber').value.trim();
    const team1 = document.getElementById('team1').value.trim();
    const team2 = document.getElementById('team2').value.trim();

    // Validate inputs
    if (!matchNumber) {
        alert('Please enter a match number.');
        return;
    }
    if (!team1) {
        alert('Please enter Team 1 name.');
        return;
    }
    if (!team2) {
        alert('Please enter Team 2 name.');
        return;
    }

    // Get current date and time
    const now = new Date();
    const formattedDateTime = now.toISOString().replace(/[:.]/g, '-'); // Format as ISO string and replace invalid filename characters

    // Construct the filename
    const fileName = `(${matchNumber})_${team1}_vs_${team2}-${formattedDateTime}.png`;

    // Use html2canvas to save the current pattern as an image
    html2canvas(document.body).then(canvas => {
        const link = document.createElement('a');
        link.download = fileName; // Use the constructed filename
        link.href = canvas.toDataURL(); // Convert canvas to a data URL
        link.click(); // Trigger the download
    }).catch(error => {
        console.error('Error saving the pattern:', error);
        alert('An error occurred while saving the pattern.');
    });
}

function checkIfNextCanBeEnabled() {
    if (is4x8Randomized && is4x4Randomized) {
        document.getElementById('next').disabled = false;
    }
}