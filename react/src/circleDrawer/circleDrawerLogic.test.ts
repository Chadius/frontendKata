import {beforeEach, describe, expect, it} from "vitest";
import {
    addNewCircle,
    changeCircleDiameter,
    CircleDrawerState,
    getCirclesToDraw,
    newCircleDrawerState, redoLastUndo,
    selectCircle, undoLastChange
} from "./circleDrawerLogic.ts";

describe('Circle Drawer', () => {
    it("can add a circle", () => {
        const circleDrawerState: CircleDrawerState = newCircleDrawerState()
        addNewCircle({circleDrawerState, centerX: 100, centerY: 200})
        expect(circleDrawerState.undoHistory).toHaveLength(1)
        const circles = getCirclesToDraw(circleDrawerState)

        expect(circles).toHaveLength(1)
        expect(circles[0]).toEqual(expect.objectContaining({x: 100, y: 200, selected: false}))
    })

    it("can change the circle diameter", () => {
        const circleDrawerState: CircleDrawerState = newCircleDrawerState()
        addNewCircle({circleDrawerState, centerX: 100, centerY: 200})
        selectCircle({circleDrawerState, x: 100, y: 200})
        changeCircleDiameter({circleDrawerState, diameter: 50})

        const circles = getCirclesToDraw(circleDrawerState)
        expect(circles).toHaveLength(1)
        expect(circles[0]).toEqual(expect.objectContaining({x: 100, y: 200, radius: 25, selected: true}))
    })

    describe("selecting a circle", () => {
        let circleDrawerState: CircleDrawerState
        beforeEach(() => {
            circleDrawerState = newCircleDrawerState()
            addNewCircle({circleDrawerState, centerX: 100, centerY: 200})
            selectCircle({circleDrawerState, x: 100, y: 200})
            changeCircleDiameter({circleDrawerState, diameter: 50})
        })

        it("with multiple circles, select the closest circle that is within it", () => {
            addNewCircle({circleDrawerState, centerX: 75, centerY: 200})
            selectCircle({circleDrawerState, x: 100, y: 200})

            const circles = getCirclesToDraw(circleDrawerState)
            expect(circles).toHaveLength(2)
            expect(circles).toEqual(expect.arrayContaining([
                        expect.objectContaining({x: 100, y: 200, selected: true})
                    ]
                )
            )
            expect(circles).toEqual(expect.arrayContaining([
                        expect.objectContaining({x: 75, y: 200, selected: false})
                    ]
                )
            )
        })

        it("selecting outside the circle radius will deselect it", () => {
            selectCircle({circleDrawerState, x: 126, y: 200})

            const circles = getCirclesToDraw(circleDrawerState)
            expect(circles[0].selected).toBeFalsy()
        })
    })

    describe("undo and redo", () => {
        let circleDrawerState: CircleDrawerState
        beforeEach(() => {
            circleDrawerState = newCircleDrawerState()
            addNewCircle({circleDrawerState, centerX: 100, centerY: 200}) // 1
            selectCircle({circleDrawerState, x: 100, y: 200})
            changeCircleDiameter({circleDrawerState, diameter: 10})
            changeCircleDiameter({circleDrawerState, diameter: 50})
            addNewCircle({circleDrawerState, centerX: 300, centerY: 40})
        })

        it("can undo previously made changes", () => {
            undoLastChange(circleDrawerState)
            let circles = getCirclesToDraw(circleDrawerState)
            expect(circles).toHaveLength(1)
            expect(circles[0].radius).toBe(25)

            undoLastChange(circleDrawerState)
            circles = getCirclesToDraw(circleDrawerState)
            expect(circles).toHaveLength(1)
            expect(circles[0].radius).toBe(5)

            undoLastChange(circleDrawerState)
            undoLastChange(circleDrawerState)
            circles = getCirclesToDraw(circleDrawerState)
            expect(circles).toHaveLength(0)
        })

        it("can redo previously undone changes", () => {
            undoLastChange(circleDrawerState)
            undoLastChange(circleDrawerState)
            undoLastChange(circleDrawerState)
            undoLastChange(circleDrawerState)

            redoLastUndo(circleDrawerState)
            let circles = getCirclesToDraw(circleDrawerState)
            expect(circles).toHaveLength(1)
            expect(circles[0]).toEqual(expect.objectContaining({x: 100, y: 200}))

            redoLastUndo(circleDrawerState)
            circles = getCirclesToDraw(circleDrawerState)
            expect(circles[0].radius).toEqual(5)

            redoLastUndo(circleDrawerState)
            circles = getCirclesToDraw(circleDrawerState)
            expect(circles[0].radius).toEqual(25)

            redoLastUndo(circleDrawerState)
            circles = getCirclesToDraw(circleDrawerState)
            expect(circles).toHaveLength(2)
            expect(circles[1]).toEqual(expect.objectContaining({x: 300, y: 40}))
        })
        it("redo is not possible if this is the most recent new action", () => {
            undoLastChange(circleDrawerState)
            undoLastChange(circleDrawerState)
            undoLastChange(circleDrawerState)
            undoLastChange(circleDrawerState)

            redoLastUndo(circleDrawerState)
            redoLastUndo(circleDrawerState)
            redoLastUndo(circleDrawerState)

            addNewCircle({circleDrawerState, centerX: 50, centerY: 600})
            let circles = getCirclesToDraw(circleDrawerState)
            expect(circles).toHaveLength(2)
            expect(circles[1]).toEqual(expect.objectContaining({x: 50, y: 600}))

            redoLastUndo(circleDrawerState)

            circles = getCirclesToDraw(circleDrawerState)
            expect(circles).toHaveLength(2)
            expect(circles[1]).toEqual(expect.objectContaining({x: 50, y: 600}))
        })
    })
});

/*
"redo is not possible if this is the most recent new action"
 */
