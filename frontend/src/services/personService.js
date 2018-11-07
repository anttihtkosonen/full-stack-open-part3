import axios from 'axios'
//const baseUrl = 'https://polar-spire-32000.herokuapp.com/api/persons'
const baseUrl = '/api/persons'

const getAll = () => {
    return axios
    .get(baseUrl)
    .then(response=>response.data)

}
  
const createPerson = (newObject) => {
    return axios
    .post(baseUrl, newObject)
    .then(response => response.data)
}
  
const deletePerson = (person) => {
    console.log(person.id)
    return axios
    .delete(`${baseUrl}/${person.id}`)
    .then(response => response.data)
}

const modifyPerson = (person) => {
    return axios
    .put(`${baseUrl}/${person.id}`, person)
    .then(response => response.data)
}

  export default { getAll, createPerson, deletePerson, modifyPerson }