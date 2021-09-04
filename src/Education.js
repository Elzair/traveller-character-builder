import React from 'react';
import { checkMT2E } from './utils';

export function Education({ 
    game, 
    career, 
    updateCareer, 
    upp, 
    updateUPP, 
    skills, 
    updateSkills, 
    term, 
    education, 
    updateEducation, 
    display, 
    onEducation, 
    updateLog 
}) {
    if (display && game === 'mt2e') {
        return (
            <EducationMT2E
                career={career}
                updateCareer={updateCareer}
                upp={upp}
                updateUPP={updateUPP}
                skills={skills}
                updateSkills={updateSkills}
                term={term}
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

function EducationMT2E({ career, updateCareer, upp, updateUPP, skills, updateSkills, term, education, updateEducation, onEducation, updateLog }) {
    function educationDecision(ev) {
        ev.preventDefault();

        let decision = '';
        for (let t of ev.target) {
            if (t.checked) {
                decision = t.value;
            }
        }

        let roll;

        // Attempt entry into university
        if (decision === 'university') {
            // 
            roll = checkMT2E(7, upp, 'Education', null, null, )
        }

        onEducation(decision);
    }

    return (
        <form className="MT2EEducation" onSubmit={educationDecision}>
            <p>Do you want to further your education or start a career?</p>
            <label><input type="radio" id="education-university" name="education" value="university" />University</label>
            <label><input type="radio" id="education-army" name="education" value="army" />Army Academy</label>
            <label><input type="radio" id="education-navy" name="education" value="navy" />Navy Academy</label>
            <label><input type="radio" id="education-marine" name="education" value="marine" />Marine Academy</label>
            <label><input type="radio" id="education-career" name="education" value="career" />Start Career</label>
            <input className="Submit" type="submit" value="Submit" />
        </form>
    );
}