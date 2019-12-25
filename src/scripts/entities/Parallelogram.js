const AreaCircle = require('./AreaCircle');
const Point = require('./Point');
const { getMissingPointParallelogram, getSelectedPoint } = require('../geometry');
/**
 * Entity representing the Parallelogram draw by the user
 */
class Parallelogram {
    /**
     * 
     * @param {DrawParallelogram} config 
     */
    constructor(config) {
        const { animator, easing } = config;
        this.config = config;
        this.animator = animator;
        this.easing = easing;
        this.points = [];
        this.animatedPoints = [];
        this.lineColor = '#659ed0';
    }

    /**
     * Add Point instance to be incluede on shape
     * @param {Point} point
     * @returns {Parallelogram} current instance
     */
    addPoint(point) {
        if (this.points.length >= 3) return;
        this.reguisterPoint(point);
        this.config.addElementToRender(point);
        this.animate();
    }

    reguisterPoint(point) {
        this.animatedPoints.push({ x: point.x, y: point.y });
        this.points.push(point);
        return this;
    }

    /**
     * set is animating on false and calculate next action for the current number of Points
     * @param {number} current current number of points at end animation
     */
    onComplete(current) {
        this.isAnimating = false;
        if (current === 3) {
            const autoPoint = new Point(getMissingPointParallelogram(this.points), this.config).animate();
            this.reguisterPoint(autoPoint).animate();
            this.config.addElementToRender(autoPoint);
        }

        if (current === 4) {
            this.reguisterPoint(this.points[0]).animate();
        }

        if (current === 5) {
            this.config.addElementToRender(new AreaCircle(this, this.config).animate())
        }
    }

    /**
     * function called for the render system on interaction or animation
     * @returns {boolean}
     */
    render() {
        if (this.points.length < 2) return;
        const lines = new Path2D();
        const points = this.isAnimating ? this.animatedPoints : this.points;
        points.forEach((point, i) => {
            if (i === 0) {
                lines.moveTo(point.x, point.y);
                return;
            }
            lines.lineTo(point.x, point.y);
        });

        this.config.reguisterLine(lines, this.lineColor);
        return this.isAnimating;
    }
    /**
     * start animation
     */
    animate() {
        this.isAnimating = true;
        if (this.points.length < 2) return;
        const previousPoint = this.points[this.points.length - 2];
        const animationPoint = this.animatedPoints[this.animatedPoints.length - 1];
        this.animator.from(animationPoint, .4, {
            x: previousPoint.x,
            y: previousPoint.y,
            onComplete: this.onComplete.bind(this),
            onCompleteParams: [this.points.length],
        });
    }

    /**
     * return selected and the oposite points for current position
     * @param {object} mousePos mouse position
     * @returns {object}
     */
    selectPointAndOposite(mousePos) { 
        return getSelectedPoint(this.points, mousePos);
    }
}

module.exports = Parallelogram;