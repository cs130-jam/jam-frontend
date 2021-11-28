const textareaStyle = {
    height: "calc(100% - 45px)"
};

const InputTextarea = (props) => {
    return (
        <div style={props.style ? props.style : {}}>
            <label className="jam-form-label">{props.label}</label>
            <textarea 
                className="jam-form-input" 
                style={textareaStyle}
                type={props.type}
                value={props.value} 
                onInput={e => props.onInput(e.target.value)}/>
        </div>
    );
}

export default InputTextarea;