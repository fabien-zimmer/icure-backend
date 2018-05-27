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

import * as models from './models';

export class TarificationDto {
    constructor(json: JSON | any) {
        Object.assign(this as TarificationDto, json)
    }

    id?: string;

    rev?: string;

    deletionDate?: number;

    regions?: Array<string>;

    type?: string;

    version?: string;

    code?: string;

    level?: number;

    label?: { [key: string]: string; };

    searchTerms?: { [key: string]: Array<string>; };

    links?: Array<string>;

    flags?: Array<TarificationDto.FlagsEnum>;

    data?: string;

    valorisations?: Array<models.ValorisationDto>;

    category?: { [key: string]: string; };

    consultationCode?: boolean;

}

export namespace TarificationDto {
    export enum FlagsEnum {
        MaleOnly = <any> 'male_only',
        FemaleOnly = <any> 'female_only'
    }
}
