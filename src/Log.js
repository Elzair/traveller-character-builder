import './Log.css';

export function Log({log}) {
    let messages = [];
    for (let entry of log) {
        messages.push(<p className="Entry">{entry}</p>);
    }

    return (
        <div className="Log">
            {messages}
        </div>
    );
}