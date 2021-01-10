import Modal from 'react-modal';

export function Game({name, setName, game, setGame, step, setStep, options, updateOptions, updateLog,}) {
    function handleSubmit(ev) {
        ev.preventDefault();
        if (name !== '') {
            updateLog([`You have selected ${game}.`, `Your name is ${name}.`]);
            setStep(1);
            if (game === 'mt2e') {
                updateOptions({ rearrangeCharacteristics: true });
            } else {
                updateOptions({ rearrangeCharacteristics: false });
            }
        }
    }

    function handleSelectGame(ev) {
        setGame(ev.target.value);
    }

    function handleText(ev) {
        setName(ev.target.value);
    }

    return (
        <Modal
            isOpen={step===0}
            contentLabel="Select Game"
        >
            <form onSubmit={handleSubmit}>
                <label>Game:</label>
                <select name="Game" onChange={handleSelectGame}>
                    <option value="classic">Classic Traveller</option>
                    <option value="cepheusengine">Cepheus Engine</option>
                    <option value="mt2e">Mongoose Traveller 2nd Edition</option>
                </select>
                <label>Character Name:</label>
                <input type="text" value={name} onChange={handleText} />
                <input type="submit" value="Ok" />
            </form>
        </Modal>
    )
}