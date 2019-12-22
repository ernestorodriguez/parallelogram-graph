const { 
    getCenter, 
    polygonArea,
    getSelectedPoint,
    updatePointsPosition,
    getMissingPointParallelogram } = require('../src/scripts/geometry');
const { expect } = require('chai')
describe('Geometry test', () => {
    it('getCenter() must return center of coordinates', () => {
        const points = [
            {x:0,y:0},
            {x:100,y:0},
            {x:100,y:100},
            {x:0,y:100},
        ];

        expect(getCenter(points, 500, 500)).to.eqls({x:50,y:50});
    });
    it('polygonArea() must return area value', () => {
        const points = {
            A:{x:0,y:0},
            B:{x:100,y:0},
            C:{x:100,y:100},
            D:{x:0,y:100},
        }

        expect(polygonArea(points, {width: 500, height:500})).to.eqls(10000);
    });

    describe('getSelectedPoint()', () => {
        it('must return null if not a point selected', () => {
            const points = {
                A:{x:0,y:0},
                B:{x:100,y:0},
                C:{x:100,y:100},
                D:{x:0,y:100},
            }

            expect(getSelectedPoint(points, {x: 6, y:6})).to.eqls({});
        });

        it('must return a point selected if position is inside active area of some point', () => {
            const points = {
                A:{x:0,y:0},
                B:{x:100,y:0},
                C:{x:100,y:100},
                D:{x:0,y:100},
            }
            expect(getSelectedPoint(points, {x: 5, y:5})).to.eqls({
                opositePoint: points.C,
                selectedPoint: points.A,
            });
        });
    });

    it('updatePointsPosition() must update points position', () => {
        const points = {
            A:{x:0,y:0},
            B:{x:100,y:0},
            C:{x:100,y:100},
            D:{x:0,y:100},
        }
        updatePointsPosition(points.A, points.C, {x:10, y:10})
        expect(points.A).to.eqls({x:10, y:10});
        expect(points.C).to.eqls({x:90, y: 90});
    });

    it('getMissingPointParallelogram()', () => {
        const points = [ 
            {x:0,y:0},
            {x:100,y:0},
            {x:100,y:100},
        ];
        
        const point = getMissingPointParallelogram(points)
        expect(point).to.eqls({x:0,y:100});
    });
});