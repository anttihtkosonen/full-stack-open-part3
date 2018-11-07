
import React from 'react';


const ShowPersons = ({persons, search, filter, onClick}) => {

    const rivit = persons.filter(person=>search(person)).map(person => 
        <tr key={person.id}>
          <td>{person.name}</td> 
          <td>{person.number}</td>
          <td><button type="button" onClick={()=>onClick(person)}>Poista</button></td>
        </tr>

      )
    
    return (
      <div>
        <table>
          <tbody>
            {rivit}
          </tbody>
        </table>
      </div>
      
    )
    }


export default ShowPersons