import {
    addNewRecord,
    CrudState,
    deleteRecord,
    filterRecordsBySurname, NameRecord,
    newCrudState,
    selectFilteredRecord,
    updateRecord
} from "./crud.logic"
import {beforeEach, describe, expect, it} from "vitest";

describe('CRUD logic', () => {
    it("can add a new record", () => {
        const crudState = newCrudState()
        addNewRecord(crudState, {givenName: "Hans", surname: "Moleman"})
        expect(crudState.records).toHaveLength(1)
        expect(crudState.records[0]).toEqual(expect.objectContaining({givenName: "Hans", surname: "Moleman"}))
    })
    it("can select an existing record", () => {
        const crudState = newCrudState()
        addNewRecord(crudState, {givenName: "Hans", surname: "Moleman"})
        selectFilteredRecord(crudState, 0)
        expect(crudState.selectedRecord).toEqual(expect.objectContaining({givenName: "Hans", surname: "Moleman"}))
    })
    it("can returns undefined if the record is out of bounds", () => {
        const crudState = newCrudState()
        addNewRecord(crudState, {givenName: "Hans", surname: "Moleman"})
        selectFilteredRecord(crudState, 9001)
        expect(crudState.selectedRecord).toBeUndefined()
    })
    describe('can filter records by surname', () => {
        let crudState: CrudState
        let gruber: NameRecord

        beforeEach(() => {
            crudState = newCrudState()
            addNewRecord(crudState, {givenName: "Hans", surname: "Moleman"})
            gruber = addNewRecord(crudState, {givenName: "Hans", surname: "Gruber"})
        })

        it("empty filter returns all records", () => {
            filterRecordsBySurname(crudState, "")
            expect(crudState.filteredRecords).toHaveLength(2)
            expect(crudState.filteredRecords.some(record => record.surname === "Gruber")).toBeTruthy()
            expect(crudState.filteredRecords.some(record => record.surname === "Moleman")).toBeTruthy()
        })

        it("undefined filter returns all records", () => {
            filterRecordsBySurname(crudState, undefined)
            expect(crudState.filteredRecords).toHaveLength(2)
        })

        it("can filter by the start of a surname", () => {
            filterRecordsBySurname(crudState, "Gru")
            expect(crudState.filteredRecords).toHaveLength(1)
            expect(crudState.filteredRecords).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({givenName: "Hans", surname: "Gruber"})
                ])
            )
        })

        it("does not filter by given name", () => {
            filterRecordsBySurname(crudState, "Hans")
            expect(crudState.filteredRecords).toHaveLength(0)
        })

        it("will select based on the index of the filtered record", () => {
            filterRecordsBySurname(crudState, "Gru")
            selectFilteredRecord(crudState, gruber.id)
            expect(crudState.selectedRecord).toEqual(
                expect.objectContaining({givenName: "Hans", surname: "Gruber"})
            )
        })
        it("will update filtered records upon add", () => {
            filterRecordsBySurname(crudState, "Gru")
            addNewRecord(crudState, {givenName: "Hans", surname: "Gru"})
            expect(crudState.filteredRecords).toHaveLength(2)
            expect(crudState.filteredRecords).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({givenName: "Hans", surname: "Gru"})
                ])
            )
        })
        it("will update filtered records upon delete", () => {
            filterRecordsBySurname(crudState, "Gru")
            expect(crudState.filteredRecords).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({givenName: "Hans", surname: "Gruber"})
                ])
            )
            deleteRecord(crudState, gruber.id)
            expect(crudState.filteredRecords).toHaveLength(0)
        })
    });

    it("can delete an existing record based on the filtered index", () => {
        const crudState = newCrudState()
        addNewRecord(crudState, {givenName: "Hans", surname: "Moleman"})
        const gruber = addNewRecord(crudState, {givenName: "Hans", surname: "Gruber"})
        deleteRecord(crudState, gruber.id)
        expect(crudState.records).toHaveLength(1)
        expect(crudState.records).toEqual(
            expect.arrayContaining([
                expect.objectContaining({givenName: "Hans", surname: "Moleman"})
            ])
        )
    })

    it ("can update an existing record", () => {
        const crudState = newCrudState()
        const moleman = addNewRecord(crudState, {givenName: "Hans", surname: "Moleman"})
        addNewRecord(crudState, {givenName: "Hans", surname: "Gruber"})
        updateRecord(crudState, moleman.id, {givenName: "Hans", surname: "Gru"})
        expect(crudState.records).toHaveLength(2)
        expect(crudState.records).toEqual(
            expect.arrayContaining([
                expect.objectContaining({givenName: "Hans", surname: "Gru"}),
                expect.objectContaining({givenName: "Hans", surname: "Gruber"}),
            ])
        )
    })
});
