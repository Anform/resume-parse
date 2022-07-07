import React, { useState, useEffect } from 'react';
import "./App.css"
import * as XLSX from 'xlsx'


function App() {
  const [items, setItems] = useState([])
  const [searchItem, setSearchTerm] = useState('')
  const LOCAL_STORAGE_KEY = "resumeApp.items"

  function clearState()
  {
    setItems([])
  }

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if(storedItems) setItems(storedItems)
  }, [])


  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
  }, [items])


  const readExcel=(file)=>{
    const promise = new Promise((resolve,reject)=>{
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file)

      fileReader.onload=(e)=>{
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray,{type: 'buffer'});

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws)

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d)=> {
      setItems(d)
    })
  };

  return(
    <div className = "App">
      <h1 className = "head">
        Resume Parser
      </h1>
      <p className = "instructions">
        Upload an excel file with candidates or search for a candidate using keywords (i.e name or coding language)
      </p>
      <div className = "userInt">
        <input type = "file" className = "fileUpload" onChange ={(e)=> {
          const file = e.target.files[0];
          readExcel(file);
        }}>
        </input>
        <button onClick = {clearState} class = "btn btn-danger">Clear Table</button>
      </div>
      
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Highest Degree</th>
          <th scope="col">Previous Jobs/Internships</th>
          <th scope="col">Java Experience (Years)</th>
          <th scope="col">Python Experience (Years)</th>
          <th scope="col">C++ Experience (Years)</th>
          <th scope="col">HTML Experience (Years)</th>
          <th scope="col">JavaScript Experience (Years)</th>
          <th scope="col">Combined coding experience (Years)</th>
        </tr>
      </thead>
      <tbody>
        <input type = "text" className = "searchBar" placeholder= "Enter keywords..." onChange = {(e) => {setSearchTerm(e.target.value)}}></input>
        {
          items.sort(function(a,b){
            switch (searchItem.toLowerCase()) {
              case 'java':
                return b.java - a.java
              case 'python':
                return b.python - a.python
              case 'c++':
                return b.cplus - a.cplus
              case 'html':
                return b.html - a.html
              case 'javascript':
                return b.javascript - a.javascript
              default:
                return b.experience - a.experience
            }
            // eslint-disable-next-line
          }).filter((val) => {
            if(searchItem === "" || searchItem.toLowerCase() === 'java' || searchItem.toLowerCase() === 'python' || searchItem.toLowerCase() === 'c++' 
            || searchItem.toLowerCase() === 'html' || searchItem.toLowerCase() === 'javascript') {
              return val
            }
            else if(val.name.toLowerCase().includes(searchItem.toLowerCase()) || val.job.toLowerCase().includes(searchItem.toLowerCase()) 
            || val.degree.toLowerCase().includes(searchItem.toLowerCase())) {
              return val
            }
          }).map((val)=>(
              <tr key = {val.Item}>
              <th>{val.name}</th>
              <th>{val.degree}</th>
              <th>{val.job}</th>
              <td>{val.java}</td>
              <td>{val.python}</td>
              <td>{val.cplus}</td>
              <td>{val.html}</td>
              <td>{val.javascript}</td>
              <td>{val.experience}</td>
          </tr>
          ))
        }
    </tbody>
  </table>  
    </div>
  );
}

export default App;
