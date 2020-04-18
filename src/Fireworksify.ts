import './Fireworksify.css';

const FIREWORK_PARTICLE_INITIAL_VELOCITY = 0.5;
const FIREWORK_SEED_INITIAL_VELOCITY = .85;
const FIREWORK_PARTICLE_INITIAL_TIMER_VALUE = 3500;
const FIREWORK_SEED_INITIAL_TIMER_VALUE = 1000;

const ACCELERATION = 0.0005;
const GRAVITY = 0.0005;
const VELOCITY = 0.3;

// Don't think we need these values.
// Holding here just in case.
// const cursorXOffset = 5;
// const cursorYOffset = 0;

class FireworkBatch {
    public el: HTMLElement = document.createElement('div');
}

class FireworkSeed {
    public el: HTMLElement = document.createElement('div');
    public time: number = 0;
    public velocityX: number = 0;
    public velocityY: number = 0;
    public positionX: number = 0;
    public positionY: number = 0;
}

class FireworkParticle {
    public el: HTMLElement = document.createElement('div');
    public time: number = 0;
    public velocityX: number = 0;
    public velocityY: number = 0;
    public positionX: number = 0;
    public positionY: number = 0;
}

export default class Fireworksify {
    private _seeds: FireworkSeed[] = [];
    private _particles: FireworkParticle[] = [];
    private _boardEl: HTMLElement = null;

    private _before: number = Date.now();
    private _id: any = null;

    private _seedClass: string = 'firework-seed--default';

    // Setting the default to 10 seconds.
    private _duration: number = 10000;
    private _timerId: any = null;

    constructor(config: any) {
        this._boardEl = document.createElement('div');
        document.body.append(this._boardEl);        

        if (config && config.duration) {
            this._duration = config.duration;
        }
        if (config && config.seedClass) {
            this._seedClass = config.seedClass;
        }

        this._id = setInterval(() => {
            this.frame();
        }, 5);
    }

    public start(duration: number) {
        const centerOffset = window.innerWidth / 4;

        this._timerId = setInterval(() => {
            const direction = (Math.round(Math.random())) * -1;
            let offset = Math.round(Math.random() * centerOffset);
            if (direction < 0) {
                offset *= -1;
            }
            const additionalTime = Math.round(Math.random() * 500);

            setTimeout(() => {
                this.newFireworkSeed(((window.innerWidth / 2) + offset), (window.innerHeight + 10));
            }, additionalTime);
        }, 350);
        this.initiateStop();
    }

    private initiateStop() {
        setTimeout(() => {
            clearInterval(this._timerId);
        }, this._duration);
    }

    private newFireworkParticle(x: number, y: number, angle: number): FireworkParticle {
        let fireworkParticle = new FireworkParticle();
        fireworkParticle.el.setAttribute('class', 'firework-particle');
        fireworkParticle.time = FIREWORK_PARTICLE_INITIAL_TIMER_VALUE;

        while (angle > 360) {
            angle -= 360;
        }
        while (angle < 0) {
            angle += 360;
        }

        if (angle > 270) {
            fireworkParticle.velocityX = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);
            fireworkParticle.velocityY = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);
        } else if (angle > 180) {
            fireworkParticle.velocityX = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);
            fireworkParticle.velocityY = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);
        } else if(angle > 90) {
            fireworkParticle.velocityX = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);
            fireworkParticle.velocityY = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);
        } else {
            fireworkParticle.velocityX = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);
            fireworkParticle.velocityY = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);
        }

        fireworkParticle.positionX = x;
        fireworkParticle.positionY = y;
        fireworkParticle.el.style.left = fireworkParticle.positionX + 'px';
        fireworkParticle.el.style.top = fireworkParticle.positionY + 'px';

        if (this._particles === null) {
            this._particles = [];
        }
        this._particles.push(fireworkParticle);

        return fireworkParticle;
    }

    private newFireworkSeed(x: number, y: number): FireworkSeed {
        let fireworkSeed = new FireworkSeed();
        fireworkSeed.el.setAttribute('class', `firework-seed ${this._seedClass}`);

        this._boardEl.appendChild(fireworkSeed.el);

        const direction = (Math.round(Math.random())) * -1;
        let additionalVelocity = (Math.round(Math.random() * 200)) / 1000;
        if (direction < 0) {
            additionalVelocity *= -1;
        }

        // Which direction is the seed going to move on the x-axis?
        const velocityX = (Math.round(Math.random()))? 0.1: -0.1;

        fireworkSeed.time = FIREWORK_SEED_INITIAL_TIMER_VALUE;
        fireworkSeed.velocityX = velocityX;
        fireworkSeed.velocityY = FIREWORK_SEED_INITIAL_VELOCITY + additionalVelocity;
        fireworkSeed.positionX = x;
        fireworkSeed.positionY = y;
        fireworkSeed.el.style.left = fireworkSeed.positionX + 'px';
        fireworkSeed.el.style.top = fireworkSeed.positionY + 'px';

        if (this._seeds === null) {
            this._seeds = [];
        }
        this._seeds.push(fireworkSeed);

        return fireworkSeed;
    } 

    private newFireworkStar(x: number, y: number) {
        let fireworkBatch = new FireworkBatch();
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
        let current = Date.now();
        let deltaTime = current - this._before;
        this._before = current;

        this._seeds.forEach((fireworkSeed, index) => {
            fireworkSeed.time -= deltaTime;

            if (fireworkSeed.time > 0) {
                fireworkSeed.velocityX -= fireworkSeed.velocityX * ACCELERATION * deltaTime;
                fireworkSeed.velocityY -= GRAVITY * deltaTime + fireworkSeed.velocityY * ACCELERATION * deltaTime;
                fireworkSeed.positionX += fireworkSeed.velocityX * deltaTime;
                fireworkSeed.positionY -= fireworkSeed.velocityY * deltaTime;
                fireworkSeed.el.style.left = fireworkSeed.positionX + 'px';
                fireworkSeed.el.style.top = fireworkSeed.positionY + 'px';
            } else {
                this.newFireworkStar(fireworkSeed.positionX, fireworkSeed.positionY);
                fireworkSeed.el.parentNode.removeChild(fireworkSeed.el);
                this._seeds.splice(index, 1);
            }
        });

        this._particles.forEach((fireworkParticle, index) =>  {
            fireworkParticle.time -= deltaTime;

            if (fireworkParticle.time > 0) {
                fireworkParticle.velocityX -= fireworkParticle.velocityX * ACCELERATION * deltaTime;
                fireworkParticle.velocityY -= GRAVITY * deltaTime + fireworkParticle.velocityY * ACCELERATION * deltaTime;
                fireworkParticle.positionX += fireworkParticle.velocityX * deltaTime;
                fireworkParticle.positionY -= fireworkParticle.velocityY * deltaTime;
                fireworkParticle.el.style.left = fireworkParticle.positionX + 'px';
                fireworkParticle.el.style.top = fireworkParticle.positionY + 'px';
            } else {
                fireworkParticle.el.parentNode.removeChild(fireworkParticle.el);
                this._particles.splice(index, 1);
            }
        });
    }
}