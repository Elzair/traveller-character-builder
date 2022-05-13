import React from 'react';
import { checkMT2E, findTerm } from './utils';

export function Education({ 
    game, 
    career, 
    updateCareer, 
    upp, 
    updateUPP, 
    skills, 
    updateSkills,
    skillList,
    updateSkillList,
    age, 
    // education, 
    // updateEducation, 
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
                skillList={skillList}
                updateSkillList={updateSkillList}
                age={age}
                // education={education}
                // updateEducation={updateEducation}
                onEducation={onEducation}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

// .##.....##.########..#######..########
// .###...###....##....##.....##.##......
// .####.####....##...........##.##......
// .##.###.##....##.....#######..######..
// .##.....##....##....##........##......
// .##.....##....##....##........##......
// .##.....##....##....#########.########

function EducationMT2E({ 
    career, 
    updateCareer, 
    upp, 
    updateUPP, 
    skills, 
    updateSkills, 
    skillList,
    updateSkillList,
    age, 
    // education, 
    // updateEducation, 
    onEducation, 
    updateLog 
}) {
    function educationDecision(ev) {
        ev.preventDefault();

        let decision = '';
        for (let t of ev.target) {
            if (t.checked) {
                decision = t.value;
            }
        }

        let roll;
        let newLog = [];
        let universityCareer = null;

        // Attempt entry into university
        if (decision === 'university') {
            // Traveller gets a -1 DM for each term after the first and a +1 if their Social is 9+.
            let dms = (findTerm(age)-1)*-1 + (upp.Social >= 9 ? 1 : 0);
            
            if (checkMT2E(7, upp, 'Education', null, null, dms).success) {
                newLog.push('Congratulations! You got into a university!');

                updateSkillList({
                    name: '',
                    list: [
                        'Admin',
                        'Advocate',
                        'Animals (Traning)',
                        'Animals (Veterinary)',
                        'Art (Performer)',
                        'Art (Holography)',
                        'Art (Instrument)',
                        'Art (Visual Media)',
                        'Art (Write)',
                        'Astrogation',
                        'Electronics (Comms)',
                        'Electronics (Computer',
                        'Electronics (Remote Ops)',
                        'Electronics (Sensors)',
                        'Engineer (M-drive)',
                        'Engineer (J-drive)',
                        'Engineer (Life Support)',
                        'Engineer (Power)',
                        'Language (Anglic)',
                        'Language (Vilani)',
                        'Language (Zdetl)',
                        'Language (Oynprith)',
                        'Medic',
                        'Navigation',
                        'Profession (Belter)',
                        'Profession (Biologicals)',
                        'Profession (Civil Engineering)',
                        'Profession (Construction)',
                        'Profession (Hydroponics)',
                        'Profession (Polymers)',
                        'Science (Archaeology)',
                        'Science (Astronomy)',
                        'Science (Biology)',
                        'Science (Chemistry)',
                        'Science (Cosmology)',
                        'Science (Cybernetics)',
                        'Science (Economics)',
                        'Science (Genetics)',
                        'Science (History)',
                        'Science (Linguistics)',
                        'Science (Philosophy)',
                        'Science (Physics)',
                        'Science (Planetology)',
                        'Science (Psionicology)',
                        'Science (Psychology)',
                        'Science (Robotics)',
                        'Science (Sophontology)',
                        'Science (Xenology)'
                    ],
                    values: [0, 1],
                    newSkills: {}
                });

                universityCareer = {
                    branch: 'university',
                    term: 0,
                    rank: null,
                    drafted: null,
                    rankPrev: null
                };

                // Increase Education by 1
                let newUPP = { ...upp };
                newUPP.Education += 1;
                updateUPP(newUPP);
            } else {
                newLog.push('Unfortunately, you did not qualify for university.');
                decision = 'career';
            }
        } else if (decision === 'army') {
            // Traveller gets a -2 DM for each term after the first one.
            let dms = (findTerm(age)-1)*-2;
            
            if (checkMT2E(8, upp, 'Endurance', null, null, dms).success) {
                universityCareer = {
                    branch: 'army-academy',
                    term: 0,
                    rank: null,
                    drafted: null,
                    rankPrev: null
                };

                newLog.push('Congratulations! You got into an army academy!');
            } else {
                newLog.push('Unfortunately, you did not qualify for an army academy.');
                decision = 'career';
            }
        } else if (decision === 'navy') {
            // Traveller gets a -2 DM for each term after the first one.
            let dms = (findTerm(age)-1)*-2;
            
            if (checkMT2E(9, upp, 'Intellect', null, null, dms).success) {
                universityCareer = {
                    branch: 'naval-academy',
                    term: 0,
                    rank: null,
                    drafted: null,
                    rankPrev: null
                };

                newLog.push('Congratulations! You got into a navy academy!');
            } else {
                newLog.push('Unfortunately, you did not qualify for a navy academy.');
                decision = 'career';
            }
        } else if (decision === 'marine') {
            // Traveller gets a -2 DM for each term after the first one.
            let dms = (findTerm(age)-1)*-2;
            
            if (checkMT2E(9, upp, 'Endurance', null, null, dms).success) {
                universityCareer = {
                    branch: 'marine-academy',
                    term: 0,
                    rank: null,
                    drafted: null,
                    rankPrev: null
                };

                newLog.push('Congratulations! You got into a marine academy!');
            } else {
                newLog.push('Unfortunately, you did not qualify for a marine academy.');
                decision = 'career';
            }
        }


        // Add university term to career list if traveller enrolled.
        if (universityCareer !== null) {
            let newCareer = [...career];
            newCareer.push(universityCareer);
            updateCareer(newCareer);
        }

        updateLog(newLog);
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