# Upload app to Appetize action

Upload or delete applications on [Appetize.io](https://appetize.io).

## Inputs

| key            | description                                                          | required |
| -------------- | -------------------------------------------------------------------- | -------- |
| APPETIZE_TOKEN | Appetize API token.                                                  | o        |
| PUBLIC_KEY     | App public key. If empty, a new app will be created.                 | x        |
| FILE_URL       | Url or local file path of your app binary.                           | o        |
| APPETIZE_TOKEN | Platform of the app (ios or android).                                | o        |
| ACTION         | Leave blank to upload or 'delete' to delete the app at `PUBLIC_KEY`. | o        |

## Example usage

For security, it is strongly recommended to use secrets for `APPETIZE_TOKEN`.

To upload an app:

```
uses: DrewCarlson/github-action-appetize@main
name: Upload to Appetize
with:
    APPETIZE_TOKEN: ${{ secrets.APPETIZE_TOKEN }}
    PUBLIC_KEY: "public_key"
    FILE_URL: /path/to/application.apk
    PLATFORM: "android"
```

To delete an app:

```
uses: DrewCarlson/github-action-appetize@main
name: Delete from Appetize
with:
    APPETIZE_TOKEN: ${{ secrets.APPETIZE_TOKEN }}
    PUBLIC_KEY: "public_key"
    ACTION: "delete"
```

## Output

| key                 | description                         |
| ------------------- | ----------------------------------- |
| appetize_public_key | The public key of the uploaded app. |

## Development

Build: `yarn run build`

Format: `yarn prettier --write .`
