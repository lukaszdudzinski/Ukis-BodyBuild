import fs from 'fs';

async function testImport() {
    try {
        await import('./src/main.js');
        console.log("SUCCESS: main.js loaded successfully");
    } catch (e) {
        console.error("ERROR loading main.js:", e);
    }
}
testImport();
