import {expect, test} from "@playwright/test";
import {getCelsiusTemperatureInput, getFahrenheitTemperatureInput, navigateToTemperatureConverter} from "./temperatureConverter";

test.describe("temperatureConverter", async () => {
    test('has article with the name of the component', async ({page}) => {
        const article = await navigateToTemperatureConverter(page);
        await expect(article).toHaveText(/Temperature Converter/);
    });

    test('expect default values from inputs', async ({page}) => {
        await navigateToTemperatureConverter(page);
        await expect(getCelsiusTemperatureInput(page)).toHaveValue("0")
        await expect(getFahrenheitTemperatureInput(page)).toHaveValue("32")
    })

    test('update the fahrenheit temperature when the celsius input is changed', async ({page}) => {
        await navigateToTemperatureConverter(page);
        const celsiusTemperature = getCelsiusTemperatureInput(page);
        await celsiusTemperature.fill("100")
        await expect(getFahrenheitTemperatureInput(page)).toHaveValue("212")
    })

    test('update the celsius temperature when the fahrenheit input is changed', async ({page}) => {
        await navigateToTemperatureConverter(page);
        const fahrenheitTemperature = getFahrenheitTemperatureInput(page);
        await fahrenheitTemperature.fill("212")
        await expect(getCelsiusTemperatureInput(page)).toHaveValue("100")
    })
})
