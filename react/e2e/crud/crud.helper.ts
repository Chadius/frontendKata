import {Page} from "@playwright/test";
import {goToHomePage} from "../app";

const navigateToCrud = async (page: Page) => {
    await goToHomePage(page);
    await page.getByRole("link", {name: "Crud"}).click()
    return getArticle(page);
}

const getArticle = (page: Page) =>
    page.getByRole("article", {name: "crud"});

const getFilter = (page: Page) =>
    page.getByLabel("filter");

const typeIntoFilter = async (page: Page, filter: string) =>
    await getFilter(page).fill(filter);

const getNameList = (page: Page) =>
    page.locator("#name-list");

const clickOnNameInList = async (page: Page, nameToSelect: string) =>
    await getNameList(page).selectOption({label: nameToSelect});

const getGivenName = (page: Page) =>
    page.getByLabel("given-name");

const typeGivenName = async (page: Page, name: string) => await getGivenName(page).fill(name);

const getSurname = (page: Page) =>
    page.getByLabel("surname");

const typeSurname = async (page: Page, name: string) => await getSurname(page).fill(name);

const clickOnCreate = async (page: Page) =>
    await getArticle(page).getByRole("button", {name: "Create"}).click();

const clickOnUpdate = async (page: Page) =>
    await getArticle(page).getByRole("button", {name: "Update"}).click();

const clickOnDelete = async (page: Page) =>
    await getArticle(page).getByRole("button", {name: "Delete"}).click();

export {
    navigateToCrud,
    getArticle,
    clickOnCreate,
    clickOnUpdate,
    clickOnDelete,
    getGivenName,
    getNameList,
    getSurname,
    getFilter,
    typeIntoFilter,
    typeGivenName,
    typeSurname,
    clickOnNameInList,
};
