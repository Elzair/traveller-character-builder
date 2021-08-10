import { open } from 'fs/promises';

async function scrapeFile(path) {
    let handle;
    let fileContents;

    try {
        handle = await open(path, 'r');
        let contents = await handle.readFile({ encoding: 'utf-8' });
        fileContents = contents.split('\n').map(line => line.split(' \t'));
    } catch (err) {
        console.error(err);
    } finally {
        await handle?.close();
    }

    return fileContents;
}

async function writeFile(path, contents) {
    let handle;

    try {
        handle = await open(path, 'w');
        await handle.writeFile(contents, { encoding: 'utf-8' });
    } catch (err) {
        console.error(err);
    } finally {
        await handle?.close();
    }
}

function expandChar(char) {
    switch (char) {
        case 'Str': return 'Strength';
        case 'Dex': return 'Dexterity';
        case 'End': return 'Endurance';
        case 'Int': return 'Intellect';
        case 'Edu': return 'Education';
        case 'Soc': return 'Social';
        default: throw new Error(`Invalid Characteristic: ${char}`);
    }
}

const DESCRIPTIONS = {
    "aerospace defense": 'Member of a planetary armed military force operating within a world\'s atmosphere and close orbit. Also known as the "planetary air force".',
    "agent": "Individual that secretly collects and reports information on the activities, movements and plans of a political or corporate enemy or competitor. Also known as a spy or intelligence operative.",
    "athlete": "Individual that has achieved celebrity status for their proficiency in sports and other forms of physical exercise.",
    "barbarian": "Individual from a primitive world (TL4 or less) capable of surviving on their world without support from a technologically advanced civilization.",
    "belter": "Individual that explores asteroid belts in search of mineral deposits and salvageable material for profit.",
    "bureaucrat": "Official in a government department, charged with following the details of administrative process.",
    "colonist": "Individual that moves to a new world or settles in a new planetary colony.",
    "diplomat": "Individual that is appointed by a planetary or interstellar government to conduct official negotiations and maintain political, economic and social relations with another polity or polities.",
    "drifter": "Individual that continually moves from place to place, without any fixed home or job.",
    "entertainer": "Individual that has achieved celebrity status for their proficiency in publicly entertaining others.",
    "hunter": "Individual that kills or traps large game, almost always large terrestrial mammals, for meat, other animal by-products (such as horn or bone), trophy or sport.",
    "marine": 'Member of an interstellar armed military force trained to serve in a variety of environments, often carried on board starships as an adjunct to an interstellar navy. Also known as the "space marines".',
    "maritime defense": 'Member of a planetary armed military force operating within and on the surface of a world\'s oceans. Also known as the "planetary wet navy".',
    "mercenary": "Professional soldier hired to serve in a foreign military force or perform a specific military action.",
    "merchant": "Individual involved in wholesale interstellar trade, particularly between individual worlds or polities.",
    "navy": 'Member of an interstellar armed military force that conducts military operations in interplanetary or interstellar space. Also known as the "space navy".',
    "noble": "Member of an elite upper class, having high social or political status.",
    "physician": "Individual that is skilled in the science of medicine and is trained and licensed to treat sick and injured people.",
    "pirate": "Individual that attacks and steals from interplanetary and interstellar ships in space.",
    "rogue": "Individual that makes their living through illicit means.",
    "scientist": "Individual that is engaged in and has expert knowledge of a science, especially a biological or physical science.",
    "scout": "Member of an interplanetary exploratory service, surveying unfamiliar territory in space.",
    "surface defense": 'Member of a planetary armed military force operating on the non-hydrographic surface of a world. Also known as the "planetary army".',
    "technician": "Individual that is skilled in mechanical or industrial techniques or in a particular technical field."
};

const DRAFT = {
    "aersospace defense": 1,
    "marine": 2,
    "maritime defense": 3,
    "navy": 4,
    "scout": 5,
    "surface defense": 6
};

function convert(contents) {
    // Initialize array with empty objects of the correct number of careers
    let careers = new Array(contents[0].length - 1);
    for (let i = 0; i < careers.length; i++) {
        careers[i] = {};
    }

    // Get career names & descriptions & draft number (-1 if unavailable)
    for (let i = 1; i < contents[0].length; i++) {
        const name = contents[0][i].toLowerCase();
        careers[i - 1].name = name;

        // Add career description
        careers[i - 1].description = DESCRIPTIONS.hasOwnProperty(name) ? DESCRIPTIONS[name] : "";

        // Add draft number
        careers[i - 1].draftNumber = DRAFT.hasOwnProperty(name) ? DRAFT[name] : -1;
    }

    // Get enlistment reqs
    for (let i = 1; i < contents[1].length; i++) {
        let quals = contents[1][i].split(' ');
        careers[i - 1].enlistment = {
            characteristic: expandChar(quals[0]),
            target: parseInt(quals[1].replace('+', '')) // Strip trailing '+' from target
        }
    }

    // Get survival reqs
    for (let i = 1; i < contents[2].length; i++) {
        let quals = contents[2][i].split(' ');
        careers[i - 1].survival = {
            characteristic: expandChar(quals[0]),
            target: parseInt(quals[1].replace('+', '')) // Strip trailing '+' from target
        }
    }

    // Get commision reqs (if no commission reqs, travellers get 2 skill rolls per term)
    for (let i = 1; i < contents[3].length; i++) {
        if (contents[3][i] === '—') {
            careers[i - 1].commission = null;
            careers[i - 1].numSkillsPerTerm = 2;
        } else {
            let quals = contents[3][i].split(' ');
            careers[i - 1].commission = {
                characteristic: expandChar(quals[0]),
                target: parseInt(quals[1].replace('+', '')) // Strip trailing '+' from target
            }
            careers[i - 1].numSkillsPerTerm = 1;
        }
    }

    // Get promotion reqs
    for (let i = 1; i < contents[4].length; i++) {
        if (contents[4][i] === '—') {
            careers[i - 1].promotion = null;
        } else {
            let quals = contents[4][i].split(' ');
            careers[i - 1].promotion = {
                characteristic: expandChar(quals[0]),
                target: parseInt(quals[1].replace('+', '')) // Strip trailing '+' from target
            }
        }
    }

    // Get re-enlistment reqs
    for (let i = 1; i < contents[5].length; i++) {
        careers[i - 1].reenlist = {
            target: parseInt(contents[5][i].replace('+', '')) // Strip trailing '+' from target
        }
    }

    // Get ranks and skills
    for (let i = 1; i < contents[7].length; i++) {
        careers[i - 1].ranks = [];

        if (contents[7][i] === '—') {
            careers[i - 1].ranks.push({ name: careers[i - 1].name });
            continue;
        }

        if (contents[7][i][0] === '[') { // No rank title
            let skill = contents[7][i].replace('[', '').replace(']', '').split('-');
            // console.log(skill);
            let value = parseInt(skill.pop());
            let name = skill.join('-');
            careers[i - 1].ranks.push({
                name: careers[i - 1].name,
                benefit: {
                    type: "SKILL",
                    name: name,
                    value: value
                }
            });
        } else { // Rank title specified
            // Rank has a skill benefit
            if (contents[7][i].includes('[')) {
                let line = contents[7][i].split(' ');

                // Find index of `line` array where the skill starts
                let idx = 0;
                for (idx = 0; idx < line.length; idx++) {
                    if (line[idx][0] === '[') {
                        break;
                    }
                }
                let title = line.slice(0, idx).join(' ');
                // let title = line.shift();
                let skill = line.slice(idx).join(' ').replace('[', '').replace(']', '').split('-');
                let value = parseInt(skill.pop());
                let name = skill.join('-'); // Needed for skills like 'Zero-G'
                careers[i - 1].ranks.push({
                    name: title,
                    benefit: {
                        type: "SKILL",
                        name: name,
                        value: value
                    }
                });
            } else {
                careers[i - 1].ranks.push({
                    name: contents[7][i]
                });
            }
        }
    }
    for (let j = 1; j <= 6; j++) {
        for (let i = 1; i < contents[7 + j].length; i++) {
            if (contents[7 + j][i] === '—') {
                continue;
            }

            if (contents[7 + j][i][0] === '[') { // No rank title
                let skill = contents[7 + j][i].replace('[', '').replace(']', '').split('-');
                // console.log(skill);
                let value = parseInt(skill.pop());
                let name = skill.join('-');
                careers[i - 1].ranks.push({
                    name: careers[i - 1].name,
                    benefit: {
                        type: "SKILL",
                        name: name,
                        value: value
                    }
                });
            } else { // Rank title specified
                // Rank has a skill benefit
                if (contents[7 + j][i].includes('[')) {
                    let line = contents[7 + j][i].split(' ');

                    // Find index of `line` array where the skill starts
                    let idx = 0;
                    for (idx = 0; idx < line.length; idx++) {
                        if (line[idx][0] === '[') {
                            break;
                        }
                    }
                    let title = line.slice(0, idx).join(' ');
                    // let title = line.shift();
                    let skill = line.slice(idx).join(' ').replace('[', '').replace(']', '').split('-');
                    let value = parseInt(skill.pop());
                    let name = skill.join('-'); // Needed for skills like 'Zero-G'
                    careers[i - 1].ranks.push({
                        name: title,
                        benefit: {
                            type: "SKILL",
                            name: name,
                            value: value
                        }
                    });
                } else {
                    careers[i - 1].ranks.push({
                        name: contents[7 + j][i]
                    });
                }
            }
        }
    }

    // Get material benefits
    for (let i = 0; i < careers.length; i++) {
        careers[i].benefits = [];
    }
    for (let j = 0; j < 7; j++) {
        for (let i = 1; i < contents[15+j].length; i++) {
            let benefit;
            let line = contents[15+j][i];

            if (line === '—') {
                benefit = {
                    type: 'NOTHING'
                };
            }
            else if (line === 'Low Passage') {
                benefit = {
                    type: 'ITEM',
                    name: line
                };
            } else if (line === 'Mid Passage') {
                benefit = {
                    type: 'ITEM',
                    name: line
                };
            } else if (line === 'High Passage') {
                benefit = {
                    type: 'ITEM',
                    name: line
                };
            } else if (line === 'Weapon') {
                benefit = {
                    type: 'WEAPON',
                    name: line
                };
            } else if (line === 'Mid Passage') {
                benefit = {
                    type: 'ITEM',
                    name: line
                };
            } else if (line === "Explorers' Society") {
                benefit = {
                    type: 'SPECIAL',
                    name: line
                };
            } else if (line === 'Courier Vessel') {
                benefit = {
                    type: 'SHIP',
                    name: line
                };
            } else if (line === 'Research Vessel') {
                benefit = {
                    type: 'SHIP',
                    name: line
                };
            } else if (line[0] === '+') {
                let char = line.replace('+', '').split(' ');
                benefit = {
                    type: 'CHARACTERISTIC',
                    name: expandChar(char[1]),
                    value: parseInt(char[0])
                };
            } else if (line.includes('Ship Share')) {
                let tmp = line.split(' ');
                let tmp2 = tmp[0].split('D');
                benefit = {
                    type: 'SHIPSHARE',
                    name: 'Ship Shares',
                    value: {
                        num: parseInt(tmp2[0]),
                        dice: parseInt(tmp2[1])
                    }
                }
            }

            careers[i - 1].benefits.push(benefit);
        }
    }

    // Get cash
    for (let i = 0; i < careers.length; i++) {
        careers[i].cash = [];
    }
    for (let j = 0; j < 7; j++) {
        for (let i = 1; i < contents[23+j].length; i++) {
            careers[i-1].cash.push(parseInt(contents[23+j][i]));
        }
    }

    // Get personal development skills
    for (let i = 0; i < careers.length; i++) {
        careers[i].pdt = [];
    }
    for (let j = 0; j < 6; j++) {
        for (let i = 1; i < contents[32 + j].length; i++) {
            let line = contents[32 + j][i];
            let skill;

            if (line[0] === '+') { // Characteristic
                let char = line.replace('+', '').split(' ');
                skill = {
                    type: 'CHARACTERISTIC',
                    name: expandChar(char[1]),
                    value: parseInt(char[0])
                }
            } else {
                skill = {
                    type: 'SKILL',
                    name: line,
                    value: 1
                }
            }

            careers[i-1].pdt.push(skill);
        }
    }

    // Get service skills
    for (let i = 0; i < careers.length; i++) {
        careers[i].sst = [];
    }
    for (let j = 0; j < 6; j++) {
        for (let i = 1; i < contents[39 + j].length; i++) {
            let line = contents[39 + j][i];
            let skill;

            if (line[0] === '+') { // Characteristic
                let char = line.replace('+', '').split(' ');
                skill = {
                    type: 'CHARACTERISTIC',
                    name: expandChar(char[1]),
                    value: parseInt(char[0])
                }
            } else {
                skill = {
                    type: 'SKILL',
                    name: line,
                    value: 1
                }
            }

            careers[i-1].sst.push(skill);
        }
    }

    // Get specialist skills
    for (let i = 0; i < careers.length; i++) {
        careers[i].spst = [];
    }
    for (let j = 0; j < 6; j++) {
        for (let i = 1; i < contents[46 + j].length; i++) {
            let line = contents[46 + j][i];
            let skill;

            if (line[0] === '+') { // Characteristic
                let char = line.replace('+', '').split(' ');
                skill = {
                    type: 'CHARACTERISTIC',
                    name: expandChar(char[1]),
                    value: parseInt(char[0])
                }
            } else {
                skill = {
                    type: 'SKILL',
                    name: line,
                    value: 1
                }
            }

            careers[i-1].spst.push(skill);
        }
    }

    // Get advanced education skills
    for (let i = 0; i < careers.length; i++) {
        careers[i].aet = [];
    }
    for (let j = 0; j < 6; j++) {
        for (let i = 1; i < contents[53 + j].length; i++) {
            let line = contents[53 + j][i];
            let skill;

            if (line[0] === '+') { // Characteristic
                let char = line.replace('+', '').split(' ');
                skill = {
                    type: 'CHARACTERISTIC',
                    name: expandChar(char[1]),
                    value: parseInt(char[0])
                }
            } else {
                skill = {
                    type: 'SKILL',
                    name: line,
                    value: 1
                }
            }

            careers[i-1].aet.push(skill);
        }
    }

    return careers;
}

let file1 = await scrapeFile('./career1.txt');
let file2 = await scrapeFile('./career2.txt');
let file3 = await scrapeFile('./career3.txt');
let file4 = await scrapeFile('./career4.txt');

let contents = convert(file1).concat(convert(file2), convert(file3), convert(file4));
await writeFile('./careers.json', JSON.stringify(contents, null, 4));
// console.log(file1);
// console.log(JSON.stringify(contents, null, 4));

