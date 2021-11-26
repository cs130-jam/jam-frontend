import React, {useState, useRef,useEffect} from 'react';
import InputField from '../util/inputField';
import ErrorInputField from '../util/errorInputField';
import '../App.css';
import DropdownField from '../util/dropdownField';
import useInterval from '../util/useInterval';
import { Alert } from 'react-bootstrap';
import useStateRef from '../util/useStateRef';

  const instrumentsListStyle = {
    margin: "0px",
    padding: "0px",
    listStyleType: "none"
}

const artistContainer = {
    height: "60px",
    position: "relative"
}

const artistImageStyle = {
    width: "60px",
    height: "60px",
    borderRadius: "3px"
}

const artistNameStyle = {
    fontSize: "18pt",
    position: "absolute",
    top: "15px",
    left: "70px"
}

const artistButtonStyle = {
    marginTop: "18px",
    marginRight: "-10px"
}

const alertStyle = {
    top: '0'
};

const formStyle = {

        padding: "100px 30px 30px 30px",
        border: "0px",
        background: "#fff"
  
};

const ARTIST_SEARCH_DELAY = 1000; // every second
const MIN_ARTIST_SEARCH_LEN = 2;

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

    const [cachedSearches, setCachedSearches] = useState({});
    const [artistQueryResults, setArtistQueryResults] = useState([]);
    const [artistQuery, setArtistQuery] = useState("");
    const [artists, setArtists, artistsRef] = useStateRef([]);
    let arts = [];
    const [isValidInterests, setIsValidInterests] = useState(true); 
    const [failMessage, setFailMessage] = useState("");


    function namesDone() {
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

    useInterval(() => {
        let cached = cachedSearches[artistQuery];
        getArtistsForQuery(artistQuery, cached ? cached.wantedCount : 10, {...cachedSearches});
    }, ARTIST_SEARCH_DELAY);


    async function getArtistsForQuery(query, wantedCount, cachedSearches) {
        if (query.length <= MIN_ARTIST_SEARCH_LEN) return null;

        let cached = cachedSearches[query];

        if (cached && cached.wantedCount !== wantedCount) {
            cached.wantedCount = wantedCount;
            setCachedSearches(cachedSearches);
        }
        if (cached && cached.responses.length >= wantedCount) return;
        if (cached && cached.page === cached.totalPages) return;

        let page = cached ? cached.page + 1 : 1;
        console.log(query);
        let response = await apiService.findArtists(query, page);
        let json = await response.json();
        console.log(json);
        if (!cached) {
            cachedSearches[query] = {
                "page": page,
                "totalPages": json.totalPages,
                "responses": json.responses,
                "wantedCount": wantedCount
            };
            cached = cachedSearches[query];
        } else {
            cached.page = page;
            cached.totalPages = json.totalPages;
            cached.responses = [...cached.responses, json.responses];
        }

        if (cached.responses.length < wantedCount) {
            getArtistsForQuery(query, wantedCount, cachedSearches);
        } else {
            setCachedSearches(cachedSearches);
        }
    }

    function onArtistSelect(entry, id) {
        if (artistsRef.current.length >= 2) setIsValidInterests(true);
        console.log(entry);
        console.log(id);
        if(id===1)
            setArtists([...artistsRef.current, entry]);
        else
            setArtists([...artistsRef.current, entry.content]);
        //console.log(artists);
    }


    useEffect(() => {
        let cached = cachedSearches[artistQuery];
        if (!cached) {
            setArtistQueryResults([]);
            return;
        }

        setArtistQueryResults(cached.responses.slice(0, cached.wantedCount).map(response => {
            return {
                "html": (
                    <div style={artistContainer}>
                        <img style={artistImageStyle} src={response.thumb}/>
                        <div style={artistNameStyle}>{response.name}</div>
                    </div>
                    ),
                "content": response
            };
        }));

        console.log(artistQueryResults);
    }, [artistQuery, cachedSearches]);

    function moreEntries() {
        let cached = cachedSearches[artistQuery];
        if (!cached) return;

        getArtistsForQuery(artistQuery, cached.wantedCount + 10, {...cachedSearches});
    }

    function removeArtist(removeEntry) {
        setArtists(artistsRef.current.filter(artist => artist.path !== removeEntry.path));
    }

    async function loadUser(){
        let response = await apiService.getCurrentUser();
        
        if (!response.ok) {
          setLoaded(false);
          return;
        }
        let json = await response.json();
        console.log(json);
        console.log(json.profile.musicInterests);
        setFirstName(json.profile.firstName);
        setLastName(json.profile.lastName);
        setKnownInstruments(json.profile.instruments);
        
        //setLoaded(true);
        
        for(let i=0; i<json.profile.musicInterests.length; i++)
        {
            console.log(json.profile.musicInterests[i].name);
            let flag = true;
            let page = 1;
            while(flag)
            {
                
                //flag=false;
                let response1 = await apiService.findArtists(json.profile.musicInterests[i].name, page);
                let json1 = await response1.json();
                let var1 = json1.responses.filter(artist => artist.path === json.profile.musicInterests[i].path);
                
                page++;
                if(var1.length!==0)
                   { 
                    console.log(var1[0]);
                    //setArtistQuery(json.profile.musicInterests[i].name);
                    onArtistSelect(var1[0], 1);
                    //setArtists([...artists, var1[0]]);
                    arts.push( var1[0]);
                    //console.log(arts);
                       flag=false;
                   }
            }
        }
        setLoaded(true);
        /*console.log(arts);
        //setArtists([...artists, arts[0]]);
        if(arts.length>0)
        setLoaded(true);
        console.log(artists);
        onArtistSelect(arts[0],1);
        onArtistSelect(arts[1],1);*/
        /*let i = 0;
        let id = setTimeout(function() {
            setArtists([...artists, arts[i]]);
            i++;
        }, 10000);*/
        /*setTimeout(function() {
            setArtists([...artists, arts[1]]);
        }, 10000);*/
        
        //setArtists([...artists, arts[2]]);
        /*json.profile.musicInterests.forEach(element => {
            console.log(element.path);

            let flag = true;

            while(flag)
            {
                console.log(element.name);
                //setArtistQuery(element.name);
                //console.log(artistQuery);
                //let cached = cachedSearches[element.name];

               // getArtistsForQuery(element.name, cached ? cached.wantedCount : 10, {...cachedSearches});
               // console.log(cachedSearches);
                flag=false;
            }
        
        });*/
        /*(artist => //artist.path === 'artists/3840';);
        {
            let flag = true;
            while(flag)
            {
                setArtistQuery(artist.name);
                let var2 = artistQuery.filter(q)
            }
        });
        console.log(var1);*/
    }

    useEffect(() => loadUser(), []);

    async function updateProfile() {
        console.log("gggggg");
        if (artists.length < 3) {
            setIsValidInterests(false);
            return;
        }
        console.log(artists);
        let locationPromise = new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(pos => resolve(pos), error => reject(error));
        });
        let location = await locationPromise;
    }

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
                    <button className="jam-submit-button" onClick={namesDone}>Next</button>
                </div>  
            </div>
        </div>
        ),
        (
            <div className="container-fluid g-0">
            <p className="jam-title-text">Favourite Instruments</p>
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

    
        loaded &&
          <div className="d-flex justify-content-center align-items-center">
          <div className="jam-form" style={formStyle}>
          <div className="container-fluid g-0">
                {!isValidInterests && <Alert style={alertStyle} variant="danger">Enter at least 3 artists</Alert>}
                {failMessage.length > 0 && <Alert style={alertStyle} variant="danger">{failMessage}</Alert>}
                <p className="jam-title-text">Favourite Artists</p>
                <DropdownField 
                    value={artistQuery}
                    onInput={setArtistQuery}
                    label="Add Favorite Artists:" 
                    type="text"
                    hasMore={cachedSearches[artistQuery] && cachedSearches[artistQuery].page < cachedSearches[artistQuery].totalPages}
                    onMore={moreEntries}
                    onSelect={onArtistSelect}
                    entries={artistQueryResults}/>
                <ul style={instrumentsListStyle}>
                    {artists.map(artist => (
                        <li className="removable-list-entry" key={artist.path}>
                            <div style={artistContainer}>
                                <img style={artistImageStyle} src={artist.thumb}/>
                                <div style={artistNameStyle}>{artist.name}</div>
                                <button style={artistButtonStyle} onClick={e => removeArtist(artist)}>x</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="row g-0">
                    <div className="col-4">
                        <button className="jam-submit-button" onClick={prevPage}>Back</button>
                    </div>
                    <div className="col-4"></div>
                    <div className="col-4">
                        <button className="jam-submit-button" onClick={updateProfile}>Apply Changes</button>
                    </div>  
                </div>
            </div> 
         
            </div>
            </div>
  
    );
};

export default UpdateProfile;