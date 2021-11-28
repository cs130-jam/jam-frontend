const InputTextarea = (props) => {
    return (
        <div>
            <label className="jam-form-label">{props.label}</label>
            <textarea 
                className="jam-form-input" 
                type={props.type}
                value={props.value} 
                onInput={e => props.onInput(e.target.value)}/>
        </div>
    );
}

export default InputTextarea;