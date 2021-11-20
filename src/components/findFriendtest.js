const {useState, useEffect} = React;

const users = [{profile:{firstName: "Steve",lastName: "kim",}, bio: "yo this is my bio"}
, {profile:{firstName: "Bill",lastName: "kim",}, bio: "yo this is my bio"}
, {profile:{firstName: "Sara",lastName: "kim",}, bio: "yo this is my bio"}];
const Example = () => {
  const [selected, setSelected] = useState(0);
  
  const handleAssigneeOnClick = () => {
    setSelected(prev => {
      if (prev === users.length - 1) {
        return 0;
      } else {
        return prev + 1;
      }
    });
  };
   
  return (
    <div onClick={handleAssigneeOnClick}>
      <p>{users[selected]}</p>
    </div>
  )
}

ReactDOM.render(<Example />, document.getElementById('root'));