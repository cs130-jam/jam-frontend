import React, {useState, useRef,useEffect} from 'react';
import InputField from '../util/inputField';
import ErrorInputField from '../util/errorInputField';
import '../App.css';
import DropdownField from '../util/dropdownField';
import useInterval from '../util/useInterval';
import { Alert } from 'react-bootstrap';
import InputTextarea from '../util/inputTextarea';
import FileUpload from '../util/imageUpload';
import { useHistory } from 'react-router';

const FALLBACK_IMG = "https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png";

const no_op = () => {};

const bioStyle = {
    height: "100%",
    maxHeight: "340px",
    marginBottom: "8px"
};

const titleStyle = {
    marginBottom: "8px",
    fontSize: "22pt"
};

const topButtonStyle = {
    marginTop: "auto",
    marginBottom: "0px"
};

const buttonsContainer = {
    display: "flex",
    flexDirection: "column"
};

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

const jamForm = {
    width: "800px"
};

const pfpWidthStyle = {
    width: "100%"
};

const pfpHeightStyle = {
    height: "100%"
};

const cropStyle = {
    maxWidth: "340px",
    aspectRatio: "1",
    overflow: "hidden",
    margin: "0 auto",
    borderRadius: "10px",
    backgroundColor: "white",
    border: "1px solid rgba(0, 0, 0, 0.08)"
};

const centeredStyle = {
    maxWidth: "340px",
    margin: "4px auto"
};

const redButtonStyle = {
    backgroundColor: "rgb(235, 94, 94)",
    marginTop: "6px"
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
    const [isFriend, setIsFriend] = useState(false);

    const [instruments, setInstruments] = useState([]);
    const [filteredInstruments, setFilteredInstruments] = useState([]);
    const [filteredWantedInstruments, setFilteredWantedInstruments] = useState([]);
    const [instQuery, setInstQuery] = useState("");
    const [wantedInstQuery, setWantedInstQuery] = useState("");

    const [cachedSearches, setCachedSearches] = useState({});
    const [artistQueryResults, setArtistQueryResults] = useState([]);
    const [artistQuery, setArtistQuery] = useState("");
    const [isValidInterests, setIsValidInterests] = useState(true);

    const [pfpTimestamp, setPfpTimestamp] = useState(Date.now());
    const [pfpStyle, _setPfpStyle] = useState(pfpHeightStyle);
    const pfpRef = useRef();

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

    function setBio(_bio) {
        setProfile({...profile, bio: _bio});
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

        if (!isCurrentUser) {
            let friendsResponse = await apiService.getFriendIds();
            if (friendsResponse.ok) {
                let friendIds = await friendsResponse.json();
                setIsFriend(friendIds.includes(pathUserId));
            }
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

        let profileCopy = {...profile};
        delete profileCopy["pfpUrl"];
        let response = await apiService.updateProfile(profileCopy);
        if (!response.ok) return;

        preferences.maxDistance.value = parseInt(preferences.maxDistance.value); 
        response = await apiService.updatePreferences(preferences);
        if (!response.ok) return;
    }

    async function uploadPfp(pfpForm) {
        let response = await apiService.uploadPfp(pfpForm);
        await new Promise(resolve => setTimeout(resolve, 5000));
        await loadUser();
        setPfpTimestamp(Date.now());
        return response;
    }

    function setPfpStyle() {
        if (pfpRef.current.width > pfpRef.current.height) {
            _setPfpStyle(pfpHeightStyle);
        } else {
            _setPfpStyle(pfpWidthStyle);
        }
    }

    async function addFriend() {
        if (isCurrentUser) return;
        let response = await apiService.friend(pathUserId);
        if (!response.ok) return;
        window.alert("Friend request sent!");
        loadUser();
    }

    async function removeFriend() {
        if (isCurrentUser) return;
        if (!window.confirm(`Are you sure you want to unfriend ${profile.firstName} ${profile.lastName}?`)) return;
        let response = await apiService.unFriend(pathUserId);
        if (!response.ok) return;
        loadUser();
    }

    async function sendMessage() {
        if (isCurrentUser) return;
        let response = await apiService.getCurrentUserChatroom(pathUserId);   
        if (!response.ok) return;
        let json = await response.json();
        history.push(`/chatrooms/${json.roomId}`);
    }

    return (loaded &&
        <div className="d-flex justify-content-center align-items-center">
            <div className="jam-form" style={jamForm}>
                <div className="container-fluid g-0">
                    <p className="jam-title-text" style={titleStyle}>User Profile</p>
                    <div className="row">
                        <div className="col-6">
                            <div style={centeredStyle}>
                                <div style={cropStyle}>
                                    <img 
                                        ref={pfpRef}
                                        style={pfpStyle}
                                        key={pfpTimestamp}
                                        src={"http://localhost" + profile.pfpUrl}
                                        onLoad={setPfpStyle}
                                        onError={(e)=>{e.target.onerror = null; e.target.src=FALLBACK_IMG}}
                                        />
                                </div>
                                {isCurrentUser && <FileUpload 
                                    postUpload={uploadPfp}
                                    getAccepted={apiService.getSupportedPfpFormats.bind(apiService)}/>}
                            </div>
                        </div>
                        <div style={buttonsContainer} className="col-6">
                            <InputTextarea style={bioStyle} value={profile.bio} onInput={isCurrentUser ? setBio : no_op} label="Biography:" type="text"/>
                            {!isCurrentUser && <button style={topButtonStyle} onClick={sendMessage} className="jam-submit-button">Send Message</button>}
                            {!isFriend && !isCurrentUser && <button style={{marginTop: "6px"}} onClick={addFriend} className="jam-submit-button">Add Friend</button>}
                            {isFriend && <button style={redButtonStyle} onClick={removeFriend} className="jam-submit-button">Remove Friend</button>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <ErrorInputField
                                value={profile.firstName}
                                onInput={isCurrentUser ? setFirstName : no_op}
                                label="First Name: " 
                                type="text"
                                isError={profile.firstName.length === 0}
                                message="First name is required"/>
                        </div>
                        <div className="col-6">
                            <InputField value={profile.lastName} onInput={isCurrentUser ? setLastName : no_op} label="Last Name:" type="text"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            {!isCurrentUser && <label className="jam-form-label">Known Instruments:</label>}
                            {isCurrentUser && <DropdownField 
                                value={instQuery}
                                onInput={setInstQuery}
                                label="Known Instruments:" 
                                type="text"
                                hasMore={false}
                                onSelect={onInstrumentSelect}
                                entries = {filteredInstruments.map(inst => {return {
                                    name: inst, 
                                    html: (<span>{inst}</span>)
                                }})}/>}
                            <ul style={instrumentsListStyle}>
                                {profile.instruments.map(instrument => (
                                    <li className="removable-list-entry" key={instrument}>
                                        <span>{instrument}</span>
                                        {isCurrentUser && <button onClick={e => removeInstrument(instrument)}>x</button>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-6">
                            {!isValidInterests && <Alert style={alertStyle} variant="danger">Enter at least 3 artists</Alert>}
                            {!isCurrentUser && <label className="jam-form-label">Favorite Artists:</label>}
                            {isCurrentUser && <DropdownField 
                                value={artistQuery}
                                onInput={setArtistQuery}
                                label="Favorite Artists:" 
                                type="text"
                                hasMore={cachedSearches[artistQuery] && cachedSearches[artistQuery].page < cachedSearches[artistQuery].totalPages}
                                onMore={moreEntries}
                                onSelect={onArtistSelect}
                                entries={artistQueryResults}/>}
                            <ul style={instrumentsListStyle}>
                                {profile.musicInterests.map(artist => (
                                    <li className="removable-list-entry" key={artist.path}>
                                        <div style={artistContainer}>
                                            <img style={artistImageStyle} src={artist.thumb}/>
                                            <div style={artistNameStyle}>{artist.name}</div>
                                            {isCurrentUser && <button style={artistButtonStyle} onClick={e => removeArtist(artist)}>x</button>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {isCurrentUser && <div className="row">
                        <div className="col-6">
                            <ErrorInputField 
                                value={preferences.maxDistance.value}
                                onInput={setMaxDistance}
                                label="Max Match Distance (Miles): " 
                                type="text" 
                                isError={maxDistanceError()}
                                message={maxDistanceErrorMessage()}/>
                        </div>
                        <div className="col-6">
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
                        </div>
                    </div>}
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