import '../App.css'
import './crud.css'
import {
    addNewRecord,
    CrudState,
    deleteRecord,
    filterRecordsBySurname,
    newCrudState,
    selectFilteredRecord,
    updateRecord
} from "./crud.logic.ts";
import {ChangeEvent, useState} from "react";

function Crud() {
    const [crudState, setCrudState] = useState<CrudState>(newCrudState())
    const [givenName, setGivenName] = useState<string>("")
    const [surname, setSurname] = useState<string>("")

    const onChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
        setCrudState(
            {
                ...filterRecordsBySurname(crudState, e.target.value)
            }
        )
    }

    const onChangeGivenName = (e: ChangeEvent<HTMLInputElement>) => {
        setGivenName(e.currentTarget.value)
    }

    const onChangeSurname = (e: ChangeEvent<HTMLInputElement>) => {
        setSurname(e.currentTarget.value)
    }

    const onClickCreate = () => {
        addNewRecord(crudState, {
            givenName,
            surname,
        })
        setCrudState(
            {...filterRecordsBySurname(crudState, crudState.filter)}
        )
    }

    const onClickDelete = () => {
        deleteRecord(crudState,
            crudState?.selectedRecord?.id ?? -1,
        )
        setCrudState(
            {...filterRecordsBySurname(crudState, crudState.filter)}
        )
    }

    const onClickUpdate = () => {
        updateRecord(crudState,
            crudState?.selectedRecord?.id ?? -1,
            {
                givenName,
                surname,
            }
        )
        setCrudState(
            {...filterRecordsBySurname(crudState, crudState.filter)}
        )
    }

    const generateSelectOptionDataFromCrudList = (crudState: CrudState) => {
        return crudState.filteredRecords.map(record =>
            <option key={record.id} value={record.id}>{`${record.surname}, ${record.givenName}`}</option>
        )
    }

    const onChangeSelectNameFromCrudList = (e: ChangeEvent<HTMLSelectElement>) => {
        selectFilteredRecord(crudState, Number(e.target.value))
        setCrudState(
            {...filterRecordsBySurname(crudState, crudState.filter)}
        )
    }

    return (
        <article aria-label="crud">
            <h1>Crud</h1>
            <div className="row">
                <label htmlFor="filter">Filter prefix:</label>
                <input aria-label={"filter"} id="filter" name="filter" type={"text"}
                       defaultValue={crudState.filter}
                       onChange={onChangeFilter}/>
            </div>
            <div className="row">
                <div className="name-list">
                    <select aria-label={"name-list"} id="name-list" name="name-list"
                            size={Math.max(4, crudState?.filteredRecords.length ?? 0)}
                            onChange={onChangeSelectNameFromCrudList}
                    >
                        {generateSelectOptionDataFromCrudList(crudState)}
                    </select>
                </div>
                <div className="column">
                    <div className="row">
                        <label htmlFor="given-name">Name:</label>
                        <input aria-label={"given-name"} id="given-name" name="given-name" type={"text"}
                               defaultValue={givenName}
                               onChange={onChangeGivenName}/>
                    </div>
                    <div className="row">
                        <label htmlFor="surname">Surname:</label>
                        <input aria-label={"surname"} id="surname" name="surname" type={"text"}
                               defaultValue={surname}
                               onChange={onChangeSurname}/>
                    </div>
                </div>
            </div>
            <div className="buttons">
                <button id={"create"} onClick={onClickCreate}>Create</button>
                <button id={"update"} disabled={!crudState.selectedRecord} onClick={onClickUpdate}>Update</button>
                <button id={"delete"} disabled={!crudState.selectedRecord} onClick={onClickDelete}>Delete</button>
            </div>
        </article>
    )
}

export default Crud
