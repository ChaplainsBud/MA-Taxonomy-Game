document.addEventListener('DOMContentLoaded', () => {
    const animals = document.querySelectorAll('.animal');
    const categories = document.querySelectorAll('.category');
    const winMessage = document.getElementById('win-message');
    const restartButton = document.getElementById('restart-button');
    let correctPlacements = 0; // Track the number of correct placements
    let draggedElement = null; // To store the dragged element for touch events

    // Store original text content of categories
    const originalCategoryTexts = {};
    categories.forEach(category => {
        originalCategoryTexts[category.id] = category.textContent;
    });

    // Ensure the win message is hidden at the start
    winMessage.classList.add('hidden');

    // Initialize draggable events for animals (support for mouse and touch events)
    animals.forEach(animal => {
        // Mouse events
        animal.addEventListener('dragstart', dragStart);
        // Touch events
        animal.addEventListener('touchstart', touchStart);
    });

    // Initialize drag and drop events for categories (support for mouse and touch events)
    categories.forEach(category => {
        // Mouse events
        category.addEventListener('dragover', dragOver);
        category.addEventListener('drop', drop);
        // Touch events
        category.addEventListener('touchmove', touchMove);
        category.addEventListener('touchend', touchEnd);
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

    // Touch event handlers
    function touchStart(event) {
        event.preventDefault();
        draggedElement = event.target; // Set the currently dragged element
    }

    function touchMove(event) {
        event.preventDefault();
        const touchLocation = event.targetTouches[0];
        draggedElement.style.position = "absolute";
        draggedElement.style.left = `${touchLocation.pageX - (draggedElement.offsetWidth / 2)}px`;
        draggedElement.style.top = `${touchLocation.pageY - (draggedElement.offsetHeight / 2)}px`;
    }

    function touchEnd(event) {
        event.preventDefault();
        const targetCategory = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        const animalId = draggedElement.id;

        if (targetCategory && targetCategory.classList.contains('category') && targetCategory.id === getAnimalCategory(animalId)) {
            if (!targetCategory.contains(draggedElement)) {
                targetCategory.textContent = ''; // Remove the category name text
                targetCategory.appendChild(draggedElement);
                correctPlacements += 1; // Increment correct placements only if the animal is not already in the category

                // Apply styles to make the image fill the category box
                draggedElement.style.width = '100%';
                draggedElement.style.height = '100%';
                draggedElement.style.objectFit = 'cover';
                draggedElement.style.position = 'relative'; // Reset position to default

                checkWinCondition(); // Check if all animals are placed correctly
            }
        } else {
            alert('Try again!');
            draggedElement.style.position = 'relative'; // Reset position to default
        }
        draggedElement = null; // Reset dragged element
    }
});
