import React from 'react';

export function Education({ game, career, updateCareer, upp, updateUPP, skills, updateSkills, education, updateEducation, display, onEducation, updateLog }) {
    if (display && game === 'mt2e') {
        return (
            <EducationMT2E
                career={career}
                updateCareer={updateCareer}
                upp={upp}
                updateUPP={updateUPP}
                skills={skills}
                updateSkills={updateSkills}
                education={education}
                updateEducation={updateEducation}
                onEducation={onEducation}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function EducationMT2E({ career, updateCareer, upp, updateUPP, skills, updateSkills, education, updateEducation, onEducation, updateLog }) {
    function educationDecision(ev) {
        ev.preventDefault();

        let decision = '';
        for (let t of ev.target) {
            if (t.checked) {
                decision = t.value;
            }
        }

        // Attempt entry into university
        if (decision === 'university') {
            
        }

        onEducation(decision);
    }

    return (
        <form className="MT2EEducation" onSubmit={educationDecision}>
            <p>Do you want to further your education or start a career?</p>
            <label><input type="radio" id="education-university" name="education" value="university" />University</label>
            <label><input type="radio" id="education-army" name="education" value="army" />Army Academy</label>
            <label><input type="radio" id="education-navy" name="education" value="navy" />Navy Academy</label>
            <label><input type="radio" id="education-marine" name="education" value="navy" />Marine Academy</label>
            <label><input type="radio" id="education-career" name="education" value="career" />Start Career</label>
            <input className="Submit" type="submit" value="Submit" />
        </form>
    );
}