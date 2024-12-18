const DEFAULT_CIRCLE_RADIUS = 10

enum CircleDrawerActionType {
    ADD_CIRCLE = "ADD_CIRCLE",
    CHANGE_CIRCLE_RADIUS = "CHANGE_CIRCLE_RADIUS",
}

interface AddCircleAction {
    type: CircleDrawerActionType.ADD_CIRCLE
    centerX: number
    centerY: number
    id: number
}

interface ChangeCircleRadiusAction {
    type: CircleDrawerActionType.CHANGE_CIRCLE_RADIUS
    id: number
    previousRadius: number
    radius: number
}

type CircleAction = AddCircleAction | ChangeCircleRadiusAction

interface Circle {
    x: number
    y: number
    radius: number
    id: number
}

interface CircleDrawerState {
    undoHistory: CircleAction[]
    redoHistory: CircleAction[]
    circles: Circle[]
    selectedCircleId?: number
}

interface CircleToDraw {
    x: number;
    y: number;
    radius: number;
    selected: boolean;
}

const newCircleDrawerState = (): CircleDrawerState => ({
    undoHistory: [],
    redoHistory: [],
    circles: [],
    selectedCircleId: undefined,
})

const addNewActionToUndoAndClearRedo = (circleDrawerState: CircleDrawerState, action: CircleAction) => {
    circleDrawerState.redoHistory = []
    circleDrawerState.undoHistory.push(action)
    return action
}

const popRedoActionAndAddToUndo = (circleDrawerState: CircleDrawerState) => {
    const actionToRedo = circleDrawerState.redoHistory.pop()
    if (actionToRedo) {
        circleDrawerState.undoHistory.push(actionToRedo)
    }
    return actionToRedo
}

const popUndoActionAndAddToRedo = (circleDrawerState: CircleDrawerState) => {
    const actionToUndo = circleDrawerState.undoHistory.pop()
    if (actionToUndo) {
        circleDrawerState.redoHistory.push(actionToUndo)
    }
    return actionToUndo
}

const addNewCircle = ({circleDrawerState, centerX, centerY}: {
    circleDrawerState: CircleDrawerState,
    centerX: number,
    centerY: number
}) => {
    let newId = 0
    while (true) {
        if (circleDrawerState.circles.every(c => c.id !== newId)) {
            break
        }
        newId += 1
    }

    const addCircleAction: AddCircleAction = {
        type: CircleDrawerActionType.ADD_CIRCLE,
        centerX,
        centerY,
        id: newId,
    }
    addNewActionToUndoAndClearRedo(circleDrawerState, addCircleAction)
    addNewCircleToState(circleDrawerState, addCircleAction)
}

const addNewCircleToState = (circleDrawerState: CircleDrawerState, action: AddCircleAction) => {
    circleDrawerState.circles.push({
        x: action.centerX,
        y: action.centerY,
        radius: DEFAULT_CIRCLE_RADIUS,
        id: action.id,
    })
}

const getCirclesToDraw = (circleDrawerState: CircleDrawerState): CircleToDraw[] => {
    return circleDrawerState.circles.map(c => ({
        x: c.x,
        y: c.y,
        radius: c.radius,
        selected: c.id === circleDrawerState.selectedCircleId,
    }))
}

const selectCircle = ({circleDrawerState, x, y}: { circleDrawerState: CircleDrawerState, x: number, y: number }) => {
    const closestCircleId: {
        id?: number,
        distanceSquared?: number,
    } = circleDrawerState.circles.reduce(
        (sum: {
            id?: number,
            distanceSquared?: number,
        }, circle) => {
            const xDistance = circle.x - x
            const yDistance = circle.y - y
            const distanceSquared = (xDistance * xDistance) + (yDistance * yDistance)
            const isInsideCircle = distanceSquared <= circle.radius * circle.radius
            const isTheSmallestDistanceSoFar = sum.distanceSquared === undefined
                || distanceSquared < sum.distanceSquared
            if (isInsideCircle && isTheSmallestDistanceSoFar) {
                return {
                    id: circle.id,
                    distanceSquared,
                }
            }
            return sum
        },
        {
            id: undefined,
            distanceSquared: undefined,
        }
    )

    circleDrawerState.selectedCircleId = closestCircleId.id
}

const compressChangeCircleRadiusActionsAndClearRedo = (circleDrawerState: CircleDrawerState, changeCircleRadiusAction: ChangeCircleRadiusAction) => {
    if (circleDrawerState.undoHistory.length === 0) return changeCircleRadiusAction
    const previousAction = circleDrawerState.undoHistory[circleDrawerState.undoHistory.length - 1]
    if (
        previousAction.type !== CircleDrawerActionType.CHANGE_CIRCLE_RADIUS
        || previousAction.id !== changeCircleRadiusAction.id
    ) {
        addNewActionToUndoAndClearRedo(circleDrawerState, changeCircleRadiusAction)
        return
    }
    circleDrawerState.undoHistory[circleDrawerState.undoHistory.length - 1] = {
        ...changeCircleRadiusAction,
        previousRadius: previousAction.previousRadius,
    }
    circleDrawerState.redoHistory = []
};

const changeCircleDiameter = ({circleDrawerState, diameter}: {
    circleDrawerState: CircleDrawerState,
    diameter: number
}) => {
    if (circleDrawerState.selectedCircleId === undefined) {
        return
    }

    const changeCircleRadiusAction: ChangeCircleRadiusAction = {
        type: CircleDrawerActionType.CHANGE_CIRCLE_RADIUS,
        id: circleDrawerState.selectedCircleId,
        previousRadius: circleDrawerState.circles[circleDrawerState.selectedCircleId].radius,
        radius: diameter / 2,
    }
    compressChangeCircleRadiusActionsAndClearRedo(circleDrawerState, changeCircleRadiusAction)
    updateCircleInState(circleDrawerState, changeCircleRadiusAction)
}

const updateCircleInState = (circleDrawerState: CircleDrawerState, action: ChangeCircleRadiusAction) => {
    circleDrawerState.circles[action.id].radius = action.radius
}

const undoLastChange = (circleDrawerState: CircleDrawerState) => {
    if (
        circleDrawerState.undoHistory.length === 0
    ) return

    const actionToUndo = popUndoActionAndAddToRedo(circleDrawerState)
    if (!actionToUndo) return

    if (actionToUndo.type === CircleDrawerActionType.ADD_CIRCLE) {
        removeCircleFromState(circleDrawerState, actionToUndo.id);
    }
    if (actionToUndo.type === CircleDrawerActionType.CHANGE_CIRCLE_RADIUS) {
        revertCircleRadiusChange(circleDrawerState, actionToUndo);
    }
}

const removeCircleFromState = (circleDrawerState: CircleDrawerState, circleIdToRemove: number) => {
    circleDrawerState.circles = circleDrawerState.circles.filter(c => c.id !== circleIdToRemove)
}

const revertCircleRadiusChange = (circleDrawerState: CircleDrawerState, actionToUndo: ChangeCircleRadiusAction) => {
    const index = circleDrawerState.circles.findIndex(c => c.id === actionToUndo.id)
    if (index >= 0) {
        circleDrawerState.circles[index].radius = actionToUndo.previousRadius
    }
}

const redoLastUndo = (circleDrawerState: CircleDrawerState) => {
    if (
        circleDrawerState.redoHistory.length === 0
    ) return

    const actionToRedo = popRedoActionAndAddToUndo(circleDrawerState)
    if (!actionToRedo) return
    if (actionToRedo.type === CircleDrawerActionType.ADD_CIRCLE) {
        addNewCircleToState(circleDrawerState, actionToRedo)
    }
    if (actionToRedo.type === CircleDrawerActionType.CHANGE_CIRCLE_RADIUS) {
        updateCircleInState(circleDrawerState, actionToRedo)
    }
}

export {newCircleDrawerState, addNewCircle, getCirclesToDraw, selectCircle, changeCircleDiameter, undoLastChange, redoLastUndo}
export type {CircleDrawerState}
