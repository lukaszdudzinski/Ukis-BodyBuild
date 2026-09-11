import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

// Replace SVG thumbnails with images or emojis
content = content.replace(
    /<div style="width: 64px; height: 64px; background-color: #2C2C2E; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #636366;">\s*<svg[^>]*>.*?<\/svg>\s*<\/div>/,
    `<div style="width: 64px; height: 64px; background-color: #2C2C2E; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 32px;">🍝</div>`
);
content = content.replace(
    /<div style="width: 64px; height: 64px; background-color: #2C2C2E; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #636366;">\s*<svg[^>]*>.*?<\/svg>\s*<\/div>/,
    `<div style="width: 64px; height: 64px; background-color: #2C2C2E; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 32px;">🥞</div>`
);

// Add labels to bar chart
const chartOld = `    <!-- Simple CSS Bar Chart Placeholder -->
    <div style="flex: 1; background-color: #FF9800; border-radius: 6px 6px 0 0; height: 35%; opacity: 0.6;"></div>
    <div style="flex: 1; background-color: #FF9800; border-radius: 6px 6px 0 0; height: 50%; opacity: 0.8;"></div>
    <div style="flex: 1; background-color: #FF9800; border-radius: 6px 6px 0 0; height: 75%; opacity: 0.9;"></div>
    <div style="flex: 1; background-color: #FF9800; border-radius: 6px 6px 0 0; height: 100%;"></div>
    <div style="flex: 1; background-color: #FF9800; border-radius: 6px 6px 0 0; height: 45%; opacity: 0.7;"></div>
    <div style="flex: 1; background-color: #FF9800; border-radius: 6px 6px 0 0; height: 85%; opacity: 0.9;"></div>
    <div style="flex: 1; background-color: #FF9800; border-radius: 6px 6px 0 0; height: 60%; opacity: 0.8;"></div>`;

const chartNew = `    <!-- Simple CSS Bar Chart Placeholder with Labels -->
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%; gap: 4px;">
        <span style="color: #888; font-size: 10px;">1945</span>
        <div style="width: 100%; background-color: #FF9800; border-radius: 6px 6px 0 0; height: 35%; opacity: 0.6;"></div>
    </div>
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%; gap: 4px;">
        <span style="color: #888; font-size: 10px;">2724</span>
        <div style="width: 100%; background-color: #FF9800; border-radius: 6px 6px 0 0; height: 50%; opacity: 0.8;"></div>
    </div>
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%; gap: 4px;">
        <span style="color: #888; font-size: 10px;">2740</span>
        <div style="width: 100%; background-color: #FF9800; border-radius: 6px 6px 0 0; height: 75%; opacity: 0.9;"></div>
    </div>
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%; gap: 4px;">
        <span style="color: #FF9800; font-size: 10px; font-weight: bold;">3466</span>
        <div style="width: 100%; background-color: #FF9800; border-radius: 6px 6px 0 0; height: 100%;"></div>
    </div>
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%; gap: 4px;">
        <span style="color: #888; font-size: 10px;">1986</span>
        <div style="width: 100%; background-color: #FF9800; border-radius: 6px 6px 0 0; height: 45%; opacity: 0.7;"></div>
    </div>
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%; gap: 4px;">
        <span style="color: #888; font-size: 10px;">3002</span>
        <div style="width: 100%; background-color: #FF9800; border-radius: 6px 6px 0 0; height: 85%; opacity: 0.9;"></div>
    </div>
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%; gap: 4px;">
        <span style="color: #888; font-size: 10px;">2866</span>
        <div style="width: 100%; background-color: #FF9800; border-radius: 6px 6px 0 0; height: 60%; opacity: 0.8;"></div>
    </div>`;

content = content.replace(chartOld, chartNew);
fs.writeFileSync('index.html', content);
console.log('Fixed diet chart and thumbnails');
