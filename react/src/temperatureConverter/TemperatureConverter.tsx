import {ChangeEvent, useState} from "react";
import {convertCelsiusToFahrenheit, convertFahrenheitToCelsius} from "./temperatureConvertLogic.ts";

const TemperatureConverter = () => {
    const [degreesCelsius, setDegreesCelsius] = useState(0);
    const [degreesFahrenheit, setDegreesFahrenheit] = useState(32);

    const onChangeCelsius = (e: ChangeEvent<HTMLInputElement>) => {
        const degrees = Number(e.target.value);
        setDegreesCelsius(degrees);
        setDegreesFahrenheit(convertCelsiusToFahrenheit(degrees));
    }

    const onChangeFahrenheit = (e: ChangeEvent<HTMLInputElement>) => {
        const degrees = Number(e.target.value);
        setDegreesFahrenheit(degrees);
        setDegreesCelsius(convertFahrenheitToCelsius(degrees));
    }

    return (
        <article aria-label={"temperature converter"}>
            <h1>Temperature Converter</h1>
            <label htmlFor="celsius">Celsius:</label>
            <input id="celsius" name="celsius" type={"number"} value={degreesCelsius} onChange={onChangeCelsius}/>
            <label htmlFor="fahrenheit">Fahrenheit:</label>
            <input id="fahrenheit" name="fahrenheit" type={"number"} value={degreesFahrenheit}
                   onChange={onChangeFahrenheit}/>
        </article>
    )
};

export default TemperatureConverter
