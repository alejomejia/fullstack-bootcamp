import PERSONS from '../../services/persons'

const Person = ({ id, name, number, persons, setPersons }) => {
  const handleDelete = () => {
    const askForDelete = window.confirm(
      `Are you sure you want to remove ${name}?`
    )

    if (askForDelete) {
      PERSONS.remove(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id))
      })
    }
  }

  return (
    <div className="person">
      <div className="person__content">
        <p>
          {name} • {number}
        </p>
      </div>
      <div className="person__actions">
        <button className="delete" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default Person
