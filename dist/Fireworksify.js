(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Fireworksify", [], factory);
	else if(typeof exports === 'object')
		exports["Fireworksify"] = factory();
	else
		root["Fireworksify"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Fireworksify.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Fireworksify.css":
/*!******************************!*\
  !*** ./src/Fireworksify.css ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack://Fireworksify/./src/Fireworksify.css?");

/***/ }),

/***/ "./src/Fireworksify.ts":
/*!*****************************!*\
  !*** ./src/Fireworksify.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Fireworksify_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Fireworksify.css */ \"./src/Fireworksify.css\");\n/* harmony import */ var _Fireworksify_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Fireworksify_css__WEBPACK_IMPORTED_MODULE_0__);\n\nvar FIREWORK_PARTICLE_INITIAL_VELOCITY = 0.5;\nvar FIREWORK_SEED_INITIAL_VELOCITY = .85;\nvar FIREWORK_PARTICLE_INITIAL_TIMER_VALUE = 3500;\nvar FIREWORK_SEED_INITIAL_TIMER_VALUE = 1000;\nvar ACCELERATION = 0.0005;\nvar GRAVITY = 0.0005;\nvar VELOCITY = 0.3;\nvar FireworkBatch = (function () {\n    function FireworkBatch() {\n        this.el = document.createElement('div');\n    }\n    return FireworkBatch;\n}());\nvar FireworkSeed = (function () {\n    function FireworkSeed() {\n        this.el = document.createElement('div');\n        this.time = 0;\n        this.velocityX = 0;\n        this.velocityY = 0;\n        this.positionX = 0;\n        this.positionY = 0;\n    }\n    return FireworkSeed;\n}());\nvar FireworkParticle = (function () {\n    function FireworkParticle() {\n        this.el = document.createElement('div');\n        this.time = 0;\n        this.velocityX = 0;\n        this.velocityY = 0;\n        this.positionX = 0;\n        this.positionY = 0;\n    }\n    return FireworkParticle;\n}());\nvar Fireworksify = (function () {\n    function Fireworksify(config) {\n        var _this = this;\n        this._seeds = [];\n        this._particles = [];\n        this._boardEl = null;\n        this._before = Date.now();\n        this._id = null;\n        this._seedClass = 'firework-seed--default';\n        this._duration = 10000;\n        this._timerId = null;\n        this._boardEl = document.createElement('div');\n        document.body.append(this._boardEl);\n        if (config && config.duration) {\n            this._duration = config.duration;\n        }\n        if (config && config.seedClass) {\n            this._seedClass = config.seedClass;\n        }\n        this._id = setInterval(function () {\n            _this.frame();\n        }, 5);\n    }\n    Fireworksify.prototype.start = function (duration) {\n        var _this = this;\n        var centerOffset = window.innerWidth / 4;\n        this._timerId = setInterval(function () {\n            var direction = (Math.round(Math.random())) * -1;\n            var offset = Math.round(Math.random() * centerOffset);\n            if (direction < 0) {\n                offset *= -1;\n            }\n            var additionalTime = Math.round(Math.random() * 500);\n            setTimeout(function () {\n                _this.newFireworkSeed(((window.innerWidth / 2) + offset), (window.innerHeight + 10));\n            }, additionalTime);\n        }, 350);\n        this.initiateStop();\n    };\n    Fireworksify.prototype.initiateStop = function () {\n        var _this = this;\n        setTimeout(function () {\n            clearInterval(_this._timerId);\n        }, this._duration);\n    };\n    Fireworksify.prototype.newFireworkParticle = function (x, y, angle) {\n        var fireworkParticle = new FireworkParticle();\n        fireworkParticle.el.setAttribute('class', 'firework-particle');\n        fireworkParticle.time = FIREWORK_PARTICLE_INITIAL_TIMER_VALUE;\n        while (angle > 360) {\n            angle -= 360;\n        }\n        while (angle < 0) {\n            angle += 360;\n        }\n        if (angle > 270) {\n            fireworkParticle.velocityX = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);\n            fireworkParticle.velocityY = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);\n        }\n        else if (angle > 180) {\n            fireworkParticle.velocityX = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);\n            fireworkParticle.velocityY = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);\n        }\n        else if (angle > 90) {\n            fireworkParticle.velocityX = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);\n            fireworkParticle.velocityY = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);\n        }\n        else {\n            fireworkParticle.velocityX = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);\n            fireworkParticle.velocityY = FIREWORK_PARTICLE_INITIAL_VELOCITY * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * VELOCITY);\n        }\n        fireworkParticle.positionX = x;\n        fireworkParticle.positionY = y;\n        fireworkParticle.el.style.left = fireworkParticle.positionX + 'px';\n        fireworkParticle.el.style.top = fireworkParticle.positionY + 'px';\n        if (this._particles === null) {\n            this._particles = [];\n        }\n        this._particles.push(fireworkParticle);\n        return fireworkParticle;\n    };\n    Fireworksify.prototype.newFireworkSeed = function (x, y) {\n        var fireworkSeed = new FireworkSeed();\n        fireworkSeed.el.setAttribute('class', \"firework-seed \" + this._seedClass);\n        this._boardEl.appendChild(fireworkSeed.el);\n        var direction = (Math.round(Math.random())) * -1;\n        var additionalVelocity = (Math.round(Math.random() * 200)) / 1000;\n        if (direction < 0) {\n            additionalVelocity *= -1;\n        }\n        var velocityX = (Math.round(Math.random())) ? 0.1 : -0.1;\n        fireworkSeed.time = FIREWORK_SEED_INITIAL_TIMER_VALUE;\n        fireworkSeed.velocityX = velocityX;\n        fireworkSeed.velocityY = FIREWORK_SEED_INITIAL_VELOCITY + additionalVelocity;\n        fireworkSeed.positionX = x;\n        fireworkSeed.positionY = y;\n        fireworkSeed.el.style.left = fireworkSeed.positionX + 'px';\n        fireworkSeed.el.style.top = fireworkSeed.positionY + 'px';\n        if (this._seeds === null) {\n            this._seeds = [];\n        }\n        this._seeds.push(fireworkSeed);\n        return fireworkSeed;\n    };\n    Fireworksify.prototype.newFireworkStar = function (x, y) {\n        var fireworkBatch = new FireworkBatch();\n        fireworkBatch.el.setAttribute('class', 'firework-batch');\n        var angle = 0;\n        while (angle < 360) {\n            var fireworkParticle = this.newFireworkParticle(x, y, angle);\n            fireworkBatch.el.appendChild(fireworkParticle.el);\n            angle += 5;\n        }\n        this._boardEl.appendChild(fireworkBatch.el);\n    };\n    Fireworksify.prototype.frame = function () {\n        var _this = this;\n        var current = Date.now();\n        var deltaTime = current - this._before;\n        this._before = current;\n        this._seeds.forEach(function (fireworkSeed, index) {\n            fireworkSeed.time -= deltaTime;\n            if (fireworkSeed.time > 0) {\n                fireworkSeed.velocityX -= fireworkSeed.velocityX * ACCELERATION * deltaTime;\n                fireworkSeed.velocityY -= GRAVITY * deltaTime + fireworkSeed.velocityY * ACCELERATION * deltaTime;\n                fireworkSeed.positionX += fireworkSeed.velocityX * deltaTime;\n                fireworkSeed.positionY -= fireworkSeed.velocityY * deltaTime;\n                fireworkSeed.el.style.left = fireworkSeed.positionX + 'px';\n                fireworkSeed.el.style.top = fireworkSeed.positionY + 'px';\n            }\n            else {\n                _this.newFireworkStar(fireworkSeed.positionX, fireworkSeed.positionY);\n                fireworkSeed.el.parentNode.removeChild(fireworkSeed.el);\n                _this._seeds.splice(index, 1);\n            }\n        });\n        this._particles.forEach(function (fireworkParticle, index) {\n            fireworkParticle.time -= deltaTime;\n            if (fireworkParticle.time > 0) {\n                fireworkParticle.velocityX -= fireworkParticle.velocityX * ACCELERATION * deltaTime;\n                fireworkParticle.velocityY -= GRAVITY * deltaTime + fireworkParticle.velocityY * ACCELERATION * deltaTime;\n                fireworkParticle.positionX += fireworkParticle.velocityX * deltaTime;\n                fireworkParticle.positionY -= fireworkParticle.velocityY * deltaTime;\n                fireworkParticle.el.style.left = fireworkParticle.positionX + 'px';\n                fireworkParticle.el.style.top = fireworkParticle.positionY + 'px';\n            }\n            else {\n                fireworkParticle.el.parentNode.removeChild(fireworkParticle.el);\n                _this._particles.splice(index, 1);\n            }\n        });\n    };\n    return Fireworksify;\n}());\n/* harmony default export */ __webpack_exports__[\"default\"] = (Fireworksify);\n\n\n//# sourceURL=webpack://Fireworksify/./src/Fireworksify.ts?");

/***/ })

/******/ });
});