/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const DrawParallelogram = __webpack_require__(/*! ./src/scripts/DrawParallelogram */ \"./src/scripts/DrawParallelogram.js\");\nwindow.DrawParallelogram = DrawParallelogram;\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./src/scripts/DrawParallelogram.js":
/*!******************************************!*\
  !*** ./src/scripts/DrawParallelogram.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Parallelogram = __webpack_require__(/*! ./entities/Parallelogram */ \"./src/scripts/entities/Parallelogram.js\");\nconst Point = __webpack_require__(/*! ./entities/Point */ \"./src/scripts/entities/Point.js\");\nconst { getSelectedPoint, updatePointsPosition } = __webpack_require__(/*! ./geometry */ \"./src/scripts/geometry.js\");\n\nclass DrawParallelogram {\n    /**\n     * initialize interactive graph \n     * @param {Element} canvas html canvas element\n     * @constructor\n    */\n    constructor(canvas, greenSockTweener, greenSockEase) {\n        this.ctx;\n        this.canvas = canvas;\n        this.elementsToRender = []\n        this.renderAnimations = [];\n        this.newPoints = []\n        this.parallelogram;\n        this.interacting = false\n        this.selectedPoint;\n        this.opositePoint\n        this.animator = greenSockTweener;\n        this.easing = {\n            easeOut: greenSockEase.easeOut.config(1.7),\n        };\n        this.initializeCanvas();\n        this.setListeners();\n        requestAnimationFrame(this.onUpdate.bind(this));\n    }\n\n    /**\n     * clear canvas\n     */\n    restart() {\n        this.elementsToRender = [];\n        this.renderAnimations = [];\n        this.newPoints = [];\n        this.parallelogram = null;\n        this.interacting = true;\n        this.selectedPoint = null;\n        this.opositePoint = null;\n    }\n\n    /**\n     * initialize canvas\n     */\n    initializeCanvas() {\n        this.ctx = this.canvas.getContext('2d');\n        this.ctx.imageSmoothingQuality = 'high';\n        this.ctx.canvas.width = window.innerWidth;\n        this.ctx.canvas.height = window.innerHeight;\n    }\n\n    /**\n    * set listeners for user iteraction\n    */\n    setListeners() {\n        window.addEventListener('resize', this.resizeHandler.bind(this));\n        this.canvas.addEventListener('click', this.clickHandler.bind(this));\n        this.canvas.addEventListener('mousedown', this.mouseDownHandler.bind(this));\n        this.canvas.addEventListener('mousemove', this.mouseMoveHanlder.bind(this));\n        this.canvas.addEventListener('mouseup', this.mouseUpHandler.bind(this));\n    }\n\n    /**\n     * render elements on interaction or animation\n     */\n    onUpdate() {\n        if (this.interacting || this.renderAnimations.some((animate) => animate)) {\n            this.interacting = false\n            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\n            this.renderAnimations = this.elementsToRender.map(element => element.render());\n        }\n\n        requestAnimationFrame(this.onUpdate.bind(this));\n    }\n\n    /**\n     * calculate pointer position on event.\n     * @param {Event} event \n     * @returns {Object} point with position\n     */\n    getMousePos(event) {\n        const rect = this.canvas.getBoundingClientRect();\n        return {\n            x: event.clientX - rect.left,\n            y: event.clientY - rect.top\n        };\n    }\n\n    /**\n    * resize Event Handler\n    */\n    resizeHandler() {\n        this.interacting = true;\n        this.ctx.canvas.width = window.innerWidth;\n        this.ctx.canvas.height = window.innerHeight;\n    };\n\n    /**\n    * click Event Handler\n    */\n    clickHandler(event) {\n        this.interacting = true;\n        const mousePos = this.getMousePos(event);\n        this.addNewPoint(mousePos);\n    }\n\n    /**\n    * mouse down Event Handler\n    */\n    mouseDownHandler(event) {\n        this.interacting = true;\n        this.draging = true;\n        const mousePos = this.getMousePos(event);\n        const { selectedPoint, opositePoint } = getSelectedPoint(this.newPoints, mousePos);\n        this.selectedPoint = selectedPoint;\n        this.opositePoint = opositePoint;\n    }\n    /**\n    * mouse move Event Handler\n    */\n    mouseMoveHanlder(event) {\n        if (this.draging && this.selectedPoint) {\n            this.interacting = true;\n            const mousePos = this.getMousePos(event);\n            updatePointsPosition(this.selectedPoint, this.opositePoint, mousePos);\n        }\n    }\n\n    /**\n    * mouse up Event Handler\n    */\n    mouseUpHandler() {\n        this.interacting = true;\n        this.draging = false;\n        this.selectedPoint = null;\n    }\n\n    /**\n     * add new point to Parallelogram, it will create one if is not defined\n     * @param {object} pos \n     */\n    addNewPoint(pos) {\n        if (!this.parallelogram) {\n            this.parallelogram = new Parallelogram(this);\n            this.elementsToRender.push(this.parallelogram);\n        }\n        if (this.newPoints.length >= 3) return;\n        const newPoint = new Point(pos, this).animate();\n        this.newPoints.push(newPoint)\n        this.parallelogram.addPoint(newPoint)\n        this.elementsToRender.push(newPoint);\n        this.parallelogram.animate();\n    }\n}\n\nmodule.exports = DrawParallelogram;\n\n//# sourceURL=webpack:///./src/scripts/DrawParallelogram.js?");

/***/ }),

/***/ "./src/scripts/entities/AreaCircle.js":
/*!********************************************!*\
  !*** ./src/scripts/entities/AreaCircle.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { polygonArea, getCenter } = __webpack_require__(/*! ../geometry */ \"./src/scripts/geometry.js\")\n/**\n * Entity representing the calculate area circle of Parallelogram\n * @class\n */\nclass AreaCircle {\n    /**\n     * @param {Parallelogram} parallelogram instance of paralelogram;  \n     * @param {Object} Config context for rendering and interaction \n     * @param {Object} Config.ctx canvas context\n     * @param {Element} Config.canvas canvas\n     * @param {Object} Config.animator tweener for animation\n     * @param {Object} Config.easing ease for animation\n     * @constructor\n     */\n    constructor(parallelogram, {ctx, canvas, animator, easing }) {\n        this.ctx = ctx;\n        this.canvas = canvas;\n        this.animator = animator;\n        this.easing = easing;\n        this.parallelogram = parallelogram;\n        this.updateProperties();\n        this.circleColor = '#FAD02C';\n    }\n\n    /**\n     * Update all properties of AreaCircle base on Parallelogram\n     */\n    updateProperties() {\n        this.updateArea();\n        this.updatePosition();\n        this.updateRadius();\n    }\n    /**\n     * update Area form Parallelogram points\n     */\n    updateArea() {\n        this.area = polygonArea(this.parallelogram.points);\n    }\n     /**\n     * update Position form Parallelogram points\n     */\n    updatePosition() {\n        const { x, y } = getCenter(this.parallelogram.points, this.canvas.width, this.canvas.height);\n        this.x = x;\n        this.y = y;\n    }\n\n     /**\n     * update radius base en current Area\n     */\n    updateRadius() {\n        this.r = Math.sqrt(this.area / Math.PI);\n    }\n\n    /**\n     * function called for the render system on interaction or animation\n     * @returns {boolean}\n     */\n    render() {\n        if (!this.isAnimating) {\n            this.updateProperties();\n        }\n        this.ctx.font = '12px Helvetica';\n        this.ctx.fillStyle = this.circleColor;\n        this.ctx.fillText(`AREA: ${this.area}`, this.x + this.r + 10, this.y);\n\n        const circlePath = new Path2D();\n        circlePath.arc(this.x, this.y, this.r, 0, 2 * Math.PI);\n        this.ctx.strokeStyle = this.circleColor;\n        this.ctx.stroke(circlePath);\n        return this.isAnimating;\n    }\n\n    /**\n     * set isAnimating on false on end animation\n     */\n    onComplete() {\n        this.isAnimating = false;\n    }\n\n    /**\n     * start animation\n     * @returns {Point} current instance\n     */\n    animate() {\n        this.isAnimating = true;\n        this.animator.from(this, .5, {\n            r: 0, \n            ease: this.easing.easeOut,\n            onComplete: this.onComplete.bind(this)\n        });\n        return this;\n    }\n}\n\n\nmodule.exports = AreaCircle;\n\n//# sourceURL=webpack:///./src/scripts/entities/AreaCircle.js?");

/***/ }),

/***/ "./src/scripts/entities/Parallelogram.js":
/*!***********************************************!*\
  !*** ./src/scripts/entities/Parallelogram.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const AreaCircle = __webpack_require__(/*! ./AreaCircle */ \"./src/scripts/entities/AreaCircle.js\");\nconst Point = __webpack_require__(/*! ./Point */ \"./src/scripts/entities/Point.js\");\nconst { getMissingPointParallelogram } = __webpack_require__(/*! ../geometry */ \"./src/scripts/geometry.js\");\n/**\n * Entity representing the Parallelogram draw by the user\n */\nclass Parallelogram {\n    constructor(config) {\n        const {ctx, canvas, animator, easing,  newPoints, storedLines, elementsToRender } = config;\n        this.config = config;\n        this.ctx = ctx;\n        this.canvas = canvas;\n        this.animator = animator;\n        this.easing = easing;\n        this.newPoints = newPoints;\n        this.storedLines = storedLines; // TODO REVIEW THIS AND REMOVE\n        this.elementsToRender = elementsToRender;\n        this.points = [];\n        this.animatedPoints = []\n        this.lineColor = '#659ed0';\n    }\n\n    /**\n     * Add Point instance to be incluede on shape\n     * @param {Point} point\n     * @returns {Parallelogram} current instance\n     */\n    addPoint(point) {\n        this.animatedPoints.push({ x: point.x, y: point.y })\n        this.points.push(point);\n        return this;\n    }\n\n    /**\n     * set is animating on false and calculate next action for the current number of Points\n     * @param {number} current current number of points at end animation\n     */\n    onComplete(current) {\n        this.isAnimating = false;\n        if (current === 3) {\n            const autoPoint = new Point(getMissingPointParallelogram(this.newPoints), this.config).animate();\n            this.addPoint(autoPoint).animate();\n            this.newPoints.push(autoPoint);\n            this.elementsToRender.push(autoPoint);\n        }\n\n        if (current === 4) {\n            this.addPoint(this.points[0]).animate();\n        }\n\n        if (current === 5) {\n            this.elementsToRender.push(new AreaCircle(this, this.config).animate())\n        }\n    }\n\n    /**\n     * function called for the render system on interaction or animation\n     * @returns {boolean}\n     */\n    render() {\n        if (this.points.length < 2) return;\n        const lines = new Path2D();\n        const points = this.isAnimating ? this.animatedPoints : this.points;\n        points.forEach((point, i) => {\n            if (i === 0) {\n                lines.moveTo(point.x, point.y);\n                return;\n            }\n            lines.lineTo(point.x, point.y);\n        });\n\n        lines.strokeStyle = this.lineColor; //review this\n        this.ctx.strokeStyle = this.lineColor;\n        this.ctx.stroke(lines);\n        return this.isAnimating;\n    }\n    /**\n     * start animation\n     */\n    animate() {\n        this.isAnimating = true;\n        if (this.points.length < 2) return;\n        const previousPoint = this.points[this.points.length - 2];\n        const animationPoint = this.animatedPoints[this.animatedPoints.length - 1];\n        this.animator.from(animationPoint, .4, {\n            x: previousPoint.x,\n            y: previousPoint.y,\n            onComplete: this.onComplete.bind(this),\n            onCompleteParams: [this.points.length],\n        });\n    }\n}\n\nmodule.exports = Parallelogram;\n\n//# sourceURL=webpack:///./src/scripts/entities/Parallelogram.js?");

/***/ }),

/***/ "./src/scripts/entities/Point.js":
/*!***************************************!*\
  !*** ./src/scripts/entities/Point.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Entity repesentacion for user selection\n * @class\n */\nclass Point {\n    /**\n     * @param {Object} pos position object \n     * @param {Object} Config context for rendering and interaction \n     * @param {Object} Config.ctx canvas context\n     * @param {Element} Config.canvas canvas\n     * @param {Object} Config.animator tweener for animation\n     * @param {Object} Config.easing ease for animation\n     * @constructor\n     */\n    constructor(pos, {ctx, canvas, animator, easing}) {\n        this.ctx = ctx;\n        this.canvas = canvas;\n        this.animator = animator;\n        this.easing = easing;\n        this.x = pos.x;\n        this.y = pos.y;\n        this.r = 11;\n        this.isAnimating = false;\n        this.animationTime = .5;\n        this.font = '9px Helvetica';\n        this.textColor = '#333652';\n        this.fillColor = 'rgba(255, 0, 0, .5)';\n        this.centerColor = '#8e0f37';\n    }\n\n    /**\n     * function called for the render system on interaction or animation\n     * @returns {boolean}\n     */\n    render() {\n        const path = new Path2D();\n        this.ctx.font = this.font;\n        this.ctx.fillStyle = this.textColor;\n        this.ctx.fillText(`x: ${this.x} y: ${this.y}`, this.x + 15, this.y);\n        this.drawFilledCircle(this, this.r, this.fillColor, path);\n        this.drawFilledCircle(this, 3, this.centerColor, path);\n        return this.isAnimating;\n    }\n\n    /**\n     * start animation\n     * @returns {Point} current instance\n     */\n    animate() {\n        this.isAnimating = true;\n        this.animator.from(this, this.animationTime, {\n            r: 0,\n            ease: this.easing.easeOut,\n            onComplete: this.onComplete.bind(this)\n        });\n        return this;\n    }\n    /**\n     * set isAnimating on false on end animation\n     */\n    onComplete() {\n        this.isAnimating = false;\n    }\n\n    /**\n     * use path to draw a circle in the context\n     * @param {object} position \n     * @param {string} radius \n     * @param {string} color \n     * @param {path2D} path2D \n     */\n    drawFilledCircle(position, radius, color, path2D) {\n        const circle = new Path2D(path2D);\n        circle.arc(position.x, position.y, radius, 0, 2 * Math.PI);\n        this.ctx.fillStyle = color;\n        this.ctx.fill(circle);\n    }\n}\n\nmodule.exports = Point;\n\n\n//# sourceURL=webpack:///./src/scripts/entities/Point.js?");

/***/ }),

/***/ "./src/scripts/geometry.js":
/*!*********************************!*\
  !*** ./src/scripts/geometry.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * calculate center of poligon\n * @param {Array} points list of points x, y\n * @param {number} width of container\n * @param {number} height of container\n */\nfunction getCenter(points, width, height) {\n    const limits = points.reduce((acumulator, current) => {\n        if(current.x < acumulator.xL) {\n            acumulator.xL = current.x\n        }\n        if(current.x > acumulator.xR) {\n            acumulator.xR = current.x\n        }\n        if(current.y < acumulator.yT) {\n            acumulator.yT = current.y\n        }\n        if(current.y > acumulator.yB) {\n            acumulator.yB = current.y\n        }\n\n        return acumulator;\n    }, {xL:width, xR: 0, yT:height, yB: 0});\n    \n    const centerX = (limits.xR - limits.xL) / 2 + limits.xL;\n    const centerY = (limits.yB - limits.yT) / 2 + limits.yT;\n    return { x: centerX, y: centerY };\n}\n\n/**\n * calculate area of poligon\n * @param {array} points list of Points\n */\nfunction polygonArea(points){ \n    let previus = points[points.length - 1];\n    const area = points.reduce((a, c) => {\n        const current = a + (previus.x+c.x) * (previus.y-c.y)\n        previus = c;\n        return current;\n    }, 0)\n    return Math.abs(area/2);\n}\n\n/**\n * match mouse position with a point in the array and return it and the oposite point\n * @param {array} points \n * @param {object} mousePos \n * @returns {object} {selectedPoint, opositePoint}\n */\nfunction getSelectedPoint(points, mousePos) {\n    let opositeIndex = 0;\n    let selection = {};\n    const selectedPoint = points.find((a, index) => {\n        opositeIndex = Math.abs(index - 2);\n        if (opositeIndex === index) {\n            opositeIndex = 3;\n        }\n        return Math.abs(mousePos.x - a.x) < 6 && Math.abs(mousePos.y - a.y) < 6;\n    });\n\n    opositePoint = points[opositeIndex];\n\n    if(selectedPoint) {\n        selection = {\n            selectedPoint,\n            opositePoint\n        }\n    }\n\n    return selection;\n}\n\n/**\n * update oposite point and current point with new position from mouse\n * @param {object} selectedPoint \n * @param {object} opositePoint \n * @param {object} mousePos \n */\nfunction updatePointsPosition(selectedPoint, opositePoint, mousePos) {\n    opositePoint.x = opositePoint.x + selectedPoint.x - mousePos.x;\n    opositePoint.y = opositePoint.y + selectedPoint.y - mousePos.y;\n    selectedPoint.x = mousePos.x;\n    selectedPoint.y = mousePos.y;\n}\n\n/**\n * calculate missing point of parallelogram\n * @param {array} points \n * @returns {object} object position\n */\nfunction getMissingPointParallelogram(points) {\n    return {x:points[2].x - (points[1].x - points[0].x), y:points[2].y + (points[0].y - points[1].y) };\n}\n\nmodule.exports = {\n    getMissingPointParallelogram,\n    updatePointsPosition,\n    getSelectedPoint,\n    polygonArea,\n    getCenter,\n}\n\n//# sourceURL=webpack:///./src/scripts/geometry.js?");

/***/ })

/******/ });