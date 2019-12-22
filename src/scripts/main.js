(function(window) {
    let ctx;
    let canvas;
    let areaCircle;
    let points = [];
    
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
        window.addEventListener('resize', () => {
            ctx.canvas.width  = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
        });
        
        canvas.addEventListener('click', (event) => {
            const mousePos = getMousePos(event);
            if (points.length < 3) {
                handleClick(mousePos);
            }
        });
        canvas.addEventListener('mousedown', (event) => {
            this.draging = true;
            const mousePos = getMousePos(event);
            ({ selectedPoint, opositePoint } = getSelectedPoint(points,mousePos));
        });
        canvas.addEventListener('mousemove', (event) => {
            if(this.draging && selectedPoint) {
                const mousePos = getMousePos(event);
                updatePointsPosition(selectedPoint, opositePoint, mousePos);
                update()
            }
        });
        canvas.addEventListener('mouseup', () => {
            this.draging = false;
            this.selectedPoint = null
        });
    }
    function handleClick(pos) {
        animateNewPoint(pos);
    }

    function completeAnimation() {
        if(points.length === 3) {
            const finalPoint = getMissingPointParallelogram(points)
            animateNewPoint(finalPoint);
        } else if(points.length === 4) {
            animateAreaCircle();
        }
    }

    function animateAreaCircle() {
        const area = polygonArea(points);
        const radius = Math.sqrt(area/Math.PI);
        const circle = getCenter(points, canvas.width, canvas.height);
        circle.r = 0;
        
        function animate (){
            update();
            drawCircle(circle, circle.r);
        }
       
        TweenLite.to(circle, .5, {r:radius, onComplete:() =>{ 
            areaCircle = circle;
            ctx.font = '12px Monospace';
            ctx.fillStyle = "#FAD02C";
            ctx.fillText(`AREA: ${area}`, circle.x + radius + 10, circle.y);
        }, onUpdate:animate, ease: Back.easeOut.config(1.7)});
    }

    function animateNewPoint(pos) {
        const animation = {
            r: 0,
        }
        let previewsPoint;
        let animationPoint;
        let firstPoint;
        let animationFirstPoint;
        const animate = () => {
            update();
           
            //animation
            if(previewsPoint) {
                ctx.beginPath();
                ctx.moveTo(previewsPoint.x, previewsPoint.y);
                ctx.lineTo(animationPoint.x, animationPoint.y);
                ctx.strokeStyle = "#659ed0";
                ctx.stroke();
            }  
            
             //animation
            if(animationFirstPoint) {
                ctx.beginPath();
                ctx.moveTo(firstPoint.x, firstPoint.y);
                ctx.lineTo(animationFirstPoint.x, animationFirstPoint.y);
                ctx.strokeStyle = "#659ed0";
                ctx.stroke();
            }

             //animation
             drawFilledCircle(pos,animation.r, 'rgba(255, 0, 0, .5)');
             drawFilledCircle(pos, 3, '#8e0f37');
             
        }

        TweenLite.to(animation, .5, {r:11, onComplete:() =>{ 
            points.push(pos);
            completeAnimation();
        }, onUpdate:animate, ease: Back.easeOut.config(1.7)});

        if(points.length > 0) {
            previewsPoint = points[points.length - 1];
            animationPoint = Object.assign({},previewsPoint);
            TweenLite.to(animationPoint, .4, {x:pos.x, y:pos.y});
        } 
        
        if(points.length === 3) {
            firstPoint = points[0];
            animationFirstPoint = Object.assign({}, firstPoint);
            TweenLite.to(animationFirstPoint, .4, {x:pos.x, y:pos.y});
        }       
    }
    function drawPoints() {
        points.forEach(point => {
            ctx.font = '9px Monospace';
            ctx.fillStyle = "#333652";
            ctx.fillText(`x: ${point.x} y: ${point.y}`, point.x + 15, point.y);
            drawFilledCircle(point, 11, 'rgba(255,0,0, .5');
            drawFilledCircle(point, 3, '#8e0f37');
        });
    }

    function update() {
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        drawLines();
        drawPoints();
        if(areaCircle) {
            const area = polygonArea(points);
            const radius = Math.sqrt(area/Math.PI);
            const circle = getCenter(points, canvas.width, canvas.height);
            drawCircle(circle, radius);
            ctx.font = '12px Monospace';
            ctx.fillStyle = "#FAD02C";
            ctx.fillText(`AREA: ${area}`, circle.x + radius + 10, circle.y);
        }
    }

    function drawLines() {
        if(points.length < 2) return;
        points.forEach((point, index) => {
            if(index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.strokeStyle = "#659ed0";
        if(points.length === 4) {
            ctx.closePath();
        }
        ctx.stroke();
    }

    function drawFilledCircle(position,radius, color) {
        ctx.beginPath();
        ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }

    function getMousePos(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    function drawCircle(position,radius) {
        ctx.beginPath();
        ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "#FAD02C";
        ctx.stroke();
    }

    window.DrawParallelogram = function(_canvas){
        canvas = _canvas;
        points = [];
        clicks = 0;
        initializeCanvas.call(this);
        setListeners.call(this);
    }
}(window))
