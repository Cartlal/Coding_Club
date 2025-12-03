
const fs = require('fs');

try {
    let content;
    try {
        content = fs.readFileSync('new_members.js', 'utf16le');
        if (!content.includes('mockMembers')) {
            throw new Error('Not utf16le');
        }
    } catch (e) {
        content = fs.readFileSync('new_members.js', 'utf8');
    }

    const match = content.match(/export const mockMembers = (\[[\s\S]*?\]);/);
    if (match) {
        const arrayStr = match[1];
        const members = eval(arrayStr);
        console.log(JSON.stringify(members, null, 2));
    } else {
        console.error("Could not find mockMembers array");
        process.exit(1);
    }
} catch (e) {
    console.error(e);
    process.exit(1);
}
