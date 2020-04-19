window.onload = function() {
    let fireworksify = new Fireworksify({
        duration: 10,
        showDefault: true,
        additionalSeeds: [{
            explode: true,
            destroy: false,
            class: 'hedgie-stunna-shades'
        }]
    });
    fireworksify.start();
};