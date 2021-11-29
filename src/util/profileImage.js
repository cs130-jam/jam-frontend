import { useEffect, useRef, useState } from "react";

const FALLBACK_IMG = "https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png";

const widthStyle = {
    width: "100%"
};

const heightStyle = {
    height: "100%"
};

const ProfileImage = (props) => {
    const ref = useRef();
    const [style, setStyle] = useState(heightStyle);

    const cropStyle = {
        maxWidth: props.size + "px",
        aspectRatio: "1",
        overflow: "hidden",
        margin: "0 auto",
        borderRadius: "10px",
        backgroundColor: "white",
        border: "1px solid rgba(0, 0, 0, 0.08)"
    };

    function _setStyle() {
        if (ref.current.width > ref.current.height) {
            setStyle(heightStyle);
        } else {
            setStyle(widthStyle);
        }
    }

    return (
        <div style={cropStyle}>
            <img
                key={props.timestamp}
                ref={ref}
                style={style}
                src={"http://localhost" + props.url}
                onLoad={_setStyle}
                onError={(e)=>{e.target.onerror = null; e.target.src=FALLBACK_IMG}}
                />
        </div>
    );
}

export default ProfileImage;