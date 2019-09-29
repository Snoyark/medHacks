import React, { useState } from 'react';
import Select from 'react-select';
import './App.css';
import * as CSV from 'csv-string';

const pagesMedicare = ['622992ae62d074eb6a02c23654c911d1', '849ad6f2240f259ec8dec1bfdd4af4e5', '06f01b110455ddbc908b9be164f33f56', '092fbc2c30c4d31cbd6c1b73624df3b6']

function getPage(number) {
  const prom = fetch(`https://api.github.com/gists/${pagesMedicare[number]}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.v3.raw',
        Authorization: btoa("Snoyark: 69c348c3b8fc00b3c9fa9253d84734d42734be58")
      }
    }
  ).then(response => {
    return response.json()
    // .files[`page${number}.csv`].content;
  }).then(response => {
    return response.files[`page${number}.csv`].content
  }).then(response => CSV.parse(response));
  return prom;
}

const App = () => {
  const [dict, setDict] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const [resp, setResp] = useState([]);
  const [info, setInfo] = useState("")
  const [dummy, setDummy] = useState("");
  const setContent = () => {
    if (Object.keys(dict).length !== 0 && resp.length !== 0) {
      return;
    }
    getPage(3).then(response => {
      let d = {}
      setResp(response)
      for (let i = 0; i < response.length - 1; i += 1) {
        d[response[i][1]] = response[i + 1][0]
        d[response[i][2]] = response[i + 1][0]
      }
      setDict(d);
    })
  }

  const getArray = () => {
    const arr = Object.keys(dict);
    const ret = []
    for (let i = 6; i < arr.length; i += 1) {
      // ret.push({value: arr[i].toLowerCase(), label: arr[i]})
      ret.push(<option value={arr[i]}/>)
    }
    return ret
  }
  setContent();
  return (
    <div style={{ display: 'display-flex' }}>
      <div style={{
        width: '100%',
        height: 130,
        verticalAlign: 'top',
        backgroundColor: '#4169E1',
        padding: 10,
        fontFamily: 'Sans-Serif',
      }}>
        <div>
          <span style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 80,
            verticalAlign: 'middle',
            }}
            >
              Pharma Veritas
          </span>
          <span style={{
            justifyContent: "flex-end",
            padding: 40,
            float: 'right', 
            fontSize : 35,
            color: 'white',
          }}
          className="tooltip"
          >
            <span className="tooltiptext">
              This was created by a group of students with varying backgrounds who wanted to help
              a group of people often looked over in the speed of technological innovation who could
              use help in their health livelihoods.
            </span>
            About
          </span>
          <span style={{
            justifyContent: "flex-end",
            padding: 40,
            float: 'right', 
            fontSize : 35,
            color: 'white',
          }}
          className="tooltip"
          >
            <span className="tooltiptext">
              Enter any medicine you may be taking, and we'll see if we can help you learn more about them.
            </span>
            Help
          </span>
        </div>
        <div style={{
          fontSize: 28,
          color: 'rgb(225, 225, 225)',
          fontFamily: 'Serif',
        }}>
          Verity regarding medicine.
        </div>
      </div>
      {/* Area between the header and the search bar */}
      <div style={{
        width: '100%',
        height: 200,
        alignItems: 'middle',
        fontSize: 45,
        textAlign: "center",
        paddingTop: 60,
      }}>
        Type in the name of the generic or brand name of your drug below to find out more information.
      </div>
      <div style={{justifyContent: 'center', paddingLeft: '5%'}}>
        <input
          id="in"
          style={{
            width: '90%',
            height: 50,
            padding: 5,
            justifyContent: 'center',
            borderRadius: 4,
            fontSize: 25,
            textAlign: 'center'
          }}
          title="What are you waiting for?"
          placeholder="Search your favorite medicines (Case/Space sensitive)!"
          onChange={(t) => {
            if (t !== '') {
              setSearchVal(document.getElementById("in").value)
            }
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              console.log(searchVal)
              if (searchVal in dict) {
                let val = `${resp[dict[searchVal]][3]}`
                const ind = val.indexOf('NOTE')
                val = val.substring(0, ind)
                setInfo(val)
                setSearchVal("");
              } else {
                setSearchVal("");
                setInfo('No medication could be found by that name.')
              }
            }
          }}
          list="meds"
        />
          <datalist id="meds">
            {getArray()}
          </datalist>
      </div>
      <div style={{
        color: 'rgb(120, 120, 120)',
        fontSize: 35,
        textAlign: 'center',
        padding: 40
      }}>
        {(Object.keys(dict).length !== 0) && info}
        <hr />
        {(Object.keys(dict).length !== 0) && (info !== "") && `\nNOTE: This is a summary and does NOT have all possible information about this product. This information does not assure that this product is safe, effective, or appropriate for you. This information is not individual medical advice and does not substitute for the advice of your health care professional. Always ask your health care professional for complete information about this product and your specific health needs.`}

      </div>
    </div>
  );
}

export default App;
