const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingQuality = 'hight';
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
var clicks = 0;
var points = {
    A: {},
    B: {},
    C: {}
}
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
  
function drawFilledCircle(position,radius, color) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawCircle(position,radius) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#FAD02C";
    ctx.stroke();
}

function drawLines(pos){
    if(clicks === 0) {
        points.A = pos;
        clicks++
    } else if (clicks == 1) {
        points.B = pos;
        ctx.beginPath();
        ctx.moveTo(points.A.x, points.A.y);
        ctx.strokeStyle = "#659ed0";
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        clicks++
    } else {
        points.C = pos;
        points.D = {x:points.C.x - (points.B.x - points.A.x), y:points.C.y + (points.A.y - points.B.y) };
        ctx.beginPath();
        ctx.moveTo(points.B.x, points.B.y);
        ctx.lineTo(points.C.x, points.C.y);
        ctx.lineTo(points.D.x, points.D.y);
        ctx.lineTo(points.A.x, points.A.y);
        ctx.closePath()
        ctx.strokeStyle = "#659ed0";
        ctx.stroke();
        const area = polygonArea(points);
        const radius = Math.sqrt(area/Math.PI);
        var circlePost = getCenter(points, canvas)
        drawCircle(circlePost, radius);
    }
}

function draw(pos){
    if(points.D) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(points.A.x, points.A.y);
        ctx.lineTo(points.B.x, points.B.y);
        ctx.lineTo(points.C.x, points.C.y);
        ctx.lineTo(points.D.x, points.D.y);
        ctx.strokeStyle = "#659ed0";
        ctx.closePath()
        ctx.stroke();
        const area = polygonArea(points);
        const radius = Math.sqrt(area/Math.PI);
        var circlePost = getCenter(points, canvas)
        drawCircle(circlePost, radius);
        Object.values(points).map((p) => {
            drawFilledCircle(p, 11, 'rgba(255,255,255,.5)');
            drawFilledCircle(p, 3, '#659ed0');
        })
    } else {
        
        drawLines(pos);
        drawFilledCircle(pos, 11, 'rgba(255,255,255,.5)');
        drawFilledCircle(pos, 3, '#659ed0');
        if(points.D){
            drawFilledCircle(points.D, 11, 'rgba(255,255,255,.5)');
            drawFilledCircle(points.D, 3, '#659ed0');
           
        }
    }
   
}


function graph() {
    var selectedPoint = null;
    var opositePoint = null;
    var draging = false;
    canvas.addEventListener('click', (event) => {
        var mousePos = getMousePos(canvas, event);
        draw(mousePos);
    });

    canvas.addEventListener('mousedown', (event) => {
        draging = true;
        var mousePos = getMousePos(canvas, event);
        ({ selectedPoint, opositePoint } = getSelectedPoint(points,mousePos));
    })

    canvas.addEventListener('mousemove', (event) => {
        var mousePos = getMousePos(canvas, event);
        if(draging && selectedPoint) {
            updatePointsPosition(selectedPoint, opositePoint, mousePos);
            draw()
        }
    });

    canvas.addEventListener('mouseup', (event) => {
        draging = false;
        selectedPoint = null
    })
}

graph();
