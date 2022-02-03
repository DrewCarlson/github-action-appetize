const core = require('@actions/core');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const baseUrl = 'https://TOKEN@api.appetize.io/v1/apps'

const uploadToAppetize = (input) => {
  const { token, publicKey, fileUrl, platform } = input;
  const postfix = (publicKey && publicKey.length > 0) ? `/${publicKey}` : ``;
  const url = `${baseUrl.replace('TOKEN', token)}${postfix}`;
  const stream = fs.createReadStream(fileUrl);
  const formData = new FormData();
  formData.append('platform', platform);
  formData.append('file', stream);
  axios.post(url, formData, {
    'maxBodyLength': Infinity,
    headers: Object.assign({ Accept: 'application/json, text/plain, */*' }, formData.getHeaders())
  }).then(response => {
      if (response.status == 200) {
        console.log('Success')
        core.setOutput('appetize_public_key', response.data.publicKey)
      } else {
        response.text().then(text => console.error({ 'error': text }));
        throw new Error(`RequestError (${response.status}) : ${response.statusText}`);
      }
    }).catch(error => {
      console.error(error.message);
      core.setFailed(error.message);
    });
};

try {
  const token = core.getInput('APPETIZE_TOKEN');
  const publicKey = core.getInput('PUBLICKEY');
  const fileUrl = core.getInput('FILE_URL');
  const platform = core.getInput('PLATFORM');
  uploadToAppetize({ token, publicKey, fileUrl, platform });
} catch (error) {
  core.setFailed(error.message);
}

