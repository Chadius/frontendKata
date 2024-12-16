interface NameRecord {
    id: number
    givenName: string
    surname: string
}

interface CrudState {
    records: NameRecord[]
    filteredRecords: NameRecord[]
    filter?: string
    selectedRecord?: NameRecord
}

const newCrudState = (): CrudState => ({
    records: [],
    filteredRecords: [],
    selectedRecord: undefined,
})

const addNewRecord = (crudState: CrudState, data: { givenName: string, surname: string }): NameRecord => {
    let newId = 0
    while (true) {
        if (!crudState.records[newId]) {
            break
        }
        newId += 1
    }
    const newRecord: NameRecord = {
        id: newId,
        ...data
    }

    crudState.records.push(newRecord)
    filterRecordsBySurname(crudState, crudState.filter)
    return newRecord
}

const selectFilteredRecord = (crudState: CrudState, recordId: number): NameRecord | undefined => {
    crudState.selectedRecord = crudState.filteredRecords.find(record => record.id === recordId)
    return crudState.selectedRecord
}

const deleteRecord = (crudState: CrudState, recordId: number): CrudState => {
    const recordToDelete = selectFilteredRecord(crudState, recordId)
    if (!recordToDelete) return crudState

    crudState.selectedRecord = undefined
    crudState.records = crudState.records.filter(record => record.id !== recordId)
    return filterRecordsBySurname(crudState, crudState.filter)
}

const filterRecordsBySurname = (crudState: CrudState, filter?: string): CrudState => {
    crudState.filter = filter
    if (!filter) {
        crudState.filteredRecords = [...crudState.records]
        return crudState
    }

    crudState.filteredRecords = crudState.records.filter(record =>
        record.surname.toLowerCase().includes(filter.toLowerCase())
    )
    return crudState
}

const updateRecord = (
    crudState: CrudState,
    recordId: number,
    data: { givenName: string, surname: string }
): CrudState => {
    const recordToUpdate = selectFilteredRecord(crudState, recordId)
    if (!recordToUpdate) return crudState
    const newRecord: NameRecord = {
        id: recordToUpdate.id,
        ...data,
    }
    const indexToReplace = crudState.records.findIndex(record => record.id === recordId)
    crudState.records[indexToReplace] = newRecord
    return filterRecordsBySurname(crudState, crudState.filter)
}

export {newCrudState, addNewRecord, selectFilteredRecord, filterRecordsBySurname, deleteRecord, updateRecord}
export type {CrudState, NameRecord}

