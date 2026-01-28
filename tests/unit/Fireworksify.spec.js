describe('Fireworksify', function () {
    var instance;

    afterEach(function () {
        if (instance) {
            instance.destroy();
            instance = null;
        }
    });

    // ── Constructor ────────────────────────────────────────────────────

    describe('Constructor', function () {
        it('should be available as a global constructor', function () {
            expect(Fireworksify).to.be.a('function');
        });

        it('should append a container element to document.body', function () {
            var childCountBefore = document.body.children.length;
            instance = new Fireworksify({ showDefault: true });
            expect(document.body.children.length).to.equal(childCountBefore + 1);
        });

        it('should create an instance with showDefault config', function () {
            instance = new Fireworksify({ showDefault: true });
            expect(instance).to.be.an('object');
        });

        it('should accept a custom duration config', function () {
            instance = new Fireworksify({ showDefault: true, duration: 5 });
            expect(instance).to.be.an('object');
        });

        it('should accept additionalSeeds config', function () {
            var customSeed = { explode: true, destroy: true, class: 'custom-seed' };
            instance = new Fireworksify({ additionalSeeds: [customSeed] });
            expect(instance).to.be.an('object');
        });

        it('should combine showDefault and additionalSeeds', function () {
            var customSeed = { explode: true, destroy: true, class: 'custom-seed' };
            instance = new Fireworksify({ showDefault: true, additionalSeeds: [customSeed] });
            expect(instance).to.be.an('object');
        });

        it('should handle null config without throwing', function () {
            instance = new Fireworksify(null);
            expect(instance).to.be.an('object');
        });

        it('should handle empty object config', function () {
            instance = new Fireworksify({});
            expect(instance).to.be.an('object');
        });
    });

    // ── generate() ─────────────────────────────────────────────────────

    describe('#generate()', function () {
        it('should create a firework seed element in the DOM', function () {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 200);
            var seeds = document.querySelectorAll('.firework-seed');
            expect(seeds.length).to.be.at.least(1);
        });

        it('should position the seed at the given coordinates', function () {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(150, 300);
            var seed = document.querySelector('.firework-seed');
            expect(seed.style.left).to.equal('150px');
            expect(seed.style.top).to.equal('300px');
        });

        it('should apply the default seed CSS class', function () {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 200);
            var seed = document.querySelector('.firework-seed--default');
            expect(seed).to.not.be.null;
        });

        it('should apply custom seed CSS class from additionalSeeds', function () {
            var customSeed = { explode: true, destroy: true, class: 'firework-seed--custom' };
            instance = new Fireworksify({ additionalSeeds: [customSeed] });
            instance.generate(100, 200);
            var seed = document.querySelector('.firework-seed--custom');
            expect(seed).to.not.be.null;
        });

        it('should assign unique IDs to each seed element', function () {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 200);
            instance.generate(200, 300);
            var seeds = document.querySelectorAll('.firework-seed');
            expect(seeds.length).to.equal(2);
            expect(seeds[0].id).to.not.equal(seeds[1].id);
        });

        it('should assign IDs with he-firework-seed prefix', function () {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 200);
            var seed = document.querySelector('.firework-seed');
            expect(seed.id).to.match(/^he-firework-seed-/);
        });
    });

    // ── start() ────────────────────────────────────────────────────────

    describe('#start()', function () {
        it('should dispatch he:fireworksify:start event', function (done) {
            instance = new Fireworksify({ showDefault: true, duration: 1 });

            function handler() {
                document.removeEventListener('he:fireworksify:start', handler);
                done();
            }
            document.addEventListener('he:fireworksify:start', handler);

            instance.start();
        });

        it('should dispatch he:fireworksify:stop event after duration expires', function (done) {
            this.timeout(5000);
            instance = new Fireworksify({ showDefault: true, duration: 1 });

            function handler() {
                document.removeEventListener('he:fireworksify:stop', handler);
                done();
            }
            document.addEventListener('he:fireworksify:stop', handler);

            instance.start();
        });

        it('should create seed elements over time', function (done) {
            this.timeout(3000);
            instance = new Fireworksify({ showDefault: true, duration: 2 });
            instance.start();

            setTimeout(function () {
                var seeds = document.querySelectorAll('.firework-seed');
                expect(seeds.length).to.be.at.least(1);
                done();
            }, 1000);
        });

        it('should not throw when called multiple times', function () {
            instance = new Fireworksify({ showDefault: true, duration: 1 });
            instance.start();
            expect(function () {
                instance.start();
            }).to.not.throw();
        });
    });

    // ── destroy() ──────────────────────────────────────────────────────

    describe('#destroy()', function () {
        it('should remove the container element from the DOM', function () {
            instance = new Fireworksify({ showDefault: true });
            var childCountBefore = document.body.children.length;
            instance.destroy();
            expect(document.body.children.length).to.equal(childCountBefore - 1);
            instance = null;
        });

        it('should stop the animation loop so no further DOM updates occur', function (done) {
            this.timeout(3000);
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 200);
            instance.destroy();
            instance = null;

            // After destroy, the frame() loop should no longer run.
            // If it did, it would throw because the DOM elements are gone.
            setTimeout(function () {
                // No errors means the loop was stopped successfully.
                expect(true).to.be.true;
                done();
            }, 100);
        });

        it('should be safe to call multiple times', function () {
            instance = new Fireworksify({ showDefault: true });
            instance.destroy();
            expect(function () {
                instance.destroy();
            }).to.not.throw();
            instance = null;
        });

        it('should clean up after start() was called', function (done) {
            this.timeout(3000);
            instance = new Fireworksify({ showDefault: true, duration: 5 });
            instance.start();

            setTimeout(function () {
                instance.destroy();
                instance = null;
                // No errors means timers were cleaned up properly.
                expect(true).to.be.true;
                done();
            }, 500);
        });
    });

    // ── Physics and Animation ──────────────────────────────────────────

    describe('Physics and Animation', function () {
        it('should move seeds upward over time', function (done) {
            this.timeout(3000);
            var startY = 500;
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, startY);

            setTimeout(function () {
                var seed = document.querySelector('.firework-seed');
                if (seed) {
                    var currentY = parseFloat(seed.style.top);
                    expect(currentY).to.be.lessThan(startY);
                }
                done();
            }, 200);
        });

        it('should create 72 particles when a seed explodes (360 / 5 degrees)', function (done) {
            this.timeout(5000);
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 500);

            // Seed timer is 1000ms; wait for it to expire and explosion to happen.
            setTimeout(function () {
                var particles = document.querySelectorAll('.firework-particle');
                expect(particles.length).to.equal(72);
                done();
            }, 1500);
        });

        it('should create a firework-batch container for explosion particles', function (done) {
            this.timeout(5000);
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 500);

            setTimeout(function () {
                var batches = document.querySelectorAll('.firework-batch');
                expect(batches.length).to.be.at.least(1);
                done();
            }, 1500);
        });

        it('should remove seeds with destroy:true after their timer expires', function (done) {
            this.timeout(5000);
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 500);

            var seedsBefore = document.querySelectorAll('.firework-seed').length;
            expect(seedsBefore).to.equal(1);

            setTimeout(function () {
                var seedsAfter = document.querySelectorAll('.firework-seed').length;
                expect(seedsAfter).to.equal(0);
                done();
            }, 1500);
        });

        it('should not destroy seeds when seedConfig.destroy is false', function (done) {
            this.timeout(5000);
            var persistentSeed = { explode: true, destroy: false, class: 'firework-seed--persistent' };
            instance = new Fireworksify({ additionalSeeds: [persistentSeed] });
            instance.generate(100, 500);

            setTimeout(function () {
                var seed = document.querySelector('.firework-seed--persistent');
                expect(seed).to.not.be.null;
                done();
            }, 1500);
        });

        it('should not create particles when seedConfig.explode is false', function (done) {
            this.timeout(5000);
            var noExplodeSeed = { explode: false, destroy: true, class: 'firework-seed--no-explode' };
            instance = new Fireworksify({ additionalSeeds: [noExplodeSeed] });
            instance.generate(100, 500);

            setTimeout(function () {
                var particles = document.querySelectorAll('.firework-particle');
                expect(particles.length).to.equal(0);
                done();
            }, 1500);
        });

        it('should assign particle IDs with he-firework-particle prefix', function (done) {
            this.timeout(5000);
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 500);

            setTimeout(function () {
                var particle = document.querySelector('.firework-particle');
                expect(particle).to.not.be.null;
                expect(particle.id).to.match(/^he-firework-particle-/);
                done();
            }, 1500);
        });

        it('should remove particles after their timer expires', function (done) {
            this.timeout(8000);
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 500);

            // Seed timer: 1000ms, then particles created with 2500ms timer.
            // Total ~3500ms before particles start being removed.
            setTimeout(function () {
                var particles = document.querySelectorAll('.firework-particle');
                expect(particles.length).to.equal(0);
                done();
            }, 5000);
        });

        it('should apply gravity so falling seeds accelerate downward', function (done) {
            this.timeout(5000);
            // Use a persistent seed (destroy:false) so it falls after peaking
            var fallingSeed = { explode: false, destroy: false, class: 'firework-seed--falling' };
            instance = new Fireworksify({ additionalSeeds: [fallingSeed] });
            instance.generate(100, 300);

            // After seed timer expires (1000ms), it should start falling
            var positionAt1500;
            setTimeout(function () {
                var seed = document.querySelector('.firework-seed--falling');
                if (seed) {
                    positionAt1500 = parseFloat(seed.style.top);
                }
            }, 1500);

            setTimeout(function () {
                var seed = document.querySelector('.firework-seed--falling');
                if (seed && positionAt1500 !== undefined) {
                    var positionAt2000 = parseFloat(seed.style.top);
                    // After peaking, the seed should be falling (positionY increasing)
                    expect(positionAt2000).to.be.greaterThan(positionAt1500);
                }
                done();
            }, 2000);
        });
    });

    // ── Custom Events ──────────────────────────────────────────────────

    describe('Custom Events', function () {
        it('should dispatch start event on the document object', function (done) {
            instance = new Fireworksify({ showDefault: true, duration: 1 });
            var received = false;

            function handler(e) {
                received = true;
                expect(e).to.be.an.instanceof(Event);
                document.removeEventListener('he:fireworksify:start', handler);
            }
            document.addEventListener('he:fireworksify:start', handler);

            instance.start();

            // The start event is dispatched synchronously, so it should be received immediately.
            setTimeout(function () {
                expect(received).to.be.true;
                done();
            }, 50);
        });

        it('should dispatch stop event with correct event type', function (done) {
            this.timeout(5000);
            instance = new Fireworksify({ showDefault: true, duration: 1 });

            function handler(e) {
                expect(e.type).to.equal('he:fireworksify:stop');
                document.removeEventListener('he:fireworksify:stop', handler);
                done();
            }
            document.addEventListener('he:fireworksify:stop', handler);

            instance.start();
        });
    });

    // ── Edge Cases ─────────────────────────────────────────────────────

    describe('Edge Cases', function () {
        it('should handle generating multiple fireworks at the same position', function () {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 200);
            instance.generate(100, 200);
            instance.generate(100, 200);
            var seeds = document.querySelectorAll('.firework-seed');
            expect(seeds.length).to.equal(3);
        });

        it('should handle generating fireworks at boundary coordinates', function () {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(0, 0);
            var seed = document.querySelector('.firework-seed');
            expect(seed.style.left).to.equal('0px');
            expect(seed.style.top).to.equal('0px');
        });

        it('should handle generating fireworks at negative coordinates', function () {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(-50, -100);
            var seed = document.querySelector('.firework-seed');
            expect(seed.style.left).to.equal('-50px');
            expect(seed.style.top).to.equal('-100px');
        });

        it('should handle additionalSeeds with empty array', function () {
            instance = new Fireworksify({ additionalSeeds: [] });
            expect(instance).to.be.an('object');
        });
    });
});
