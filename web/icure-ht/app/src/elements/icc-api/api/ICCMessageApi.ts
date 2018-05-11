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

export class iccMessageApi {
    host : string
    headers : XHR.Header
    constructor(host: string, headers: any) {
        this.host = host
        this.headers = new XHR.Header('Authorization',headers.Authorization)
    }


    handleError(e: XHR.Data) {
        if (e.status == 401) throw Error('auth-failed')
        else throw Error('api-error'+ e.status)
    }


    createMessage(body?: models.MessageDto) : Promise<models.MessageDto|any> {
        let _body = null
        _body = body
        
        const _url = this.host+"/message" + "?ts=" + (new Date).getTime() 

        return XHR.sendCommand('POST', _url , [this.headers], _body )
                .then(doc =>  new models.MessageDto(doc.body as JSON))
                .catch(err => this.handleError(err))


    }
    deleteDelegation(messageId: string, delegateId: string) : Promise<models.MessageDto|any> {
        let _body = null
        
        
        const _url = this.host+"/message/{messageId}/delegate/{delegateId}".replace("{messageId}", messageId+"").replace("{delegateId}", delegateId+"") + "?ts=" + (new Date).getTime() 

        return XHR.sendCommand('DELETE', _url , [this.headers], _body )
                .then(doc =>  new models.MessageDto(doc.body as JSON))
                .catch(err => this.handleError(err))


    }
    deleteMessages(messageIds: string) : Promise<Boolean|any> {
        let _body = null
        
        
        const _url = this.host+"/message/{messageIds}".replace("{messageIds}", messageIds+"") + "?ts=" + (new Date).getTime() 

        return XHR.sendCommand('DELETE', _url , [this.headers], _body )
                .then(doc => true)
                .catch(err => this.handleError(err))


    }
    deleteMessagesBatch(body?: models.ListOfIdsDto) : Promise<Boolean|any> {
        let _body = null
        _body = body
        
        const _url = this.host+"/message/delete/byIds" + "?ts=" + (new Date).getTime() 

        return XHR.sendCommand('POST', _url , [this.headers], _body )
                .then(doc => true)
                .catch(err => this.handleError(err))


    }
    findByHCPartyPatientSecretFKeys(secretFKeys?: string) : Promise<Array<models.MessageDto>|any> {
        let _body = null
        
        
        const _url = this.host+"/message/byHcPartySecretForeignKeys" + "?ts=" + (new Date).getTime()  + (secretFKeys ? "&secretFKeys=" + secretFKeys : "")

        return XHR.sendCommand('GET', _url , [this.headers], _body )
                .then(doc => (doc.body as Array<JSON>).map(it=>new models.MessageDto(it)))
                .catch(err => this.handleError(err))


    }
    findMessages(startKey?: string, startDocumentId?: string, limit?: number) : Promise<models.MessagePaginatedList|any> {
        let _body = null
        
        
        const _url = this.host+"/message" + "?ts=" + (new Date).getTime()  + (startKey ? "&startKey=" + startKey : "") + (startDocumentId ? "&startDocumentId=" + startDocumentId : "") + (limit ? "&limit=" + limit : "")

        return XHR.sendCommand('GET', _url , [this.headers], _body )
                .then(doc =>  new models.MessagePaginatedList(doc.body as JSON))
                .catch(err => this.handleError(err))


    }
    findMessagesByFromAddress(fromAddress?: string, startKey?: string, startDocumentId?: string, limit?: number) : Promise<models.MessagePaginatedList|any> {
        let _body = null
        
        
        const _url = this.host+"/message/byFromAddress" + "?ts=" + (new Date).getTime()  + (fromAddress ? "&fromAddress=" + fromAddress : "") + (startKey ? "&startKey=" + startKey : "") + (startDocumentId ? "&startDocumentId=" + startDocumentId : "") + (limit ? "&limit=" + limit : "")

        return XHR.sendCommand('GET', _url , [this.headers], _body )
                .then(doc =>  new models.MessagePaginatedList(doc.body as JSON))
                .catch(err => this.handleError(err))


    }
    findMessagesByToAddress(toAddress?: string, startKey?: string, startDocumentId?: string, limit?: number, reverse?: boolean) : Promise<models.MessagePaginatedList|any> {
        let _body = null
        
        
        const _url = this.host+"/message/byToAddress" + "?ts=" + (new Date).getTime()  + (toAddress ? "&toAddress=" + toAddress : "") + (startKey ? "&startKey=" + startKey : "") + (startDocumentId ? "&startDocumentId=" + startDocumentId : "") + (limit ? "&limit=" + limit : "") + (reverse ? "&reverse=" + reverse : "")

        return XHR.sendCommand('GET', _url , [this.headers], _body )
                .then(doc =>  new models.MessagePaginatedList(doc.body as JSON))
                .catch(err => this.handleError(err))


    }
    findMessagesByTransportGuid(transportGuid?: string, startKey?: string, startDocumentId?: string, limit?: number) : Promise<models.MessagePaginatedList|any> {
        let _body = null
        
        
        const _url = this.host+"/message/byTransportGuid" + "?ts=" + (new Date).getTime()  + (transportGuid ? "&transportGuid=" + transportGuid : "") + (startKey ? "&startKey=" + startKey : "") + (startDocumentId ? "&startDocumentId=" + startDocumentId : "") + (limit ? "&limit=" + limit : "")

        return XHR.sendCommand('GET', _url , [this.headers], _body )
                .then(doc =>  new models.MessagePaginatedList(doc.body as JSON))
                .catch(err => this.handleError(err))


    }
    getChildren(messageId: string) : Promise<Array<models.MessageDto>|any> {
        let _body = null
        
        
        const _url = this.host+"/message/{messageId}/children".replace("{messageId}", messageId+"") + "?ts=" + (new Date).getTime() 

        return XHR.sendCommand('GET', _url , [this.headers], _body )
                .then(doc => (doc.body as Array<JSON>).map(it=>new models.MessageDto(it)))
                .catch(err => this.handleError(err))


    }
    getMessage(messageId: string) : Promise<models.MessageDto|any> {
        let _body = null
        
        
        const _url = this.host+"/message/{messageId}".replace("{messageId}", messageId+"") + "?ts=" + (new Date).getTime() 

        return XHR.sendCommand('GET', _url , [this.headers], _body )
                .then(doc =>  new models.MessageDto(doc.body as JSON))
                .catch(err => this.handleError(err))


    }
    listMessagesByInvoiceIds(body?: models.ListOfIdsDto) : Promise<Array<models.MessageDto>|any> {
        let _body = null
        _body = body
        
        const _url = this.host+"/message/byInvoiceId" + "?ts=" + (new Date).getTime() 

        return XHR.sendCommand('POST', _url , [this.headers], _body )
                .then(doc => (doc.body as Array<JSON>).map(it=>new models.MessageDto(it)))
                .catch(err => this.handleError(err))


    }
    modifyMessage(body?: models.MessageDto) : Promise<models.MessageDto|any> {
        let _body = null
        _body = body
        
        const _url = this.host+"/message" + "?ts=" + (new Date).getTime() 

        return XHR.sendCommand('PUT', _url , [this.headers], _body )
                .then(doc =>  new models.MessageDto(doc.body as JSON))
                .catch(err => this.handleError(err))


    }
    newDelegations(messageId: string, body?: Array<models.DelegationDto>) : Promise<models.MessageDto|any> {
        let _body = null
        _body = body
        
        const _url = this.host+"/message/{messageId}/delegate".replace("{messageId}", messageId+"") + "?ts=" + (new Date).getTime() 

        return XHR.sendCommand('PUT', _url , [this.headers], _body )
                .then(doc =>  new models.MessageDto(doc.body as JSON))
                .catch(err => this.handleError(err))


    }
    setMessagesStatusBits(status: number, body?: models.ListOfIdsDto) : Promise<Array<models.MessageDto>|any> {
        let _body = null
        _body = body
        
        const _url = this.host+"/message/status/{status}".replace("{status}", status+"") + "?ts=" + (new Date).getTime() 

        return XHR.sendCommand('PUT', _url , [this.headers], _body )
                .then(doc => (doc.body as Array<JSON>).map(it=>new models.MessageDto(it)))
                .catch(err => this.handleError(err))


    }
}
