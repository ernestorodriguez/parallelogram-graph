// user can select 3 points (mark with a circle 11px wide), and has te posibility to moved

// draw a parallegram blue line with the 3 points selected by the user
// draw a circle yellow line with same Area, And center of mass as parallegram
// draw coordinates for the selected poits and area for the shapes



/*
    mesure distance between points for each side A to B and B to C
    calculate area  AB x BC
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

function polygonArea(pointsData){ 
    const points =  Object.values(pointsData);
    let previus = points[points.length - 1];
    const area = points.reduce((a, c) => {
        const current = a + (previus.x+c.x) * (previus.y-c.y)
        previus = c;
        return current;
    }, 0)
    return Math.abs(area/2);
}

function getSelectedPoint(points, mousePos) {
    let selection = {}
    const positions = Object.values(points);
    let opositeIndex = 0;
    const selectedPoint = positions.find((a, index) => {
        opositeIndex = Math.abs(index - 2);
        if (opositeIndex === index) {
            opositeIndex = 3;
        }
        return Math.abs(mousePos.x - a.x) < 6 && Math.abs(mousePos.y - a.y) < 6;
    });

    opositePoint = positions[opositeIndex];

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