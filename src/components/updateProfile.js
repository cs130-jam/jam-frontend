import React, {useState, useRef,useEffect} from 'react';
import InputField from '../util/inputField';
import ErrorInputField from '../util/errorInputField';
import '../App.css';
import './updateProfile.css';
import DropdownField from '../util/dropdownField';


  const instrumentsListStyle = {
    margin: "0px",
    padding: "0px",
    listStyleType: "none"
}



const UpdateProfile = (props) => {

    const apiService = props.apiService
    //const [buttonText, setButtonText] = useState("Yes"); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState
    //const [selected, setSelected] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [instruments, setInstruments] = useState([]);
    const [filteredInstruments, setFilteredInstruments] = useState([]);
    const [knownInstruments, setKnownInstruments] = useState([]);
    const [instQuery, setInstQuery] = useState("");

    function next() {
        if (firstName.length === 0) {
            return;
        }

        setPageIndex(pageIndex + 1);
    }

    function prevPage() {
        setPageIndex(pageIndex - 1);
    }

    function matchingPrefixIgnoreCase(prefix, entries) {
        prefix = prefix.toLowerCase();
        return entries.filter(entry => {
            const compareLength = Math.min(prefix.length, entry.length);
            return prefix.substring(0, compareLength) === entry.substring(0, compareLength).toLowerCase();
        });
    }

    function getFilteredInstruments(query) {
        return matchingPrefixIgnoreCase(query, instruments);
    }
    useEffect(() => {
        setFilteredInstruments(getFilteredInstruments(instQuery));
    }, [instQuery, instruments]);

    function onInstrumentSelect(instrument) {
        if (knownInstruments.includes(instrument.name)) return;
        setKnownInstruments([...knownInstruments, instrument.name]);
    }

    async function getInstruments() {
        let response = await apiService.getInstruments();
        let json = await response.json();
        setInstruments(json);
    }
    useEffect(() => getInstruments(), []);

    function removeInstrument(instrument) {
        setKnownInstruments(knownInstruments.filter(filteredInstrument => filteredInstrument !== instrument));
    }

    function instrumentsDone() {
        setPageIndex(pageIndex + 1);
    }

    async function loadUser(){
        let response = await apiService.getCurrentUser();
        
        if (!response.ok) {
          setLoaded(false);
          return;
        }
        let json = await response.json();
        console.log(json);
        console.log(json.profile.instruments);
        setFirstName(json.profile.firstName);
        setLastName(json.profile.lastName);
        setKnownInstruments(json.profile.instruments);
        /*let recuserId = json.userId;

        let userResponse = await apiService.getUser(recuserId);
        if (!userResponse.ok) {
          setLoaded(false);
          return;
        }
        let userJson = await userResponse.json();
        setSelected(userJson);*/
        setLoaded(true);
    }

    useEffect(() => loadUser(), []);

    const pages = [
        (
            <div className="container-fluid g-0">
            <p className="jam-title-text">Personal Information</p>
            <ErrorInputField 
                value={firstName}
                onInput={setFirstName}
                label="First Name: " 
                type="text" 
                isError={firstName.length === 0}
                message="First name is required"/>
            <InputField value={lastName} onInput={setLastName} label="Last Name:" type="text" />
            <div className="row g-0">
                <div className="col-4">
                    {/* <button className="jam-submit-button disabled" disabled>Back</button> */}
                </div>
                <div className="col-4"></div>
                <div className="col-4">
                    <button className="jam-submit-button" onClick={next}>Next</button>
                </div>  
            </div>
        </div>
        ),
        (
            <div className="container-fluid g-0">
            <p className="jam-title-text">Interested Instruments</p>
            <DropdownField 
                value={instQuery}
                onInput={setInstQuery}
                label="Add Known Instruments:" 
                type="text"
                hasMore={false}
                onSelect={onInstrumentSelect}
                entries = {filteredInstruments.map(inst => {return {
                    name: inst, 
                    html: (<span>{inst}</span>)
                }})}/>
            <ul style={instrumentsListStyle}>
                {knownInstruments.map(instrument => (
                    <li className="removable-list-entry" key={instrument}>
                        <span>{instrument}</span>
                        <button onClick={e => removeInstrument(instrument)}>x</button>
                    </li>
                ))}
            </ul>
            <div className="row g-0">
                <div className="col-4">
                    <button className="jam-submit-button" onClick={prevPage}>Back</button>
                </div>
                <div className="col-4"></div>
                <div className="col-4">
                    <button className="jam-submit-button" onClick={instrumentsDone}>Next</button>
                </div>  
            </div>
        </div>
        )
    ];

    return (

    
          
          <div className="d-flex justify-content-center align-items-center">
          <div className="jam-form">
          {pages[pageIndex]}
         
            </div>
            </div>
  
    );
};

export default UpdateProfile;