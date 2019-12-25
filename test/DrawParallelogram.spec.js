
const chai = require('chai');
const spies = require('chai-spies');
const DrawParallelogram = require('../src/scripts/DrawParallelogram')
const Point = require('../src/scripts/entities/Point')
const Parallelogram = require('../src/scripts/entities/Parallelogram')
const { expect } = chai;
chai.use(spies);

const TweenMaxMock = {
    from(obj, time, params) {
        if(params.onComplete) {
            const p = params.onCompleteParams || []
            params.onComplete(...p);
        }
    }
};
const BackEaseMock = {
    easeOut: {
        config(){}
    }
};
requestAnimationFrame = (callback) => {}
window = {
    innerWidth: 1200,
    innerHeight: 800,
    addEventListener(param) {}
}

const canvas = {
    getBoundingClientRect: () => ({left:0, top: 0}),
    getContext() {
        return {
            canvas:this
        }
    }
}

describe('DrawParallelogram test', () => {
    it('must defined a point on user interaction', () => {
        const actions = {}
        canvas.addEventListener = (eventName, callback) => {
                actions[eventName] = callback;
        };
        const dp = new DrawParallelogram(canvas, TweenMaxMock, BackEaseMock);
        actions.click({clientX:100, clientY:100})
        expect(dp.parallelogram.points.length).equal(1);
        expect(dp.parallelogram).instanceOf(Parallelogram)
        expect(dp.parallelogram.points[0]).instanceOf(Point)
    });

    it('must only allow three points to be added and must calculate the fourt one', () => {
        const actions = {}
        canvas.addEventListener = (eventName, callback) => {
                actions[eventName] = callback;
        };

        const dp = new DrawParallelogram(canvas, TweenMaxMock, BackEaseMock);

        const point0 = {x:100, y:100};
        const point1 = {x:100, y:200};
        const point2 = {x:200, y:200};
        const point3 = {x:600, y:500};
        const calculatePoint = {x:200, y:100};

        actions.click({clientX:point0.x, clientY:point0.y})
        actions.click({clientX:point1.x, clientY:point1.y})
        actions.click({clientX:point2.x, clientY:point2.y})
        actions.click({clientX:point3.x, clientY:point3.y})
        
        const expectedPoints = [
            new Point(point0, dp),
            new Point(point1, dp),
            new Point(point2, dp),
            new Point(calculatePoint, dp),
            new Point(point0, dp),
        ];
        expect(dp.parallelogram.points.length).equal(5);
        expect(dp.parallelogram.points).be.eql(expectedPoints);
    });

    it('must move the points positions', () => {
        const actions = {}
        canvas.addEventListener = (eventName, callback) => {
                actions[eventName] = callback;
        };

        const dp = new DrawParallelogram(canvas, TweenMaxMock, BackEaseMock);

        const point0 = {x:100, y:100};
        const point1 = {x:100, y:200};
        const point2 = {x:200, y:200};
        const calculatePoint = {x:200, y:100};
        const expectePosition = {x:50, y:150};
        const expecteOpositePosition = {x:250, y:150};
        actions.click({clientX:point0.x, clientY:point0.y});
        actions.click({clientX:point1.x, clientY:point1.y});
        actions.click({clientX:point2.x, clientY:point2.y});
        actions.mousedown({clientX:calculatePoint.x, clientY:calculatePoint.y});
        actions.mousemove({clientX:expectePosition.x, clientY:expectePosition.y});
        actions.mouseup({clientX:expectePosition.x, clientY:expectePosition.y});

        const expectedPoints = [
            new Point(point0, dp),
            new Point(expecteOpositePosition, dp),
            new Point(point2, dp),
            new Point(expectePosition, dp),
            new Point(point0, dp),
        ];
        
        expect(dp.parallelogram.points).be.eql(expectedPoints);
    });

    it('must not move the points if position is outside active area', () => {
        const actions = {}
        canvas.addEventListener = (eventName, callback) => {
                actions[eventName] = callback;
        };

        const dp = new DrawParallelogram(canvas, TweenMaxMock, BackEaseMock);

        const point0 = {x:100, y:100};
        const point1 = {x:100, y:200};
        const point2 = {x:200, y:200};
        const calculatePoint = {x:200, y:100};
        const expectePosition = {x:50, y:150};
        actions.click({touches: [{clientX:point0.x, clientY:point0.y}]});
        actions.click({touches: [{clientX:point1.x, clientY:point1.y}]});
        actions.click({touches: [{clientX:point2.x, clientY:point2.y}]});
        actions.mousedown({touches: [{clientX:calculatePoint.x + 6, clientY:calculatePoint.y + 6}]});
        actions.mousemove({touches: [{clientX:expectePosition.x, clientY:expectePosition.y}]});
        actions.mouseup({touches: [{clientX:expectePosition.x, clientY:expectePosition.y}]});

        const expectedPoints = [
            new Point(point0, dp),
            new Point(point1, dp),
            new Point(point2, dp),
            new Point(calculatePoint, dp),
            new Point(point0, dp),
        ];
        
        expect(dp.parallelogram.points).be.eql(expectedPoints);
    });

    it('must reset to initial state on restart', ()=> {
        const actions = {}
        canvas.addEventListener = (eventName, callback) => {
                actions[eventName] = callback;
        };

        const dp = new DrawParallelogram(canvas, TweenMaxMock, BackEaseMock);
        actions.click({clientX:100, clientY:100});

        expect(dp.parallelogram.points.length).equal(1);
        expect(dp.elementsToRender.length).equal(2);
        expect(dp.parallelogram).instanceOf(Parallelogram);
        dp.restart();
        expect(dp.parallelogram).be.eql(new Parallelogram(dp));
        expect(dp.elementsToRender.length).equal(1);
    })

    it('must Configure Canvas', () => {
        requestAnimationFrame = () => {}
        let resizeHandler;
        window = {
            innerWidth: 1200,
            innerHeight: 800,
            addEventListener(param, callback) {
                resizeHandler = callback;
                expect(['resize']).to.contain(param);
            }
        }
        const canvas = {
            getContext() {
                return {
                    canvas: this
                }
            },
            addEventListener: () => {},
        }
        new DrawParallelogram(canvas, TweenMaxMock, BackEaseMock);
        expect(canvas.width).to.eql(window.innerWidth);
        expect(canvas.height).to.eql(window.innerHeight);
        const newWidth = 200;
        const newHeight = 500;
        window.innerWidth = newWidth,
        window.innerHeight = newHeight,
        resizeHandler()
        expect(canvas.width).to.eql(newWidth);
        expect(canvas.height).to.eql(newHeight);

    });

    it('must render elements on canvas', () => {
        const actions = {}
        requestAnimationFrame = chai.spy();
        canvas.addEventListener = (eventName, callback) => {
                actions[eventName] = callback;
        };
        const moveTo = chai.spy();
        const lineTo = chai.spy();
        const stroke = chai.spy();
        const fillText = chai.spy();
        const arc = chai.spy();
        const fill = chai.spy();
        Path2D = chai.spy(() => {
            return {
                moveTo,
                lineTo,
                arc
            }
        });
        const clearRect = chai.spy();
        canvas.getContext = () => {
            return {
                canvas: this,
                clearRect,
                stroke,
                fillText,
                fill
            }
        }
        const dp = new DrawParallelogram(canvas, TweenMaxMock, BackEaseMock);
        dp.onUpdate()
        expect(requestAnimationFrame).to.be.called();

        const point0 = {x:100, y:100};
        const point1 = {x:100, y:200};
        const point2 = {x:200, y:200};

        actions.click({clientX:point0.x, clientY:point0.y})
        actions.click({clientX:point1.x, clientY:point1.y})
        actions.click({clientX:point2.x, clientY:point2.y})
        dp.onUpdate()
        expect(dp.renderAnimations.length).to.eql(6);

        expect(moveTo).to.called.exactly(1); // initial position lines
        expect(lineTo).to.called.exactly(4); // lines of Parallelogram
        expect(stroke).to.called.exactly(2); // stroke for lines Parallelogram and Area Circle
        expect(fillText).to.called.exactly(5); // position points and area text
        expect(arc).to.called.exactly(9); // 4 points with two circles each and Area circle
        expect(fill).to.called.exactly(8); // 4 points with two circles
    });

    describe('animations', () => {

    });
});