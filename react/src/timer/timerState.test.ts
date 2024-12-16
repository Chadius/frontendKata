import {
    defaultTimerState,
    getGaugeRatio,
    getTimeElapsed,
    resetTimer,
    setTimerDuration,
    TimerState,
    updateTimeElapsed
} from "./timerState";
import {describe, it, beforeEach, afterEach, vi, MockInstance, expect} from "vitest";

const START_TIME_MS = 100;

describe("timerState", () => {
    let dateSpy: MockInstance<() => number>
    beforeEach(() => {
        dateSpy = vi.spyOn(Date, "now").mockReturnValue(START_TIME_MS)
    })
    afterEach(() => {
        dateSpy.mockRestore()
    })

    describe('resetting the duration', () => {
        let timerState: TimerState
        beforeEach(() => {
            dateSpy.mockReturnValue(START_TIME_MS * 2)
            timerState = defaultTimerState()
            timerState = resetTimer(timerState)
        })

        it("will set start time to now", () => {
            expect(timerState.timeSinceLastTick).toBe(START_TIME_MS * 2)
        })

        it("will set time elapsed to 0", () => {
            expect(getTimeElapsed(timerState)).toBe(0)
        })

        it("will empty the gauge", () => {
            expect(getGaugeRatio(timerState)).toBeCloseTo(0)
        })
    });

    describe('elapsed time', () => {
        let timerState: TimerState
        beforeEach(() => {
            timerState = defaultTimerState()
            timerState = resetTimer(timerState)
        })

        it("will start with no time elapsed", () => {
            expect(getTimeElapsed(timerState)).toBe(0)
        })

        it("will count elapsed time since it started", () => {
            dateSpy.mockReturnValue(START_TIME_MS + (timerState.duration / 2))
            updateTimeElapsed(timerState)
            expect(getTimeElapsed(timerState)).toBe(timerState.duration / 2)
        })

        it("will cap at the duration", () => {
            dateSpy.mockReturnValue(START_TIME_MS + (timerState.duration * 2))
            updateTimeElapsed(timerState)
            expect(getTimeElapsed(timerState)).toBe(timerState.duration)
        })

        it("will resume counting time elapsed after hitting the cap", () => {
            const initialDuration = timerState.duration
            dateSpy.mockReturnValue(START_TIME_MS + (initialDuration * 2))
            updateTimeElapsed(timerState)
            setTimerDuration(timerState, initialDuration * 9001)
            dateSpy.mockReturnValue(START_TIME_MS + (initialDuration * 3))
            updateTimeElapsed(timerState)
            expect(getTimeElapsed(timerState)).toBe(initialDuration * 2)
        })
    });

    it("will change the duration upon request", () => {
        const timerState = defaultTimerState()
        setTimerDuration(timerState, 10000)
        expect(timerState.duration).toBe(10000)
    })

    it("will ignore non-positive timer durations", () => {
        const timerState = defaultTimerState()
        setTimerDuration(timerState, 0)
        expect(timerState.duration).toBe(defaultTimerState().duration)
        setTimerDuration(timerState, -10000)
        expect(timerState.duration).toBe(defaultTimerState().duration)
    })


    describe('calculate gauge amount', () => {
        let timerState: TimerState
        const duration = 10000;
        beforeEach(() => {
            timerState = defaultTimerState()
            setTimerDuration(timerState, duration)
        })

        it("will start the gauge at 0", () => {
            expect(getGaugeRatio(timerState)).toBeCloseTo(0)
        })

        it("will return a partially filled gauge before the duration expires", () => {
            dateSpy.mockReturnValue(START_TIME_MS + (duration / 2))
            updateTimeElapsed(timerState)
            expect(getGaugeRatio(timerState)).toBeCloseTo(0.5)
        })

        it("will return a completely filled gauge when the duration is reached", () => {
            dateSpy.mockReturnValue(START_TIME_MS + duration)
            updateTimeElapsed(timerState)
            expect(getGaugeRatio(timerState)).toBeCloseTo(1.0)
        })

        it("will return a completely filled gauge after the duration is reached", () => {
            dateSpy.mockReturnValue(START_TIME_MS + duration * 2)
            updateTimeElapsed(timerState)
            expect(getGaugeRatio(timerState)).toBeCloseTo(1.0)
        })

        it("will return 0 if the duration is invalid", () => {
            timerState.duration = -100
            dateSpy.mockReturnValue(START_TIME_MS + duration * 2)
            updateTimeElapsed(timerState)
            expect(getGaugeRatio(timerState)).toBeCloseTo(0)
        })
    });
})
