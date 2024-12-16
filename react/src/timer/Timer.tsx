import {
    defaultTimerState,
    getGaugeRatio,
    getTimeElapsed,
    resetTimer,
    setTimerDuration,
    TimerState,
    updateTimeElapsed
} from "./timerState.ts";
import {ChangeEvent, useEffect, useState} from "react";

const formatTimeElapsed = (timeElapsed: number): string => `${(timeElapsed / 1000).toFixed(1)}s`;

const Timer = () => {
    const [timerState, setTimerState] = useState<TimerState>(defaultTimerState())

    useEffect(() => {
        const renderTime = () => {
            setTimerState({...updateTimeElapsed(timerState)})
        };
        const tickId = setTimeout(renderTime, 50);
        return () => clearTimeout(tickId);
    }, [timerState]);

    const resetTimerOnClick = () => {
        setTimerState({
            ...resetTimer(timerState),
        })
    }

    const onChangeDuration = (e: ChangeEvent<HTMLInputElement>) => {
        const duration = Number(e.target.value);
        setTimerState({...setTimerDuration(timerState, duration)})
    }

    return (
        <>
            <progress id={"timer"} value={getGaugeRatio(timerState)}></progress>
            <p id={"time-elapsed"}>{formatTimeElapsed(getTimeElapsed(timerState))}</p>
            <input type={"range"} min={100} max={20000} defaultValue={timerState.duration} id={"duration"}
                   onChange={onChangeDuration}></input>
            <button onClick={resetTimerOnClick}>Reset</button>
        </>
    )
};

export default Timer
