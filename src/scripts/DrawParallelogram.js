const Parallelogram = require('./entities/Parallelogram');
const Point = require('./entities/Point');
const { updatePointsPosition } = require('./geometry');

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
        this.parallelogram;
        this.interacting = false
        this.selectedPoint = null;
        this.opositePoint = null;
        this.animator = greenSockTweener;
        this.easing = {
            easeOut: greenSockEase.easeOut.config(1.7),
        };

        this.initializeCanvas();
        this.setListeners();
        this.setupParallelogram()
        this.onUpdate();
    }

    /**
     * clear canvas
     */
    restart() {
        this.elementsToRender = [];
        this.renderAnimations = [];
        this.interacting = true;
        this.selectedPoint = null;
        this.opositePoint = null;
        this.setupParallelogram();
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
        this.canvas.addEventListener('touchstart', this.mouseDownHandler.bind(this),{passive:true});
        this.canvas.addEventListener('mousemove', this.mouseMoveHanlder.bind(this));
        this.canvas.addEventListener('touchmove', this.mouseMoveHanlder.bind(this),{passive:true});
        this.canvas.addEventListener('mouseup', this.mouseUpHandler.bind(this));
        this.canvas.addEventListener('touchsend', this.mouseUpHandler.bind(this),{passive:true});
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
     * reguister line of color on canvas context
     * @param {Path2D} shape 
     * @param {string} color 
     */
    reguisterLine(shape, color) {
        this.ctx.strokeStyle = color;
        this.ctx.stroke(shape);
    }

    /**
     * reguister test on canvas
     * @param {string} text 
     * @param {object} pos 
     * @param {string} color 
     * @param {string} font 
     */
    reguisterText(text, pos, color, font) {
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, pos.x, pos.y);
    }

    reguisterFill(shape, color) {
        this.ctx.fillStyle = color ;
        this.ctx.fill(shape);
    }

    /**
     * add element to render 
     * @param {Path2D} shape 
     */
    addElementToRender(shape) {
        this.elementsToRender.push(shape);
    }

    /**
     * calculate pointer position on mouse or touch event.
     * @param {Event} event 
     * @returns {Object} point with position
     */
    getMousePos(event) {

        let client = {
            x: event.clientX,
            y: event.clientY 
        }

        if( event.touches ) {
            client = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY,
            }
        } 
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: client.x - rect.left,
            y: client.y - rect.top
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
        if(this.parallelogram) {
            const { selectedPoint, opositePoint } = this.parallelogram.selectPointAndOposite(mousePos);
            this.selectedPoint = selectedPoint;
            this.opositePoint = opositePoint;
        }
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
        const newPoint = new Point(pos, this).animate();
        this.parallelogram.addPoint(newPoint, this.elementsToRender);
    }

    /**
     * setup new Instance for Parallelogram
     */
    setupParallelogram() {
        this.parallelogram = new Parallelogram(this);
        this.elementsToRender.push(this.parallelogram);
    }
}

module.exports = DrawParallelogram;