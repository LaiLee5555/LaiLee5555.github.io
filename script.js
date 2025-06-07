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
        showAlert('You must reset before generating a new pattern.');
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
        showAlert('You must randomize the 4x8 pattern first.');
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
        showAlert('Please fill in ** Match Detail ** before starting.');
        return;
    }

    // Disable the Start button
    document.getElementById('start').disabled = true;

    // Show 3-2-1 countdown, then randomize and start timer
    showCountdown(() => {
        randomize4x8();
        startTimer(5 * 60); // 5 minutes in seconds
    });
}

function startTimer(duration) {
    const timerElement = document.getElementById('timer');
    let timeRemaining = duration;
    let twoMinuteSoundPlayed = false;

    // Update the timer immediately
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    document.getElementById('next').disabled = true;

    timerInterval = setInterval(() => {
        timeRemaining--;

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeRemaining === 120) { // Last 2 minutes
            randomize4x4();
            playSound('audioDing');
        }

        if (timeRemaining === 130  && !twoMinuteSoundPlayed) {
            playSound('audio2mnLeft');
            twoMinuteSoundPlayed = true;
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            playSound('audioTimesUp');
            checkIfNextCanBeEnabled();
        }
    }, 1000);
}

let confirmCallback = null;

// Function to show the custom confirmation modal
function showConfirm(message, callback) {
    const confirmModal = document.getElementById('customConfirm');
    const confirmMessage = document.getElementById('confirmMessage');
    confirmMessage.textContent = message; // Set the custom message
    confirmModal.style.display = 'block'; // Show the modal
    confirmCallback = callback; // Store the callback function
}

// Function to handle the confirmation response
function handleConfirm(response) {
    const confirmModal = document.getElementById('customConfirm');
    confirmModal.style.display = 'none'; // Hide the modal
    if (confirmCallback) {
        confirmCallback(response); // Call the callback with the user's response
    }
}

// Updated resetPatterns function to use the custom confirmation modal
function resetPatterns() {
    showConfirm('Are you sure you want to reset the patterns?', function (response) {
        if (response) {
            const boxes = document.querySelectorAll('.box');
            boxes.forEach(box => {
                box.style.backgroundColor = '#ffffff'; // Reset to white color
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

            // Show a confirmation message
            showAlert('The patterns and inputs have been reset successfully.');
        }
    });
}

function showAlert(message) {
    const alertModal = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message; // Set the custom message
    alertModal.style.display = 'block'; // Show the modal
}

// Function to close the custom alert
function closeAlert() {
    const alertModal = document.getElementById('customAlert');
    alertModal.style.display = 'none'; // Hide the modal
}

function playSound(id) {
    const audio = document.getElementById(id);
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
}

function showCountdown(callback) {
    const overlay = document.getElementById('countdownOverlay');
    const number = document.getElementById('countdownNumber');
    overlay.classList.add('active');
    let count = 3;
    number.textContent = count;

    // Play sound and start countdown only after sound actually starts
    const audio = document.getElementById('audioMatchBegin');
    if (audio) {
        audio.currentTime = 0;
        // Play returns a promise
        audio.play().catch(() => { }).finally(() => {
            startCountdown();
        });
    } else {
        startCountdown();
    }

    function startCountdown() {
        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                number.textContent = count;
            } else if (count === 0) {
                number.textContent = "GO!";
            } else {
                clearInterval(countdownInterval);
                overlay.classList.remove('active');
                if (callback) callback();
            }
        }, 1000);
    }
}



function saveAndReset() {
    if (!is4x8Randomized || !is4x4Randomized) {
        showAlert('You must complete both randomizations before saving.');
        return;
    }

    // Get match number and team names from input fields
    const matchNumber = document.getElementById('matchNumber').value.trim();
    const team1 = document.getElementById('team1').value.trim();
    const team2 = document.getElementById('team2').value.trim();

    // Validate inputs
    if (!matchNumber) {
        showAlert('Please enter a match number.');
        return;
    }
    if (!team1) {
        showAlert('Please enter Team 1 name.');
        return;
    }
    if (!team2) {
        showAlert('Please enter Team 2 name.');
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
        showAlert('An error occurred while saving the pattern.');
    });
}

function checkIfNextCanBeEnabled() {
    // Enable the Next button only if both patterns are randomized and the timer is over
    if (is4x8Randomized && is4x4Randomized && timerInterval === null) {
        document.getElementById('next').disabled = false;
    } else {
        document.getElementById('next').disabled = true;
    }
}