const AreaCircle = require('./AreaCircle');
const Point = require('./Point');
const { getMissingPointParallelogram } = require('../geometry');
/**
 * Entity representing the Parallelogram draw by the user
 */
class Parallelogram {
    constructor(config) {
        const {ctx, canvas, animator, easing,  newPoints, storedLines, elementsToRender } = config;
        this.config = config;
        this.ctx = ctx;
        this.canvas = canvas;
        this.animator = animator;
        this.easing = easing;
        this.newPoints = newPoints;
        this.storedLines = storedLines; // TODO REVIEW THIS AND REMOVE
        this.elementsToRender = elementsToRender;
        this.points = [];
        this.animatedPoints = []
        this.lineColor = '#659ed0';
    }

    /**
     * Add Point instance to be incluede on shape
     * @param {Point} point
     * @returns {Parallelogram} current instance
     */
    addPoint(point) {
        this.animatedPoints.push({ x: point.x, y: point.y })
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
            const autoPoint = new Point(getMissingPointParallelogram(this.newPoints), this.config).animate();
            this.addPoint(autoPoint).animate();
            this.newPoints.push(autoPoint);
            this.elementsToRender.push(autoPoint);
        }

        if (current === 4) {
            this.addPoint(this.points[0]).animate();
        }

        if (current === 5) {
            this.elementsToRender.push(new AreaCircle(this, this.config).animate())
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

        lines.strokeStyle = this.lineColor; //review this
        this.ctx.strokeStyle = this.lineColor;
        this.ctx.stroke(lines);
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
}

module.exports = Parallelogram;