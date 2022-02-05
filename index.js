const core = require('@actions/core')
const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')

const baseUrl = 'https://TOKEN@api.appetize.io/v1/apps'

const uploadToAppetize = (input) => {
  const { token, publicKey, fileUrl, platform } = input
  const postfix = publicKey && publicKey.length > 0 ? `/${publicKey}` : ``
  const url = `${baseUrl.replace('TOKEN', token)}${postfix}`
  var body
  var headers = { Accept: 'application/json, text/plain, */*' }
  if (fileUrl.startsWith('http')) {
    body = { url: fileUrl, platform: platform }
    headers = Object.assign(headers, { 'Content-Type': 'application/json' })
  } else {
    const stream = fs.createReadStream(fileUrl)
    const formData = new FormData()
    formData.append('platform', platform)
    formData.append('file', stream)
    body = formData
    headers = Object.assign(headers, formData.getHeaders())
  }
  axios
    .post(url, body, { maxBodyLength: Infinity, headers: headers })
    .then((response) => {
      if (response.status == 200) {
        console.log('Success')
        core.setOutput('appetize_public_key', response.data.publicKey)
      } else {
        response.text().then((text) => console.error({ error: text }))
        throw new Error(
          `RequestError (${response.status}) : ${response.statusText}`
        )
      }
    })
    .catch((error) => {
      console.error(error.message)
      core.setFailed(error.message)
    })
}

const deleteFromAppetize = (input) => {
  if (publicKey && publicKey.length > 0) {
    const url = `${baseUrl.replace('TOKEN', token)}/${publicKey}`
    axios
      .delete(url)
      .then((response) => {
        if (response.status == 200) {
          console.log('Success')
          core.setOutput('appetize_public_key', publicKey)
        } else {
          throw new Error(
            `Failed to delete '${publicKey}': ${response.status} ${response.statusText}`
          )
        }
      })
      .catch((error) => {
        console.error(error.message)
        core.setFailed(error.message)
      })
  } else {
    throw new Error('PUBLIC_KEY must contain a valid public key')
  }
}

try {
  const token = core.getInput('APPETIZE_TOKEN')
  const publicKey = core.getInput('PUBLIC_KEY')
  const fileUrl = core.getInput('FILE_URL')
  const platform = core.getInput('PLATFORM')
  const action = core.getInput('ACTION')
  if (action && action.toLowerCase() == 'delete') {
    deleteFromAppetize({ token, publicKey })
  } else {
    uploadToAppetize({ token, publicKey, fileUrl, platform })
  }
} catch (error) {
  core.setFailed(error.message)
}
