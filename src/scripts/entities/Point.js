/**
 * Entity repesentacion for user selection
 * @class
 */
class Point {
    /**
     * @param {Object} pos position object 
     * @param {Object} Config context for rendering and interaction 
     * @param {Object} Config.animator tweener for animation
     * @param {Object} Config.easing ease for animation
     * @constructor
     */
    constructor(pos, config) {
        const { animator, easing } = config;
        this.config = config;
        this.animator = animator;
        this.easing = easing;
        this.x = pos.x;
        this.y = pos.y;
        this.r = 11;
        this.isAnimating = false;
        this.animationTime = .5;
        this.font = '9px Helvetica';
        this.textColor = '#333652';
        this.fillColor = 'rgba(255, 0, 0, .5)';
        this.centerColor = '#8e0f37';
    }

    /**
     * function called for the render system on interaction or animation
     * @returns {boolean}
     */
    render() {
        const path = new Path2D();
        const text = `x: ${this.x} y: ${this.y}`;
        const position = {x: this.x + 15, y: this.y };
        this.config.reguisterText(text, position, this.textColor, this.font);
        this.drawFilledCircle(this, this.r, this.fillColor, path);
        this.drawFilledCircle(this, 3, this.centerColor, path);
        return this.isAnimating;
    }

    /**
     * start animation
     * @returns {Point} current instance
     */
    animate() {
        this.isAnimating = true;
        this.animator.from(this, this.animationTime, {
            r: 0,
            ease: this.easing.easeOut,
            onComplete: this.onComplete.bind(this)
        });
        return this;
    }
    /**
     * set isAnimating on false on end animation
     */
    onComplete() {
        this.isAnimating = false;
    }

    /**
     * use path to draw a circle in the context
     * @param {object} position 
     * @param {number} radius
     * @param {string} color 
     * @param {path2D} path2D 
     */
    drawFilledCircle(position, radius, color, path2D) {
        const circle = new Path2D(path2D);
        circle.arc(position.x, position.y, radius, 0, 2 * Math.PI);
        this.config.reguisterFill(circle, color);
    }
}

module.exports = Point;
