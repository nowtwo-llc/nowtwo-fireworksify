import './Fireworksify.css';

const FIREWORK_PARTICLE_INITIAL_VELOCITY = 0.5;
const FIREWORK_SEED_INITIAL_VELOCITY = 0.85;
const FIREWORK_PARTICLE_INITIAL_TIMER_VALUE = 2500;
const FIREWORK_SEED_INITIAL_TIMER_VALUE = 1000;

const ACCELERATION = 0.0005;
const GRAVITY = 0.0005;
const VELOCITY = 0.3;

const DEFAULT_SEED = {
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
    public seedConfig: any = null;
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

export class Fireworksify {
    private _seeds: FireworkSeed[] = [];
    private _particles: FireworkParticle[] = [];
    private _boardEl: HTMLElement = null;

    private _before: number = Date.now();
    private _id: any = null;
    private _domId = 1000;

    private _availableSeeds: any[] = [];

    // Setting the default to 10 seconds.
    private _duration = 10000;
    private _timerId: any = null;

    constructor(config: any) {
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
        this._id = setInterval(() => {
            this.frame();
        }, 5);
    }

    public start(): void {
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

    public generate(x: number, y: number): void {
        this.newFireworkSeed(x, y);
    }

    private initiateStop(): void {
        setTimeout(() => {
            const stopEvent = new Event('he:fireworksify:stop');
            document.dispatchEvent(stopEvent);

            clearInterval(this._timerId);
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

        if (angle > 270) {
            fireworkParticle.velocityX =
                FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.sin((angle * Math.PI) / 180) * (1 - Math.random() * VELOCITY);
            fireworkParticle.velocityY =
                FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.cos((angle * Math.PI) / 180) * (1 - Math.random() * VELOCITY);
        } else if (angle > 180) {
            fireworkParticle.velocityX =
                FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.sin((angle * Math.PI) / 180) * (1 - Math.random() * VELOCITY);
            fireworkParticle.velocityY =
                FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.cos((angle * Math.PI) / 180) * (1 - Math.random() * VELOCITY);
        } else if (angle > 90) {
            fireworkParticle.velocityX =
                FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.sin((angle * Math.PI) / 180) * (1 - Math.random() * VELOCITY);
            fireworkParticle.velocityY =
                FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.cos((angle * Math.PI) / 180) * (1 - Math.random() * VELOCITY);
        } else {
            fireworkParticle.velocityX =
                FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.sin((angle * Math.PI) / 180) * (1 - Math.random() * VELOCITY);
            fireworkParticle.velocityY =
                FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.cos((angle * Math.PI) / 180) * (1 - Math.random() * VELOCITY);
        }
        fireworkParticle.positionX = x;
        fireworkParticle.positionY = y;
        fireworkParticle.el.style.left = `${fireworkParticle.positionX}px`;
        fireworkParticle.el.style.top = `${fireworkParticle.positionY}px`;

        if (this._particles === null) {
            this._particles = [];
        }
        this._particles.push(fireworkParticle);

        return fireworkParticle;
    }

    private newFireworkSeed(x: number, y: number): FireworkSeed {
        const seedConfig = this._availableSeeds[Math.floor(Math.random() * this._availableSeeds.length)];

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

        if (this._seeds === null) {
            this._seeds = [];
        }
        this._seeds.push(fireworkSeed);

        return fireworkSeed;
    }

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

        this._seeds.forEach((fireworkSeed, index) => {
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
                    fireworkSeed.el.parentNode.removeChild(fireworkSeed.el);
                    this._seeds.splice(index, 1);

                    fireworkSeed = null;
                }
            }
            // Making sure we remove seeds if they are out of view.
            if (fireworkSeed !== null && fireworkSeed.peaked && fireworkSeed.positionY > window.innerHeight) {
                fireworkSeed.el.parentNode.removeChild(fireworkSeed.el);
                this._seeds.splice(index, 1);
            }
        });

        this._particles.forEach((fireworkParticle, index) => {
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
                fireworkParticle.el.parentNode.removeChild(fireworkParticle.el);
                this._particles.splice(index, 1);

                fireworkParticle = null;
            }
            // Making sure we remove particles if they are out of view.
            if (fireworkParticle !== null && fireworkParticle.positionY > window.innerHeight) {
                fireworkParticle.el.parentNode.removeChild(fireworkParticle.el);
                this._particles.splice(index, 1);

                fireworkParticle = null;
            }
        });
    }
}
