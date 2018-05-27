/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '../filter-panel/filter-panel.js';

import '../collapse-button/collapse-button.js';
import './ht-pat-admin-card.js';
import './ht-pat-he-tree-detail.js';
import './ht-pat-detail-ctc-detail-panel.js';
import '../icons/icure-icons.js';
import '../../icd-styles.js';
import '../dynamic-form/entity-selector.js';
import '../dynamic-form/health-problem-selector.js';

import moment from 'moment/src/moment'
import _ from 'lodash/lodash'
import styx from '../../../scripts/styx'
import {AccessLogDto} from "../icc-api/model/AccessLogDto"

class HtPatDetail extends Polymer.TkLocalizerMixin(Polymer.Element) {
  static get template() {
    return Polymer.html`
        <style include="iron-flex iron-flex-alignment"></style>
        <!--suppress CssUnusedSymbol -->
        <style include="icd-styles">
            :host {
                height: 100%;
            }

            .container {
                width: 100%;
                height: calc(100vh - 64px);
                display: grid;
                grid-template-columns: 20% 30% 50%;
                grid-template-rows: 100%;
                position: fixed;
                top: 64px;
                left: 0;
                bottom: 0;
                right: 0;
            }

            .zone {
                height: 100%;
            }

            .padding-0 {
                padding: 0;
            }

            .one-line-menu {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 400;
                padding-left: 0;
            }

            #first {
                height: calc(100% - 36px);
            }

            paper-fab {
                --paper-fab-mini: {
                    height: 28px;
                    width: 28px;
                    padding: 4px;
                };

                margin-right: 4px;
            }

            .first-panel {
                /*width:20%;
                height:calc(100% - 64px);*/
                height: 100%;
                background: var(--app-background-color-dark);
                /*position:fixed;*/
                top: 64px;
                left: 0;
                @apply --shadow-elevation-3dp;
                grid-column: 1 / 1;
                grid-row: 1 / 1;
                z-index: 3;
                overflow: hidden;
            }

            #_contacts_listbox {
                padding: 0;
            }

            paper-listbox {
                background: transparent;
                padding: 0;
            }

            paper-item {
                background: transparent;
                outline: 0;
                --paper-item-selected: {

                };

                --paper-item-disabled-color: {
                    color: red;
                };

                --paper-item-focused: {
                    background: transparent;
                };
                --paper-item-focused-before: {
                    background: transparent;
                };

            }

            paper-listbox {
                outline: 0;
                --paper-listbox-selected-item: {
                    color: var(--app-text-color-light);
                    background: var(--app-primary-color);
                };
                --paper-listbox-disabled-color: {
                    color: red;
                };
            }

            #adminFileMenu paper-item.iron-selected {
                color: var(--app-text-color-light);
                background: var(--app-primary-color);
                @apply --text-shadow;
            }

            collapse-button {
                outline: 0;
                --paper-listbox-selected-item: {
                    color: var(--app-text-color-light);
                    background: var(--app-primary-color);
                }
            }

            collapse-button > .menu-item.iron-selected {
                @apply --padding-right-left-16;
                color: var(--app-text-color-light);
                background: var(--app-primary-color);
                @apply --text-shadow;
            }

            paper-item.opened {
                padding-top: 8px;

            }

            .opened {
                color: var(--app-text-color);
                background: var(--app-text-color-light);
                border-radius: 2px 2px 0 0;
                box-shadow: 0 4px 0 0 white,
                0 -2px 0 0 white,
                0 2px 2px 0 rgba(0, 0, 0, 0.14),
                0 1px 5px 0 rgba(0, 0, 0, 0.12),
                0 3px 1px -2px rgba(0, 0, 0, 0.2);

            }

            .opened.iron-selected {
                box-shadow: 0 4px 0 0 white,
                0 -2px 0 0 var(--app-primary-color),
                0 2px 2px 0 rgba(0, 0, 0, 0.14),
                0 1px 5px 0 rgba(0, 0, 0, 0.12),
                0 3px 1px -2px rgba(0, 0, 0, 0.2);
            }

            .sublist {
                background: var(--app-light-color);
                margin: 0 0 8px -30px;
                padding: 0;
                padding-bottom: 4px;
                border-radius: 0 0 2px 2px;
                @apply --shadow-elevation-2dp;
            }

            paper-item.sublist-footer {
                height: 48px;
                font-weight: normal;
            }

            .sublist-footer paper-icon-button.menu-item-icon, .list-info paper-icon-button.menu-item-icon {
                padding: 2px;
                height: 24px;
                width: 24px;
                -webkit-border-radius: 12px;
                -moz-border-radius: 12px;
                border-radius: 12px;
                background: var(--app-secondary-color);
                color: var(--app-text-color);
                margin-right: 8px;
            }

            paper-item.list-info {
                font-weight: lighter;
                font-style: italic;
                height: 48px;
            }

            .list-title {
                font-weight: bold;
            }

            .menu-item {
                @apply --padding-right-left-16;
                height: 48px;
                @apply --paper-font-button;
                text-transform: inherit;
                justify-content: space-between;
                cursor: pointer;
                @apply --transition;
            }

            .sublist .menu-item {
                font-size: 13px;
                min-height: 32px;
                height: 32px;
            }

            .menu-item:hover {
                /*background: var(--app-dark-color-faded);*/
                @apply --transition;
            }

            .menu-item .iron-selected {
                background: var(--app-primary-color);

            }

            .menu-item .opened {
                background: white !important;
                width: 80%;
                border-radius: 2px;
            }

            .menu-item-icon--selected {
                width: 0;
            }

            .opened .menu-item-icon--selected {
                width: 18px;
            }

            .opened > .menu-item-icon {
                transform: scaleY(-1);
            }

            paper-item.menu-item.opened {
                @apply --padding-right-left-16;
            }

            .submenu-item {
                cursor: pointer;
            }

            .submenu-item.iron-selected {
                background: var(--app-primary-color-light);
                color: var(--app-text-color-light);
                @apply --text-shadow;
            }

            .submenu-item-icon {
                height: 14px;
                width: 14px;
                color: var(--app-text-color-light);
                margin-right: 10px;
            }

            .add-btn-container {
                width: 20%;
                position: absolute;
                bottom: 16px;
                /*display:none;*/
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            .new-ctc-btn-container {
                width: 30%;
                left: 20%;
                position: absolute;
                bottom: 16px;
                /*display:none;*/
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            .add-btn {
                --paper-button-ink-color: var(--app-secondary-color-dark);
                background: var(--app-secondary-color);
                color: var(--app-text-color);
                font-weight: bold;
                font-size: 12px;
                height: 40px;
                min-width: 100px;
                @apply --shadow-elevation-2dp;
                padding: 10px 1.2em;
            }

            .patient-info-container {
                height: 96px;
                @apply --padding-right-left-32;
                cursor: pointer;
            }

            .patient-info-container:hover {
                background: var(--app-dark-color-faded);
                @apply --transition;
            }

            .patient-info {
                @apply --padding-left-16;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
            }

            .patient-name {
                font-weight: 700;
                line-height: 14px;
            }

            .patient-birthdate {
                font-size: 13px;
            }

            .btn-close {
                position: absolute;
                left: 26px;
                top: 18px;
                background: var(--app-secondary-color);
                color: var(--app-text-color);
                height: 20px;
                width: 20px;
                z-index: 4;
            }

            .btn-close:hover {
                @apply --transition;
                top: 17px;
                @apply --shadow-elevation-2dp;
            }

            .patient-picture-container {
                height: 60px;
                width: 60px;
                border-radius: 50%;
                overflow: hidden;
            }

            .patient-picture-container img {
                width: 100%;
                margin: 50%;
                transform: translate(-50%, -50%);
            }

            .submenus-container {
                overflow-x: auto;
                height: 100%;
                margin-bottom: 16px;
            }

            [hidden] {
                display: none !important;
            }

            /* END FIRST PANEL */

            /* SECOND PANEL  */
            .second-panel {
                /*width:30%;*/
                height: 100%;
                background: var(--app-background-color);
                /*position:fixed;*/
                top: 64px;
                left: 20%;
                @apply --shadow-elevation-2dp;
                margin: 0;
                grid-column: 2 / 2;
                grid-row: 1 / 1;

                z-index: 2;

            }

            .fit-bottom {
                bottom: 0;
                left: 20% !important;
                width: 30%;
                height: 48px;
                z-index: 4;
                @apply --padding-right-left-32;
                display: flex;
                flex-direction: row;
                justify-content: center;
                flex-wrap: nowrap;
                padding-top: 8px;
            }

            .selection-toast-button {
                height: 32px;
                @apply --paper-font-button;
                text-transform: lowercase;
            }

            .selection-toast-icon {
                height: 16px;
                margin-right: 4px;
            }

            div.extraDialogFields {
                margin-top: 0;
            }

            .contact {
                margin: 0 32px 16px;
                background: var(--app-light-color);
                color: var(--app-text-color);
                outline: 0;
                padding: 0;
                align-items: flex-start !important;
                @apply --shadow-elevation-2dp;
                position: relative;
            }

            .contact.iron-selected {
                background: var(--app-primary-color);
                color: var(--app-light-color);
                @apply --text-shadow;
            }

            .contact h4 {
                font-size: 14px;
                font-weight: 600;
                margin: 0;
                -webkit-user-select: none; /* Chrome/Safari */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* IE10+ */

                /* Rules below not implemented in browsers yet */
                -o-user-select: none;
                user-select: none;

            }

            .contact .contact-text-row {
                width: calc(100% - 32px);
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
                @apply --padding-right-left-16;
            }

            .contact:nth-of-type(1) .contact-text-row p {
                padding-right: 32px;
            }

            .contact .contact-text-row:first-child, .contact .contact-text-row:last-child {
                height: 24px;
            }

            /*.contact .contact-text-row:nth-child(2){
                height:48px;
            }*/

            .contact-text-row p {
                width: 100%;
                text-overflow: ellipsis;
                overflow-x: hidden;
                white-space: nowrap;
            }

            .contact-text-date {
                justify-content: space-between !important;
                position: relative;
                top: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, .1);
                @apply --padding-right-left-16;
                color: var(--app-text-color-disabled);
                height: 24px;
            }

            .contact .label-container {
                display: flex;
                flex-flow: row nowrap;
            }

            .contact label {
                font-size: 12px;
                font-weight: 400;
                margin: 0;
                display: block;

                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                -webkit-user-select: none; /* Chrome/Safari */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* IE10+ */

                /* Rules below not implemented in browsers yet */
                -o-user-select: none;
                user-select: none;

            }

            .ICD-10 {
                line-height: 12px;
                margin-right: 4px;
                color: black;
            }

            .iron-selected .ICD-10 {
                color: var(--app-light-color);
            }

            .iron-selected .ICD-10 span {
                background: var(--app-light-color);
            }

            .ICD-10:hover {
                font-weight: 600;
            }

            .ICD-10:hover:before {
                height: 8px;
                width: 8px;
                margin-bottom: 0;
                border-radius: 4px;
            }

            .ICD-10 span {
                content: '';
                display: inline-block;
                height: 6px;
                width: 6px;
                border-radius: 3px;
                margin-right: 3px;
                margin-bottom: 1px;
                background: lightgrey;
            }

            .contact .ICD-10:not(:first-child) {
                margin-left: 4px;
            }

            .contact p {
                @apply --paper-font-body1;
                margin: 0;
                -webkit-user-select: none; /* Chrome/Safari */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* IE10+ */

                /* Rules below not implemented in browsers yet */
                -o-user-select: none;
                user-select: none;
            }

            .contact-icon {
                position: absolute;
                right: 8px;
                margin: auto;
                top: 20px;
            }

            paper-material.iron-selected > .contact-icon {
                color: var(--app-text-color-light);
            }

            paper-material.iron-selected > .contact-text > .contact-text-date {
                color: var(--app-text-color-light) !important;
            }

            .current-contact {
                color: var(--app-secondary-color-dark);
                margin-bottom: 16px;
            }

            .current-contact.iron-selected {
                border-bottom: 1px solid var(--app-primary-color);
            }

            .contact--big {
                min-height: 96px;
                /*@apply --padding-16;*/
                /*border-bottom: 1px solid var(--app-background-color-dark);*/
            }

            .contact--small {
                min-height: 32px;
                /*@apply --padding-right-left-16;*/
                padding-bottom: 8px;
            }

            .contact--small .contact-text-row:nth-child(2) {
                justify-content: space-between;
            }

            .contact--small .contact-text-row:last-child {
                display: none;
            }

            .contact--small .he-dots-container {
                display: none;
            }

            .he-dots-container {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-end;
            }

            .contact-year {
                display: block;
                @apply --paper-font-body2;
                @apply --padding-32;
                padding-bottom: 8px;
            }

            .contact-year:first-child {
                padding-top: 0;
            }

            .contact-text {
                background: transparent;
                flex-direction: column;
                justify-content: space-between;
                align-items: flex-start;
                width: 100%;
                height: 100%;
                padding: 0;
            }

            .contact-text:focus::before, .contact-text:focus::after {
                background: transparent;
            }

            .contacts-container {
                overflow-y: auto;
                height: calc(100% - 80px);
                padding-bottom: 32px;
            }

            .layout.vertical {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                flex-wrap: nowrap;
            }

            .todo-list {
                border: 1px dashed rgba(0, 0, 0, 0.1);
                margin: 0 32px;
                border-radius: 4px;
            }

            .todo-item {
                font-size: 14px;
                --paper-item-min-height: 32px;
                color: var(--app-text-color);
                display: flex;
                flex-flow: row wrap;
                align-items: center;
                justify-content: space-between;
            }

            .todo-item h4 {
                margin: 0.5em 0;
            }

            .todo-due-date {
                font-size: 14px;
                font-weight: 300;
                margin-right: 4px;
            }

            .todo-actions paper-icon-button {
                height: 24px;
                width: 24px;
                padding: 2px;
                --paper-icon-button-hover: {
                    color: var(--app-secondary-color);
                };
            }

            .todo-item--late {
                color: var(--paper-red-500)
            }

            /* END SECOND PANEL */

            .second-third-panel {
                width: 80%;
                height: calc(100% - 64px);
                background: var(--app-background-color);
                position: fixed;
                top: 64px;
                right: 0;
                z-index: 2;
                overflow-y: scroll;
            }

            ht-pat-detail-ctc-detail-panel {
                grid-column: 3 / 3;
                grid-row: 1 / 1;
            }

            .statusContainer {
                display: inline-flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                padding-top: 4px;
                padding-bottom: 4px;
                width: 100%;
                height: 24px;
                overflow: hidden;
            }

            #insuranceStatus, #hubStatus, #tlStatus, #consentStatus {
                --paper-fab-background: var(--app-background-color-darker);
                --paper-fab-keyboard-focus-background: var(--app-background-color);
                color: var(--app-primary-color-dark);
                box-shadow: none;
                --paper-fab-iron-icon: {
                    height: 16px;
                    width: 16px;
                }

            }

            #insuranceStatus.medicalHouse {
                --paper-fab-background: var(--app-status-color-pending);
            }

            #insuranceStatus.noInsurance, #hubStatus.noAccess, #tlStatus.noTl, #consentStatus.noConsent {
                --paper-fab-background: var(--app-status-color-nok);
            }

            #insuranceStatus.insuranceOk, #hubStatus.accessOk, #tlStatus.tlOk, #consentStatus.consentOk {
                --paper-fab-background: var(--app-status-color-ok);
            }

            .display-left-menu {
                display: none;
                position: fixed;
                top: 50%;
                left: 0;
                z-index: 120;
                background: var(--app-background-color-dark);
                transform: translateY(-50%) rotate(0);
                border-radius: 0 50% 50% 0;
                transition: transform 0.2s ease-in;

            }

            .display-left-menu.open {
                left: 20%;
                border-radius: 50% 0 0 50%;
                transform: translateY(-50%) rotate(180deg);
                transition: transform 0.2s ease-in;
            }

            @media screen and (max-width: 1025px) {
                .container {
                    grid-template-columns: 0% 40% 60%;

                }

                .container .fit-bottom {
                    left: 0% !important;
                    width: 40%;
                }

                .container.expanded {
                    grid-template-columns: 20% 30% 50%;
                }

                .container.expanded .fit-bottom {
                    left: 20% !important;
                    width: 30%;
                }

                .selection-toast-button {
                    @apply --paper-font-caption;
                    text-transform: lowercase;
                }

                .second-third-panel {
                    width: 70%;
                }

                .patient-info-container {
                    @apply --padding-right-left-16;
                }

                .patient-picture-container {
                    display: none;
                }

                .btn-close {
                    left: 8px;
                    top: 16px;
                }

                .display-left-menu {
                    display: inherit;
                }
            }

            .extraDialogFields paper-input, .extraDialogFields tk-token-field {
                --paper-input-container-focus-color: var(--app-primary-color);
            }

            .toast-detector {
                position: relative;
                height: 48px;
                bottom: 48px;
                width: 100%;
            }

            .saved {
                position: fixed;
                top: 50%;
                right: 0;
                z-index: 1000;
                color: white;
                font-size: 13px;
                background: rgba(0, 0, 0, 0.42);
                height: 24px;
                padding: 0 8px 0 12px;
                border-radius: 3px 0 0 3px;
                width: 0;
                opacity: 0;
                animation: savedAnim 2.5s ease-in;
            }

            .saved iron-icon {
                margin-left: 4px;
                padding: 4px;
            }

            @keyframes savedAnim {
                0% {
                    width: 0;
                    opacity: 0;
                }
                20% {
                    width: 80px;
                    opacity: 1;
                }
                25% {
                    width: 72px;
                    opacity: 1;
                }
                75% {
                    width: 72px;
                    opacity: 1;
                }
                100% {
                    width: 0;
                    opacity: 0;
                }
            }
        </style>

        <div class="container">
            <paper-item id="savedIndicator">SAVED
                <iron-icon icon="icons:check"></iron-icon>
            </paper-item>
            <template is="dom-if" if="[[isAdminSelected(selectedAdminFile)]]">
                <ht-pat-admin-card class="second-third-panel" id="pat-admin-card" api="[[api]]" user="[[user]]" patient="{{patient}}" language="[[language]]" resources="[[resources]]"></ht-pat-admin-card>
            </template>
            <paper-icon-button class="display-left-menu" icon="chevron-right" on-tap="_expandColumn"></paper-icon-button>
            <div class="first-panel">
                <paper-material class="zone compact-menu">
                    <paper-listbox class="padding-0" id="adminFileMenu" selected-item="{{selectedAdminFile}}">
                        <paper-item id="_admin_info" class="horizontal layout patient-info-container">
                            <paper-fab class="btn-close" mini="" icon="close" on-tap="close"></paper-fab>
                            <div class="patient-picture-container"><img src\$="[[picture(patient)]]"></div>
                            <div class="patient-info">
                                <div class="patient-name">[[patient.firstName]] [[patient.lastName]]</div>
                                <div class="patient-birthdate">°[[patient.dateOfBirth]]</div>
                                <div class="statusContainer">
                                    <paper-fab id="insuranceStatus" mini="" icon="vaadin:handshake"></paper-fab>
                                    <paper-fab id="consentStatus" mini="" icon="vaadin:clipboard-check"></paper-fab>
                                    <paper-fab id="tlStatus" mini="" icon="vaadin:specialist"></paper-fab>
                                    <paper-fab id="hubStatus" mini="" icon="vaadin:cluster"></paper-fab>
                                </div>
                            </div>
                        </paper-item>
                        <paper-item class="menu-item" id="_complete_file">[[localize('com_fil','Complete file',language)]]
                            <iron-icon class="menu-item-icon" icon="icons:arrow-forward"></iron-icon>
                        </paper-item>
                    </paper-listbox>
                    <div class="submenus-container">
                        <paper-listbox class="padding-0" id="mainMenu" selected-items="{{selectedMainElements}}" multi="" toggle-shift="">
                            <collapse-button>
                                <paper-item slot="sublist-collapse-item" class="menu-trigger menu-item" id="_ht_active_hes" on-tap="toggleSelectAll" elevation="">
                                    <div class="one-line-menu list-title"><span>[[localize('act_hea_pro','Active Health Problems',language)]]</span></div>
                                    <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu" hover="none"></paper-icon-button>
                                </paper-item>
                                <paper-listbox id="ahelb" class="menu-content sublist" multi="" toggle-shift="" on-selected-items-changed="selectedMainElementItemsChanged">
                                    <template is="dom-if" if="[[!activeHealthElements.length]]">
                                        <paper-item class="menu-item  list-info">
                                            <div class="one-line-menu">[[localize('no_act_hea_ele','No active health elements',language)]]</div>
                                            <paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                    <template id="activeHesDomRepeat" is="dom-repeat" items="[[activeHealthElements]]" as="he">
                                        <ht-pat-he-tree-detail i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="[[getHeId(he)]]" he="[[he]]" selected="[[isMainElementSelected(he,selectedMainElements,selectedMainElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate" on-select-he="selectHealthElement"></ht-pat-he-tree-detail>
                                    </template>
                                    <template is="dom-if" if="[[activeHealthElements.length]]">
                                        <paper-item class="menu-item sublist-footer">
                                            <div class="one-line-menu">[[localize('add_hea_ele','Add health element',language)]]</div>
                                            <paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button>
                                <paper-item slot="sublist-collapse-item" class="menu-trigger menu-item" id="_ht_inactive_hes" on-tap="toggleSelectAll" elevation="">
                                    <div class="one-line-menu list-title"><span>[[localize('med_ant','Medical antecedents',language)]]</span></div>
                                    <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                </paper-item>
                                <paper-listbox id="ihelb" class="menu-content sublist" multi="" toggle-shift="" on-selected-items-changed="selectedMainElementItemsChanged">
                                    <template is="dom-if" if="[[!inactiveHealthElements.length]]">
                                        <paper-item class="menu-item list-info">
                                            <div class="one-line-menu">[[localize('no_med_ant','No medical antecedent',language)]]</div>
                                            <paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addInactiveHealthElement"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                    <template id="inactiveHesDomRepeat" is="dom-repeat" items="[[inactiveHealthElements]]" as="he">
                                        <ht-pat-he-tree-detail i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="[[getHeId(he)]]" he="[[he]]" selected="[[isMainElementSelected(he,selectedMainElements,selectedMainElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <template is="dom-if" if="[[inactiveHealthElements.length]]">
                                        <paper-item class="menu-item sublist-footer">
                                            <div class="one-line-menu">[[localize('add_med_ant','Add medical antecedent',language)]]</div>
                                            <paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addInactiveHealthElement"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button>
                                <paper-item slot="sublist-collapse-item" id="_svc_group_familyrisks" class="menu-trigger menu-item" on-tap="toggleSelectAll">
                                    <div class="one-line-menu list-title">[[localize('fam_ris','Family risks',language)]]</div>
                                    <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                </paper-item>
                                <paper-listbox id="frhelb" class="menu-content sublist" multi="" toggle-shift="" on-selected-items-changed="selectedMainElementItemsChanged">
                                    <template is="dom-if" if="[[!familyrisks.length]]">
                                        <paper-item class="menu-item list-info">
                                            <div class="one-line-menu">[[localize('no_fam_ris','No family risks',language)]]</div>
                                            <paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addService" data-label="Family risk" data-tags="CD-ITEM|familyrisk|1.0"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                    <template is="dom-repeat" items="[[familyrisks]]" as="risk">
                                        <ht-pat-he-tree-detail i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="[[getHeId(he)]]" he="[[risk]]" selected="[[isMainElementSelected(he,selectedMainElements,selectedMainElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <template is="dom-if" if="[[familyrisks.length]]">
                                        <paper-item class="menu-item sublist-footer">
                                            <div class="one-line-menu">[[localize('add_fam_ris','Add family risk',language)]]</div>
                                            <paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addService" data-label="Family risk" data-tags="CD-ITEM|familyrisk|1.0"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                </paper-listbox>
                            </collapse-button>
                            
                            <collapse-button>
                                <paper-item slot="sublist-collapse-item" id="_svc_group_risks" class="menu-trigger menu-item" on-tap="toggleSelectAll">
                                    <div class="one-line-menu list-title">[[localize('ris','Risks',language)]]</div>
                                    <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                </paper-item>
                                <paper-listbox id="rhelb" class="menu-content sublist" multi="" toggle-shift="" on-selected-items-changed="selectedMainElementItemsChanged">
                                    <template is="dom-if" if="[[!risks.length]]">
                                        <paper-item class="menu-item list-info">
                                            <div class="one-line-menu">[[localize('no_ris','No risks',language)]]</div>
                                            <paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addService" data-label="Risks" data-tags="CD-ITEM|risk|1.0"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                    <template is="dom-repeat" items="[[risks]]" as="risk">
                                        <ht-pat-he-tree-detail i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="[[getHeId(he)]]" he="[[risk]]" selected="[[isMainElementSelected(he,selectedMainElements,selectedMainElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <template is="dom-if" if="[[risks.length]]">
                                        <paper-item class="menu-item sublist-footer">
                                            <div class="one-line-menu">[[localize('add_ris','Add risk',language)]]</div>
                                            <paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Risks" data-tags="CD-ITEM|risk|1.0"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button>
                                <paper-item slot="sublist-collapse-item" id="_svc_group_allergies" class="menu-trigger menu-item" on-tap="toggleSelectAll">
                                    <div class="one-line-menu list-title">[[localize('all','Allergies',language)]]</div>
                                    <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                </paper-item>
                                <paper-listbox id="alhelb" class="menu-content sublist" multi="" toggle-shift="" on-selected-items-changed="selectedMainElementItemsChanged">
                                    <template is="dom-if" if="[[!allergies.length]]">
                                        <paper-item class="menu-item list-info">
                                            <div class="one-line-menu">[[localize('no_all','No allergies',language)]]</div>
                                            <paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addService" data-label="Allergies" data-tags="CD-ITEM|allergy|1.0"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                    <template is="dom-repeat" items="[[allergies]]" as="allergy">
                                        <ht-pat-he-tree-detail i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="[[getHeId(he)]]" he="[[allergy]]" selected="[[isMainElementSelected(he,selectedMainElements,selectedMainElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <template is="dom-if" if="[[allergies.length]]">
                                        <paper-item class="menu-item sublist-footer">
                                            <div class="one-line-menu">[[localize('add_all','Add allergy',language)]]</div>
                                            <paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Allergies" data-tags="CD-ITEM|allergy|1.0"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button>
                                <paper-item slot="sublist-collapse-item" id="_svc_group_medications" class="menu-trigger menu-item" on-tap="toggleSelectAll">
                                    <div class="one-line-menu list-title">[[localize('med','Medication',language)]]</div>
                                    <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                </paper-item>
                                <paper-listbox id="mhelb" class="menu-content sublist" multi="" toggle-shift="" selected-items="{{selectedMedications}}">
                                    <template is="dom-if" if="[[!medications.length]]">
                                        <paper-item class="menu-item list-info">
                                            <div class="one-line-menu">[[localize('no_med','No medications',language)]]</div>
                                            <paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Medications" data-tags="CD-ITEM|medication|1.0"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                    <template is="dom-repeat" items="[[medications]]" as="medication">
                                        <paper-item class="menu-item" id="_svc_[[medication.id]]">
                                            <div class="one-line-menu">
                                                [[shortServiceDescription(medication, language)]]
                                            </div>
                                        </paper-item>
                                    </template>
                                    <template is="dom-if" if="[[medications.length]]">
                                        <paper-item class="menu-item sublist-footer">
                                            <div class="one-line-menu">[[localize('add_med','Add medication',language)]]</div>
                                            <paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addService" data-label="Medications" data-tags="CD-ITEM|medication|1.0"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button>
                                <paper-item slot="sublist-collapse-item" class="menu-trigger menu-item" id="_ht_archived_hes" on-tap="toggleSelectAll" elevation="">
                                    <div class="one-line-menu list-title"><span>[[localize('arc','Archive',language)]]</span></div>
                                    <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                </paper-item>
                                <paper-listbox id="arhelb" class="menu-content sublist" multi="" toggle-shift="" on-selected-items-changed="selectedMainElementItemsChanged">
                                    <template is="dom-if" if="[[!archivedHealthElements.length]]">
                                        <paper-item class="menu-item list-info">
                                            <div class="one-line-menu">[[localize('no_arc_hea_ele','No archived health elements',language)]]</div>
                                        </paper-item>
                                    </template>
                                    <template id="archivedHesDomRepeat" is="dom-repeat" items="[[archivedHealthElements]]" as="he">
                                        <ht-pat-he-tree-detail i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="[[getHeId(he)]]" he="[[he]]" selected="[[isMainElementSelected(he,selectedMainElements,selectedMainElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                </paper-listbox>
                            </collapse-button>
                        </paper-listbox>
                    </div>
                </paper-material>
                <div class="add-btn-container">
                    <paper-button class="add-btn" on-tap="_addHealthElement">[[localize('add_heal_elem','Add Health Element',language)]]</paper-button>
                </div>
            </div>
            <template is="dom-if" if="[[!isAdminSelected(selectedAdminFile)]]" restamp="">
                <div class="second-panel">
                    <div>
                        <filter-panel id="contactFilterPanel" items="[[secondPanelItems]]" selected-icon="{{contactType}}" search-string="{{contactSearchString}}"></filter-panel>
                    </div>
                    <div class="contacts-container" on-scroll="openToast">
                        <paper-listbox id="_contacts_listbox" focused="" multi="" toggle-shift="" selectable="paper-material" selected-items="{{selectedContactItems}}">
                            <template is="dom-if" if="[[events.length]]">
                                <span class="contact-year" on-click="openToast">[[localize('to_do','To Do',language)]]</span>
                                <paper-listbox id="_events_listbox" class="todo-list">
                                    <template is="dom-repeat" items="[[events]]" as="e">
                                        <paper-item id="_svc_[[e.id]]" class\$="todo-item [[_lateEventCssClass(e)]]">
                                            <h4><label class="todo-due-date">[[_dateFormat(e.valueDate)]]</label>[[shortServiceDescription(e)]]</h4>
                                            <div class="todo-actions">
                                                <paper-icon-button icon="clear" on-tap="clearEvent"></paper-icon-button>
                                                <paper-icon-button icon="done" on-tap="completeEvent"></paper-icon-button>
                                            </div>
                                        </paper-item>
                                    </template>
                                </paper-listbox>
                            </template>
                            <template is="dom-if" if="[[!events.length]]">
                            </template>
                            <template is="dom-repeat" items="[[contactYears]]" as="contactYear">
								<span class="contact-year" on-click="openToast">
									[[contactYear.year]]
								</span>
                                <template is="dom-repeat" items="[[contactYear.contacts]]" as="contact" filter="[[contactFilter(selectedMainElements, selectedMainElements.*, timeSpanStart, timeSpanEnd, contactSearchString, currentContact)]]" sort="compareContacts">
                                    <paper-material id="ctc_[[contact.id]]" elevation="0" class\$="layout vertical contact [[_isLatestYearContact(contactYear, contactYears)]] [[_contactClasses(contact, contact.closingDate)]]" contact="[[contact]]" on-click="openToast">
                                        <paper-item class="contact-text">
                                            <div class="contact-text-row contact-text-date">
                                                <label>[[_timeFormat(contact.openingDate)]] ([[_shortId(contact.id)]])</label>
                                                <label>[[hcp(contact)]]</label>
                                            </div>
                                            <div class="contact-text-row grey">
                                                <h4>[[contact.userDescr]]</h4>
                                                <template is="dom-repeat" items="[[highlightedServiceLabels(user)]]" as="label">
                                                    <p>
                                                        <template is="dom-repeat" items="[[serviceDescriptions(contact,label)]]" as="svcDesc">
                                                            <template is="dom-if" if="[[!index]]">[[label]]:</template>
                                                            <template is="dom-if" if="[[index]]"> ,</template>
                                                            [[svcDesc]]
                                                        </template>
                                                    </p>

                                                </template>
                                            </div>
                                            <div class="contact-text-row label-container">
                                                <template is="dom-repeat" items="[[contact.healthElements]]" as="he">
                                                    <label id="label_[[contact.id]]_[[getHeId(he)]]" class\$="ICD-10 [[he.colour]]"><span></span>[[he.descr]]</label>
                                                    <paper-tooltip for="label_[[contact.id]]_[[getHeId(he)]]">[[he.descr]]</paper-tooltip>
                                                </template>
                                            </div>
                                        </paper-item>
                                        <template is="dom-if" if="[[!contact.closingDate]]">
                                            <paper-icon-button id="close-[[contact.id]]" class="menu-item-icon contact-icon" icon="icons:cancel" on-tap="closeContact"></paper-icon-button>
                                        </template>
                                    </paper-material>
                                </template>
                            </template>
                        </paper-listbox>
                    </div>
                    <div class="toast-detector" on-mousemove="openToast"></div>
                    <paper-toast id="selectionToast" class="fit-bottom">
                        <paper-button class="selection-toast-button" name="select-today" role="button" tabindex="0" animated="" aria-disabled="false" elevation="0" on-tap="_selectToday">
                            <iron-icon class="selection-toast-icon" icon="icure-svg-icons:select-today"></iron-icon>
                            Select Today
                        </paper-button>
                        <paper-button class="selection-toast-button" name="select-six-months" role="button" tabindex="0" animated="" aria-disabled="false" elevation="0" on-tap="_select6Months">
                            <iron-icon class="selection-toast-icon" icon="icure-svg-icons:select-six-months"></iron-icon>
                            Last 6 Months
                        </paper-button>
                        <paper-button class="selection-toast-button" name="select-all" role="button" tabindex="0" animated="" aria-disabled="false" elevation="0" on-tap="_selectAll">
                            <iron-icon class="selection-toast-icon" icon="icure-svg-icons:select-all"></iron-icon>
                            Select All
                        </paper-button>
                    </paper-toast>
                    <template is="dom-if" if="[[!currentContact]]">
                        <div class="new-ctc-btn-container">
                            <paper-button class="add-btn" on-tap="newContact">[[localize('new_con','New Contact',language)]]</paper-button>
                        </div>
                    </template>
                </div>
                <ht-pat-detail-ctc-detail-panel id="ctcDetailPanel" contacts="[[selectedContacts]]" all-contacts="[[contacts]]" health-elements="[[_concat(activeHealthElements,inactiveHealthElements)]]" api="[[api]]" i18n="[[i18n]]" user="[[user]]" patient="[[patient]]" language="[[language]]" resources="[[resources]]" current-contact="[[currentContact]]" on-select-current-contact="_selectCurrentContact" on-change="formsChanged" on-must-save-contact="_saveContact"></ht-pat-detail-ctc-detail-panel>
            </template>

        </div>

        <health-problem-selector id="add-healthelement-dialog" api="[[api]]" i18n="[[i18n]]" resources="[[resources]]" language="[[language]]" data-provider="[[_healthElementsSelectorDataProvider()]]" on-entity-selected="_addedHealthElementSelected" entity-type="Health Problem" entity="{{heEntity}}" ok-label="Create">
            <div class="extraDialogFields" slot="suffix">
            </div>
        </health-problem-selector>

        <health-problem-selector id="edit-healthelement-dialog" api="[[api]]" i18n="[[i18n]]" resources="[[resources]]" language="[[language]]" data-provider="[[_healthElementsSelectorDataProvider()]]" on-entity-selected="_editedHealthElementSelected" entity-type="Health Problem" entity="{{heEntity}}" ok-label="Modify">
            <div class="extraDialogFields" slot="suffix">
                <div class="history">[[localize('his','history',language)]]</div>
            </div>
        </health-problem-selector>

        <entity-selector id="add-service-dialog" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" columns="[[_servicesSelectorColumns()]]" data-provider="[[_servicesSelectorDataProvider(editedSvcLabel)]]" on-entity-selected="_addedOrEditedServiceSelected" entity-type="[[editedSvcLabel]]" entity="{{svcEntity}}" ok-label="Create">
            <div class="extraDialogFields" slot="suffix">
                <paper-input label="Description" value="[[shortServiceDescription(svcEntity, language)}}" on-value-changed="_svcEntityContentChanged"></paper-input>
            </div>
        </entity-selector>

        <entity-selector id="edit-service-dialog" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" columns="[[_servicesSelectorColumns()]]" data-provider="[[_servicesSelectorDataProvider(editedSvcLabel)]]" on-entity-selected="_addedOrEditedServiceSelected" entity-type="[[editedSvcLabel]]" entity="{{svcEntity}}" ok-label="Modify">
            <div class="extraDialogFields" slot="suffix">
                <paper-input label="Description" value="[[shortServiceDescription(svcEntity, language)}}" on-value-changed="_svcEntityContentChanged"></paper-input>
            </div>
        </entity-selector>
`;
  }

  static get is() {
    return 'ht-pat-detail'
  }

  static get properties() {
    return {
      api: {
        type: Object
      },
      user: {
        type: Object
      },
      patient: {
        type: Object,
        notify: true
      },
      patientInsurance: {
        type: Object,
        value: function () {
          return {}
        }
      },
      patientInsurability: {
        type: Object,
        value: function () {
          return {}
        }
      },
      selectedAdminFile: {
        type: Object,
        observer: 'selectedAdminFileChanged',
        value: null
      },
      selectedMainElements: {
        type: Array,
        observer: "selectedMainElementsChanged",
        value: function () {
          return []
        }
      },
      selectedFamily: {
        type: Array,
        value: function () {
          return []
        }

      },
      events: {
        type: Array,
        value: function () {
          return []
        }

      },
      selectedRisks: {
        type: Array,
        value: function () {
          return []
        }

      },
      selectedAllergies: {
        type: Array,
        value: function () {
          return []
        }

      },
      selectedLocalize: {
        type: Array,
        value: function () {
          return []
        }
      },
      selected: {
        type: Boolean,
        value: false
      },
      showFiltersPanel: {
        type: Boolean,
        value: false
      },
      currentContact: {
        type: Object,
        value: null
      },
      contactSearchString: {
        type: String,
        value: null
      },
      showDetailsFiltersPanel: {
        type: Boolean,
        value: false
      },
      isLatestYear: {
        type: Boolean,
        value: false
      },
      selectedContactItems: {
        type: Array,
        value: function () {
          return []
        }
      },
      itemSelected: {
        type: Boolean,
        value: false
      },
      secondPanelItems: {
        type: Array,
        value: function () {
          return [{icon: "icure-svg-icons:laboratory", title: "Lab Results", id: "LabResults"}, {
            icon: "icure-svg-icons:imaging",
            title: "Imaging",
            id: "Imaging"
          }, {icon: "icure-svg-icons:stethoscope", title: "Consultation", id: "Consultation"}, {
            icon: "editor:insert-drive-file",
            title: "Protocol",
            id: "Protocol"
          }, {icon: "icure-svg-icons:prescription", title: "Prescription", id: "Prescription"}, {
            icon: "icure-svg-icons:sent-reports",
            title: "Sent Reports",
            id: "SentReports"
          }, {icon: "icure-svg-icons:received-reports", title: "Received Reports", id: "ReceivedReports"}]
        }
      },
      i18n: {
        type: Object
      }
    }
  }

  static get observers() {
    return ['patientOpened(patient.id,api,user)', 'patientChanged(api,user,patient)', 'selectedMainElementsSpliced(selectedMainElements.splices)', 'selectedContactItemsChanged(selectedContactItems.*)']
  }

  constructor() {
    super()
  }

  selectedContactItemsChanged() {
    const ctcDetailPanel = this.shadowRoot.querySelector('#ctcDetailPanel')
    ctcDetailPanel && ctcDetailPanel.flushSave()

    this.set('selectedContacts', this.selectedContactItems.map(i => i.contact))
  }

  _shortId(id) {
    return id && id.substr(0, 8)
  }

  _timeFormat(date) {
    return this.api.moment(date).format(date > 99991231 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY')
  }

  _dateFormat(date) {
    return this.api.moment(date).format('DD/MM/YYYY')
  }

  _contactClasses(contact) {
    return contact.closingDate ? '' : 'current-contact'
  }

  clearEvent(el) {
    const svcId = el.target.parentElement.parentElement.id.substr(5)
    const svc = this.get('events').find(s => s.id === svcId)

    const t = svc.tags.find(t => t.type === 'CD-LIFECYCLE')
    if (t) {
      t.code = 'cancelled'
      if (!this.currentContact) {
        return
      }
      this.saveService(svc).then(c => this.filterEvents())
    }
  }

  completeEvent(el) {
    const svcId = el.target.parentElement.parentElement.id.substr(5)
    const svc = this.get('events').find(s => s.id === svcId)

    const t = svc.tags.find(t => t.type === 'CD-LIFECYCLE')
    if (t) {
      t.code = 'completed'
      if (!this.currentContact) {
        return
      }
      this.saveService(svc).then(c => this.filterEvents())
    }
  }

  saveService(svc) {
    svc.modified = +new Date()
    if (!svc.id) {
      svc.id = this.api.crypto().randomUuid()
    }
    if (!svc.valueDate) {
      svc.valueDate = parseInt(moment().format('YYYYMMDDHHmmss'))
    }
    if (!svc.openingDate) {
      svc.openingDate = svc.valueDate
    }
    if (!svc.created) {
      svc.created = svc.modified
    }
    const ctc = this.api.contact().contactOfService(this.get('contacts'), svc.id) || this.currentContact
    let sc = this.currentContact.subContacts.find(sc => sc.services.find(sId => svc.id))
    if (!sc) {
      sc = ctc.subContacts.find(sc => sc.services.find(sId => svc.id)) || {}
      this.currentContact.subContacts.push(sc = {formId: sc.formId, planOfActionId: sc.planOfActionId, healthElementId: sc.healthElementId, services: []})
      sc.services.push({serviceId: svc.id})
    }
    const oldSvcIdx = this.currentContact.services.findIndex(s => s.id === svc.id)
    if (oldSvcIdx > -1) {
      this.currentContact.services.splice(oldSvcIdx, 1)
    }
    this.currentContact.services.push(svc)
    return this.saveCurrentContact()
  }

  saveContact(ctc) {
    return (ctc.rev ? this.api.contact().modifyContact(ctc) : this.api.contact().createContact(ctc)).then(c => {
      ctc.rev = c.rev
      console.log("contact saved: " + ctc.id + ":" + ctc.rev)

      setTimeout(() => this.$.savedIndicator.classList.remove("saved"), 2000)
      this.$.savedIndicator.classList.add("saved")

      if (ctc.services.find(s => s.tags.find(t => t.type === 'CD-ITEM' && ['allergy', 'risk', 'familyrisk', 'healthcareelement', 'healthissue', 'medication'].indexOf(t.code) >= 0))) {
        this.patientChanged()
      }
      return c
    })
  }

  saveCurrentContact() {
    return this.saveContact(this.currentContact)
  }

  _saveContact(event) {
    this.saveContact(event.detail)
  }

  filterEvents() {
    this.set('events', _.sortBy(this.api.contact().filteredServices(this.contacts, s => s.tags.find(t => t.type === 'CD-LIFECYCLE' && t.code === 'planned')), it => -this.api.moment(it.valueDate)))
  }

  _lateEventCssClass(e) {
    return this.api.moment(e.valueDate).isBefore(moment()) ? 'todo-item--late' : ''
  }

  _isLatestYearContact(contactYear, contactYears) {
    if (contactYear.year === contactYears[Object.keys(contactYears)[0]].year) {
      this.isLatestYear = true
      return "contact--big"
    } else {
      this.isLatestYear = false
      return "contact--small"
    }
  }

  openToast() {
    Polymer.dom(this.root).querySelector('#selectionToast').show()
  }

  toggleFiltersPanel() {
    this.showFiltersPanel = !this.showFiltersPanel
    this.root.querySelector('#filtersPanel').classList.toggle('filters-panel--collapsed')
  }

  selectedItemsSubmenu(list, selectedItems) {
    if (!selectedItems || selectedItems.length === 0) {
      return 'icons:check-box-outline-blank'
    } else if (selectedItems.length < list.length) {
      return 'icons:indeterminate-check-box'
    } else {
      return 'icons:check-box'
    }
  }

  checkedUncheckedIcon(item, selectedItems) {
    if (selectedItems && selectedItems.find(i => i && i.id && i.id.endsWith(item.id))) {
      return 'icons:check-box'
    } else {
      return 'icons:check-box-outline-blank'
    }
  }

  patientOpened(patientId, api, user) {
    if (api && user && patientId && patientId !== this.latestPatientId) {
      this.latestPatientId = patientId
      this.api.accesslog().createAccessLog(new AccessLogDto({
        id: this.api.crypto().randomUuid(),
        patientId: patientId,
        user: user.id,
        date: +new Date(),
        accessType: 'USER_ACCESS'
      }))
    }
  }

  patientChanged(api, user, patient, forceCreate = true) {
    if (this.api && this.user && this.patient) {
      const patient = this.patient
      Promise.all([this.api.contact().findBy(this.user.healthcarePartyId, patient), this.api.helement().findBy(this.user.healthcarePartyId, patient)]).then(([ctcs, hes]) => {
        const descrPattern = this.user.properties.find(p => p.type.identifier === 'org.taktik.icure.preferred.contactDescription') || "{Motifs de contact}"
        const sorter = x => [-x.valueDate || -x.openingDate, -x.closingDate]
        const idServicesInHes = _.compact(hes.map(he => he.idService))

        this.api.contact().filterServices(ctcs, s => s.tags.find(c => c.type === 'CD-ITEM' && ['healtcarehelement', 'healthissue', 'familyrisk', 'risk', 'allergy'].includes(c.code)) && !idServicesInHes.includes(s.id)).then(hesAsServices => {
          const combinedHes = _.sortBy(_.concat(hesAsServices.map(svc => ({
            created: svc.created,
            modified: svc.modified,
            endOfLife: svc.endOfLife,
            author: svc.author,
            responsible: svc.responsible,
            codes: svc.codes,
            tags: svc.tags,
            valueDate: svc.valueDate,
            openingDate: svc.openingDate,
            closingDate: svc.closingDate,
            descr: this.shortServiceDescription(svc, this.language),
            idService: svc.id,
            status: svc.status,
            svc: svc,
            plansOfAction: []
          })), hes.filter(it => it.descr && !it.descr.startsWith('Etat g') && !it.descr.startsWith('Algemeen t') && it.descr !== 'INBOX')), sorter)

          combinedHes.forEach(e => {
            e.selectedItems = []
          })

          this.api.code().icdChapters(_.compact(combinedHes.map(he => he.codes.find(c => c.type === 'ICD' || c.type === 'ICD10'))).map(x => x.code)).then(codes => {
            codes.forEach(cc => {
              cc.healthElements = _.sortBy(combinedHes.filter(he => {
                let heIcd = he.codes.find(c => c.type === 'ICD' || c.type === 'ICD10')
                return heIcd && cc.subCodes.includes(heIcd.code)
              }), sorter)
              cc.healthElements.forEach(he => he.colour = cc.descr.colour)
            })
            this.set('healthTopics', _.sortBy(codes.filter(ht => ht.healthElements.length > 1), it => this.api.contact().localize(it, this.language)))

            this.set('activeHealthElements', _.sortBy(combinedHes.filter(it => !it.closingDate && (it.status & 1) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && (c.code === 'healthissue' || c.code === 'healthcareelement'))), 'descr'))
            this.set('inactiveHealthElements', _.sortBy(combinedHes.filter(it => (it.closingDate || (it.status & 1) === 1) && (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && (c.code === 'healthissue' || c.code === 'healthcareelement'))), 'descr'))
            this.set('archivedHealthElements', _.sortBy(combinedHes.filter(it => (it.status & 2) === 2), 'descr'))
            this.set('allergies', _.sortBy(combinedHes.filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && c.code === 'allergy')), 'descr'))
            this.set('risks', _.sortBy(combinedHes.filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && c.code === 'risk')), 'descr'))
            this.set('familyrisks', _.sortBy(combinedHes.filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && c.code === 'familyrisk')), 'descr'))
          })

          const unclosedContact = ctcs.find(c => !c.closingDate)
          const allContacts = unclosedContact ? ctcs.concat([unclosedContact]) : ctcs
          const templateKeys = descrPattern.match(/\{.+?\}/g).map(s => s.substring(1, s.length - 1)).reduce((acc, s) => {
            acc[s] = true
            return acc
          }, {})
          allContacts.forEach(ctc => {
            ctc.healthElements = Object.values(ctc.subContacts.map(sc => sc.planOfActionId && combinedHes.find(he => he.plansOfAction.find(poa => poa.id === sc.planOfActionId)) || sc.healthElementId && combinedHes.find(he => he.id === sc.healthElementId)).reduce((acc, x) => {
              x && x.id && (acc[x.id] = x)
              return acc
            }, {}))
            ctc.userDescr = this.api.template(descrPattern, ctc.services.filter(s => templateKeys[s.label] && !s.endOfLife).reduce((acc, v) => {
              acc[v.label] = !acc[v.label] ? this.shortServiceDescription(v, this.language) : acc[v.label] + "," + this.shortServiceDescription(v, this.language)
              return acc
            }, {}))
            if (!ctc.userDescr || ctc.userDescr.length < 3) {
              ctc.userDescr = ctc.descr
            }
          });
          (unclosedContact && Promise.resolve(unclosedContact) || this.api.contact().newInstance(this.user, patient, {
            descr: 'Contact du jour',
            userDescr: 'Contact du jour'
          })).then(newCtc => {
            const thisYear = moment().year()
            this.set('contacts', ctcs)
            this.set('currentContact', newCtc)
            this.set('contactYears', _.sortBy(_.values(_.reduce(ctcs, (acc, ctc) => {
              if (ctc.subContacts && ctc.subContacts.length || ctc.services.find(s => _.values(s.content).find(this.contentHasData.bind(this)))) {
                let year = parseInt((ctc.openingDate || 2000).toString().substr(0, 4))
                const contacts = (acc[year] || (acc[year] = {year: year, contacts: []})).contacts
                if (!contacts.includes(ctc)) {
                  contacts.push(ctc)
                }
              }
              return acc
            }, _.fromPairs([[thisYear, {year: thisYear, contacts: [newCtc]}]]))).map(x => {
              x.contacts = _.sortBy(x.contacts, sorter)
              return x
            }), x => -x.year))
            this.filterEvents()
          })
        })

        this.api.contact().filterServices(ctcs, s => s.tags.find(c => c.type === 'CD-ITEM' && c.code === 'medication')).then(medications => this.set('medications', _.sortBy(medications, sorter)))

        this._updateFilterPanels()
      })

      //eHealth stuff
      if (patient.ssin && this.api.tokenId) {
        this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => this.api.fhc().Geninscontroller().getGeneralInsurabilityUsingGET(patient.ssin, this.api.tokenId, this.api.keystoreId, this.api.credentials.ehpassword, hcp.nihii, hcp.ssin, hcp.lastName, "doctor", null, null).then(gi => {
          const genInsOk = !gi.faultCode && gi.insurabilities && gi.insurabilities.length && gi.insurabilities[0].ct1 && !(gi.generalSituation && gi.generalSituation.length)
          const medicalHouse = gi.medicalHouseInfo && gi.medicalHouseInfo.medical && this.api.before(gi.medicalHouseInfo.periodStart, +new Date()) && (!gi.medicalHouseInfo.periodEnd || this.api.after(gi.medicalHouseInfo.periodEnd + 24 * 3600 * 1000, +new Date()))

          this.$.insuranceStatus.classList.remove('medicalHouse')
          this.$.insuranceStatus.classList.remove('noInsurance')
          this.$.insuranceStatus.classList.remove('insuranceOk')

          this.$.insuranceStatus.classList.add(genInsOk ? medicalHouse ? 'medicalHouse' : 'insuranceOk' : 'noInsurance')
          Polymer.updateStyles(this.$.insuranceStatus)

          if (genInsOk) {
            //set gen ins info on patient
            const pi = patient.insurabilities && _.assign({}, patient.insurabilities[0] || {})
            const ins = gi.insurabilities[0]
            this.api.insurance().listInsurancesByCode(ins.mutuality).then(out => {
              if (out && out.length) {
                pi.insuranceId = out[0].id
              }
              if (ins.ct1 && pi.parameters.tc1 !== ins.ct1) {
                pi.parameters = _.assign(pi.parameters || {}, {tc1: ins.ct1, preferentialstatus: parseInt(ins.ct1) % 2 === 1 ? 'true' : 'false'})
              }
              ins.ct2 && pi.parameters.tc2 !== ins.ct2 && (pi.parameters = _.assign(pi.parameters || {}, {tc2: ins.ct2}))
              ins.paymentApproval ? pi.parameters = _.assign(pi.parameters || {}, {paymentapproval: 'true'}) : delete pi.parameters.paymentapproval
              if (patient === this.patient) {
                this.set('patient.insurabilities.0', pi)
              }
            })
          }
        }))
      }
    }
  }

  unselectAdminFile() {
    this.$.adminFileMenu.select(null)
  }

  newContact(e) {
    this.patientChanged()
  }

  closeContact(e) {
    e.stopPropagation()
    e.preventDefault()

    const ctcId = e.target.id.substr(6)
    const year = this.contactYears.find(y => y.contacts.find(c => c.id === ctcId))
    const contact = year.contacts.find(c => c.id === ctcId)

    if (contact) {
      if (!contact.rev && (!contact.services || contact.services.length === 0)) {
        const idx = this.contactYears[0].contacts.indexOf(this.currentContact)
        if (idx >= 0) {
          this.splice('contactYears.0.contacts', idx, 1)
        }
        this.set('currentContact', null)
      } else {
        this.api.contact().getContact(contact.id).then(c => {
          c.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'));
          (c.rev ? this.api.contact().modifyContact(c) : this.api.contact().createContact(c)).then(() => this.patientChanged())
          //this.notifyPath('currentContact.closingDate')
        })
      }
    }
  }

  selectedMainElementItemsChanged(event) {
    const domRepeat = event.target.querySelector("dom-repeat")
    const selectedModels = event.target.selectedItems.map(el => domRepeat.modelForElement(el).he)

    if (!domRepeat || !selectedModels) {
      return
    }
    const allModels = domRepeat.items || []

    this.set('selectedMainElements', this.selectedMainElements.filter(he => !allModels.includes(he)).concat(selectedModels))
  }

  isMainElementSelected(item, selectedItems) {
    return selectedItems && selectedItems.includes(item)
  }

  selectedMainElementsSpliced(changeRecord) {
    if (changeRecord) {
      this.updateContactYears()
    }
  }

  _archive(event) {
    const model = event.detail
    if (model.he.id) {
      this.api.helement().getHealthElement(model.he.id).then(he => {
        if (!he.closingDate && he.closingDate !== 0) {
          he.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'))
        }
        if ((he.status & 1) === 0) {
          he.status = he.status | 1
        }
        if ((he.status & 2) === 0) {
          he.status = he.status | 2
        }
        this.api.helement().modifyHealthElement(he).then(() => {
          this.patientChanged()
        })
      })
    } else if (model.he.idService) {
      if (!this.currentContact) {
        return
      }
      const svc = model.he.svc

      if (!svc.closingDate && svc.closingDate !== 0) {
        svc.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'))
      }
      if ((svc.status & 2) === 0) {
        svc.status = svc.status | 2
      }
      this.saveService(svc).then(c => this.patientChanged())
    }
  }

  _activate(event) {
    const model = event.detail
    if (model.he.id) {
      this.api.helement().getHealthElement(model.he.id).then(he => {
        if (he.closingDate || he.closingDate === 0) {
          he.closingDate = null
        }
        if ((he.status & 1) === 1) {
          he.status = he.status - 1
        } //activate
        if ((he.status & 2) === 2) {
          he.status = he.status - 2
        } //unarchive
        this.api.helement().modifyHealthElement(he).then(he => {
          this.patientChanged()
        })
      })
    } else if (model.he.idService) {
      if (!this.currentContact) {
        return
      }
      const svc = model.he.svc

      if (svc.closingDate || svc.closingDate === 0) {
        svc.closingDate = null
      }
      if ((svc.status & 1) === 1) {
        svc.status = svc.status - 1
      } //activate
      if ((svc.status & 2) === 2) {
        svc.status = svc.status - 2
      } //unarchive
      this.saveService(svc).then(c => this.patientChanged())
    }
  }

  _inactivate(event) {
    const model = event.detail
    if (model.he.id) {
      this.api.helement().getHealthElement(model.he.id).then(he => {
        if (!he.closingDate && he.closingDate !== 0) {
          he.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'))
        }
        if ((he.status & 2) === 2) {
          he.status = he.status - 2
        } //unarchive
        this.api.helement().modifyHealthElement(he).then(he => {
          this.patientChanged()
        })
      })
    } else if (model.he.idService) {
      if (!this.currentContact) {
        return
      }
      const svc = model.he.svc

      if (!svc.closingDate && svc.closingDate !== 0) {
        svc.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'))
      }
      if ((svc.status & 2) === 2) {
        svc.status = svc.status - 2
      } //unarchive

      this.saveService(svc).then(c => this.patientChanged())
    }
  }

  _selectToday() {
    this.$.adminFileMenu.select(1)

    this.set('timeSpanStart', parseInt(moment().startOf('day').format('YYYYMMDD')))
    this.set('timeSpanEnd', null)

    this.updateContactYears()
  }

  _select6Months() {
    this.set('timeSpanStart', parseInt(moment().subtract(6, 'month').format('YYYYMMDD')))
    this.set('timeSpanEnd', null)

    this.updateContactYears()
  }

  _selectAll() {
    this.set('timeSpanStart', null)
    this.set('timeSpanEnd', null)

    this.updateContactYears()
  }

  _selectCurrentContact() {
    this.shadowRoot.querySelector('#_contacts_listbox').set('selectedValues', [0])
  }

  updateContactYears() {
    this.notifyPath('contactYears')
  }

  getHeId(he) {
    return he.id ? `_he_${he.id}` : `_svc_${he.idService}`
  }

  contactFilter() {
    return function (ctc) {
      const regExp = this.contactSearchString && new RegExp(this.contactSearchString, "i")

      const heIds = this.selectedMainElements.map(he => he.id)
      const poaIds = _.flatMap(this.selectedMainElements, he => he.selectedPlansOfAction ? he.selectedPlansOfAction.map(p => p.id) : [])
      const svcIds = this.selectedMainElements.filter(he => !he.id).map(he => he.idService)

      return this.api.after(ctc.openingDate, this.timeSpanStart) && this.api.before(ctc.openingDate, this.timeSpanEnd) && (!regExp || ctc.subContacts.filter(sc => sc.descr && sc.descr.match(regExp) && sc.services.length).length || ctc.services.filter(s => this.shortServiceDescription(s, this.language).match(regExp)).length) && (!heIds.length && !poaIds.length && !svcIds.length || ctc.subContacts.filter(sc => (sc.healthElementId && heIds.includes(sc.healthElementId) || sc.planOfActionId && poaIds.includes(sc.planOfActionId)) && sc.services.length).length || ctc.services.filter(s => svcIds.includes(s.id)).length) || !ctc.closingDate
    }.bind(this)
  }

  compareContacts(a, b) {
    return b.created - a.created
  }

  close() {
    this.set('patient', null)
  }

  selectedAdminFileChanged(el) {
    if (el && this.selectedMainElements && this.selectedMainElements.length) {
      this.set("selectedMainElements", [])
    }
    this._updateFilterPanels()
  }

  _editHealthElement(event) {
    const model = event.detail;
    (model.he.codes && model.he.codes.length && this.api.code().getCodes(model.he.codes.map(c => this.api.code().normalize(c).id).join(',')) || Promise.resolve([])).then(codes => {
      this.editedHealthElementModel = model
      this.$['edit-healthelement-dialog'].set('entity', _.assign(_.assign({plansOfAction: []}, model.he), {codes: codes}))
      this.$['edit-healthelement-dialog'].open()
    })
  }

  toggleMenu(e) {
    e.stopPropagation()
    e.preventDefault()
    styx.parent(e.target, el => el.tagName.toLowerCase() === 'collapse-button').toggle()
    styx.parent(e.target, el => el.tagName.toLowerCase() === 'paper-item').classList.toggle('opened')

    this._updateFilterPanels()
  }

  getPaperItemParentForEvent(e) {
    let tgt = e.target
    while (tgt && tgt.tagName && tgt.tagName.toLowerCase() !== 'paper-item') {
      tgt = tgt.parentElement
    }
    return tgt && tgt.tagName ? tgt : null
  }

  getPaperListboxParent(tgt) {
    while (tgt && tgt.tagName && tgt.tagName.toLowerCase() !== 'paper-listbox') {
      tgt = tgt.parentElement
    }
    return tgt && tgt.tagName ? tgt : null
  }

  handleSelectionChange(e) {
    const selections = e.detail.selections
    const selChanges = {}

    selections.forEach(s => {
      (s.items || this.selectedMainElements.map(he => this.getHeId(he))).forEach(id => {
        const item = this.root.querySelector('#' + id)
        if (item) {
          const listBox = this.getPaperListboxParent(item)
          if (listBox) {
            const selChangesEntry = selChanges[listBox.id] || (selChanges[listBox.id] = {el: listBox, selectedValues: listBox.selectedValues})
            if (s.action === 'select') {
              selChangesEntry.selectedValues = _.uniq(selChanges[listBox.id].selectedValues.concat([listBox.items.indexOf(item)]))
            } else if (s.action === 'unselect') {
              const delValue = listBox.items.indexOf(item)
              selChangesEntry.selectedValues = selChanges[listBox.id].selectedValues.filter(it => it !== delValue)
            }
          }
        }
      })
    })
    Object.values(selChanges).forEach(c => c.el.set('selectedValues', c.selectedValues))
  }

  isNotEmpty(a) {
    return a && a.length > 0
  }

  isEmpty(a) {
    return !a || a.length === 0
  }

  isAdminSelected(el) {
    return el && el.id === '_admin_info'
  }

  highlightedServiceLabels(user) {
    try {
      return user.properties.filter(p => p.type.identifier === 'org.taktik.icure.highlightedServiceLabels').map(p => JSON.parse(p.typedValue.stringValue))[0] || ['Examen clinique', 'Diagnostics', 'Prescription']
    } catch (e) {
    }
    return ['Examen clinique', 'Diagnostics', 'Prescription']
  }

  hcp(ctc) {
    const usr = this.api.users && this.api.users[ctc.author]
    const hcp = usr ? this.api.hcParties[usr.healthcarePartyId] : null
    return hcp && hcp.lastName + " " + (hcp.firstName && hcp.firstName.length && hcp.firstName.substr(0, 1) + ".") || usr && usr.login || "N/A"
  }

  picture(pat) {
    if (!pat) {
      return require('../../../images/Male-128.jpg')
    }
    return pat.picture ? 'data:image/jpeg;base64,' + pat.picture : pat.gender === 'F' || pat.gender === 'f' ? require('../../../images/Female-128.jpg') : require('../../../images/Male-128.jpg')
  }

  serviceDescriptions(ctc, label) {
    return this.api && this.api.contact().services(ctc, label).filter(s => !s.endOfLife).map(s => this.shortServiceDescription(s, this.language)).filter(desc => desc) || []
  }

  shortServiceDescription(svc, lng) {
    let rawDesc = svc && this.api && this.api.contact().shortServiceDescription(svc, lng)
    return rawDesc && '' + rawDesc || ''
  }

  contentHasData(c) {
    return this.api && this.api.contact().contentHasData(c) || false
  }

  _addHealthElement(e) {
    this.$['add-healthelement-dialog'].open()
    this.$['add-healthelement-dialog'].set('entity', {
      plansOfAction: [],
      tags: (e.target.dataset.tags ? e.target.dataset.tags.split(',') : []).map(c => ({id: c, type: c.split('|')[0], code: c.split('|')[1], version: c.split('|')[2]}))
    })
  }

  _addInactiveHealthElement(e) {
    this.$['add-healthelement-dialog'].open()
    this.$['add-healthelement-dialog'].set('entity', {
      plansOfAction: [],
      closingDate: parseInt(moment().format('YYYYMMDDHHmmss')),
      tags: (e.target.dataset.tags ? e.target.dataset.tags.split(',') : []).map(c => ({id: c, type: c.split('|')[0], code: c.split('|')[1], version: c.split('|')[2]}))
    })
  }

  _addService(e) {
    this.set('editedSvcLabel', e.target.dataset.label)
    this.$['add-service-dialog'].open()
    this.$['add-service-dialog'].set('entity', {
      'label': e.target.dataset.label,
      'tags': (e.target.dataset.tags ? e.target.dataset.tags.split(',') : []).map(c => ({id: c, type: c.split('|')[0], code: c.split('|')[1], version: c.split('|')[2]}))
    })
  }

  _healthElementsSelectorColumns() {
    return [{key: 'descr', title: 'Description'}, {key: 'plansOfActionDescr', title: 'Plans of action'}]
  }

  _healthElementsSelectorDataProvider() {
    return {
      filter: function (filterValue, limit, offset, sortKey, descending) {
        const regExp = filterValue && new RegExp(filterValue, "i")

        return Promise.all([this.api.code().findPaginatedCodesByLabel('be', 'BE-THESAURUS', 'fr', filterValue, null, 1000), this.api.entitytemplate().findEntityTemplates(this.user.id, 'org.taktik.icure.entities.HealthElementTemplate', null, true)]).then(results => {
          const codes = results[0]
          const entityTemplates = results[1]
          const filtered = _.flatten(entityTemplates.map(et => et.entity)).filter(he => [he].concat(he.plansOfAction || []).find(it => it.descr && it.descr.match(regExp) || it.name && it.name.match(regExp))).map(it => ({
            descr: it.descr || it.name,
            healthElement: it,
            plansOfAction: it.plansOfAction || [],
            plansOfActionDescr: (it.plansOfAction && it.plansOfAction.map(poa => poa.descr || poa.name) || []).join(',')
          })).concat(codes.rows.map(code => ({descr: this.api.localize(code.label), codes: [code.id].concat(code.links), plansOfAction: [], plansOfActionDescr: 'N/A'})))
          return {totalSize: filtered.length, rows: (descending ? _.reverse(_.sortBy(filtered, sortKey)) : _.sortBy(filtered, sortKey)).slice(offset, limit)}
        })
      }.bind(this)
    }
  }

  _normalizedHealthElement(healthElement) {
    return {
      descr: healthElement.descr,
      openingDate: healthElement.openingDate || +new Date(),
      closingDate: healthElement.closingDate,
      status: healthElement.status || 0,
      plansOfAction: (healthElement.plansOfAction || []).map(poa => _.extend(poa, {
        id: this.api.crypto().randomUuid(),
        openingDate: parseInt(moment().format('YYYYMMDDHHmmss'))
      })),
      tags: (healthElement.tags || []).map(c => this.api.code().normalize(c)),
      codes: (healthElement.codes || []).map(c => this.api.code().normalize(c)),
      idService: healthElement.idService
    }
  }

  _addedHealthElementSelected(event, healthElement) {
    this.api.helement().newInstance(this.user, this.patient, this._normalizedHealthElement(healthElement)).then(he => this.api.helement().createHealthElement(he)).then(he => this.patientChanged())
  }

  _editedHealthElementSelected(event, healthElement) {
    if (this.editedHealthElementModel.he.id) {
      this.api.helement().getHealthElement(this.editedHealthElementModel.he.id).then(he => {
        delete healthElement.plansOfActionDescr
        _.assign(he, this._normalizedHealthElement(healthElement))
        return he
      }).then(he => this.api.helement().modifyHealthElement(he)).then(he => this.patientChanged())
    } else if (this.editedHealthElementModel.he.idService) {
      const svc = this.editedHealthElementModel.he.svc
      return this.api.helement().serviceToHealthElement(this.user, this.patient, svc, this.language).then(he => {
        if (this.currentContact) {
          this.api.contact().promoteServiceInContact(this.currentContact, this.user, this.contacts, svc, undefined, null, he.id, null)
          this.saveCurrentContact().then(c => this.patientChanged())
        }

        this.editedHealthElementModel.he = he
        return this._editedHealthElementSelected(event, healthElement)
      })
    }
  }

  _servicesSelectorColumns() {
    return [{
      key: svc => svc && svc.content && this.shortServiceDescription(svc, this.language) || '',
      sortKey: 'content.' + this.language + '.stringValue',
      title: 'Description'
    }, {
      key: svc => svc && svc.codes && svc.codes.map(c => (c.type || c.id && c.id.split('|')[0]) + ':' + (c.code || c.id && c.id.split('|')[1])).join(',') || '',
      sortKey: 'codes.0.code',
      title: 'Codes'
    }]
  }

  _servicesSelectorDataProvider(label) {
    return {
      filter: function (filterValue, limit, offset, sortKey, descending) {
        const regExp = filterValue && new RegExp(filterValue, "i")

        return this.api.code().findPaginatedCodesByLabel('be', 'BE-THESAURUS', 'fr', filterValue, null, 1000).then(results => {
          const filtered = results.rows.map(code => ({
            label: label,
            content: _.mapValues(code.label, v => ({stringValue: v})),
            codes: code.links && code.links.map(c => ({id: c, type: c.split('|')[0], code: c.split('|')[1], version: c.split('|')[2]})) || []
          }))
          return {totalSize: filtered.length, rows: (descending ? _.reverse(_.sortBy(filtered, sortKey)) : _.sortBy(filtered, sortKey)).slice(offset, limit)}
        })
      }.bind(this)
    }
  }

  _addedOrEditedServiceSelected(event, svc) {
    if (!this.currentContact) {
      return
    }
    this.saveService(svc).then(c => this.patientChanged())
  }

  _svcEntityContentChanged(e, value) {
    const svc = styx.parent(e.target, el => el.tagName.toLowerCase() === 'entity-selector').entity
    const content = svc.content || (svc.content = {});
    (content[this.language] || (content[this.language] = {})).stringValue = value
  }

  _updateFilterPanels() {
    setTimeout(() => {
      const cfp = Polymer.dom(this.root).querySelector("#contactFilterPanel")
      cfp && cfp.refreshIcons()
      const hpd = Polymer.dom(this.root).querySelector("ht-pat-detail-ctc-detail-panel")
      hpd && hpd.refreshIcons()
    }, 10)
  }

  _expandColumn(e) {
    this.root.querySelector('.display-left-menu').classList.toggle('open')
    this.root.querySelector('.container').classList.toggle('expanded')
    this._updateFilterPanels()
  }

  _concat(a, b) {
    return (a || []).concat(b || [])
  }
}

customElements.define(HtPatDetail.is, HtPatDetail)
