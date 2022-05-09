import React, { useEffect } from "react";
import * as reactTestRenderer from 'react-test-renderer';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { setValues } from './random';
import { Draft } from "./Draft";

test('Draft renders nothing when `display` is false', () => {
    const game = 'cepheus';
    const upp = {Strength: 7, Dexterity: 7, Endurance: 7, Intellect: 7, Education: 7, Social: 7};
    const updateUPP = () => {};
    const career = [];
    const updateCareer = () => {};
    const skills = {};
    const updateSkills = () => {};
    const cascadeSkill = null;
    const updateCascadeSkill = () => {};
    const display = false;
    const onSuccess = () => {};
    const updateLog = () => {};

    const component = reactTestRenderer.create(
        // { game, upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, display, onSuccess, updateLog }
        <Draft 
            game={game} 
            upp={upp} 
            updateUPP={updateUPP} 
            career={career} 
            updateCareer={updateCareer} 
            skills={skills} 
            updateSkills={updateSkills}
            cascadeSkill={cascadeSkill}
            updateCascadeSkill={updateCascadeSkill}
            display={display}
            onSuccess={onSuccess}
            updateLog={updateLog} 
        />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('DraftCT drafts someone', () => {
    setValues([2])
    const game = 'classic';
    const upp = {Strength: 7, Dexterity: 7, Endurance: 7, Intellect: 7, Education: 7, Social: 7};
    const updateUPP = () => {};
    let career = [];
    const updateCareer = newCareer => career = newCareer;
    let skills = {};
    const updateSkills = updated => { skills = { ...skills, ...updated}; };
    const cascadeSkill = null;
    const updateCascadeSkill = () => {};
    const display = true;
    let casc = true;
    const onDraft = success => casc = success;
    let log = [];
    const updateLog = updated => log = log.concat(updated);

    const _ = render(
        // { game, upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, display, onSuccess, updateLog }
        <Draft 
            game={game} 
            upp={upp} 
            updateUPP={updateUPP} 
            career={career} 
            updateCareer={updateCareer} 
            skills={skills} 
            updateSkills={updateSkills}
            cascadeSkill={cascadeSkill}
            updateCascadeSkill={updateCascadeSkill}
            display={display}
            onDraft={onDraft}
            updateLog={updateLog} 
        />
    );

    expect(casc).toBeFalsy();
    expect(log).toEqual(expect.arrayContaining(['You were drafted into the Marines.', 'Because of your rank, you gain Cutlass-1.']));
    expect(career).toHaveLength(1);
    expect(career[0]).toEqual(expect.objectContaining({ branch: 'marines', term: 0, rank: 0, drafted: true, rankPrev: 0}));
    expect(skills).toEqual(expect.objectContaining({ 'Cutlass': 1}));
});