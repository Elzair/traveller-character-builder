export function Career({game, step, setStep, career, updateCareer, upp, setUPP }) {
    if (game === 'classic') {
        return (<CareerCT step={step} setStep={setStep} career={career} updateCareer={updateCareer} upp={upp} setUpp={setUPP} />);
    } else {
        return (<div></div>);
    }
}



function CareerCT({step, setStep, career, updateCareer, upp, setUpp }) {
    function selectCareer(ev) {
        ev.preventDefault();
        for (let c of ev.target) {
            if (c.checked) {
                updateCareer({branch: c.value, terms: 0, rank: 0});
                setStep(3);
            }
        }
    }

    if (step === 2) {
        return (
            <form onSubmit={selectCareer}>
                <p>Select Career: </p>
                <input type="radio" id="car1" name="career" value="navy"/> <label for="car1">Navy</label>
                <input type="radio" id="car2" name="career" value="marines"/> <label for="car2">Marines</label>
                <input type="radio" id="car3" name="career" value="army"/> <label for="car3">Army</label>
                <input type="radio" id="car4" name="career" value="scouts"/> <label for="car4">Scouts</label>
                <input type="radio" id="car5" name="career" value="merchants"/> <label for="car5">Merchants</label>
                <input type="radio" id="car6" name="career" value="other"/> <label for="car6">Other</label>
                <input type="submit" value="Submit" />
            </form>
        );
    }

    return (<div></div>);
}
