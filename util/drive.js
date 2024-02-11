/* 
Google Drive API:
Demonstration to:
1. upload 
2. delete 
3. create public URL of a file.
required npm package: googleapis
*/
const { google } = require('googleapis');
const axios = require('axios');
const open = require('open');
// const path = require('path');
// const fs = require('fs');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';


const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || '';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

/* 
filepath which needs to be uploaded
Note: Assumes example.jpg file is in root directory, 
though this can be any filePath
*/
//const filePath = path.join(__dirname, 'MyPublicWiFi.exe');

 async function listFile() {
    try {
        const response = await drive.files.list({
            includeRemoved: false,
            spaces: 'drive',
            fileId: 'the-file-id-of-the-folder'
        })
           return response.data.files
        
    } catch (error) {
        console.log(error.message);
      }
}

export async function refToken() {
  //let offlineAccess = await signInResponse.grantOfflineAccess();

// Authorization code can be used to exchange for a refresh token
//let refreshAccessCode = offlineAccess.code;  
let tokenRequest = await axios.request({
    method: 'post',
    url: "https://www.googleapis.com/oauth2/v3/token",
    headers: {"content-type": "application/x-www-form-urlencoded"},
    params: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: "postmessage",
      grant_type: "authorization_code"
    }
 });

let googleOAuthToken = tokenRequest.data["refresh_token"];
console.log(googleOAuthToken);
}


// listFile()

export async function uploadFile(file) {
  try {
    //console.log(filePath, "fileeeee");
    const response = await drive.files.create({
      requestBody: {
        name: 'MyPublicWiFi.exe', //This can be name of your choice
        mimeType: 'application/octet-stream',
      },
      media: {
        mimeType: 'application/octet-stream',
        body: file,
      },
    });
    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
}

//uploadFile()
 export async function deleteFile(fid) {
  try {
    const response = await drive.files.delete({
      fileId: fid,
    });
    console.log(response.data, response.status);
  } catch (error) {
    console.log(error.message);
  }
}

// deleteFile();

export async function generatePublicUrl(fid) {
  try {
    //const fileId = '1MGJaqB-CffU5ahiuAnJF99lF4N-DSYrm';
    const fileId = fid;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    /* 
    webViewLink: View the file in browser
    webContentLink: Direct download link 
    */
    const result = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink, webContentLink',
    });
    await open(result.data.webContentLink)
  } catch (error) {
    console.log(error.message);
  }
}
// generatePublicUrl()

export default { listFile, generatePublicUrl, uploadFile }
// generatePublicUrl();