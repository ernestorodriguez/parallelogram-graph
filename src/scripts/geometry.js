/**
 * calculate center of poligon
 * @param {array} points list of points x, y
 * @param {number} width of container
 * @param {number} height of container
 */
function getCenter(points, width, height) {
    const limits = points.reduce((accumulator, current) => {
        if(current.x < accumulator.xL) {
            accumulator.xL = current.x
        }
        if(current.x > accumulator.xR) {
            accumulator.xR = current.x
        }
        if(current.y < accumulator.yT) {
            accumulator.yT = current.y
        }
        if(current.y > accumulator.yB) {
            accumulator.yB = current.y
        }

        return accumulator;
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
        const current = a + (previus.x+c.x) * (previus.y-c.y);
        previus = c;
        return current;
    }, 0);
    return Math.abs(area/2);
}

/**
 * match mouse position with a point in the array and return it and the oposite point
 * @param {array} points 
 * @param {object} mousePos 
 * @returns {object} {selectedPoint, oppositePoint}
 */
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


    if(selectedPoint) {
        selection = {
            selectedPoint,
            oppositePoint: points[opositeIndex]
        }
    }

    return selection;
}

/**
 * update opposite point and current point with new position from mouse
 * @param {object} selectedPoint 
 * @param {object} oppositePoint
 * @param {object} mousePos 
 */
function updatePointsPosition(selectedPoint, oppositePoint, mousePos) {
    oppositePoint.x = oppositePoint.x + selectedPoint.x - mousePos.x;
    oppositePoint.y = oppositePoint.y + selectedPoint.y - mousePos.y;
    selectedPoint.x = mousePos.x;
    selectedPoint.y = mousePos.y;
}

/**
 * calculate missing point of parallelogram
 * @param {array} points 
 * @returns {object} object position
 */
function getMissingPointParallelogram(points) {
    return {x:points[2].x - (points[1].x - points[0].x), y:points[2].y + (points[0].y - points[1].y) };
}

module.exports = {
    getMissingPointParallelogram,
    updatePointsPosition,
    getSelectedPoint,
    polygonArea,
    getCenter,
};