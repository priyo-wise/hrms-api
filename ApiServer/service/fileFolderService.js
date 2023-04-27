const path = require("path");
const { unlink } = require("fs/promises");

const deleteFile=async (file)=>{
    const fliePath = `${path.dirname(require.main.filename)}\\${file}`;
    await unlink(fliePath).catch(err=>{throw err;});
}
module.exports={
    deleteFile
}