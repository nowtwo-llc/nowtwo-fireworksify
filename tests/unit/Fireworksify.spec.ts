import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Fireworksify } from '../../src/Fireworksify';

/** Typed querySelector so inline style assertions don't need casting at every call site. */
const query = (selector: string): HTMLElement | null => document.querySelector<HTMLElement>(selector);

const queryAll = (selector: string): NodeListOf<HTMLElement> => document.querySelectorAll<HTMLElement>(selector);

describe('Fireworksify', () => {
    let instance: Fireworksify | null = null;

    beforeEach(() => {
        // The library drives everything from a 5ms setInterval and Date.now()
        // deltas. Faking both makes the physics deterministic and removes the
        // real-time waits the previous Karma suite spent ~20s on.
        vi.useFakeTimers();
    });

    afterEach(() => {
        // Destroy before restoring real timers so clearInterval still targets
        // the fake clock that created the handles.
        if (instance) {
            instance.destroy();
            instance = null;
        }
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    // ── Constructor ────────────────────────────────────────────────────

    describe('Constructor', () => {
        it('should be available as a constructor', () => {
            expect(Fireworksify).to.be.a('function');
        });

        it('should append a container element to document.body', () => {
            const childCountBefore = document.body.children.length;
            instance = new Fireworksify({ showDefault: true });
            expect(document.body.children.length).to.equal(childCountBefore + 1);
        });

        it('should create an instance with showDefault config', () => {
            instance = new Fireworksify({ showDefault: true });
            expect(instance).to.be.an('object');
        });

        it('should accept a custom duration config', () => {
            instance = new Fireworksify({ showDefault: true, duration: 5 });
            expect(instance).to.be.an('object');
        });

        it('should accept additionalSeeds config', () => {
            const customSeed = { explode: true, destroy: true, class: 'custom-seed' };
            instance = new Fireworksify({ additionalSeeds: [customSeed] });
            expect(instance).to.be.an('object');
        });

        it('should combine showDefault and additionalSeeds', () => {
            const customSeed = { explode: true, destroy: true, class: 'custom-seed' };
            instance = new Fireworksify({ showDefault: true, additionalSeeds: [customSeed] });
            expect(instance).to.be.an('object');
        });

        it('should handle null config without throwing', () => {
            instance = new Fireworksify(null);
            expect(instance).to.be.an('object');
        });

        it('should handle empty object config', () => {
            instance = new Fireworksify({});
            expect(instance).to.be.an('object');
        });
    });

    // ── generate() ─────────────────────────────────────────────────────

    describe('#generate()', () => {
        it('should create a firework seed element in the DOM', () => {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 200);
            expect(queryAll('.firework-seed').length).to.be.at.least(1);
        });

        it('should position the seed at the given coordinates', () => {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(150, 300);
            const seed = query('.firework-seed');
            expect(seed?.style.left).to.equal('150px');
            expect(seed?.style.top).to.equal('300px');
        });

        it('should apply the default seed CSS class', () => {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 200);
            expect(query('.firework-seed--default')).to.not.be.null;
        });

        it('should apply custom seed CSS class from additionalSeeds', () => {
            const customSeed = { explode: true, destroy: true, class: 'firework-seed--custom' };
            instance = new Fireworksify({ additionalSeeds: [customSeed] });
            instance.generate(100, 200);
            expect(query('.firework-seed--custom')).to.not.be.null;
        });

        it('should assign unique IDs to each seed element', () => {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 200);
            instance.generate(200, 300);
            const seeds = queryAll('.firework-seed');
            expect(seeds.length).to.equal(2);
            expect(seeds[0].id).to.not.equal(seeds[1].id);
        });

        it('should assign IDs with he-firework-seed prefix', () => {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 200);
            expect(query('.firework-seed')?.id).to.match(/^he-firework-seed-/);
        });

        it('should fall back to the default seed when none are configured', () => {
            instance = new Fireworksify({ duration: 10 });
            expect(() => instance?.generate(100, 200)).to.not.throw();
            expect(query('.firework-seed--default')).to.not.be.null;
        });
    });

    // ── start() ────────────────────────────────────────────────────────

    describe('#start()', () => {
        it('should dispatch he:fireworksify:start event', () => {
            instance = new Fireworksify({ showDefault: true, duration: 1 });
            let received = false;

            const handler = () => {
                received = true;
            };
            document.addEventListener('he:fireworksify:start', handler);

            instance.start();
            document.removeEventListener('he:fireworksify:start', handler);

            expect(received).to.be.true;
        });

        it('should dispatch he:fireworksify:stop event after duration expires', () => {
            instance = new Fireworksify({ showDefault: true, duration: 1 });
            let received = false;

            const handler = () => {
                received = true;
            };
            document.addEventListener('he:fireworksify:stop', handler);

            instance.start();
            expect(received).to.be.false;

            vi.advanceTimersByTime(1000);
            document.removeEventListener('he:fireworksify:stop', handler);

            expect(received).to.be.true;
        });

        it('should create seed elements over time', () => {
            instance = new Fireworksify({ showDefault: true, duration: 2 });
            instance.start();

            vi.advanceTimersByTime(1000);

            expect(queryAll('.firework-seed').length).to.be.at.least(1);
        });

        it('should not throw when called multiple times', () => {
            const fireworksify = new Fireworksify({ showDefault: true, duration: 1 });
            instance = fireworksify;
            fireworksify.start();
            expect(() => fireworksify.start()).to.not.throw();
        });
    });

    // ── destroy() ──────────────────────────────────────────────────────

    describe('#destroy()', () => {
        it('should remove the container element from the DOM', () => {
            const fireworksify = new Fireworksify({ showDefault: true });
            const childCountBefore = document.body.children.length;
            fireworksify.destroy();
            expect(document.body.children.length).to.equal(childCountBefore - 1);
        });

        it('should stop the animation loop so no further DOM updates occur', () => {
            const fireworksify = new Fireworksify({ showDefault: true });
            fireworksify.generate(100, 200);
            fireworksify.destroy();

            // If the frame() loop were still running it would operate on
            // detached elements as their timers expire.
            expect(() => vi.advanceTimersByTime(2000)).to.not.throw();
            expect(query('.firework-seed')).to.be.null;
        });

        it('should be safe to call multiple times', () => {
            const fireworksify = new Fireworksify({ showDefault: true });
            fireworksify.destroy();
            expect(() => fireworksify.destroy()).to.not.throw();
        });

        it('should clean up after start() was called', () => {
            const fireworksify = new Fireworksify({ showDefault: true, duration: 5 });
            fireworksify.start();
            vi.advanceTimersByTime(500);

            fireworksify.destroy();

            expect(() => vi.advanceTimersByTime(5000)).to.not.throw();
        });
    });

    // ── Physics and Animation ──────────────────────────────────────────

    describe('Physics and Animation', () => {
        it('should move seeds upward over time', () => {
            const startY = 500;
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, startY);

            vi.advanceTimersByTime(200);

            const seed = query('.firework-seed');
            expect(seed).to.not.be.null;
            expect(parseFloat(seed?.style.top ?? '0')).to.be.lessThan(startY);
        });

        it('should create 72 particles when a seed explodes (360 / 5 degrees)', () => {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 500);

            // The seed timer is 1000ms; advance past it so the burst happens.
            vi.advanceTimersByTime(1500);

            expect(queryAll('.firework-particle').length).to.equal(72);
        });

        it('should create a firework-batch container for explosion particles', () => {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 500);

            vi.advanceTimersByTime(1500);

            expect(queryAll('.firework-batch').length).to.be.at.least(1);
        });

        it('should remove seeds with destroy:true after their timer expires', () => {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 500);

            expect(queryAll('.firework-seed').length).to.equal(1);

            vi.advanceTimersByTime(1500);

            expect(queryAll('.firework-seed').length).to.equal(0);
        });

        it('should not destroy seeds when seedConfig.destroy is false', () => {
            const persistentSeed = { explode: true, destroy: false, class: 'firework-seed--persistent' };
            instance = new Fireworksify({ additionalSeeds: [persistentSeed] });
            instance.generate(100, 500);

            vi.advanceTimersByTime(1500);

            expect(query('.firework-seed--persistent')).to.not.be.null;
        });

        it('should not create particles when seedConfig.explode is false', () => {
            const noExplodeSeed = { explode: false, destroy: true, class: 'firework-seed--no-explode' };
            instance = new Fireworksify({ additionalSeeds: [noExplodeSeed] });
            instance.generate(100, 500);

            vi.advanceTimersByTime(1500);

            expect(queryAll('.firework-particle').length).to.equal(0);
        });

        it('should assign particle IDs with he-firework-particle prefix', () => {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 500);

            vi.advanceTimersByTime(1500);

            const particle = query('.firework-particle');
            expect(particle).to.not.be.null;
            expect(particle?.id).to.match(/^he-firework-particle-/);
        });

        it('should remove particles after their timer expires', () => {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 500);

            // Seed timer 1000ms, then particles live for 2500ms.
            vi.advanceTimersByTime(5000);

            expect(queryAll('.firework-particle').length).to.equal(0);
        });

        it('should apply gravity so falling seeds accelerate downward', () => {
            // A seed that neither explodes nor is destroyed keeps falling after it peaks.
            const fallingSeed = { explode: false, destroy: false, class: 'firework-seed--falling' };
            instance = new Fireworksify({ additionalSeeds: [fallingSeed] });
            instance.generate(100, 300);

            vi.advanceTimersByTime(1500);
            const positionAt1500 = parseFloat(query('.firework-seed--falling')?.style.top ?? '0');

            vi.advanceTimersByTime(500);
            const positionAt2000 = parseFloat(query('.firework-seed--falling')?.style.top ?? '0');

            expect(positionAt2000).to.be.greaterThan(positionAt1500);
        });
    });

    // ── Custom Events ──────────────────────────────────────────────────

    describe('Custom Events', () => {
        it('should dispatch start event on the document object', () => {
            instance = new Fireworksify({ showDefault: true, duration: 1 });
            const received: Event[] = [];

            const handler = (e: Event) => {
                received.push(e);
            };
            document.addEventListener('he:fireworksify:start', handler);

            instance.start();
            document.removeEventListener('he:fireworksify:start', handler);

            expect(received).to.have.lengthOf(1);
            expect(received[0]).to.be.an.instanceof(Event);
            expect(received[0].type).to.equal('he:fireworksify:start');
        });

        it('should dispatch stop event with correct event type', () => {
            instance = new Fireworksify({ showDefault: true, duration: 1 });
            const received: Event[] = [];

            const handler = (e: Event) => {
                received.push(e);
            };
            document.addEventListener('he:fireworksify:stop', handler);

            instance.start();
            vi.advanceTimersByTime(1000);
            document.removeEventListener('he:fireworksify:stop', handler);

            expect(received).to.have.lengthOf(1);
            expect(received[0].type).to.equal('he:fireworksify:stop');
        });
    });

    // ── Edge Cases ─────────────────────────────────────────────────────

    describe('Edge Cases', () => {
        it('should handle generating multiple fireworks at the same position', () => {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(100, 200);
            instance.generate(100, 200);
            instance.generate(100, 200);
            expect(queryAll('.firework-seed').length).to.equal(3);
        });

        it('should handle generating fireworks at boundary coordinates', () => {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(0, 0);
            const seed = query('.firework-seed');
            expect(seed?.style.left).to.equal('0px');
            expect(seed?.style.top).to.equal('0px');
        });

        it('should handle generating fireworks at negative coordinates', () => {
            instance = new Fireworksify({ showDefault: true });
            instance.generate(-50, -100);
            const seed = query('.firework-seed');
            expect(seed?.style.left).to.equal('-50px');
            expect(seed?.style.top).to.equal('-100px');
        });

        it('should handle additionalSeeds with empty array', () => {
            instance = new Fireworksify({ additionalSeeds: [] });
            expect(instance).to.be.an('object');
        });
    });
});
