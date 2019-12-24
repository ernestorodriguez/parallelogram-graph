function mouseEvent(event, x,y, canvas) {
    const rect = canvas.getBoundingClientRect();
    const X  =  x + rect.left
    const Y = y + rect.top;
    var ev = document.createEvent("MouseEvent");
    ev.initMouseEvent(
        event,
        true, true,
        window, null,
        X, Y, X, Y, 
        false, false, false, false,
        0, null
    );
    canvas.dispatchEvent(ev);
}
describe('DrawParallelogram test', () => {
    it('Must Configure Canvas', () => {
        const canvas = {
            getContext() {
                return {
                    canvas:this
                }
            },
            addEventListener: chai.spy((param) => {
                expect(['click', 'mousemove', 'mousedown', 'mouseup']).to.contain(param);
            }),
        }
        new DrawParallelogram(canvas);
        expect(canvas.width).to.eql(window.innerWidth)
        expect(canvas.height).to.eql(window.innerHeight)
        expect(canvas.addEventListener).to.have.been.called();
    });

    it('must draw points', () => {
        const canvas = document.getElementById('graph');
        const ctx = canvas.getContext('2d');
        chai.spy.on(ctx,)
        
        new DrawParallelogram(canvas);
        canvas.height = 300;
        mouseEvent('click', 100, 100, canvas);
        mouseEvent('click', 100, 200, canvas);
        mouseEvent('click', 200, 200, canvas);
       
        setTimeout(() => {
            mouseEvent('mousedown', 200, 200, canvas);
            const moveEvent = new Event('mousemove');
            moveEvent.clientX = 300;
            moveEvent.clientY = 200;
            canvas.dispatchEvent(moveEvent)
            mouseEvent('mousedown', 200, 200, canvas);
        }, 3000)
      
    });

});