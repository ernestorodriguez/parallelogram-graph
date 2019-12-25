const { polygonArea, getCenter } = require('../geometry');
/**
 * Entity representing the calculate area circle of Parallelogram
 * @class
 */
class AreaCircle {
    /**
     * @param {Parallelogram} parallelogram instance of parallelogram;
     * @param {object} Config context for rendering and interaction
     * @param {element} Config.canvas canvas
     * @param {object} Config.animator tweener for animation
     * @param {object} Config.easing ease for animation
     * @constructor
     */
    constructor(parallelogram, config) {
        const { canvas, animator, easing } = config;
        this.config = config;
        this.canvas = canvas;
        this.animator = animator;
        this.easing = easing;
        this.parallelogram = parallelogram;
        this.updateProperties();
        this.circleColor = '#FAD02C';
        this.font = '12px Helvetica';
    }

    /**
     * Update all properties of AreaCircle base on Parallelogram
     */
    updateProperties() {
        this.updateArea();
        this.updatePosition();
        this.updateRadius();
    }
    /**
     * update Area form Parallelogram points
     */
    updateArea() {
        this.area = polygonArea(this.parallelogram.points);
    }
     /**
     * update Position form Parallelogram points
     */
    updatePosition() {
        const { x, y } = getCenter(this.parallelogram.points, this.canvas.width, this.canvas.height);
        this.x = x;
        this.y = y;
    }

     /**
     * update radius base en current Area
     */
    updateRadius() {
        this.r = Math.sqrt(this.area / Math.PI);
    }

    /**
     * function called for the render system on interaction or animation
     * @returns {boolean}
     */
    render() {
        if (!this.isAnimating) {
            this.updateProperties();
        }
        const text = `AREA: ${this.area}`;
        const position = {x: this.x + this.r + 10, y: this.y };
        this.config.reguisterText(text, position, this.circleColor, this.font);

        const circlePath = new Path2D();
        circlePath.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.config.reguisterLine(circlePath, this.circleColor);
        return this.isAnimating;
    }

    /**
     * set isAnimating on false on end animation
     */
    onComplete() {
        this.isAnimating = false;
    }

    /**
     * start animation
     * @returns {AreaCircle} current instance
     */
    animate() {
        this.isAnimating = true;
        this.animator.from(this, .5, {
            r: 0, 
            ease: this.easing.easeOut,
            onComplete: this.onComplete.bind(this)
        });
        return this;
    }
}


module.exports = AreaCircle;