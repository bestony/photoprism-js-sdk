# PhotoPrism JS SDK

an unofficial JavaScript SDK for the [PhotoPrism](https://www.photoprism.app/) API


## Usage

```bash
npm install photoprism
```

```javascript
import { PhotoPrism } from 'photoprism';

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
