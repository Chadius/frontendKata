export interface TimerState {
    timeSinceLastTick: number;
    duration: number;
    pauseClock: boolean;
    elapsedTime: number;
}

const defaultTimerState = (): TimerState => ({
    timeSinceLastTick: Date.now(),
    duration: 5000,
    pauseClock: false,
    elapsedTime: 0,
})

const getTimeElapsed = (timerState: TimerState): number =>
    timerState.elapsedTime

const resetTimer = (timerState: TimerState): TimerState => {
    timerState.timeSinceLastTick = Date.now()
    timerState.elapsedTime = 0
    timerState.pauseClock = false
    return timerState
}

const setTimerDuration = (timerState: TimerState, duration: number): TimerState => {
    if (duration <= 0) return timerState
    if (duration > timerState.duration) {
        timerState.pauseClock = false
        timerState.timeSinceLastTick = Date.now()
    }
    timerState.duration = duration
    return timerState
}

const getGaugeRatio = (timerState: TimerState): number => {
    if (timerState.duration <= 0) {
        return 0
    }
    return Math.min(getTimeElapsed(timerState) / timerState.duration, 1.0)
}

const updateTimeElapsed = (timerState: TimerState): TimerState => {
    if (!timerState) return timerState
    if (timerState.pauseClock) return timerState

    const now = Date.now()
    timerState.elapsedTime += now - timerState.timeSinceLastTick
    timerState.timeSinceLastTick = now

    if (timerState.elapsedTime > timerState.duration) {
        timerState.pauseClock = true
        timerState.elapsedTime = timerState.duration
    }
    return timerState
}

export {defaultTimerState, getTimeElapsed, resetTimer, setTimerDuration, getGaugeRatio, updateTimeElapsed}
