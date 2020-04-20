let fireworksify = null;
let running = false;

document.addEventListener('he:fireworksify:start', function() {
    console.log('start');
    running = true;
}, false);
document.addEventListener('he:fireworksify:stop', function() {
    console.log('stop');
    running = false;
}, false);

window.onload = function() {
    fireworksify = new Fireworksify({
        duration: 10,
        showDefault: true,
        additionalSeeds: [{
            explode: true,
            destroy: false,
            class: 'hedgie-stunna-shades'
        }]
    });
};

let runDisplay = function() {
    if (!running) {
        fireworksify.start();
    }
};
let launchOne = function() {
    const widthQuarter = window.innerWidth / 4;
    const heightQuarter = window.innerHeight / 4;
    const positionX = Math.round(Math.random() * (widthQuarter * 2)) + widthQuarter;
    const positionY = Math.round(Math.random() * (heightQuarter * 2)) + (heightQuarter * 2);
    fireworksify.generate(positionX, positionY);
}
