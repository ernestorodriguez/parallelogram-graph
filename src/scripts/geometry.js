/**
 * calculate center of poligon
 * @param {Array} points list of points x, y
 * @param {number} width of container
 * @param {number} height of container
 */
function getCenter(points, width, height) {
    const limits = points.reduce((acumulator, current) => {
        if(current.x < acumulator.xL) {
            acumulator.xL = current.x
        }
        if(current.x > acumulator.xR) {
            acumulator.xR = current.x
        }
        if(current.y < acumulator.yT) {
            acumulator.yT = current.y
        }
        if(current.y > acumulator.yB) {
            acumulator.yB = current.y
        }

        return acumulator;
    }, {xL:width, xR: 0, yT:height, yB: 0});
    
    const centerX = (limits.xR - limits.xL) / 2 + limits.xL;
    const centerY = (limits.yB - limits.yT) / 2 + limits.yT;
    return { x: centerX, y: centerY };
}

/**
 * calculate area of poligon
 * @param {array} points list of Points
 */
function polygonArea(points){ 
    let previus = points[points.length - 1];
    const area = points.reduce((a, c) => {
        const current = a + (previus.x+c.x) * (previus.y-c.y)
        previus = c;
        return current;
    }, 0)
    return Math.abs(area/2);
}

function getSelectedPoint(points, mousePos) {
    let opositeIndex = 0;
    let selection = {};
    const selectedPoint = points.find((a, index) => {
        opositeIndex = Math.abs(index - 2);
        if (opositeIndex === index) {
            opositeIndex = 3;
        }
        return Math.abs(mousePos.x - a.x) < 6 && Math.abs(mousePos.y - a.y) < 6;
    });

    opositePoint = points[opositeIndex];

    if(selectedPoint) {
        selection = {
            selectedPoint,
            opositePoint
        }
    }

    return selection;
}

function updatePointsPosition(selectedPoint, opositePoint, mousePos) {
    opositePoint.x = opositePoint.x + selectedPoint.x - mousePos.x;
    opositePoint.y = opositePoint.y + selectedPoint.y - mousePos.y;
    selectedPoint.x = mousePos.x;
    selectedPoint.y = mousePos.y;
}

function getMissingPointParallelogram(points) {
    return {x:points[2].x - (points[1].x - points[0].x), y:points[2].y + (points[0].y - points[1].y) };
}