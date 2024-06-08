import { Photoprism } from "../src";
import { test, expect } from "@jest/globals";

import { createReadStream } from "fs";

test('can create Photoprism instance', () => {
    const photoprism = new Photoprism("http://localhost:2342", "admin", "insecure")
    expect(photoprism).toBeInstanceOf(Photoprism)
})


test('can generate token', async () => {
    const photoprism = new Photoprism("http://localhost:2342", "admin", "insecure")
    const token = await photoprism.getToken()
    expect(token.length).toEqual(48)
})


// TODO: This test need to check
test('wrong password cannot generate token', async () => {
    const photoprism = new Photoprism("http://localhost:2342", "admin", "wrongpassword")
    await expect(photoprism.getToken()).rejects.toThrow()
})

test('can get albums', async () => {
    const photoprism = new Photoprism("http://localhost:2342", "admin", "insecure")
    const albums = await photoprism.getAlbums()
    expect(albums).toBeInstanceOf(Array)
})

test('can create album', async () => {
        
    const photoprism = new Photoprism("http://localhost:2342", "admin", "insecure")
    const album = await photoprism.createAlbum({ Title: "test" })

    expect(album).toBeInstanceOf(Object)
    expect(album.Title).toEqual("test")
})

test("can upload photo into album", async () => {

    const photoprism = new Photoprism("http://localhost:2342", "admin", "insecure")
    const album = await photoprism.createAlbum({ Title: "test-upload2" })

    const uploadFile = createReadStream(__dirname + "/sample.png")
    
    let upload = await photoprism.uploadPhotoToAlbum([album.UID!], uploadFile)

    expect(upload).toBe(true)
},5000)