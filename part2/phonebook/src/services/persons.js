import axios from 'axios'
const BASE_URL = '/api/persons'

const getAll = () => {
  const request = axios.get(BASE_URL)
  return request.then((response) => response.data)
}

const create = (person) => {
  const request = axios.post(BASE_URL, person)
  return request.then((response) => response.data)
}

const update = (id, changedPerson) => {
  const request = axios.put(`${BASE_URL}/${id}`, changedPerson)
  return request.then((response) => response.data)
}

const remove = (id) => {
  const request = axios.delete(`${BASE_URL}/${id}`)
  return request.then((response) => response.data)
}

const PERSONS = { getAll, create, update, remove }

export default PERSONS
