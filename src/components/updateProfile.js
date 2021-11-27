import React, {useState, useRef,useEffect} from 'react';
import InputField from '../util/inputField';
import ErrorInputField from '../util/errorInputField';
import '../App.css';
import DropdownField from '../util/dropdownField';
import useInterval from '../util/useInterval';
import { Alert } from 'react-bootstrap';
import useStateRef from '../util/useStateRef';
import { useHistory } from "react-router-dom";

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

const ARTIST_SEARCH_DELAY = 1000; // every second
const MIN_ARTIST_SEARCH_LEN = 2;

const UpdateProfile = (props) => {
    const apiService = props.apiService;
    const currentUser = props.currentUser;
    const pathUserId = props.match.params.userId ? props.match.params.userId : props.currentUser.id;
    const isCurrentUser = currentUser.id === pathUserId;
    const history = useHistory();

    const [loaded, setLoaded] = useState(false);
    const [profile, setProfile] = useState({});
    const [preferences, setPreferences] = useState({})

    const [instruments, setInstruments] = useState([]);
    const [filteredInstruments, setFilteredInstruments] = useState([]);
    const [filteredWantedInstruments, setFilteredWantedInstruments] = useState([]);
    const [instQuery, setInstQuery] = useState("");
    const [wantedInstQuery, setWantedInstQuery] = useState("");

    const [cachedSearches, setCachedSearches] = useState({});
    const [artistQueryResults, setArtistQueryResults] = useState([]);
    const [artistQuery, setArtistQuery] = useState("");
    const [isValidInterests, setIsValidInterests] = useState(true);

    function matchingPrefixIgnoreCase(prefix, entries) {
        prefix = prefix.toLowerCase();
        return entries.filter(entry => {
            const compareLength = Math.min(prefix.length, entry.length);
            return prefix.substring(0, compareLength) === entry.substring(0, compareLength).toLowerCase();
        });
    }
    
    function setFirstName(name) {
        setProfile({...profile, firstName: name});
    }

    function setLastName(name) {
        setProfile({...profile, lastName: name});
    }

    function setMaxDistance(dst) {
        setPreferences({...preferences, maxDistance: {units: "Miles", value: dst}});
    }

    function getFilteredInstruments(query) {
        return matchingPrefixIgnoreCase(query, instruments);
    }
    useEffect(() => {
        setFilteredInstruments(getFilteredInstruments(instQuery));
    }, [instQuery, instruments]);

    function getFilteredWantedInstruments(query) {
        return matchingPrefixIgnoreCase(query, instruments);
    }
    useEffect(() => {
        setFilteredWantedInstruments(getFilteredWantedInstruments(wantedInstQuery));
    }, [wantedInstQuery, instruments]);

    function onInstrumentSelect(instrument) {
        if (profile.instruments.includes(instrument.name)) return;
        setProfile({...profile, instruments: [...profile.instruments, instrument.name]});
    }

    function onWantedInstrumentSelect(instrument) {
        if (preferences.wantedInstruments.includes(instrument.name)) return;
        setPreferences({...preferences, wantedInstruments: [...preferences.wantedInstruments, instrument.name]});
    }

    async function getInstruments() {
        let response = await apiService.getInstruments();
        let json = await response.json();
        setInstruments(json);
    }
    useEffect(() => getInstruments(), []);

    function removeInstrument(instrument) {
        setProfile({...profile, instruments: profile.instruments.filter(filteredInstrument => filteredInstrument !== instrument)});
    }

    function removeWantedInstrument(instrument) {
        setPreferences({...preferences, wantedInstruments: preferences.wantedInstruments.filter(wantedInstruments => wantedInstruments !== instrument)});
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
        let response = await apiService.findArtists(query, page);
        let json = await response.json();
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

    function onArtistSelect(entry) {
        if (profile.musicInterests.length >= 2) setIsValidInterests(true);
        setProfile({...profile, musicInterests: [...profile.musicInterests, entry.content]});
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
    }, [artistQuery, cachedSearches]);

    function moreEntries() {
        let cached = cachedSearches[artistQuery];
        if (!cached) return;

        getArtistsForQuery(artistQuery, cached.wantedCount + 10, {...cachedSearches});
    }

    function removeArtist(removeEntry) {
        setProfile({...profile, musicInterests: profile.musicInterests.filter(artist => artist.path !== removeEntry.path)});
    }

    function maxDistanceError() {
        return !/^[-\d]+$/.test(preferences.maxDistance.value) || parseInt(preferences.maxDistance.value) <= 0;
    }

    function maxDistanceErrorMessage() {
        if (!(/^[-\d]+$/.test(preferences.maxDistance.value))) {
            return "Must be a number";
        } else if (parseInt(preferences.maxDistance.value) <= 0) {
            return "Must be greater than 0";
        }
    }

    async function loadUser() {
        if (!currentUser.id) return;
        let response = await (isCurrentUser ? apiService.getCurrentUser() : apiService.getUser(pathUserId));
        
        if (!response.ok) return;
        let json = await response.json();

        setProfile(json.profile);
        if (isCurrentUser) {
            setPreferences(json.preferences);
        }
        setLoaded(true);
    }
    useEffect(() => loadUser(), [currentUser]);

    async function updateProfile() {
        if (!isCurrentUser) return;
        if (profile.musicInterests.length < 3) {
            setIsValidInterests(false);
            return;
        }
        if (maxDistanceError()) return;

        delete profile["pfpUrl"];
        let response = await apiService.updateProfile(profile);
        if (!response.ok) return;

        preferences.maxDistance.value = parseInt(preferences.maxDistance.value); 
        response = await apiService.updatePreferences(preferences);
        if (!response.ok) return;
    }

    return (loaded &&
        <div className="d-flex justify-content-center align-items-center">
            <div className="jam-form">
                <div className="container-fluid g-0">
                    <p className="jam-title-text">{profile.firstName + " " + profile.lastName}</p>
                    <ErrorInputField 
                        value={profile.firstName}
                        onInput={setFirstName}
                        label="First Name: " 
                        type="text" 
                        isError={profile.firstName.length === 0}
                        message="First name is required"/>
                    <InputField value={profile.lastName} onInput={setLastName} label="Last Name:" type="text" />
                    <br/>
                    <DropdownField 
                        value={instQuery}
                        onInput={setInstQuery}
                        label="Known Instruments:" 
                        type="text"
                        hasMore={false}
                        onSelect={onInstrumentSelect}
                        entries = {filteredInstruments.map(inst => {return {
                            name: inst, 
                            html: (<span>{inst}</span>)
                        }})}/>
                    <ul style={instrumentsListStyle}>
                        {profile.instruments.map(instrument => (
                            <li className="removable-list-entry" key={instrument}>
                                <span>{instrument}</span>
                                <button onClick={e => removeInstrument(instrument)}>x</button>
                            </li>
                        ))}
                    </ul>
                    <br/>   
                    {!isValidInterests && <Alert style={alertStyle} variant="danger">Enter at least 3 artists</Alert>}
                    <DropdownField 
                        value={artistQuery}
                        onInput={setArtistQuery}
                        label="Favorite Artists:" 
                        type="text"
                        hasMore={cachedSearches[artistQuery] && cachedSearches[artistQuery].page < cachedSearches[artistQuery].totalPages}
                        onMore={moreEntries}
                        onSelect={onArtistSelect}
                        entries={artistQueryResults}/>
                    <ul style={instrumentsListStyle}>
                        {profile.musicInterests.map(artist => (
                            <li className="removable-list-entry" key={artist.path}>
                                <div style={artistContainer}>
                                    <img style={artistImageStyle} src={artist.thumb}/>
                                    <div style={artistNameStyle}>{artist.name}</div>
                                    <button style={artistButtonStyle} onClick={e => removeArtist(artist)}>x</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {isCurrentUser && <>
                        <br/>
                        <ErrorInputField 
                            value={preferences.maxDistance.value}
                            onInput={setMaxDistance}
                            label="Max Match Distance (Miles): " 
                            type="text" 
                            isError={maxDistanceError()}
                            message={maxDistanceErrorMessage()}/>
                        <DropdownField 
                            value={wantedInstQuery}
                            onInput={setWantedInstQuery}
                            label="Wanted Instruments (Empty for any):" 
                            type="text"
                            hasMore={false}
                            onSelect={onWantedInstrumentSelect}
                            entries = {filteredWantedInstruments.map(inst => {return {
                                name: inst, 
                                html: (<span>{inst}</span>)
                            }})}/>
                        <ul style={instrumentsListStyle}>
                            {preferences.wantedInstruments.map(instrument => (
                                <li className="removable-list-entry" key={instrument}>
                                    <span>{instrument}</span>
                                    <button onClick={e => removeWantedInstrument(instrument)}>x</button>
                                </li>
                            ))}
                        </ul>
                    </>}
                    {isCurrentUser && <>
                        <br/>
                        <div className="row g-0">
                            <button className="jam-submit-button" onClick={updateProfile}>Apply Changes</button>
                        </div>
                    </>}
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;