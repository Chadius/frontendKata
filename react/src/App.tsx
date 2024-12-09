import './App.css'
import Counter from "./counter/Counter.tsx";
import TemperatureConverter from "./temperatureConverter/TemperatureConverter.tsx";

function App() {

    return (
        <>
            <article aria-label={"counter"}>
                <h1>Counter</h1>
                <Counter/>
            </article>
            <hr/>
            <article aria-label={"temperature converter"}>
                <h1>Temperature Converter</h1>
                <TemperatureConverter/>
            </article>
        </>
    )
}

export default App
