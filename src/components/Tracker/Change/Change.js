import React from 'react';

const Change = props => {
    return (
        <li>
            <div>{props.name}</div>
            <div>{props.type === 'loss' ? (
                <span className="loss"> -{props.mass} </span>
            ) : (
                <span className="gain">
                    +{props.mass}
                </span>
            )}</div>
        </li>
    );
}

export default Change;