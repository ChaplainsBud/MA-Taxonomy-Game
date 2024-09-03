document.addEventListener('DOMContentLoaded', () => {
    const animals = document.querySelectorAll('.animal');
    const categories = document.querySelectorAll('.category');

    animals.forEach(animal => {
        animal.addEventListener('dragstart', dragStart);
    });

    categories.forEach(category => {
        category.addEventListener('dragover', dragOver);
        category.addEventListener('drop', drop);
    });

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
        if (event.target.id === getAnimalCategory(animalId)) {
            event.target.appendChild(animalElement);
            alert('Correct!');
        } else {
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
});
