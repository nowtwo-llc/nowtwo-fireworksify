(function () {
    var fireworksify = null;
    var running = false;

    var statusEl = document.getElementById('status');

    function setStatus(text) {
        statusEl.textContent = text;
    }

    // The library dispatches these on document, so the demo reads its state
    // from the same events a real integration would.
    document.addEventListener('he:fireworksify:start', function () {
        running = true;
        setStatus('Running — 10 seconds.');
    });

    document.addEventListener('he:fireworksify:stop', function () {
        running = false;
        setStatus('Finished.');
    });

    function create() {
        return new Fireworksify({
            duration: 10,
            showDefault: true,
            additionalSeeds: [
                {
                    explode: true,
                    destroy: false,
                    class: 'hedgie-stunna-shades'
                }
            ]
        });
    }

    window.addEventListener('load', function () {
        fireworksify = create();

        document.getElementById('run-display').addEventListener('click', function () {
            if (running) {
                return;
            }
            fireworksify.start();
        });

        document.getElementById('launch-one').addEventListener('click', function () {
            // Keep single shots inside the middle band of the viewport so they
            // are visible without scrolling.
            var widthQuarter = window.innerWidth / 4;
            var heightQuarter = window.innerHeight / 4;
            var positionX = Math.round(Math.random() * (widthQuarter * 2)) + widthQuarter;
            var positionY = Math.round(Math.random() * (heightQuarter * 2)) + heightQuarter * 2;

            fireworksify.generate(positionX, positionY);
            setStatus('Fired one.');
        });

        document.getElementById('stop').addEventListener('click', function () {
            // destroy() tears down the timers and the container, so the demo
            // builds a fresh instance to stay interactive.
            fireworksify.destroy();
            fireworksify = create();
            running = false;
            setStatus('Stopped.');
        });
    });
})();
