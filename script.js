document.addEventListener('DOMContentLoaded', () => {
    const animals = document.querySelectorAll('.animal');
    const categories = document.querySelectorAll('.category');
    const winMessage = document.getElementById('win-message');
    const restartButton = document.getElementById('restart-button');
    let correctPlacements = 0; // Track the number of correct placements

    // Store original text content of categories
    const originalCategoryTexts = {};
    categories.forEach(category => {
        originalCategoryTexts[category.id] = category.textContent;
    });

    // Ensure the win message is hidden at the start
    winMessage.classList.add('hidden');

    // Initialize draggable events for animals
    animals.forEach(animal => {
        animal.addEventListener('dragstart', dragStart);
    });

    // Initialize drag and drop events for categories
    categories.forEach(category => {
        category.addEventListener('dragover', dragOver);
        category.addEventListener('drop', drop);
    });

    // Event listener for restart button
    restartButton.addEventListener('click', restartGame);

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const animalId = event.dataTransfer.getData('text');
        const animalElement = document.getElementById(animalId);

        if (event.target.id === getAnimalCategory(animalId) && !event.target.contains(animalElement)) {
            event.target.textContent = ''; // Remove the category name text
            event.target.appendChild(animalElement);
            correctPlacements += 1; // Increment correct placements only if the animal is not already in the category

            // Apply styles to make the image fill the category box
            animalElement.style.width = '100%';
            animalElement.style.height = '100%';
            animalElement.style.objectFit = 'cover';

            checkWinCondition(); // Check if all animals are placed correctly
        } else if (event.target.id !== getAnimalCategory(animalId)) {
            alert('Try again!');
        }
    }

    function getAnimalCategory(animalId) {
        const categories = {
            'cat': 'mammals',
            'eagle': 'birds',
            'snake': 'reptiles'
        };
        return categories[animalId];
    }

    function checkWinCondition() {
        if (correctPlacements === animals.length) {
            showWinMessage();
        }
    }

    function showWinMessage() {
        winMessage.classList.remove('hidden'); // Show the win message only when all correct answers are complete

        // Delay the fade-in of the restart button by 0.5 seconds
        setTimeout(() => {
            restartButton.classList.add('visible'); // Add class to fade in the button
        }, 500); // You can adjust the delay here if needed
    }

    function restartGame() {
        winMessage.classList.add('hidden'); // Hide the win message
        correctPlacements = 0; // Reset the number of correct placements

        // Reset animals to their original positions
        const animalContainer = document.querySelector('.animals');
        animals.forEach(animal => {
            animalContainer.appendChild(animal);
            
            // Reset image styles to default
            animal.style.width = '';
            animal.style.height = '';
            animal.style.objectFit = '';
        });

        // Clear any elements inside category boxes and restore original text
        categories.forEach(category => {
            while (category.firstChild) {
                category.removeChild(category.firstChild);
            }
            category.textContent = originalCategoryTexts[category.id]; // Restore the original text content
        });

        // Remove the visible class from the restart button to reset it
        restartButton.classList.remove('visible');

        console.log('Game reset complete.');
    }
});
