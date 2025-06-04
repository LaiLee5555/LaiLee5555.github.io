const colorLimits = { Blue: 50, Green: 50, Yellow: 50, Red: 50 };
let isReset = true;
let is4x8Randomized = false;
let is4x4Randomized = false;

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

    // Disable the 4x8 button and enable the 4x4 button
    document.getElementById('random4x8').disabled = true;
    document.getElementById('random4x4').disabled = false;
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

    // Disable the 4x4 button
    document.getElementById('random4x4').disabled = true;
    is4x4Randomized = true;

    checkIfNextCanBeEnabled();
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

        // Enable the 4x8 button and disable the 4x4 button
        document.getElementById('random4x4').disabled = true;
        document.getElementById('random4x8').disabled = false;

        // Reset flags
        isReset = true;
        is4x8Randomized = false;
        is4x4Randomized = false;

        // Disable the Next button
        document.getElementById('next').disabled = true;
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

        // Reset the patterns after saving
        resetPatterns();
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