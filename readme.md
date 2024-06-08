# PhotoPrism JS SDK

an unofficial JavaScript SDK for the PhotoPrism API


## Usage

```bash
npm install photoprism-sdk
```

```javascript
import { PhotoPrism } from 'photoprism-sdk';

// init instance
const photoprism = new Photoprism("http://localhost:2342", "admin", "insecure")

// get albums
const albums = await photoprism.getAlbums()

// create album
const album = await photoprism.createAlbum({ Title: "test" })


// upload file in album
const uploadFile = createReadStream(__dirname + "/sample.png")
let upload = await photoprism.uploadPhotoToAlbum([album.UID!], uploadFile)
```

more use cases can be found in the [test](tests)

## LICENSE
[MIT](LICENSE)