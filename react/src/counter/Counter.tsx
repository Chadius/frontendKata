import {useState} from "react";

const Counter = () => {
    const [count, setCount] = useState(0);

    const incrementCount = () => {
        setCount(count + 1)
    }

    return (
        <article aria-label={"counter"}>
            <h1>Counter</h1>
            <label htmlFor="count">Count:</label>
            <input id="count" name="count" type="text" value={count} readOnly={true}/>
            <button onClick={incrementCount}>Count</button>
        </article>
    )
};

export default Counter
