import {convertCelsiusToFahrenheit, convertFahrenheitToCelsius} from "./temperatureConvertLogic";

describe('Temperature Convert Logic', () => {
    it("converts Celsius to Fahrenheit", () => {
        expect(convertCelsiusToFahrenheit(0)).toBeCloseTo(32)
        expect(convertCelsiusToFahrenheit(-40)).toBeCloseTo(-40)
        expect(convertCelsiusToFahrenheit(100)).toBeCloseTo(212)
    })
    it("converts Fahrenheit to Celsius", () => {
        expect(convertFahrenheitToCelsius(32)).toBeCloseTo(0)
        expect(convertFahrenheitToCelsius(-40)).toBeCloseTo(-40)
        expect(convertFahrenheitToCelsius(212)).toBeCloseTo(100)
    })
});
