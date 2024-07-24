const screenshots = [
    '1.png',
    '2.png',
    '3.png',
    '4.png'
];

let currentIndex = 0;

const screenshotElement = document.querySelector('.screenshot');
const prevBtn = document.querySelector('.bt');
const nextBtn = document.querySelector('.bt');

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : screenshots.length - 1;
    screenshotElement.src = screenshots[currentIndex];
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < screenshots.length - 1) ? currentIndex + 1 : 0;
    screenshotElement.src = screenshots[currentIndex];
});

screenshotElement.addEventListener('click', () => {
    currentIndex = (currentIndex < screenshots.length - 1) ? currentIndex + 1 : 0;
    screenshotElement.src = screenshots[currentIndex];
});