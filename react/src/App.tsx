import './App.css'
import Counter from "./counter/Counter.tsx";
import TemperatureConverter from "./temperatureConverter/TemperatureConverter.tsx";
import FlightBooker from "./flightBooker/FlightBooker.tsx";

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
            <article aria-label={"flight booker"}>
                <h1>Flight Booker</h1>
                <FlightBooker/>
            </article>
        </>
    )
}

export default App
