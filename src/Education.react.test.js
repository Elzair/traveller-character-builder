import React, { useEffect } from "react";
import ReactDOM from 'react-dom/client';
import * as reactTestRenderer from 'react-test-renderer';
// import { cleanup, fireEvent, render } from '@testing-library/react';
import { setValues } from './random';
import { Education } from "./Education";

//Education({ game, career, updateCareer, upp, updateUPP, skills, updateSkills, skillList, updateSkillList, age,  display, onEducation, updateLog })
test('Education renders nothing when `display` is false', () => {
    const game = 'mt2e';
    const career = [];
    const updateCareer = () => {};
    const upp = {Strength: 7, Dexterity: 7, Endurance: 7, Intellect: 7, Education: 7, Social: 7};
    const updateUPP = () => {};
    const skills = {};
    const updateSkills = () => {};
    const skillList = [];
    const updateSkillList = () => {};
    const age = 18;
    const cascadeSkill = null;
    const updateCascadeSkill = () => {};
    const display = false;
    const onEducation = () => {};
    const updateLog = () => {};

    const component = reactTestRenderer.create(
        <Education 
            game={game} 
            career={career} 
            updateCareer={updateCareer} 
            upp={upp} 
            updateUPP={updateUPP} 
            skills={skills} 
            updateSkills={updateSkills}
            skillList = {skillList}
            updateSkillList={updateSkillList}
            age={age}
            display={display}
            onEducation={onEducation}
            updateLog={updateLog} 
        />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('EducationMT2E accepts someone into university.', () => {
    setValues([5]);
    const game = 'mt2e';
    const career = [];
    const updateCareer = () => {};
    const upp = {Strength: 7, Dexterity: 7, Endurance: 7, Intellect: 7, Education: 12, Social: 7};
    const updateUPP = () => {};
    const skills = {};
    const updateSkills = () => {};
    const skillList = [];
    const updateSkillList = () => {};
    const age = 18;
    const cascadeSkill = null;
    const updateCascadeSkill = () => {};
    const display = true;
    let decision = null;
    const onEducation = dec => decision = dec;
    let log = [];
    const updateLog = updated => log = log.concat(updated);

    const {queryByLabelText, queryByText} = render(
        <Education 
            game={game} 
            career={career} 
            updateCareer={updateCareer} 
            upp={upp} 
            updateUPP={updateUPP} 
            skills={skills} 
            updateSkills={updateSkills}
            skillList = {skillList}
            updateSkillList={updateSkillList}
            age={age}
            display={display}
            onEducation={onEducation}
            updateLog={updateLog} 
        />
    );

    // const {queryByLabelText, queryByText} = render(
    //     <Education 
    //         game={game} 
    //         career={career} 
    //         updateCareer={updateCareer} 
    //         upp={upp} 
    //         updateUPP={updateUPP} 
    //         skills={skills} 
    //         updateSkills={updateSkills}
    //         skillList = {skillList}
    //         updateSkillList={updateSkillList}
    //         age={age}
    //         display={display}
    //         onEducation={onEducation}
    //         updateLog={updateLog} 
    //     />
    // );

    // // console.log(queryByText(/Submit/));
    
    // fireEvent.click(queryByLabelText(/University/));
    // fireEvent.click(queryByText(/Submit/));

    // expect(decision).toEqual('university');
    expect(career).toEqual(expect.arrayContaining([expect.objectContaining({ branch: 'university', term: 0, rank: null, drafted: null, rankPrev: null})]));
    expect(upp.Education).toEqual(13);
});