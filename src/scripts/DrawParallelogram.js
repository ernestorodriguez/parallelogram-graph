const Parallelogram = require('./entities/Parallelogram');
const Point = require('./entities/Point');
const { getSelectedPoint, updatePointsPosition } = require('./geometry')

class DrawParallelogram {
    /**
     * initialize interactive graph 
     * @param {Element} canvas html canvas element
     * @constructor
    */
    constructor(canvas, greenSockTweener, greenSockEase) {
        this.ctx;
        this.canvas = canvas;
        this.elementsToRender = []
        this.renderAnimations = [];
        this.newPoints = []
        this.parallelogram;
        this.interacting = false
        this.selectedPoint;
        this.opositePoint
        this.animator = greenSockTweener;
        this.easing = {
            easeOut: greenSockEase.easeOut.config(1.7),
        };
        this.initializeCanvas();
        this.setListeners();
        requestAnimationFrame(this.onUpdate.bind(this));
    }

    /**
     * clear canvas
     */
    restart() {
        this.elementsToRender = [];
        this.renderAnimations = [];
        this.newPoints = [];
        this.parallelogram = null;
        this.interacting = true;
        this.selectedPoint = null;
        this.opositePoint = null;
    }

    /**
     * initialize canvas
     */
    initializeCanvas() {
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingQuality = 'high';
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
    }

    /**
    * set listeners for user iteraction
    */
    setListeners() {
        window.addEventListener('resize', this.resizeHandler.bind(this));
        this.canvas.addEventListener('click', this.clickHandler.bind(this));
        this.canvas.addEventListener('mousedown', this.mouseDownHandler.bind(this));
        this.canvas.addEventListener('mousemove', this.mouseMoveHanlder.bind(this));
        this.canvas.addEventListener('mouseup', this.mouseUpHandler.bind(this));
    }

    /**
     * render elements on interaction or animation
     */
    onUpdate() {
        if (this.interacting || this.renderAnimations.some((animate) => animate)) {
            this.interacting = false
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderAnimations = this.elementsToRender.map(element => element.render());
        }

        requestAnimationFrame(this.onUpdate.bind(this));
    }

    /**
     * calculate pointer position on event.
     * @param {Event} event 
     * @returns {Object} point with position
     */
    getMousePos(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    /**
    * resize Event Handler
    */
    resizeHandler() {
        this.interacting = true;
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
    };

    /**
    * click Event Handler
    */
    clickHandler(event) {
        this.interacting = true;
        const mousePos = this.getMousePos(event);
        this.addNewPoint(mousePos);
    }

    /**
    * mouse down Event Handler
    */
    mouseDownHandler(event) {
        this.interacting = true;
        this.draging = true;
        const mousePos = this.getMousePos(event);
        const { selectedPoint, opositePoint } = getSelectedPoint(this.newPoints, mousePos);
        this.selectedPoint = selectedPoint;
        this.opositePoint = opositePoint;
    }
    /**
    * mouse move Event Handler
    */
    mouseMoveHanlder(event) {
        if (this.draging && this.selectedPoint) {
            this.interacting = true;
            const mousePos = this.getMousePos(event);
            updatePointsPosition(this.selectedPoint, this.opositePoint, mousePos);
        }
    }

    /**
    * mouse up Event Handler
    */
    mouseUpHandler() {
        this.interacting = true;
        this.draging = false;
        this.selectedPoint = null;
    }

    /**
     * add new point to Parallelogram, it will create one if is not defined
     * @param {object} pos 
     */
    addNewPoint(pos) {
        if (!this.parallelogram) {
            this.parallelogram = new Parallelogram(this);
            this.elementsToRender.push(this.parallelogram);
        }
        if (this.newPoints.length >= 3) return;
        const newPoint = new Point(pos, this).animate();
        this.newPoints.push(newPoint)
        this.parallelogram.addPoint(newPoint)
        this.elementsToRender.push(newPoint);
        this.parallelogram.animate();
    }
}

module.exports = DrawParallelogram;