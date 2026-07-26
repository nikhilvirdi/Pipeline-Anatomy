const fs = require('fs');
const path = require('path');

const darkPath = 'c:/Pipeline Anatomy/icons/githubLogoDarkTheme.png';
const lightPath = 'c:/Pipeline Anatomy/icons/githubLogoLightTheme.png';

console.log('Dark logo size:', fs.statSync(darkPath).size);
console.log('Light logo size:', fs.statSync(lightPath).size);
