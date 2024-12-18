import {ChangeEvent, MouseEventHandler, useRef, useState} from "react";
import {
    addNewCircle,
    changeCircleDiameter,
    CircleDrawerState,
    getCirclesToDraw,
    newCircleDrawerState, redoLastUndo,
    selectCircle, undoLastChange
} from "../../src/circleDrawer/circleDrawerLogic";
import Canvas from "./Canvas.tsx";

function CircleDrawer() {
    const [circleDrawerState, setCircleDrawerState] = useState<CircleDrawerState>(newCircleDrawerState())
    const dialogRef = useRef<HTMLDialogElement | null>(null)
    const openDialog = () => {
        if (dialogRef.current) dialogRef.current.showModal();
    }

    const closeDialog = () => {
        if (dialogRef.current) dialogRef.current.close();
    }

    const drawCircles = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        context.strokeStyle = '#00000'
        context.fillStyle = '#ffffff'
        context.lineWidth = 1
        context.rect(0, 0, canvas.width, canvas.height)
        context.fill()

        context.strokeStyle = '#00000'
        context.lineWidth = 1

        getCirclesToDraw(circleDrawerState).forEach((circle) => {
            context.fillStyle = circle.selected ? '#888888' : '#efefef'
            context.beginPath()
            context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI)
            context.fill()
            context.stroke()
        })
    }

    const onClickOnCanvas: MouseEventHandler<HTMLCanvasElement> = (event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const canvasX = event.clientX - rect.left
        const canvasY = event.clientY - rect.top
        selectCircle({circleDrawerState, x: canvasX, y: canvasY})
        if (circleDrawerState.selectedCircleId === undefined) {
            addNewCircle({
                circleDrawerState,
                centerX: canvasX,
                centerY: canvasY,
            })
            setCircleDrawerState({...circleDrawerState})
            return
        }

        setCircleDrawerState({...circleDrawerState})
        openDialog()
        event.stopPropagation()
    }

    const selectedCircleRadius = () => {
        const selectedCircle = getCirclesToDraw(circleDrawerState).find(c => c.selected)
        return selectedCircle === undefined ? 0 : selectedCircle.radius
    }
    const selectedCircleText = () => {
        const selectedCircle = getCirclesToDraw(circleDrawerState).find(c => c.selected)
        if (!selectedCircle) return "no circle selected"
        return `Adjust diameter of circle at (${selectedCircle.x.toFixed(0)}, ${selectedCircle.y.toFixed(0)}): ${selectedCircle.radius * 2}`
    }
    const onChangeDiameter = (e: ChangeEvent<HTMLInputElement>) => {
        const diameter = Number(e.target.value);
        changeCircleDiameter({circleDrawerState, diameter})
        setCircleDrawerState({...circleDrawerState})
    }

    const onClickUndo = () => {
        undoLastChange(circleDrawerState)
        setCircleDrawerState({...circleDrawerState})
    }

    const onClickRedo = () => {
        redoLastUndo(circleDrawerState)
        setCircleDrawerState({...circleDrawerState})
    }

    return (
        <article aria-label="circle-drawer">
            <h1>Circle Drawer</h1>
            <div className="buttons">
                <button id={"Undo"} disabled={circleDrawerState.undoHistory.length === 0} onClick={onClickUndo}>Undo</button>
                <button id={"Redo"} disabled={circleDrawerState.redoHistory.length === 0} onClick={onClickRedo}>Redo</button>
            </div>
            <div className="canvas">
                <Canvas draw={drawCircles} onClick={onClickOnCanvas}/>
            </div>
            <dialog id="dialog" aria-label="diameter-menu" ref={dialogRef}>
                <label htmlFor={"diameter"}>{selectedCircleText()}</label>
                <input type={"range"} min={1} max={200} value={selectedCircleRadius() * 2} id={"diameter"}
                       onChange={onChangeDiameter}></input>
                <button id="close" onClick={closeDialog}>
                    Close
                </button>
            </dialog>
        </article>
    )
}

export default CircleDrawer
