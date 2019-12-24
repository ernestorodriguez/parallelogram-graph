(function (window) {
    let ctx;
    let canvas;
    let newPoints = []
    let storedLines;
    let config;
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


    function addNewPoint(pos) {
        if (!storedLines) {
            storedLines = new Parallelogram(config);
            elementsToRender.push(storedLines);
        }
        if (newPoints.length >= 3) return;
        console.log(newPoints.length)
        const newPoint = new Point(pos, config).animate();
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
            config = {
                ctx, 
                canvas, 
                animator: TweenMax,
                easing: {
                    easeOut: Back.easeOut.config(1.7),
                },
                // change this
                newPoints,
                storedLines,
                elementsToRender,
            }
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
