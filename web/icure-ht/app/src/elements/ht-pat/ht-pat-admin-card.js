/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '../dynamic-form/dynamic-form.js';

class HtPatAdminCard extends Polymer.TkLocalizerMixin(Polymer.mixinBehaviors([], Polymer.Element)) {
  static get template() {
    return Polymer.html`
        <style include="iron-flex iron-flex-alignment"></style>
        <style>
            :host {
                height: 100%;
                padding-top: 32px;
            }

            .container {
                width: 100%;
                height: 100%;
            }

            paper-material.card {
                background-color: #fff;
                padding: 10px;
                margin-left: 5px;
                margin-right: 5px;
                margin-bottom: 10px;
            }

            paper-input {
                padding-left: 5px;
                padding-right: 5px;
            }

            paper-dropdown-menu {
                padding-left: 5px;
                padding-right: 5px;
            }

        </style>

        <dynamic-form id="dynamic-form" api="[[api]]" user="[[user]]" template="[[patientForm]]" data-map="[[patientMap]]" data-provider="[[dataProvider]]"></dynamic-form>
`;
  }

  static get is() {
    return 'ht-pat-admin-card'
  }

  static get properties() {
    return {
      api: {
        type: Object
      },
      patientForm: {
        type: Object,
        value: function () {
          return require('./rsrc/PatientAdministrativeForm.json')
        }
      },
      addressForm: {
        type: Object,
        value: function () {
          return require('./rsrc/PatientAddressForm.json')
        }
      },
      telecomForm: {
        type: Object,
        value: function () {
          return require('./rsrc/PatientTelecomForm.json')
        }
      },
      insuranceForm: {
        type: Object,
        value: function () {
          return require('./rsrc/PatientInsuranceForm.json')
        }
      },
      user: {
        type: Object
      },
      patient: {
        type: Object,
        notify: true
      },
      patientMap: {
        type: Object
      },
      dataProvider: {
        type: Object,
        value: null
      }
    }
  }

  static get observers() {
    return ['patientChanged(api,user,patient)']
  }

  constructor() {
    super()
  }

  detached() {
    this.flushSave()
  }

  patientChanged() {
    if (this.api && this.user && this.patient) {
      this.flushSave()
      this.dataProvider = this.patientDataProvider(this.patient, '', this.patient && this.patient.id)
      this.set('patientMap', _.cloneDeep(this.patient))
      this.$['dynamic-form'].loadDataMap()
    }
  }

  scheduleSave(patient) {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
    }
    this.saveAction = function () {
      this.api.patient().modifyPatient(patient).then(p => this.patient && (this.patient.rev = p.rev)).catch(e => this.patient && this.api.patient().getPatient(this.patient.id).then(p => {
        this.patient = p
        this.saveTimeout = undefined
        this.saveAction = undefined
      }))
    }.bind(this)
    this.saveTimeout = setTimeout(this.saveAction, 10000)
  }

  flushSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
      this.saveAction()
    }
  }

  patientDataProvider(root, rootPath, id) {
    const getValue = function (key) {
      return root ? _.get(root, key) : null
    }
    const setValue = function (key, value) {
      if (root && _.get(root, key) !== value) {
        root === this.patient ? this.set('patient.' + key, value) : _.set(root, key, value)
        this.scheduleSave(this.patient)
      }
    }.bind(this)
    return {
      getStringValue: getValue,
      getNumberValue: getValue,
      getMeasureValue: getValue,
      getDateValue: getValue,
      getBooleanValue: key => root ? _.get(root, key) && _.get(root, key) !== 'false' : null,
      setStringValue: setValue,
      setNumberValue: setValue,
      setMeasureValue: setValue,
      setDateValue: setValue,
      setBooleanValue: setValue,
      getSubForms: function (key) {
        return (root[key] || []).map((a, idx) => {
          return {
            dataMap: a,
            dataProvider: this.patientDataProvider(a, (rootPath.length ? rootPath + '.' : '') + key + '.' + idx, a.id || (a.id = this.api.crypto().randomUuid())),
            template: key === 'addresses' ? this.addressForm : key === 'telecoms' ? this.telecomForm : this.insuranceForm
          }
        })
      }.bind(this),
      getId: () => id,
      deleteSubForm: (key, id) => {
        this.flushSave()
        _.remove(root[key], root[key].find(a => a.id === id))
        this.$['dynamic-form'].notify((rootPath.length ? rootPath + '.' : '') + key + '.*')
        this.scheduleSave(this.patient)
      },
      addSubForm: (key, guid) => {
        this.flushSave(); //Important
        (root[key] || (root[key] = [])).push({})
        this.$['dynamic-form'].notify((rootPath.length ? rootPath + '.' : '') + key + '.*')
        this.scheduleSave(this.patient)
      },
      filter: (data, text, id) => {
        if (data.source === 'insurances') {
          return (text || '').length >= 2 ? this.api.insurance().listInsurancesByName(text).then(res => res.map(i => ({
            'id': i.id,
            'name': this.localize(i.name, this.language)
          }))) : id ? this.api.insurance().getInsurance(id).then(i => ({'id': i.id, 'name': this.localize(i.name, this.language)})) : Promise.resolve([])
        }
      }
    }
  }

  localize(e, lng) {
    return this.api && this.api.contact().localize(e, lng) || ""
  }
}

customElements.define(HtPatAdminCard.is, HtPatAdminCard)
