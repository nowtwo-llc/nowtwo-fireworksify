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
        setStatus('Running — ' + document.getElementById('duration').value + ' seconds.');
    });

    document.addEventListener('he:fireworksify:stop', function () {
        running = false;
        setStatus('Finished.');
    });

    // Config is read by the constructor, so any settings change means a new
    // instance rather than mutating the live one.
    function create() {
        // A custom seed exists only because there is an entry in
        // additionalSeeds — there is no separate flag for it. `class` is the
        // whole styling hook: the artwork lives in the page's own CSS.
        var additionalSeeds = document.getElementById('use-custom').checked
            ? [
                  {
                      explode: document.getElementById('seed-explode').checked,
                      destroy: document.getElementById('seed-destroy').checked,
                      class: 'hedgie-stunna-shades'
                  }
              ]
            : [];

        return new Fireworksify({
            duration: Number(document.getElementById('duration').value),
            showDefault: document.getElementById('show-default').checked,
            additionalSeeds: additionalSeeds
        });
    }

    function rebuild() {
        if (fireworksify) {
            fireworksify.destroy();
        }
        fireworksify = create();
        running = false;
    }

    window.addEventListener('load', function () {
        rebuild();

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
            rebuild();
            setStatus('Stopped.');
        });

        ['duration', 'show-default', 'use-custom', 'seed-explode', 'seed-destroy'].forEach(function (id) {
            document.getElementById(id).addEventListener('change', function () {
                rebuild();
                setStatus('Settings applied — rebuilt the instance.');
            });
        });
    });
})();
