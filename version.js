const fs = require("fs");
const pkg = require("./public/version.json");

const version = {
    version: pkg.version
};

fs.writeFileSync("./public/version.json", JSON.stringify(version, null, 2));

console.log("Version updated:", version);