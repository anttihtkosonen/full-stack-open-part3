import React from 'react';
import Filter from './components/Filter';
import ShowPersons from './components/ShowPersons';
import personService from './services/personService';
import Notification from './components/Notification';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
      newNumber: '',
      filter: '',
      message: ''
    }
  }

  componentDidMount() {
    console.log('did mount')
    personService
      .getAll()
      .then(persons => {
        this.setState({ persons })
      })
  }

  addPerson = (event) => {
    event.preventDefault()
    const personObj ={
      name: this.state.newName,
      number: this.state.newNumber,
    }

    const nimet = this.state.persons.map(person => person.name)

    if (personObj.name === ''){
      window.alert(`Anna henkilölle nimi`)
    }

    else if (nimet.includes(personObj.name) ===false) {
      this.createPerson(personObj)
    }  
    else  {
      this.updatePerson(personObj)
    }
  }
  
  createPerson = (personObj) => {
    personService
    .createPerson(personObj)
         .then(response => {
          this.setState({
            persons: this.state.persons.concat(response),
            newName: '',
            newNumber: '',
            filter: '',
            message: response.name+' lisättiin palvelimelle'
          })
          setTimeout(() => {this.setState({message: ''})}, 4000)
    }) 
  }

  updatePerson = (personObj) => {
    const result = window.confirm(personObj.name+' on jo luettelossa - korvataanko vanha numero uudella?')
    if (result===true) {          
      const changedPerson=  this.state.persons.find(i=>i.name === personObj.name)
      changedPerson.number = this.state.newNumber
      personService
      .modifyPerson(changedPerson)
      .catch(error => {
        const result = window.confirm(`Henkilön '${changedPerson.name}' tiedot on jo poistettu palvelimelta - lisätäänkö antamasi tiedot uudelleen palvelimelle?`)
        if (result === true) {
          this.createPerson(personObj)
        }
      })
      .then(() =>
        personService
        .getAll()
        .then(response =>{
          this.setState({
            persons: response,
            newName: '',
            newNumber: '',
            filter: '',
            message: personObj.name + ' numeroa muutettiin'
          })
        setTimeout(() => {this.setState({message: ''})}, 4000)
        })
      )

    }
  }
  

  handleAddPerson = (event) => {
    console.log(event.target.value)
    this.setState({ newName: event.target.value })
  }

  handleAddNum = (event) => {
    console.log(event.target.value)
    this.setState({ newNumber: event.target.value })
  }

  handleFind =(event) => {
    console.log(event.target.value)
    this.setState({ filter: event.target.value })
  }

  findPerson = (person) => {
    const personData=person.name+' '+person.number
    return this.state.filter.length === 0 || personData.match(new RegExp(this.state.filter, 'i'))
  }

  onClick = (person) => {
    const result = window.confirm('Haluatko varmasti poistaa henkilön ' +person.name )
    if(result) {
      console.log(person)
      personService.deletePerson(person)
        .catch(error => {
          window.alert(`Henkilöä nimeltä '${person.name}' ei löydy palvelimelta`)
        })
      const newPersonsList = this.state.persons.filter(i=>i.id !== person.id)
      this.setState({ 
        persons: newPersonsList,
        message: person.name + ' poistettiin palvelimelta'
      })
      setTimeout(() => {this.setState({message: ''})}, 4000)
    } 
}


  render() {
    return (
      <div>
        <h1>Puhelinluettelo</h1>
        <Notification message={this.state.message}/>
        <form onSubmit={this.findPerson} >
          <Filter value={this.state.filter} filterFunction = {this.handleFind} />
        </form>
        <h2>Lisää uusi</h2>
        <form onSubmit={this.addPerson} >
          <div>
            nimi: <input 
              value = {this.state.newName} 
              onChange={this.handleAddPerson}
              />
          </div>
          <div>
            numero: <input 
              value = {this.state.newNumber} 
              onChange={this.handleAddNum}
            />
          </div>          
          <div>
            <button type="submit">lisää</button>
          </div>
        </form>

        <h2>Numerot</h2>
        <ShowPersons search = {person => this.findPerson(person)} persons = {this.state.persons} onClick={this.onClick} />
      </div>
    )
  }
}

export default App