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

    describe('changing circle diameter', () => {
        let circleDrawerState: CircleDrawerState
        beforeEach(() => {
            circleDrawerState = newCircleDrawerState()
            addNewCircle({circleDrawerState, centerX: 100, centerY: 200})
            selectCircle({circleDrawerState, x: 100, y: 200})
        })

        it("can change the circle diameter", () => {
            changeCircleDiameter({circleDrawerState, diameter: 50})

            const circles = getCirclesToDraw(circleDrawerState)
            expect(circles).toHaveLength(1)
            expect(circles[0]).toEqual(expect.objectContaining({x: 100, y: 200, radius: 25, selected: true}))
        })

        it("will undo multiple changes to a single circle in a single step", () => {
            changeCircleDiameter({circleDrawerState, diameter: 10})
            addNewCircle({circleDrawerState, centerX: 200, centerY: 200})
            selectCircle({circleDrawerState, x: 100, y: 200})
            changeCircleDiameter({circleDrawerState, diameter: 15})
            changeCircleDiameter({circleDrawerState, diameter: 20})
            changeCircleDiameter({circleDrawerState, diameter: 30})
            changeCircleDiameter({circleDrawerState, diameter: 40})
            changeCircleDiameter({circleDrawerState, diameter: 50})

            undoLastChange(circleDrawerState)

            const circles = getCirclesToDraw(circleDrawerState)
            expect(circles[0]).toEqual(expect.objectContaining({x: 100, y: 200, radius: 5, selected: true}))
        })
    });

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

        it("can undo previously made changes (the same circle resized counts as a single change)", () => {
            undoLastChange(circleDrawerState)
            let circles = getCirclesToDraw(circleDrawerState)
            expect(circles).toHaveLength(1)
            expect(circles[0].radius).toBe(25)

            undoLastChange(circleDrawerState)
            circles = getCirclesToDraw(circleDrawerState)
            expect(circles).toHaveLength(1)
            expect(circles[0].radius).not.toBe(25)

            undoLastChange(circleDrawerState)
            circles = getCirclesToDraw(circleDrawerState)
            expect(circles).toHaveLength(0)
        })

        it("can redo previously undone changes", () => {
            undoLastChange(circleDrawerState)
            undoLastChange(circleDrawerState)
            undoLastChange(circleDrawerState)

            redoLastUndo(circleDrawerState)
            let circles = getCirclesToDraw(circleDrawerState)
            expect(circles).toHaveLength(1)
            expect(circles[0]).toEqual(expect.objectContaining({x: 100, y: 200}))

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

