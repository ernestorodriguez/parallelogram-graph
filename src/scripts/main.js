(function(window) {
    let ctx;
    let canvas;

    const lineColor = '#659ed0';
    const circleColor = '#FAD02C';
    const pointCenterColor = '#8e0f37';
    const pointColor = 'rgba(255, 0, 0, .5)';

    /**
     * Classes 
     */

    class Point {
        constructor(pos) {
            this.x = pos.x;
            this.y = pos.y;
            this.r = 11;
        }
        render() {
            const path = new Path2D();
            ctx.font = '9px Monospace';
            ctx.fillStyle = "#333652";
            ctx.fillText(`x: ${this.x} y: ${this.y}`, this.x + 15, this.y);
            this.drawFilledCircle(this, this.r, pointColor, path);
            this.drawFilledCircle(this, 3, pointCenterColor, path);
        }

        animate() {
            TweenMax.from(this, .5, {r: 0, ease: Back.easeOut.config(1.7)});
            return this;
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
        }

        addPoint(point) {
            const p = {x:point.x, y: point.y};
            this.animatedPoints.push(Object.assign({}, p))
            this.points.push(point);
            return this;
        }

        onComplete(current) {
            this.isAnimating = false;
            if(current === 3) {
                console.log('complete', 3)
                const autoPoint = new Point(getMissingPointParallelogram(newPoints)).animate();
                this.addPoint(autoPoint).animate();
                
                // remove this
                newPoints.push(autoPoint);
                //
                elementsToRender.push(autoPoint);
            }
    
            if(current === 4) {
                this.addPoint(this.points[0]).animate();
            }

            if(current === 5) {
                elementsToRender.push(new AreaCircle(this).animate())
            }
        }

        render = function() {
            const lines = new Path2D();
            if(this.points.length < 2) return;
            const points = this.isAnimating ? this.animatedPoints :  this.points;
            points.forEach((point, i) => {
               
                if (i === 0) {
                    lines.moveTo(point.x, point.y);
                    return;
                }
                lines.lineTo(point.x, point.y);
            });
    
            lines.strokeStyle = lineColor;
            ctx.strokeStyle = lineColor;
            ctx.stroke(lines);
        }

        animate() {
            this.isAnimating = true;
            if(this.points.length < 2) return;
            const previousPoint = this.points[this.points.length - 2];
            const animationPoint = this.animatedPoints[this.animatedPoints.length - 1];
            TweenMax.from(animationPoint, .4, {
                x: previousPoint.x, 
                y:previousPoint.y, 
                onComplete:this.onComplete.bind(this),
                onCompleteParams: [this.points.length],
            });
        }
    }

    class AreaCircle {
        constructor(poligon) {
            this.poligon = poligon;
            this.updateProperties();  
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
            this.r = Math.sqrt(this.area/Math.PI);
        }

        render() {
            if(!this.isAnimating) {
                this.updateProperties();
            }
            ctx.font = '12px Monospace';
            ctx.fillStyle = circleColor;
            ctx.fillText(`AREA: ${this.area}`, this.x + this.r + 10, this.y);
            const circlePath = new Path2D();
            circlePath.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            ctx.strokeStyle = circleColor;
            ctx.stroke(circlePath);
        }

        onComplete() {
            this.isAnimating = false;
        }

        animate() {
            this.isAnimating = true;
            TweenMax.from(this, .5, {r:0, ease: Back.easeOut.config(1.7), 
                onComplete: this.onComplete.bind(this)});
            return this;
        }
    }

    const elementsToRender = []

    function onUpdate() {
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        elementsToRender.map(element => element.render())
        requestAnimationFrame(onUpdate.bind(this));
    }
    

    /**
     * initialize canvas, needs to be called
     */
    function initializeCanvas() {
        ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'hight';
        ctx.canvas.width  = window.innerWidth;
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
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    };

    function clickHandler(event) {
        const mousePos = getMousePos(event);
        addNewPoint(mousePos);
    }

    function mouseDownHandler(event) {
        this.draging = true;
        const mousePos = getMousePos(event);
        ({ selectedPoint, opositePoint } = getSelectedPoint(newPoints,mousePos));
    }

    function mouseMoveHanlder(event) {
        if(this.draging && selectedPoint) {
            const mousePos = getMousePos(event);
            updatePointsPosition(selectedPoint, opositePoint, mousePos);
        }
    }

    function mouseUpHandler() {
        this.draging = false;
        this.selectedPoint = null;
    }

    /**
     * Interactions
     */

    const newPoints = []
    const storedLines = new Parallelogram();
    elementsToRender.push(storedLines);

    function addNewPoint(pos) {
        if(newPoints.length === 4) return;
        const newPoint = new Point(pos).animate();
        newPoints.push(newPoint)
        const paral = storedLines.addPoint(newPoint)
        elementsToRender.push(newPoint);
        paral.animate();
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
        constructor(_canvas){
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
        clear() {
            // TODO
        };
    }

    /**
     * make api avaible
     */
    window.DrawParallelogram = DrawParallelogram;

}(window))
