import React from "react";
import renderer from 'react-test-renderer';
import { setValues } from './random';
import { Commission } from "./Commission";

test('Commission renders nothing when `display` is false', () => {
    const game = 'classic';
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

    const component = renderer.create(
        // { game, upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, display, onSuccess, updateLog }
        <Commission 
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

// ..######..##..........###.....######...######..####..######.
// .##....##.##.........##.##...##....##.##....##..##..##....##
// .##.......##........##...##..##.......##........##..##......
// .##.......##.......##.....##..######...######...##..##......
// .##.......##.......#########.......##.......##..##..##......
// .##....##.##.......##.....##.##....##.##....##..##..##....##
// ..######..########.##.....##..######...######..####..######.
test('Commission renders CommissionCT when "classic" is selected and `display` is true', () => {
    const game = 'classic';
    const upp = {Strength: 7, Dexterity: 7, Endurance: 7, Intellect: 7, Education: 7, Social: 7};
    const updateUPP = () => {};
    const career = [];
    const updateCareer = () => {};
    const skills = {};
    const updateSkills = () => {};
    const cascadeSkill = null;
    const updateCascadeSkill = () => {};
    const display = true;
    const onSuccess = () => {};
    const updateLog = () => {};

    const component = renderer.create(
        <Commission 
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

test('CommissionCT commmissions with the proper roll', () => {
    setValues([5, 4]);
    const game = 'classic';
    const upp = {Strength: 7, Dexterity: 7, Endurance: 7, Intellect: 7, Education: 7, Social: 9};
    const updateUPP = () => {};
    let career = [{ branch: "navy", term: 1, rank: 0, drafted: false, rankPrev: 0 }];
    const updateCareer = updated => career = updated;
    const skills = {};
    const updateSkills = () => {};
    const cascadeSkill = null;
    const updateCascadeSkill = () => {};
    const display = true;
    let success = false;
    const onSuccess = (isSuccess, _) => success = isSuccess;
    let log = [];
    const updateLog = (updated) => log = log.concat(updated);

    const component = renderer.create(
        <Commission 
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
    tree.props.onSubmit({ preventDefault: ()=>{} }); // Needed for ev.preventDefault();

    expect(success).toBeTruthy();
    expect(log).toEqual(expect.arrayContaining(['Congratulations! You are now a Rank 1 Ensign.']));
    expect(career).toEqual(expect.arrayContaining([expect.objectContaining({ branch: 'navy', term: 1, rank: 1, drafted: false, rankPrev: 0 })]));
});

test('CommissionCT fails commmission.', () => {
    setValues([6, 3]);
    const game = 'classic';
    const upp = {Strength: 7, Dexterity: 7, Endurance: 7, Intellect: 7, Education: 7, Social: 8};
    const updateUPP = () => {};
    let career = [{ branch: "navy", term: 1, rank: 0, drafted: false, rankPrev: 0 }];
    const updateCareer = updated => career = updated;
    const skills = {};
    const updateSkills = () => {};
    const cascadeSkill = null;
    const updateCascadeSkill = () => {};
    const display = true;
    let success = false;
    const onSuccess = (isSuccess, _) => success = isSuccess;
    let log = [];
    const updateLog = (updated) => log = log.concat(updated);

    const component = renderer.create(
        <Commission 
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
    tree.props.onSubmit({ preventDefault: ()=>{} }); // Needed for ev.preventDefault();

    expect(success).toBeFalsy();
    expect(log).toEqual(expect.arrayContaining(['Sorry, you failed to get a commission in term 1.']));
    expect(career).toEqual(expect.arrayContaining([expect.objectContaining({ branch: 'navy', term: 1, rank: 0, drafted: false, rankPrev: 0 })]));
});

// ..######..########.########..##.....##.########.##.....##..######.
// .##....##.##.......##.....##.##.....##.##.......##.....##.##....##
// .##.......##.......##.....##.##.....##.##.......##.....##.##......
// .##.......######...########..#########.######...##.....##..######.
// .##.......##.......##........##.....##.##.......##.....##.......##
// .##....##.##.......##........##.....##.##.......##.....##.##....##
// ..######..########.##........##.....##.########..#######...######.

test('Commission renders CommissionCE when "cepheus" is selected and `display` is true', () => {
    const game = 'cepheus';
    const upp = {Strength: 7, Dexterity: 7, Endurance: 7, Intellect: 7, Education: 7, Social: 7};
    const updateUPP = () => {};
    const career = [];
    const updateCareer = () => {};
    const skills = {};
    const updateSkills = () => {};
    const cascadeSkill = null;
    const updateCascadeSkill = () => {};
    const display = true;
    const onSuccess = () => {};
    const updateLog = () => {};

    const component = renderer.create(
        <Commission 
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