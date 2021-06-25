import './Log.css';

export function Log({log}) {
    const messages = log.map(entry => (<p className="Entry">{entry}</p>));

    return (
        <div className="Log">
            {messages}
        </div>
    );
}