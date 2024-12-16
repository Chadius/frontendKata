import './App.css'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Layout from "./Layout.tsx";
import Counter from "./counter/Counter.tsx";
import TemperatureConverter from "./temperatureConverter/TemperatureConverter.tsx";
import Crud from "./crud/Crud.tsx";
import Timer from "./timer/Timer.tsx";
import FlightBooker from "./flightBooker/FlightBooker.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path={"/"} element={<Layout/>}></Route>
                <Route path={"counter"} element={<Counter/>}></Route>
                <Route path={"temperatureConverter"} element={<TemperatureConverter/>}></Route>
                <Route path={"flightBooker"} element={<FlightBooker/>}></Route>
                <Route path={"timer"} element={<Timer/>}></Route>
                <Route path={"crud"} element={<Crud/>}></Route>
            </Routes>
        </Router>
    )
}

export default App
