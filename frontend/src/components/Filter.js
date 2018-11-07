
import React from 'react';


const Filter = ({value, filterFunction}) => {
    return (
      <div>
            Rajaa näytettäviä: <input value={value} onChange={filterFunction} />
      </div>
    )
}


export default Filter