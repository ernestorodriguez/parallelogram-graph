(function (window) {
    let ctx;
    let canvas;

    /**
     * Classes 
     */

    class Point {
        constructor(pos) {
            this.x = pos.x;
            this.y = pos.y;
            this.r = 11;
            this.isAnimating = false;
        }
        render() {
            const path = new Path2D();
            ctx.font = '9px Monospace';
            ctx.fillStyle = "#333652";
            ctx.fillText(`x: ${this.x} y: ${this.y}`, this.x + 15, this.y);
            this.drawFilledCircle(this, this.r, 'rgba(255, 0, 0, .5)', path);
            this.drawFilledCircle(this, 3, '#8e0f37', path);
            return this.isAnimating;
        }

        animate() {
            this.isAnimating = true;
            TweenMax.from(this, .5, {
                r: 0,
                ease: Back.easeOut.config(1.7),
                onComplete: this.onComplete.bind(this)
            });
            return this;
        }
        onComplete() {
            this.isAnimating = false;
        }

        drawFilledCircle(position, radius, color, path2D) {
            const circle = new Path2D(path2D);
            circle.arc(position.x, position.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill(circle);
        }
    }

    class Parallelogram {
        constructor() {
            this.points = [];
            this.animatedPoints = []
            this.lineColor = '#659ed0';
        }

        addPoint(point) {
            this.animatedPoints.push({ x: point.x, y: point.y })
            this.points.push(point);
            return this;
        }

        onComplete(current) {
            this.isAnimating = false;
            if (current === 3) {
                const autoPoint = new Point(getMissingPointParallelogram(newPoints)).animate();
                this.addPoint(autoPoint).animate();
                // remove this
                newPoints.push(autoPoint);
                //
                elementsToRender.push(autoPoint);
            }

            if (current === 4) {
                this.addPoint(this.points[0]).animate();
            }

            if (current === 5) {
                elementsToRender.push(new AreaCircle(this).animate())
            }
        }

        render = function () {
            const lines = new Path2D();
            if (this.points.length < 2) return;
            const points = this.isAnimating ? this.animatedPoints : this.points;
            points.forEach((point, i) => {

                if (i === 0) {
                    lines.moveTo(point.x, point.y);
                    return;
                }
                lines.lineTo(point.x, point.y);
            });

            lines.strokeStyle = this.lineColor;
            ctx.strokeStyle = this.lineColor;
            ctx.stroke(lines);
            return this.isAnimating;
        }

        animate() {
            this.isAnimating = true;
            if (this.points.length < 2) return;
            const previousPoint = this.points[this.points.length - 2];
            const animationPoint = this.animatedPoints[this.animatedPoints.length - 1];
            TweenMax.from(animationPoint, .4, {
                x: previousPoint.x,
                y: previousPoint.y,
                onComplete: this.onComplete.bind(this),
                onCompleteParams: [this.points.length],
            });
        }
    }

    class AreaCircle {
        constructor(poligon) {
            this.poligon = poligon;
            this.updateProperties();
            this.circleColor = '#FAD02C';
        }

        updateProperties() {
            this.updateArea();
            this.updatePosition();
            this.updateRadius();
        }

        updateArea() {
            this.area = polygonArea(this.poligon.points);
        }

        updatePosition() {
            const pos = getCenter(this.poligon.points, canvas.width, canvas.height);
            this.x = pos.x;
            this.y = pos.y;
        }

        updateRadius() {
            this.r = Math.sqrt(this.area / Math.PI);
        }

        render() {
            if (!this.isAnimating) {
                this.updateProperties();
            }
            ctx.font = '12px Monospace';
            ctx.fillStyle = this.circleColor;
            ctx.fillText(`AREA: ${this.area}`, this.x + this.r + 10, this.y);
            const circlePath = new Path2D();
            circlePath.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            ctx.strokeStyle = this.circleColor;
            ctx.stroke(circlePath);
            return this.isAnimating;
        }

        onComplete() {
            this.isAnimating = false;
        }

        animate() {
            this.isAnimating = true;
            TweenMax.from(this, .5, {
                r: 0, ease: Back.easeOut.config(1.7),
                onComplete: this.onComplete.bind(this)
            });
            return this;
        }
    }

    let elementsToRender = []
    let renderAnimations = [];
    let interacting = false

    function onUpdate() {
        if (interacting || renderAnimations.some((animate) => animate)) {
            interacting = false
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            renderAnimations = elementsToRender.map(element => element.render());
        }

        requestAnimationFrame(onUpdate.bind(this));
    }


    /**
     * initialize canvas, needs to be called
     */
    function initializeCanvas() {
        ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    }

    /**
    * set listeners for user iteraction, needs to be called
    */
    function setListeners() {
        window.addEventListener('resize', resizeHandler);
        canvas.addEventListener('click', clickHandler);
        canvas.addEventListener('mousedown', mouseDownHandler);
        canvas.addEventListener('mousemove', mouseMoveHanlder);
        canvas.addEventListener('mouseup', mouseUpHandler);
    }

    /**
     * Event Handlers
     */

    function resizeHandler() {
        interacting = true;
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    };

    function clickHandler(event) {
        interacting = true;
        const mousePos = getMousePos(event);
        addNewPoint(mousePos);

    }

    function mouseDownHandler(event) {
        interacting = true;
        this.draging = true;
        const mousePos = getMousePos(event);
        ({ selectedPoint, opositePoint } = getSelectedPoint(newPoints, mousePos));
    }

    function mouseMoveHanlder(event) {
        if (this.draging && selectedPoint) {
            interacting = true;
            const mousePos = getMousePos(event);
            updatePointsPosition(selectedPoint, opositePoint, mousePos);
        }
    }

    function mouseUpHandler() {
        interacting = true;
        this.draging = false;
        this.selectedPoint = null;
    }

    /**
     * Interactions
     */

    let newPoints = []
    let storedLines;

    function addNewPoint(pos) {
        if (!storedLines) {
            storedLines = new Parallelogram();
            elementsToRender.push(storedLines);
        }
        if (newPoints.length >= 3) return;
        console.log(newPoints.length)
        const newPoint = new Point(pos).animate();
        newPoints.push(newPoint)
        storedLines.addPoint(newPoint)
        elementsToRender.push(newPoint);
        storedLines.animate();
    }
    /**
     * utils
     */

    /**
     * calculate pointer position on event.
     * @param {Event} event 
     * @returns {Object} point with position
     */
    function getMousePos(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    /**
     * initialize interactive graph 
     * @param {Element} _canvas html canvas element
     * @constructor
     */
    class DrawParallelogram {
        constructor(_canvas) {
            canvas = _canvas;
            initializeCanvas.call(this);
            setListeners.call(this);
            requestAnimationFrame(onUpdate.bind(this));
            // remove this
            window.drawign = this;
            // add singleton
        }
        /**
         * clear canvas
         */
        restart() {
            elementsToRender = [];
            interacting = true;
            newPoints = []
            storedLines = undefined;
        };
    }

    /**
     * make api avaible
     */
    window.DrawParallelogram = DrawParallelogram;

}(window))
