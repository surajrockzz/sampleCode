const fs = require('fs');
const _ = require('lodash');

// Function to read JSON objects from a file
function readJsonObjectsFromFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return data.split('\n').filter(line => line.trim() !== '').map(line => JSON.parse(line));
}

// Function to compare two JSON objects and print differences
function compareJsonObjects(obj1, obj2, path = '') {
    const differences = [];
    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    keys.forEach(key => {
        const fullPath = path ? `${path}.${key}` : key;
        if (!obj2.hasOwnProperty(key)) {
            differences.push(`Key '${fullPath}' is missing in the second object`);
        } else if (!obj1.hasOwnProperty(key)) {
            differences.push(`Key '${fullPath}' is missing in the first object`);
        } else if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
            differences.push(...compareJsonObjects(obj1[key], obj2[key], fullPath));
        } else if (obj1[key] !== obj2[key]) {
            differences.push(`Key '${fullPath}' has different values: '${obj1[key]}' vs '${obj2[key]}'`);
        }
    });

    return differences;
}

// Main function to compare JSON files
function compareJsonFiles(file1, file2) {
    const jsonObjects1 = readJsonObjectsFromFile(file1);
    const jsonObjects2 = readJsonObjectsFromFile(file2);

    if (jsonObjects1.length !== jsonObjects2.length) {
        console.log('The files have different number of JSON objects');
        return;
    }

    for (let i = 0; i < jsonObjects1.length; i++) {
        const differences = compareJsonObjects(jsonObjects1[i], jsonObjects2[i]);
        if (differences.length > 0) {
            console.log(`Differences in object ${i + 1}:`);
            differences.forEach(diff => console.log(diff));
        } else {
            console.log(`Object ${i + 1} is identical in both files`);
        }
    }
}

// Replace 'file1.json' and 'file2.json' with the paths to your JSON files
compareJsonFiles('file1.jsonl', 'file2.jsonl');
