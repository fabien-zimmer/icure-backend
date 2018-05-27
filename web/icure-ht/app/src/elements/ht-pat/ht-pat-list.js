/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '../dynamic-form/ckmeans-grouping.js';

import moment from 'moment/src/moment'
import _ from 'lodash/lodash'
import filterExParser from '../../../scripts/filterExParser'

class HtPatList extends Polymer.TkLocalizerMixin(Polymer.mixinBehaviors([], Polymer.Element)) {
  static get template() {
    return Polymer.html`
        <custom-style>
            <style is="custom-style">
                :host {
                    display: block;
                    height: 100%;
                    @apply --padding-right-left-32;
                }

                :host #patients-list {
                    height: calc(100% - 124px);
                    outline: none;
                }

                paper-input {
                    --paper-input-container-focus-color: var(--app-primary-color);
                    --paper-input-container-label: {
                        color: var(--app-text-color);
                        opacity: 1;
                    };
                    --paper-input-container-underline-disabled: {
                        border-bottom: 1px solid var(--app-text-color);

                    };
                    --paper-input-container-color: var(--app-text-color);
                }

                .horizontal {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    flex-basis: 100%;
                    align-items: center;
                }

                .horizontal paper-input {
                    height: 90px;
                    @apply --padding-right-left-16
                }

                .horizontal vaadin-date-picker {
                    height: 90px;
                    padding-bottom: 0px;
                    @apply --padding-right-left-16
                }

                vaadin-grid.material {

                    font-family: Roboto, sans-serif;
                    --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));

                    --vaadin-grid-cell: {
                        padding: 8px;
                    };

                    --vaadin-grid-header-cell: {
                        height: 64px;
                        color: rgba(0, 0, 0, var(--dark-secondary-opacity));
                        font-size: 12px;
                    };

                    --vaadin-grid-body-cell: {
                        height: 48px;
                        color: rgba(0, 0, 0, var(--dark-primary-opacity));
                        font-size: 13px;
                    };

                    --vaadin-grid-body-row-hover-cell: {
                        background-color: var(--paper-grey-200);
                    };

                    --vaadin-grid-body-row-selected-cell: {
                        background-color: var(--paper-grey-100);
                    };

                    --vaadin-grid-focused-cell: {
                        box-shadow: none;
                        font-weight: bold;
                    };
                }

                vaadin-grid.material .cell {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding-right: 56px;
                }

                vaadin-grid.material .cell.last {
                    padding-right: 24px;
                }

                vaadin-grid.material .cell.numeric {
                    text-align: right;
                }

                vaadin-grid.material paper-checkbox {
                    --primary-color: var(--paper-indigo-500);
                    margin: 0 24px;
                }

                vaadin-grid.material vaadin-grid-sorter .cell {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                vaadin-grid.material vaadin-grid-sorter iron-icon {
                    transform: scale(0.8);
                }

                vaadin-grid.material vaadin-grid-sorter:not([direction]) iron-icon {
                    color: rgba(0, 0, 0, var(--dark-disabled-opacity));
                }

                vaadin-grid.material vaadin-grid-sorter[direction] {
                    color: rgba(0, 0, 0, var(--dark-primary-opacity));
                }

                vaadin-grid.material vaadin-grid-sorter[direction=desc] iron-icon {
                    transform: scale(0.8) rotate(180deg);
                }

                .add-btn-container {
                    position: fixed;
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    bottom: 16px;
                    left: 0;
                }

                .add-btn {
                    --paper-button-ink-color: var(--app-secondary-color-dark);
                    background: var(--app-secondary-color);
                    color: var(--app-text-color);
                    font-weight: bold;
                    font-size: 14px;
                    height: 40px;
                    min-width: 100px;
                    @apply --shadow-elevation-2dp;
                    padding: 10px 1.2em;
                }

                .patient-photo {
                    background: rgba(0, 0, 0, 0.1);
                    height: 26px;
                    width: 26px;
                    min-width: 26px;
                    border-radius: 50%;
                    margin-right: 8px;
                    overflow: hidden !important;
                    padding-right: 0 !important;
                }

                .patient-photo img {
                    width: 100%;
                    margin: 50%;
                    transform: translate(-50%, -50%);
                }
            </style>
        </custom-style>

        <paper-input id="filter" label="Filter" value="{{filterValue}}" on-keydown="refresh"></paper-input>
        <vaadin-grid id="patients-list" class="material" multi-sort="[[multiSort]]" active-item="{{activeItem}}" on-tap="click">
            <vaadin-grid-column width="32px">
                <template class="header">
                    <div class="cell frozen">[[localize('pic','Picture',language)]]</div>
                </template>
                <template>
                    <div class="cell frozen patient-photo"><img src\$="[[picture(item)]]"></div>
                </template>
            </vaadin-grid-column>

            <vaadin-grid-column width="100px">
                <template class="header">
                    <vaadin-grid-sorter path="lastName">[[localize('las_nam','Last name',language)]]</vaadin-grid-sorter>
                </template>
                <template>
                    <div class="cell frozen">[[item.lastName]]</div>
                </template>
            </vaadin-grid-column>
            <vaadin-grid-column width="100px">
                <template class="header">
                    <vaadin-grid-sorter path="firstName">[[localize('fir_nam','First name',language)]]</vaadin-grid-sorter>
                </template>
                <template>
                    <div class="cell frozen">[[item.firstName]]</div>
                </template>
            </vaadin-grid-column>
            <vaadin-grid-column width="100px">
                <template class="header">
                    <vaadin-grid-sorter path="dateOfBirth">[[localize('dat_of_bir','Date of birth',language)]]</vaadin-grid-sorter>
                </template>
                <template>
                    <div class="cell frozen">[[formatDateOfBirth(item.dateOfBirth)]]</div>
                </template>
            </vaadin-grid-column>
            <vaadin-grid-column width="100px">
                <template class="header">
                    <div class="cell frozen">[[localize('ema','Email',language)]]</div>
                </template>
                <template>
                    <div class="cell frozen">[[item.email]]</div>
                </template>
            </vaadin-grid-column>
            <vaadin-grid-column>
                <template class="header">
                    <div class="cell numeric">[[localize('pho','Phone',language)]]</div>
                </template>
                <template>
                    <div class="cell numeric">[[item.phone]]</div>
                </template>
            </vaadin-grid-column>
            <vaadin-grid-column>
                <template class="header">
                    <div class="cell numeric">[[localize('mob','Mobile',language)]]</div>
                </template>
                <template>
                    <div class="cell numeric">[[item.mobile]]</div>
                </template>
            </vaadin-grid-column>
        </vaadin-grid>
        <div class="add-btn-container">
            <paper-button class="add-btn" on-tap="_addPatient">[[localize('add_pat','Add Patient',language)]]</paper-button>
        </div>
        <paper-dialog id="add-patient-dialog">
            <div class="horizontal">
                <paper-input label="Last name" style="min-width:200px" value="{{lastName}}"></paper-input>
                <paper-input label="First name" value="{{firstName}}"></paper-input>
                <vaadin-date-picker label="Date of Birth" i18n="[[i18n]]" value="{{dateAsString}}"></vaadin-date-picker>
            </div>
            <div class="buttons">
                <paper-button dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button dialog-confirm="" autofocus="" on-tap="confirm">[[localize('cre','Create',language)]]</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
    return 'ht-pat-list'
  }

  static get properties() {
    return {
      api: {
        type: Object
      },
      user: {
        type: Object
      },
      selectedPatient: {
        type: Object,
        notify: true
      },
      activeItem: {
        type: Object
      },
      i18n: {
        Type: Object,
        value: function () {
          moment.locale('fr')
          const res = {
            monthNames: moment.months(),
            weekdays: moment.weekdays(),
            weekdaysShort: moment.weekdaysShort(),
            firstDayOfWeek: moment.localeData().firstDayOfWeek(),
            week: 'Semaine',
            calendar: 'Calendrier',
            clear: 'Clear',
            today: 'Aujourd\'hui',
            cancel: 'Annuler',
            formatDate: function (d) {
              //return moment(d).format(moment.localeData().longDateFormat('L'))
              return moment(d).format('DD/MM/YYYY')
            },
            parseDate: function (s) {
              return moment(s, 'DD/MM/YYYY').toDate()
            },
            formatTitle: function (monthName, fullYear) {
              return monthName + ' ' + fullYear
            }
          }
          return res
        }
      }
    }
  }

  constructor() {
    super()
  }

  ready() {
    super.ready()

    var grid = this.$['patients-list']

    grid.lastParams = null //Used to prevent double calls
    grid.size = 0
    grid.pageSize = 50
    grid.dataProvider = function (params, callback) {
      const sort = params.sortOrders && params.sortOrders[0] && params.sortOrders[0].path || 'lastName'
      const desc = params.sortOrders && params.sortOrders[0] && params.sortOrders[0].direction === 'desc' || false

      const pageSize = params.pageSize || grid.pageSize
      const startIndex = (params.page || 0) * pageSize
      const endIndex = ((params.page || 0) + 1) * pageSize

      const thisParams = this.filterValue + "|" + sort + "|" + (desc ? "<|" : ">|") + startIndex + ":" + pageSize + ":"

      let latestSearchValue = this.filterValue
      this.latestSearchValue = latestSearchValue

      if (!latestSearchValue || latestSearchValue.length < 2) {
        console.log("Cancelling empty search")
        grid.set("size", 0)
        callback([])
        return
      }

      let svcFilter = null
      try {
        svcFilter = filterExParser.parse(latestSearchValue, {hcpId: this.user.healthcarePartyId})
      } catch (ignored) {
      }

      const filter = svcFilter ? null : /^[0-9]{11}$/.test(latestSearchValue) ? {
        '$type': 'PatientByHcPartyAndSsinFilter',
        'healthcarePartyId': this.user.healthcarePartyId,
        'ssin': latestSearchValue
      } : /^[0-3][0-9]?\/(1[0-2]|[0-9])\/([1-2][89012])?[0-9][0-9]$/.test(latestSearchValue) ? {
        '$type': 'PatientByHcPartyDateOfBirthFilter',
        'healthcarePartyId': this.user.healthcarePartyId,
        'dateOfBirth': latestSearchValue.replace(/([0-3][0-9]?)\/(1[0-2]|[0-9])\/(([1-2][89012])?[0-9][0-9])/g, '$3$2$1')
      } : {'$type': 'PatientByHcPartyNameContainsFuzzyFilter', 'healthcarePartyId': this.user.healthcarePartyId, 'searchString': latestSearchValue}

      if (grid.lastParams !== thisParams) {
        grid.lastParams = thisParams
        console.log("Starting search for " + thisParams)
        grid.latestPromise = svcFilter ? this.api.contact().filterServicesBy(null, null, 10000, {filter: svcFilter}).then(out => {
          let rows = out.rows

          const svcDict = rows.reduce((acc, s) => {
            const cs = acc[s.id]
            if (!cs || !cs.modified || s.modified && this.api.after(s.modified, cs.modified)) {
              acc[s.id] = s
            }
            return acc
          }, {})
          const services = _.sortBy(Object.values(svcDict).filter(s => !s.endOfLife), [s => +this.api.moment(s.modified || s.created || s.valueDate)])
          const hcpId = this.user.healthcarePartyId

          const ownersOfDelegations = services.reduce((acc, s) => {
            s.cryptedForeignKeys[hcpId].forEach(d => acc[d.owner] = 1)
            return acc
          }, {})
          const importedAESHcPartyKeys = {}
          return this.api.hcparty().getHcPartyKeysForDelegate(hcpId).then(keys => Promise.all(Object.keys(ownersOfDelegations).map(ownerId => this.api.crypto().decryptHcPartyKey(ownerId, hcpId, keys[ownerId]).then(importedAESHcPartyKey => importedAESHcPartyKeys[ownerId] = importedAESHcPartyKey)))).then(() => Promise.all(services.map(s => Promise.all(s.cryptedForeignKeys[hcpId].map(k => this.api.crypto().AES.decrypt(importedAESHcPartyKeys[k.owner].key, this.api.crypto().utils.hex2ua(k.key))))))).then(arraysOfArraysOfPatIdsAsUa => {
            return this.api.patient().filterBy(null, null, endIndex || grid.pageSize, params.index, sort, desc, {
              filter: {
                '$type': 'PatientByIdsFilter',
                'ids': _.uniqBy(_.compact(_.flatMap(arraysOfArraysOfPatIdsAsUa).map(ua => this.api.crypto().utils.ua2text(ua).split(':')[1])))
              }
            })
          })
        }) : this.api.patient().filterBy(null, null, endIndex || grid.pageSize, params.index, sort, desc, {filter: filter})
      }

      grid.latestPromise.then(function (res) {
        if (this.filterValue !== latestSearchValue) {
          console.log("Cancelling obsolete search")
          return
        }
        if (grid.size !== res.totalSize) {
          grid.set("size", res.totalSize)
        }
        callback(_.slice(res.rows, startIndex, endIndex).map(this.pimpPatient))
      }.bind(this))
    }.bind(this)
  }

  formatDateOfBirth(dateOfBirth) {
    return dateOfBirth ? ("" + dateOfBirth).replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$3/$2/$1') : 'N/A'
  }

  refresh() {
    //Give the gui the time to update the field
    setTimeout(function () {
      let currentValue = this.filterValue

      if (this.latestSearchValue === currentValue) {
        return
      }
      setTimeout(function () {
        if (currentValue === this.filterValue) {
          console.log("Triggering search for " + this.filterValue)
          this.$['patients-list'].clearCache()
        } else {
          console.log("Skipping search for " + this.filterValue + " != " + currentValue)
        }
      }.bind(this), 500) //Wait for the user to stop typing
    }.bind(this), 100)
  }

  pimpPatient(p) {
    p.email = p.addresses && p.addresses.map(a => a.telecoms && a.telecoms.filter(t => t.telecomType === 'email').map(t => t.telecomNumber).join()).filter(a => a).join() || ''
    p.phone = p.addresses && p.addresses.map(a => a.telecoms && a.telecoms.filter(t => t.telecomType === 'phone').map(t => t.telecomNumber).join()).filter(a => a).join() || ''
    p.mobile = p.addresses && p.addresses.map(a => a.telecoms && a.telecoms.filter(t => t.telecomType === 'mobile').map(t => t.telecomNumber).join()).filter(a => a).join() || ''
    return p
  }

  click(e) {
    const selected = this.activeItem
    console.log('selected ' + selected + ' - ' + this.latestSelected)
    this.set('selectedPatient', selected)
    /*if (this.inDoubleClick && ((this.latestSelected === selected) || (this.latestSelected && !selected) || (!this.latestSelected && selected))) {
  this.set('selectedPatient', selected || this.latestSelected)
} else {
  this.latestSelected = selected
  this.inDoubleClick = true
  setTimeout(() => {
      delete this.inDoubleClick
  }, 500)
}*/
  }

  _addPatient() {
    this.$['add-patient-dialog'].open()
  }

  confirm() {
    this.api.patient().newInstance(this.user, {
      lastName: this.lastName,
      firstName: this.firstName,
      dateOfBirth: this.dateAsString && parseInt(this.dateAsString.replace(/-/g, ''))
    }).then(p => this.api.patient().createPatient(p)).then(p => this.set('selectedPatient', p))
  }

  picture(pat) {
    if (!pat) {
      return require('../../../images/Male-128.jpg')
    }
    return pat.picture ? 'data:image/jpeg;base64,' + pat.picture : pat.gender === 'female' ? require('../../../images/Female-128.jpg') : require('../../../images/Male-128.jpg')
  }
}

customElements.define(HtPatList.is, HtPatList)
