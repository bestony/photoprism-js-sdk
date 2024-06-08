import axios from 'axios'
import dayjs from 'dayjs'
import FormData from 'form-data'

import { Album } from './types'
import { ReadStream } from 'fs'


export class Photoprism {
    // PhotoPrism API Endpoint, like http://localhost:2342
    private endpoint: string
    // Photoprism API Username
    private username: string
    // Photoprism API Password
    private password: string
    // Photoprism API Token, private
    private token: string

    // PhotoPrism API Token Expiry Time
    private token_expiry_time: Date

    // Photoprism user_id
    private user_id: string

    constructor(endpoint: string, username: string, password: string) {
        this.endpoint = endpoint
        this.username = username
        this.password = password
        this.token = ""
        this.user_id = ""
        this.token_expiry_time = new Date()
    }

    public async getToken(): Promise<string> {

        if (this.token != "") {
            return this.token
        }

        let data = JSON.stringify({
            "username": this.username,
            "password": this.password,
            "code": ""
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.endpoint}/api/v1/session`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        let response = await axios.request(config)

        var now = dayjs()
        this.token_expiry_time = now.add(response.data.expires_in, 'second').toDate()
        this.token = response.data.access_token
        this.user_id = response.data.user.UID

        return this.token
    }


    public async getAlbums(count: Number = 24, offset: Number = 0, type: string = "album"): Promise<Album[] | null> {
        let token = await this.getToken();

        let query_object = { count: count.toString(), offset: offset.toString(), type }
        let query_string = new URLSearchParams(query_object).toString()

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${this.endpoint}/api/v1/albums?${query_string}`,
            headers: {
                'X-Auth-Token': token
            }
        };

        let response = await axios.request(config)


        return response.data
    }

    public async createAlbum(album: Album): Promise<Album> {
        let token = await this.getToken();
        let data = JSON.stringify(album);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.endpoint}/api/v1/albums`,
            headers: {
                'X-Auth-Token': token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        let response = await axios.request(config)

        return response.data
    }

    public async uploadPhotoToAlbum(albumUIDs: Array<string>, photo: ReadStream): Promise<Boolean> {
        let data = new FormData();

        data.append('files', photo);
        const uploadId = (Math.random() + 1).toString(36).substring(6)

        let url = `${this.endpoint}/api/v1/users/${this.user_id}/upload/${uploadId}`


        // Upload TO Server
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'X-Auth-Token': this.token,
                ...data.getHeaders()
            },
            data: data
        };

        let response = await axios.request(config)

        // Add To Album
        let alter_data = JSON.stringify({
            "albums": albumUIDs
        });
        
        let alter_config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'X-Auth-Token': this.token,
                'Content-Type': 'application/json'
            },
            data: alter_data
        };
        let alter_response = await axios.request(alter_config)
        
        return true
    }
}