import { useState, useEffect } from 'react'

import PERSONS from './services/persons'

import Form from './components/Form'
import Search from './components/Search'
import Person from './components/Person'
import Notification from './components/Notification'

const App = () => {
  const initialNotification = {
    show: false,
    message: '',
    type: '',
  }

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(initialNotification)

  useEffect(() => {
    PERSONS.getAll().then((persons) => setPersons(persons))
  }, [])

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleNewName = (e) => {
    setNewName(e.target.value)
  }

  const handleNewNumber = (e) => {
    setNewNumber(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber,
    }

    // Check if name and number has values
    if (newName && newNumber) {
      // Check if person name already exists
      if (persons.some((person) => person.name === newName)) {
        // Check if person name and number are the same
        if (persons.some((person) => person.number === newNumber)) {
          alert(
            `${newName} was already added with the same number: ${newNumber}`
          )
          return
        }

        // Ask if want to replace the old number with the new one
        const askForUpdate = window.confirm(
          `${newName} is already added to phonebook. Do you want to update the number?`
        )

        if (askForUpdate) {
          const clonedPerson = persons.filter(
            (person) => person.name === newName
          )

          const clonedPersonId = clonedPerson[0].id

          const changedPerson = {
            ...clonedPerson[0],
            number: newNumber,
          }

          // Update person number in server and state
          PERSONS.update(clonedPersonId, changedPerson)
            .then((returnedPerson) => {
              const updatedPerson = persons.map((person) =>
                person.id !== clonedPersonId ? person : returnedPerson
              )
              setPersons(updatedPerson)

              triggerNotification(
                `${clonedPerson[0].name} number was updated`,
                'success'
              )

              setNewName('')
              setNewNumber('')
            })
            .catch((err) => {
              console.log(err.response.data)
              triggerNotification(err.response.data.error, 'error')
            })
          return
        } else {
          // If don't want to update, clear inputs
          setNewName('')
          setNewNumber('')
        }
      } else {
        // Make new person in case it doesn't exist
        PERSONS.create(newPerson)
          .then((personCreated) => {
            setPersons((prevPersons) => prevPersons.concat(personCreated))
            setNewName('')
            setNewNumber('')
            triggerNotification(`${newPerson.name} number was added`, 'success')
          })
          .catch((err) => {
            console.log(err.response.data)
            triggerNotification(err.response.data.error, 'error')
          })
      }
    } else {
      alert('Make sure to write name and phone')
    }
  }

  const triggerNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    })
    setTimeout(() => setNotification(initialNotification), 3000)
  }

  const personsToShow = search
    ? persons.filter((person) => {
        const searchByName = person.name
          .toLowerCase()
          .includes(search.toLowerCase())
        const searchByNumber = person.number.includes(search)
        return searchByName || searchByNumber
      })
    : persons

  return (
    <div className="container">
      <h1>Phonebook</h1>
      <div className="card">
        <h2>Add New</h2>
        <Form
          handleSubmit={handleSubmit}
          newName={newName}
          newNumber={newNumber}
          handleNewName={handleNewName}
          handleNewNumber={handleNewNumber}
        />
      </div>
      <div className="card">
        <h2>Numbers</h2>
        {persons[0] ? (
          <>
            <Search search={search} handleSearch={handleSearch} />
            <div className="persons">
              {personsToShow.map((person) => (
                <Person
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  number={person.number}
                  persons={persons}
                  setPersons={setPersons}
                />
              ))}
            </div>
          </>
        ) : (
          <p>No person added to phonebook yet</p>
        )}
      </div>
      {notification.show && <Notification {...notification} />}
    </div>
  )
}

export default App
