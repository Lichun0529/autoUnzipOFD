const fs = require('fs');
const path = require('path');
const Seven = require('node-7z');
const { exec } = require('child_process');
const list = [];
async function scanFile() {
    const files = await fs.readdirSync('../'); // Get all files in the current directory
    for (const file of files) {
        if(file.endsWith('.ofd') && !list.includes(path.parse(file).name)){
            console.log(file);
            return file; // Return the first file with the '.ofd' extension
        }
    }
}

async function unzipFile(file) {
    const folderName = path.parse(file).name; // Get the file name without extension
    const targetPath = `../${folderName}`; // Create the target path to extract the contents
    fs.mkdirSync(targetPath, { recursive: true }); // Create the directory if it doesn't exist
    try {
        Seven.extractFull('../'+file, targetPath)
        list.push(folderName)
        // exec(`explorer.exe ${path.resolve(targetPath)}`);
    } catch (error) {
        console.log(error);
    }
}

function deleteFile(file) {
    try {
        fs.unlinkSync(file); // Delete the specified file
    } catch (error) {
        console.error("Error in deleting file:", error); // Log the error if deletion fails
    }
}

async function main() {
    while (true) {
        const zipFile = await scanFile();
        if (zipFile) {
            await unzipFile(zipFile);
            // deleteFile(zipFile); // Uncomment this line if you want to delete the original zip file after successful extraction
        }
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 1 second before scanning again
    }
}

main().catch((error) => {
    console.error("Error in the main function:", error);
});