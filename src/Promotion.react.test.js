import React from "react";
import renderer from 'react-test-renderer';
import { setValues } from './random';
import { Promotion } from "./Promotion";

test('Promotion renders nothing when `display` is false', () => {
    const game = 'classic';
    const upp = { Strength: 7, Dexterity: 7, Endurance: 7, Intellect: 7, Education: 7, Social: 7 };
    const updateUPP = () => { };
    const career = [];
    const updateCareer = () => { };
    const skills = {};
    const updateSkills = () => { };
    const cascadeSkill = null;
    const updateCascadeSkill = () => { };
    const display = false;
    const onSuccess = () => { };
    const updateLog = () => { };

    const component = renderer.create(
        // { game, upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, display, onSuccess, updateLog }
        <Promotion
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
test('Promotion renders PromotionCT when "classic" is selected and `display` is true', () => {
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
        <Promotion 
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

test('PromotionCT promotes with the proper roll', () => {
    setValues([5, 3]);
    const game = 'classic';
    const upp = {Strength: 7, Dexterity: 7, Endurance: 7, Intellect: 7, Education: 7, Social: 9};
    const updateUPP = () => {};
    let career = [{ branch: "marines", term: 1, rank: 1, drafted: false, rankPrev: 0 }];
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
        <Promotion 
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
    expect(log).toEqual(expect.arrayContaining(['Congratulations! You are now a Rank 2 Captain.']));
    expect(career).toEqual(expect.arrayContaining([expect.objectContaining({ branch: 'marines', term: 1, rank: 2, drafted: false, rankPrev: 0 })]));
});

test('PromotionCT fails promotion.', () => {
    setValues([5, 3]);
    const game = 'classic';
    const upp = {Strength: 7, Dexterity: 7, Endurance: 7, Intellect: 7, Education: 7, Social: 7};
    const updateUPP = () => {};
    let career = [{ branch: "marines", term: 1, rank: 1, drafted: false, rankPrev: 0 }];
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
        <Promotion 
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
    expect(log).toEqual(expect.arrayContaining(['Sorry, you failed to get a promotion in term 1.']));
    expect(career).toEqual(expect.arrayContaining([expect.objectContaining({ branch: 'marines', term: 1, rank: 1, drafted: false, rankPrev: 0 })]));
});