const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcImagePath = 'C:/Users/dell/.gemini/antigravity/brain/59d483fb-f796-4701-b178-aa0bf65642ad/medical_crescent_tooth_nurse_1788086254792.jpg';
const destDir = 'C:/Users/dell/Desktop/dental-quiz-app/public';

async function generateIcons() {
  try {
    // Check if sharp is installed, else install it
    
    // Generate icon-192.png
    await sharp(srcImagePath)
      .resize(192, 192)
      .toFormat('png')
      .toFile(path.join(destDir, 'icons', 'icon-192.png'));
    console.log('Created icon-192.png');

    // Generate icon-512.png
    await sharp(srcImagePath)
      .resize(512, 512)
      .toFormat('png')
      .toFile(path.join(destDir, 'icons', 'icon-512.png'));
    console.log('Created icon-512.png');

    // Generate favicon.png
    await sharp(srcImagePath)
      .resize(32, 32)
      .toFormat('png')
      .toFile(path.join(destDir, 'favicon.png'));
    console.log('Created favicon.png');

    // Also copy favicon.png to favicon.ico for basic fallback
    fs.copyFileSync(path.join(destDir, 'favicon.png'), path.join(destDir, 'favicon.ico'));
    console.log('Copied to favicon.ico');

  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
