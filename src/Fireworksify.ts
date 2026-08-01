// Initial speed of explosion particles radiating outward from the burst point
const FIREWORK_PARTICLE_INITIAL_VELOCITY = 0.5;
// Initial upward launch speed of a firework seed
const FIREWORK_SEED_INITIAL_VELOCITY = 0.85;
// How long (ms) a particle stays alive before being removed
const FIREWORK_PARTICLE_INITIAL_TIMER_VALUE = 2500;
// How long (ms) a seed travels upward before exploding
const FIREWORK_SEED_INITIAL_TIMER_VALUE = 1000;

// Air resistance factor — decelerates objects proportional to their velocity
const ACCELERATION = 0.0005;
// Gravitational pull — constant downward acceleration each frame
const GRAVITY = 0.0005;
// Random velocity dampening factor — each particle gets up to 30% speed reduction for variance
const VELOCITY = 0.3;

/** Configuration for a single firework seed type. */
interface SeedConfig {
    explode: boolean;
    destroy: boolean;
    class: string;
}

/** Configuration options passed to the Fireworksify constructor. */
interface FireworksifyConfig {
    duration?: number;
    showDefault?: boolean;
    additionalSeeds?: SeedConfig[];
}

const DEFAULT_SEED: SeedConfig = {
    explode: true,
    destroy: true,
    class: 'firework-seed--default'
};

class FireworkBatch {
    public el: HTMLElement = document.createElement('div');
}

class FireworkSeed {
    public el: HTMLElement = document.createElement('div');
    public id = 0;
    public time = 0;
    public velocityX = 0;
    public velocityY = 0;
    public positionX = 0;
    public positionY = 0;
    public seedConfig: SeedConfig = DEFAULT_SEED;
    public peaked = false;
}

class FireworkParticle {
    public el: HTMLElement = document.createElement('div');
    public id = 0;
    public time = 0;
    public velocityX = 0;
    public velocityY = 0;
    public positionX = 0;
    public positionY = 0;
}

/**
 * Fireworksify — a lightweight browser fireworks animation controller.
 *
 * Creates a full-viewport overlay and renders firework seeds that launch upward,
 * explode into 72-particle starbursts, and fade out with simulated gravity and
 * air resistance. Dispatches `he:fireworksify:start` and `he:fireworksify:stop`
 * custom events on `document`.
 */
export class Fireworksify {
    private _seeds: FireworkSeed[] = [];
    private _particles: FireworkParticle[] = [];
    private _boardEl: HTMLElement;

    private _before: number = Date.now();
    // Handle for the 5ms animation loop interval
    private _id: ReturnType<typeof setInterval> | null = null;
    private _domId = 1000;

    private _availableSeeds: SeedConfig[] = [];

    // Setting the default to 10 seconds.
    private _duration = 10000;
    private _timerId: ReturnType<typeof setInterval> | null = null;

    constructor(config?: FireworksifyConfig | null) {
        this._boardEl = document.createElement('div');
        document.body.append(this._boardEl);

        if (config && config.duration) {
            this._duration = config.duration * 1000;
        }
        if (config && config.showDefault) {
            this._availableSeeds.push(DEFAULT_SEED);
        }
        if (config && Array.isArray(config.additionalSeeds) && config.additionalSeeds.length) {
            this._availableSeeds = this._availableSeeds.concat(config.additionalSeeds);
        }
        // Animation loop running at ~200fps (5ms interval) for smooth physics simulation
        this._id = setInterval(() => {
            this.frame();
        }, 5);
    }

    /**
     * Start an automated fireworks display that launches seeds at random horizontal
     * offsets from the viewport center. The display runs for the configured duration
     * (default 10 seconds) and then stops automatically.
     */
    public start(): void {
        // Guard against multiple concurrent start() calls without clearing the previous timer
        if (this._timerId !== null) {
            clearInterval(this._timerId);
        }

        const centerOffset = window.innerWidth / 4;

        const startEvent = new Event('he:fireworksify:start');
        document.dispatchEvent(startEvent);

        this._timerId = setInterval(() => {
            const direction = Math.round(Math.random()) * -1;
            let offset = Math.round(Math.random() * centerOffset);
            if (direction < 0) {
                offset *= -1;
            }
            const additionalTime = Math.round(Math.random() * 500);

            setTimeout(() => {
                this.newFireworkSeed(window.innerWidth / 2 + offset, window.innerHeight + 10);
            }, additionalTime);
        }, 350);
        this.initiateStop();
    }

    /**
     * Generate a single firework seed at the given coordinates.
     * Useful for triggering fireworks at specific positions (e.g., on click).
     */
    public generate(x: number, y: number): void {
        this.newFireworkSeed(x, y);
    }

    /**
     * Tear down the fireworks instance: stop all timers, remove DOM elements,
     * and clear internal arrays. The instance should not be reused after calling this.
     */
    public destroy(): void {
        if (this._id !== null) {
            clearInterval(this._id);
            this._id = null;
        }
        if (this._timerId !== null) {
            clearInterval(this._timerId);
            this._timerId = null;
        }
        if (this._boardEl && this._boardEl.parentNode) {
            this._boardEl.parentNode?.removeChild(this._boardEl);
        }
        this._seeds = [];
        this._particles = [];
    }

    private initiateStop(): void {
        setTimeout(() => {
            const stopEvent = new Event('he:fireworksify:stop');
            document.dispatchEvent(stopEvent);

            if (this._timerId !== null) {
                clearInterval(this._timerId);
                this._timerId = null;
            }
        }, this._duration);
    }

    private getNextId(): number {
        this._domId += 1;
        return this._domId;
    }

    private newFireworkParticle(x: number, y: number, angle: number): FireworkParticle {
        const fireworkParticle = new FireworkParticle();
        fireworkParticle.id = this.getNextId();
        fireworkParticle.el.id = `he-firework-particle-${fireworkParticle.id}`;
        fireworkParticle.el.setAttribute('class', 'firework-particle');
        fireworkParticle.time = FIREWORK_PARTICLE_INITIAL_TIMER_VALUE;

        while (angle > 360) {
            angle -= 360;
        }
        while (angle < 0) {
            angle += 360;
        }

        // All quadrants use the same trigonometric projection — sin/cos handle sign automatically
        fireworkParticle.velocityX =
            FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.sin((angle * Math.PI) / 180) * (1 - Math.random() * VELOCITY);
        fireworkParticle.velocityY =
            FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.cos((angle * Math.PI) / 180) * (1 - Math.random() * VELOCITY);

        fireworkParticle.positionX = x;
        fireworkParticle.positionY = y;
        fireworkParticle.el.style.left = `${fireworkParticle.positionX}px`;
        fireworkParticle.el.style.top = `${fireworkParticle.positionY}px`;

        this._particles.push(fireworkParticle);

        return fireworkParticle;
    }

    private newFireworkSeed(x: number, y: number): FireworkSeed {
        // Fall back to the built-in seed when no seeds were configured, so that
        // `new Fireworksify({ duration: 10 }).start()` works without extra setup.
        const seedConfig = this._availableSeeds.length
            ? this._availableSeeds[Math.floor(Math.random() * this._availableSeeds.length)]
            : DEFAULT_SEED;

        const fireworkSeed = new FireworkSeed();
        fireworkSeed.id = this.getNextId();
        fireworkSeed.seedConfig = seedConfig;
        fireworkSeed.el.id = `he-firework-seed-${fireworkSeed.id}`;
        fireworkSeed.el.setAttribute('class', `firework-seed ${seedConfig.class}`);

        this._boardEl.appendChild(fireworkSeed.el);

        const direction = Math.round(Math.random()) * -1;
        let additionalVelocity = Math.round(Math.random() * 200) / 1000;
        if (direction < 0) {
            additionalVelocity *= -1;
        }
        // Which direction is the seed going to move on the x-axis?
        const velocityX = Math.round(Math.random()) ? 0.1 : -0.1;

        fireworkSeed.time = FIREWORK_SEED_INITIAL_TIMER_VALUE;
        fireworkSeed.velocityX = velocityX;
        fireworkSeed.velocityY = FIREWORK_SEED_INITIAL_VELOCITY + additionalVelocity;
        fireworkSeed.positionX = x;
        fireworkSeed.positionY = y;
        fireworkSeed.el.style.left = `${fireworkSeed.positionX}px`;
        fireworkSeed.el.style.top = `${fireworkSeed.positionY}px`;

        this._seeds.push(fireworkSeed);

        return fireworkSeed;
    }

    /**
     * Create a starburst of 72 particles (one every 5 degrees around a full 360° circle)
     * at the given position, grouped inside a batch container for fade-out animation.
     */
    private newFireworkStar(x: number, y: number) {
        const fireworkBatch = new FireworkBatch();
        fireworkBatch.el.setAttribute('class', 'firework-batch');

        let angle = 0;
        while (angle < 360) {
            const fireworkParticle = this.newFireworkParticle(x, y, angle);

            fireworkBatch.el.appendChild(fireworkParticle.el);
            angle += 5;
        }

        this._boardEl.appendChild(fireworkBatch.el);
    }

    private frame() {
        const current = Date.now();
        const deltaTime = current - this._before;
        this._before = current;

        // Use filter() instead of forEach+splice to avoid skipping elements
        // when mutating the array during iteration
        this._seeds = this._seeds.filter((fireworkSeed) => {
            fireworkSeed.time -= deltaTime;

            if (fireworkSeed.time > 0) {
                fireworkSeed.velocityX -= fireworkSeed.velocityX * ACCELERATION * deltaTime;
                fireworkSeed.velocityY -= GRAVITY * deltaTime + fireworkSeed.velocityY * ACCELERATION * deltaTime;
                fireworkSeed.positionX += fireworkSeed.velocityX * deltaTime;
                fireworkSeed.positionY -= fireworkSeed.velocityY * deltaTime;
                fireworkSeed.el.style.left = `${fireworkSeed.positionX}px`;
                fireworkSeed.el.style.top = `${fireworkSeed.positionY}px`;
            } else {
                if (!fireworkSeed.peaked && fireworkSeed.seedConfig.explode) {
                    this.newFireworkStar(fireworkSeed.positionX, fireworkSeed.positionY);
                }
                fireworkSeed.peaked = true;

                if (!fireworkSeed.seedConfig.destroy) {
                    fireworkSeed.velocityX += fireworkSeed.velocityX * ACCELERATION * deltaTime;
                    fireworkSeed.velocityY += GRAVITY * deltaTime + fireworkSeed.velocityY * ACCELERATION * deltaTime;
                    fireworkSeed.positionX += fireworkSeed.velocityX * deltaTime;
                    fireworkSeed.positionY += fireworkSeed.velocityY * deltaTime;
                    fireworkSeed.el.style.left = `${fireworkSeed.positionX}px`;
                    fireworkSeed.el.style.top = `${fireworkSeed.positionY}px`;
                } else {
                    fireworkSeed.el.parentNode?.removeChild(fireworkSeed.el);
                    return false; // Remove from array
                }
            }
            // Remove seeds that have peaked and fallen out of the viewport
            if (fireworkSeed.peaked && fireworkSeed.positionY > window.innerHeight) {
                fireworkSeed.el.parentNode?.removeChild(fireworkSeed.el);
                return false; // Remove from array
            }
            return true; // Keep in array
        });

        this._particles = this._particles.filter((fireworkParticle) => {
            fireworkParticle.time -= deltaTime;

            if (fireworkParticle.time > 0) {
                fireworkParticle.velocityX -= fireworkParticle.velocityX * ACCELERATION * deltaTime;
                fireworkParticle.velocityY -=
                    GRAVITY * deltaTime + fireworkParticle.velocityY * ACCELERATION * deltaTime;
                fireworkParticle.positionX += fireworkParticle.velocityX * deltaTime;
                fireworkParticle.positionY -= fireworkParticle.velocityY * deltaTime;
                fireworkParticle.el.style.left = `${fireworkParticle.positionX}px`;
                fireworkParticle.el.style.top = `${fireworkParticle.positionY}px`;
            } else {
                fireworkParticle.el.parentNode?.removeChild(fireworkParticle.el);
                return false; // Remove from array
            }
            // Remove particles that have fallen out of the viewport
            if (fireworkParticle.positionY > window.innerHeight) {
                fireworkParticle.el.parentNode?.removeChild(fireworkParticle.el);
                return false; // Remove from array
            }
            return true; // Keep in array
        });
    }
}
