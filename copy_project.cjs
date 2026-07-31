const fs = require('fs');
const path = require('path');

function copyProject(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    fs.cpSync(src, dest, {
        recursive: true,
        filter: (source) => {
            const basename = path.basename(source);
            if (['node_modules', '.git', 'dist', 'build', '.env'].includes(basename)) {
                return false; // Skip these folders/files
            }
            return true;
        }
    });
}

try {
    console.log("Copying Frontend...");
    copyProject("c:\\projects\\LeavePortal", "C:\\prem\\leave_project");
    
    console.log("Copying Backend...");
    copyProject("c:\\projects\\backend_leaveportal", "C:\\prem\\backend");
    
    console.log("Copy completed successfully!");
} catch (err) {
    console.error("Error during copy:", err);
}
