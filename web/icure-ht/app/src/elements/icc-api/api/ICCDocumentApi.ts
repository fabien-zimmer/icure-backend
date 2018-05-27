/**
 *
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0.2
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {XHR} from "./XHR"
import * as models from '../model/models';

export class iccDocumentApi {
    host: string
    headers: Array<XHR.Header>

    constructor(host: string, headers: any) {
        this.host = host
        this.headers = Object.keys(headers).map(k => new XHR.Header(k, headers[k]))
    }


    handleError(e: XHR.Data) {
        if (e.status == 401) throw Error('auth-failed')
        else throw Error('api-error' + e.status)
    }


    createDocument(body?: models.DocumentDto): Promise<models.DocumentDto | any> {
        let _body = null
        _body = body

        const _url = this.host + "/document" + "?ts=" + (new Date).getTime()

        return XHR.sendCommand('POST', _url, this.headers, _body)
            .then(doc => new models.DocumentDto(doc.body as JSON))
            .catch(err => this.handleError(err))


    }

    deleteAttachment(documentId: string): Promise<models.DocumentDto | any> {
        let _body = null


        const _url = this.host + "/document/{documentId}/attachment".replace("{documentId}", documentId + "") + "?ts=" + (new Date).getTime()

        return XHR.sendCommand('DELETE', _url, this.headers, _body)
            .then(doc => new models.DocumentDto(doc.body as JSON))
            .catch(err => this.handleError(err))


    }

    deleteDocument(documentIds: string): Promise<models.DocumentDto | any> {
        let _body = null


        const _url = this.host + "/document/{documentIds}".replace("{documentIds}", documentIds + "") + "?ts=" + (new Date).getTime()

        return XHR.sendCommand('DELETE', _url, this.headers, _body)
            .then(doc => new models.DocumentDto(doc.body as JSON))
            .catch(err => this.handleError(err))


    }

    findByHCPartyMessageSecretFKeys(hcPartyId?: string, secretFKeys?: string): Promise<Array<models.DocumentDto> | any> {
        let _body = null


        const _url = this.host + "/document/byHcPartySecretForeignKeys" + "?ts=" + (new Date).getTime() + (hcPartyId ? "&hcPartyId=" + hcPartyId : "") + (secretFKeys ? "&secretFKeys=" + secretFKeys : "")

        return XHR.sendCommand('GET', _url, this.headers, _body)
            .then(doc => (doc.body as Array<JSON>).map(it => new models.DocumentDto(it)))
            .catch(err => this.handleError(err))


    }

    findWithoutDelegation(limit?: number): Promise<Array<models.DocumentDto> | any> {
        let _body = null


        const _url = this.host + "/document/woDelegation" + "?ts=" + (new Date).getTime() + (limit ? "&limit=" + limit : "")

        return XHR.sendCommand('GET', _url, this.headers, _body)
            .then(doc => (doc.body as Array<JSON>).map(it => new models.DocumentDto(it)))
            .catch(err => this.handleError(err))


    }

    getAttachment(documentId: string, attachmentId: string, sfks?: string): Promise<Boolean | any> {
        let _body = null


        const _url = this.host + "/document/{documentId}/attachment/{attachmentId}".replace("{documentId}", documentId + "").replace("{attachmentId}", attachmentId + "") + "?ts=" + (new Date).getTime() + (sfks ? "&sfks=" + sfks : "")

        return XHR.sendCommand('GET', _url, this.headers, _body)
            .then(doc => true)
            .catch(err => this.handleError(err))


    }

    getDocument(documentId: string): Promise<models.DocumentDto | any> {
        let _body = null


        const _url = this.host + "/document/{documentId}".replace("{documentId}", documentId + "") + "?ts=" + (new Date).getTime()

        return XHR.sendCommand('GET', _url, this.headers, _body)
            .then(doc => new models.DocumentDto(doc.body as JSON))
            .catch(err => this.handleError(err))


    }

    modifyDocument(body?: models.DocumentDto): Promise<models.DocumentDto | any> {
        let _body = null
        _body = body

        const _url = this.host + "/document" + "?ts=" + (new Date).getTime()

        return XHR.sendCommand('PUT', _url, this.headers, _body)
            .then(doc => new models.DocumentDto(doc.body as JSON))
            .catch(err => this.handleError(err))


    }

    setAttachment(documentId: string, body?: Array<string>): Promise<models.DocumentDto | any> {
        let _body = null
        _body = body

        const _url = this.host + "/document/{documentId}/attachment".replace("{documentId}", documentId + "") + "?ts=" + (new Date).getTime()

        return XHR.sendCommand('PUT', _url, this.headers, _body)
            .then(doc => new models.DocumentDto(doc.body as JSON))
            .catch(err => this.handleError(err))


    }

    setAttachmentMulti(documentId: string, attachment?: Array<string>): Promise<models.DocumentDto | any> {
        let _body = null

        ;attachment && (_body = (_body || new FormData())).append('attachment', new Blob(attachment, {type: "application/octet-stream"}))
        const _url = this.host + "/document/{documentId}/attachment/multipart".replace("{documentId}", documentId + "") + "?ts=" + (new Date).getTime()

        return XHR.sendCommand('PUT', _url, this.headers, _body)
            .then(doc => new models.DocumentDto(doc.body as JSON))
            .catch(err => this.handleError(err))


    }
}

