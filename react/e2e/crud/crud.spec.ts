import {expect, test} from "@playwright/test";
import {
    clickOnCreate, clickOnDelete,
    clickOnNameInList, clickOnUpdate, getArticle, getGivenName,
    getNameList, getSurname,
    navigateToCrud,
    typeGivenName,
    typeIntoFilter,
    typeSurname
} from "./crud.helper";

test.describe("crud", async () => {
    test('has article with the name of the component', async ({page}) => {
        const article = await navigateToCrud(page);
        await expect(article).toHaveText(/Crud/);
    });

    test('can add a name to the list', async ({page}) => {
        await navigateToCrud(page);
        await typeGivenName(page, "Hans");
        await typeSurname(page, "Moleman");
        await clickOnCreate(page);
        await clickOnNameInList(page, "Moleman, Hans")

        await expect(getGivenName(page)).toHaveText("");
        await expect(getSurname(page)).toHaveText("");
    });

    test('can filter by surname', async({page}) => {
        await navigateToCrud(page);
        await typeGivenName(page, "Hans");
        await typeSurname(page, "Moleman");
        await clickOnCreate(page);

        await typeGivenName(page, "Hans");
        await typeSurname(page, "Gruber");
        await clickOnCreate(page);

        await typeGivenName(page, "Hans");
        await typeSurname(page, "Grubby");
        await clickOnCreate(page);

        await expect(getNameList(page).getByText("Moleman, Hans")).toHaveCount(1);
        await expect(getNameList(page).getByText("Gruber, Hans")).toHaveCount(1);
        await expect(getNameList(page).getByText("Grubby, Hans")).toHaveCount(1);

        await typeIntoFilter(page, "Grub");
        await expect(getNameList(page).getByText("Moleman, Hans")).toHaveCount(0);
        await expect(getNameList(page).getByText("Gruber, Hans")).toHaveCount(1);
        await expect(getNameList(page).getByText("Grubby, Hans")).toHaveCount(1);

        await typeIntoFilter(page, "Grubby");
        await expect(getNameList(page).getByText("Moleman, Hans")).toHaveCount(0);
        await expect(getNameList(page).getByText("Gruber, Hans")).toHaveCount(0);
        await expect(getNameList(page).getByText("Grubby, Hans")).toHaveCount(1);

        await typeIntoFilter(page, "");
        await expect(getNameList(page).getByText("Moleman, Hans")).toHaveCount(1);
        await expect(getNameList(page).getByText("Gruber, Hans")).toHaveCount(1);
        await expect(getNameList(page).getByText("Grubby, Hans")).toHaveCount(1);
    });

    test('disables the update and delete buttons until a name is selected', async ({page}) => {
        await navigateToCrud(page);

        await expect(getArticle(page).getByRole("button", {name: "Delete"})).toBeDisabled();
        await expect(getArticle(page).getByRole("button", {name: "Update"})).toBeDisabled();

        await typeGivenName(page, "Hans");
        await typeSurname(page, "Moleman");
        await clickOnCreate(page);

        await expect(getArticle(page).getByRole("button", {name: "Delete"})).toBeDisabled();
        await expect(getArticle(page).getByRole("button", {name: "Update"})).toBeDisabled();

        await clickOnNameInList(page, "Moleman, Hans")

        await expect(getArticle(page).getByRole("button", {name: "Delete"})).toBeEnabled();
        await expect(getArticle(page).getByRole("button", {name: "Update"})).toBeEnabled();
    });

    test('can delete a name', async({page}) => {
        await navigateToCrud(page);
        await typeGivenName(page, "Hans");
        await typeSurname(page, "Moleman");
        await clickOnCreate(page);

        await clickOnNameInList(page, "Moleman, Hans")
        await clickOnDelete(page);

        await expect(getNameList(page).getByText("Moleman, Hans")).toHaveCount(0);
    });

    test('can update an existing name', async({page}) => {
        await navigateToCrud(page);
        await typeGivenName(page, "Hans");
        await typeSurname(page, "Gruber");
        await clickOnCreate(page);

        await clickOnNameInList(page, "Gruber, Hans")
        await typeGivenName(page, "Hans");
        await typeSurname(page, "Moleman");
        await clickOnUpdate(page);

        await expect(getNameList(page).getByText("Moleman, Hans")).toHaveCount(1);
    });
});
