import accounting from '../../../scripts/accounting'

class DynamicMedicationField extends Polymer.TkLocalizerMixin(Polymer.mixinBehaviors([], Polymer.Element)) {
  static get template() {
    return Polymer.html`
        <style>

            :host {
                display: block;
                flex-grow: var(--dynamic-field-width, 100);
                min-width: calc(var(--dynamic-field-width-percent, '100%') - 32px);
                font-size: 12px;
                margin: 0 16px;
                position: relative;
            }

            dynamic-link {
                position: absolute;
                right: 0;
                top: 4px;
            }

            .modified-icon {
                width: 18px;
            }

            .modified-previous-value {
                color: var(--app-text-color-disabled);
                text-decoration: line-through;
                font-style: italic;
            }

            .modified-before-out {
                color: var(--app-secondary-color-dark);
                text-align: right;
                float: right;
                font-style: italic;
                border-bottom: 1px dotted var(--app-secondary-color-dark);
            }

            .modified-after-out {
                color: var(--app-secondary-color-dark);
                text-align: right;
                float: right;
                font-style: italic;
                border-bottom: 1px dotted var(--app-secondary-color-dark);
            }

            .medication-line {
                margin: 4px 0;
                text-overflow: ellipsis;
                height: 18px;
                font-size: 13px;
                width: 100%;
                min-width: initial;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                flex-wrap: nowrap;
            }

            .medication-line > span {
                padding: 0 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 90%;
                white-space: nowrap;
            }

            .medication-line > .action-buttons {
                width: 45px;
                padding-right: 0;
            }

            paper-dropdown-menu, paper-listbox {
                width: 250px;
            }

            .tokens paper-button iron-icon {
                height: 16px;
                width: 16px;
            }

            paper-input {
                --paper-input-container-focus-color: var(--app-primary-color);
                --paper-input-container-label: {
                    color: var(--app-text-color);
                    opacity: 1;
                };
            }

            input {
                font: inherit;
                outline: 0;
                box-shadow: none;
                border: none;
                width: auto;
                max-width: 100%;
                min-width: 1.8em;
                font-size: var(--form-font-size);
            }

            label {
                white-space: var(--paper-font-common-nowrap_-_white-space);
                overflow: var(--paper-font-common-nowrap_-_overflow);
                text-overflow: var(--paper-font-common-nowrap_-_text-overflow);
                font-family: var(--paper-font-subhead_-_font-family);
                -webkit-font-smoothing: var(--paper-font-subhead_-_-webkit-font-smoothing);
                font-size: 12px; /* var(--paper-font-subhead_-_font-size); */
                font-weight: var(--paper-font-subhead_-_font-weight);
                line-height: var(--paper-font-subhead_-_line-height);
                color: var(--paper-input-container-label_-_color, var(--paper-input-container-color, var(--secondary-text-color)));
            }

            ul {
                padding-left: 0;
                border: 1px dashed rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                margin-top: 4px;
                margin-bottom: 4px;
            }

            ul li {
                list-style: none;
            }

            .action-buttons {
                float: right;
                width: 40px;
                height: 20px;
                padding-right: 8px;
            }

            .action-buttons paper-icon-button {
                padding: 2px;
                margin-top: -1px;
            }

            paper-icon-button {
                height: 20px;
                width: 20px;
                padding: 2px;
            }

            .container {
                @apply(--layout-horizontal);
            }

            iron-selector > * {
                padding: 16px 16px;
            }

            label,
            .container {
                cursor: text;
            }

            paper-dialog {
                min-width: 600px;
                width: 80%;
            }

            .regimen-line {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: flex-end;

            }

            .regimen-line paper-icon-button {
                margin-left: 12px;
                margin-bottom: 12px;
                height: 20px;
                width: 20px;
                padding: 2px;
            }

            .regimen--frequency, {
                flex-grow: 3;
                margin: auto;
                padding: 0 8px 0 0;
            }

            .regimen--tod {
                flex-grow: 3;
                margin: auto;
                padding: 0 8px 0 8px;
            }

            .regimen--quantity {
                flex-grow: 1;
                margin: auto;
                padding: 0 8px 0 8px;
                max-width: 80px;

            }

            .regimen--units {
                flex-grow: 3;
                margin: auto;
                padding: 0 0 0 8px;
            }

            vaadin-grid {
                --vaadin-grid-body-row-hover-cell: {
                    background-color: var(--app-primary-color);
                    color: white;
                };
                --vaadin-grid-body-row-selected-cell: {
                    background-color: var(--app-primary-color);
                    color: white;
                };
            }

            .modal-title {
                background: var(--app-background-color-dark);
                margin-top: 0;
                padding: 16px 24px;
            }

            .modal-button {
                --paper-button-ink-color: var(--app-secondary-color-dark);
                color: var(--app-text-color);
                font-weight: 400;
                font-size: 14px;
                height: 40px;
                min-width: 100px;
                padding: 10px 1.2em;
            }

            .modal-button--save {
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                background: var(--app-secondary-color);
                color: var(--app-primary-color-dark);
                font-weight: 700;

            }

        </style>

        <label hidden\$="[[!label]]" aria-hidden="true">
            <span>[[label]]</span>
        </label>
        <dynamic-link i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" linkables="[[linkables]]" represented-object="[[label]]"></dynamic-link>

        <template is="dom-if" if="[[wasModified]]">
            <span class="modified-before-out">modified [[lastModified]] <iron-icon class="modified-icon" icon="schedule"></iron-icon></span>
        </template>
        <template is="dom-if" if="[[isModifiedAfter]]">
            <span class="modified-after-out">[[localize('obs_val','obsolete value',language)]]<iron-icon class="modified-icon" icon="report-problem"></iron-icon></span>
        </template>

        <ul>
            <template is="dom-repeat" items="[[localizedValue]]" as="lv">
                <li id="[[lv.id]]" class="medication-line"><span>[[lv.stringValue]]</span>
                    <div class="action-buttons">
                        <paper-icon-button icon="create" on-tap="editMedication"></paper-icon-button>
                        <paper-icon-button icon="clear" on-tap="clearMedication"></paper-icon-button>
                    </div>
                </li>
            </template>
        </ul>

        <paper-icon-button icon="add" on-tap="addMedication"></paper-icon-button>
        <a on-tap="addMedication()">[[localize('add_pre_dru','Add prescription drug',language)]]</a>

        <paper-dialog id="medication-selection" always-on-top="true">
            <h2 class="modal-title">[[localize('sel_med','Select medication',language)]]</h2>
            <paper-input id="filter" label="Filter" value="{{filterValue}}" on-keydown="refresh"></paper-input>
            <vaadin-grid id="entities-list" class="material" active-item="{{selectedMedicationFromList}}" on-tap="click">
                <template is="dom-repeat" items="[[columns]]" as="column">
                    <vaadin-grid-column width="[[_columnWidth(column)]]">
                        <template class="header">
                            <vaadin-grid-sorter path="[[column.key]]">[[column.title]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[_cellContent(item, column)]]</div>
                        </template>
                    </vaadin-grid-column>
                </template>
            </vaadin-grid>
            <div class="buttons">
                <paper-button class="modal-button modal-button--cancel" dialog-dismiss="" on-tap="skip">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="modal-button modal-button--save" dialog-confirm="" autofocus="" on-tap="confirm">[[localize('sel','Select',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="medication-detail" always-on-top="true" no-cancel-on-outside-click="true">
            <h2 class="modal-title">[[localize('med_det','Medication detail',language)]]</h2>
            <paper-input id="filter" label="Medication" value="{{selectedMedicationContentWithId.medicationValue.medicinalProduct.intendedname}}"></paper-input>
            <template id="rgRepeat" is="dom-repeat" items="[[selectedMedicationContentWithId.medicationValue.regimen]]" as="rg">
                <div class="regimen-line">
                    <paper-dropdown-menu label="Frequency" class="regimen--frequency">
                        <paper-listbox slot="dropdown-content" selected="[[_selectedFrequency(rg, rg.weekday, rg.date)]]" on-iron-select="_selectFrequency">
                            <paper-item id="daily">[[localize('dai','Daily',language)]]</paper-item>
                            <paper-item id="weekly">[[localize('wee','Weekly',language)]]</paper-item>
                            <paper-item id="monthly">[[localize('mon','Monthly',language)]]</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <template is="dom-if" if="[[rg.weekday]]">
                    </template>
                    <template is="dom-if" if="[[!rg.weekday]]">
                        <template is="dom-if" if="[[rg.date]]">
                        </template>
                        <template is="dom-if" if="[[!rg.date]]">
                            <paper-dropdown-menu label="Time of day" class="regimen--tod">
                                <paper-listbox slot="dropdown-content" selected="rg.dayPeriod.code" attr-for-selected="id" on-iron-select="_selectDayPeriod">
                                    <paper-item id="beforebreakfast">[[_localize("Beforebreakfast")]]</paper-item>
                                    <paper-item id="duringbreakfast">[[_localize("Duringbreakfast")]]</paper-item>
                                    <paper-item id="afterbreakfast">[[_localize("Afterbreakfast")]]</paper-item>
                                    <paper-item id="morning">[[_localize("Morning")]]</paper-item>
                                    <paper-item id="beforelunch">[[_localize("Beforelunch")]]</paper-item>
                                    <paper-item id="noon">[[_localize("Noon")]]</paper-item>
                                    <paper-item id="afternoon">[[_localize("Afternoon")]]</paper-item>
                                    <paper-item id="duringlunch">[[_localize("Duringlunch")]]</paper-item>
                                    <paper-item id="afterlunch">[[_localize("Afterlunch")]]</paper-item>
                                    <paper-item id="beforedinner">[[_localize("Beforedinner")]]</paper-item>
                                    <paper-item id="duringdinner">[[_localize("Duringdinner")]]</paper-item>
                                    <paper-item id="afterdinner">[[_localize("Afterdinner")]]</paper-item>
                                    <paper-item id="evening">[[_localize("Evening")]]</paper-item>
                                    <paper-item id="night">[[_localize("Night")]]</paper-item>
                                    <hr>
                                    <paper-item>[[_localize("Precise hour")]]</paper-item>
                                </paper-listbox>
                            </paper-dropdown-menu>
                        </template>
                    </template>
                    <paper-input id="quantity" label="Quantity" value="{{rg.administratedQuantity.quantity}}" type="number" class="regimen--quantity" on-change="_valueChanged"></paper-input>
                    <paper-input id="quantity" label="Units" value="{{rg.administratedQuantity.unit}}" class="regimen--units" on-change="_valueChanged"></paper-input>
                    <paper-icon-button icon="clear" on-tap="clearPosologyRegimen"></paper-icon-button>
                </div>
            </template>


            <paper-button on-tap="addPosologyRegimen">
                <iron-icon icon="add"></iron-icon>
                [[localize('add_pos_reg','Add posology regimen',language)]]
            </paper-button>
            <div class="buttons">
                <paper-button dialog-confirm="" autofocus="" on-tap="close" class="modal-button modal-button--save">[[localize('save','Save',language)]]</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
    return 'dynamic-medication-field'
  }

  static get properties() {
    return {
      api: {
        type: Object
      },
      wasModified: {
        type: Boolean
      },
      isModifiedAfter: {
        type: Boolean
      },
      readOnly: {
        type: Boolean,
        value: false
      },
      lastModified: {
        type: String
      },
      label: {
        type: String
      },
      context: {
        type: String
      },
      value: {
        type: Array,
        notify: true,
        value: function () {
          return []
        }
      },
      shelf: { //Where the items from value are stored during a move
        type: Array,
        notify: true,
        value: function () {
          return []
        }
      },
      localizedValue: {
        type: Array,
        value: function () {
          return []
        }
      },
      input: {
        type: String
      },
      width: {
        type: Number,
        value: 48,
        observer: '_widthChanged'
      },
      columns: {
        type: Array,
        value: function () {
          return [{key: 'name', title: 'Name', size: '400px'}, {key: 'pricepatstd', title: 'Price pat.'}, {key: 'pubprice', title: 'Price'}]
        }
      },

      entityType: {
        type: String,
        value: 'entity'
      },

      dataProvider: {
        type: Object,
        value: null
      },

      selectedMedicationFromList: {
        type: Object,
        value: null,
        observer: "_selectedMedicationFromListChanged"
      },
      selectedMedicationContentWithId: {
        type: Object,
        value: null
      }
    }
  }

  static get observers() {
    return ['_valueChanged(value.*, selectedMedicationContentWithId.medicationValue.medicinalProduct, selectedMedicationContentWithId.medicationValue.substanceProduct, selectedMedicationContentWithId.medicationValue.regimen.*)']
  }

  constructor() {
    super()
  }

  ready() {
    super.ready()

    var grid = this.$['entities-list']

    grid.lastParams = null //Used to prevent double calls
    grid.size = 0
    grid.pageSize = 50
    grid.dataProvider = function (params, callback) {
      const sort = params.sortOrders && params.sortOrders[0] && params.sortOrders[0].path || this.columns[0] && this.columns[0].key
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

      grid.lastParams = thisParams
      console.log("Starting search for " + thisParams)

      const limit = endIndex || grid.pageSize
      const offset = params.index

      this.api.bedrugs().getMedecinePackages(this.latestSearchValue, this.language, null, 0, 100).then(packs => {
        return {totalSize: packs.length, rows: (desc ? _.reverse(_.sortBy(packs, sort)) : _.sortBy(packs, sort)).slice(offset, limit)}
      }).then(function (res) {
        if (this.filterValue !== latestSearchValue) {
          console.log("Cancelling obsolete search")
          return
        }
        if (grid.size !== res.totalSize) {
          grid.set("size", res.totalSize)
        }
        callback(_.slice(res.rows, startIndex, endIndex))
      }.bind(this))
    }.bind(this)
  }

  _cellContent(item, column) {
    return column.key.indexOf("price") !== -1 ? accounting.formatMoney(_.get(item, column.key) / 100, "€", 2, " ", ",") : _.get(item, column.key)
  }

  _columnWidth(column) {
    return column.size || "100px"
  }

  click(e) {
    const selected = this.selectedMedicationFromList

    console.log('selected ' + selected + ' - ' + this.latestSelected)
    if (this.inDoubleClick && (this.latestSelected === selected || this.latestSelected && !selected || !this.latestSelected && selected)) {
      this.select(this.latestSelected)
    } else {
      this.latestSelected = selected
      this.inDoubleClick = true
      setTimeout(() => {
        delete this.inDoubleClick
      }, 500)
    }
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
          this.$['entities-list'].clearCache()
        } else {
          console.log("Skipping search for " + this.filterValue + " != " + currentValue)
        }
      }.bind(this), 500) //Wait for the user to stop typing
    }.bind(this), 100)
  }

  confirm() {
    if (this.selectedMedicationFromList) {
      this.select(this.selectedMedicationFromList)
    }
  }

  skip() {
    if (this.selectedMedicationContentWithId && this.selectedMedicationContentWithId.isNew && this.selectedMedicationContentWithId.id) {
      const currentId = this.selectedMedicationContentWithId.id
      this.select(null)
      this.splice('value', this.value.findIndex(s => s.id === currentId), 1)
    }
  }

  close() {
  }

  select(item) {
    if (item) {
      this.selectMedicationFromList(item)
      this.$['medication-selection'].close()
    }
  }

  _selectedMedicationFromListChanged(item) {
    var grid = this.$['entities-list']
    grid.selectedItems = item ? [item] : []
  }

  _localizedValueChanged(change) {
    const current = this.value
    const modified = this.localizedValue
    const newValue = []

    modified.forEach((m, idx) => {
      const existing = current.find(e => m.id === e.id) || this.shelf.find(e => m.id === e.id)
      if (existing) {
        newValue.push(_.extend(existing, {index: idx}))
        _.pull(current, existing)
      } else {
        newValue.push({id: this.api.crypto().randomUuid(), index: idx, content: _.fromPairs([[this.language, {stringValue: m.stringValue}]])})
      }
    })

    this.shelf = current
    this.set('value', newValue)
  }

  _widthChanged(width) {
    this.updateStyles({'--dynamic-field-width': width, '--dynamic-field-width-percent': '' + width + '%'})
  }

  _localizedValue(value) {
    return value && _.compact(_.sortBy(value, 'index').map(v => v && v.content && this.localizedMedicationValueWithId(v.id, v.content, this.language))) || []
  }

  _valueChanged() {
    let localizedValue = this._localizedValue(this.value)
    if (!_.isEqual(localizedValue, this.localizedValue)) {
      this.set('localizedValue', localizedValue)
      this.dispatchEvent(new CustomEvent('field-changed', {detail: {context: this.context, value: this.value}}))
    }
  }

  localizedMedicationValueWithId(id, e, lng) {
    if (!e) {
      return null
    }
    let content = e[lng] || e.fr || e.en || e.nl
    return content && {id: id, stringValue: this.api.contact().medication().medicationToString(content.medicationValue, this.language || 'fr')}
  }

  extractContentWithIdFromMedicationService(m, isNew) {
    return {
      id: m.id,
      medicationValue: (this.api.localize(m.content, this.language) || (m.content[this.language] = {medicationValue: {regimen: []}})).medicationValue,
      isNew: isNew || false
    }
  }

  addMedication() {
    const id = this.api.crypto().randomUuid()
    this.push('value', {
      id: id,
      index: this.value.reduce((acc, v) => Math.max(v.index, acc), 0) + 1,
      content: _.fromPairs([[this.language, {medicationValue: {regimen: []}}]])
    })

    const item = this.value.find(s => s.id === id)
    this.set('selectedMedicationContentWithId', this.extractContentWithIdFromMedicationService(item, true))
    this.$['medication-selection'].open()
  }

  editMedication(el) {
    const id = el.target.parentElement.parentElement.id
    const item = this.value.find(s => s.id === id)
    if (item) {
      this.set('selectedMedicationContentWithId', this.extractContentWithIdFromMedicationService(item))
      this.$['medication-detail'].open()
    }
  }

  clearMedication(el) {
    const id = el.target.parentElement.parentElement.id
    this.set('selectedMedicationContentWithId', null)
    this.splice('value', this.value.findIndex(s => s.id === id), 1)
  }

  selectMedicationFromList(med) {
    this.api.bedrugs().getMppInfos(med.id.id, this.language === 'en' ? 'fr' : this.language || 'fr').then(mppInfos => {
      this.set('selectedMedicationContentWithId.medicationValue.medicinalProduct', {"intendedname": med.name, "intendedcds": [{type: "CD-DRUG-CNK", code: med.id.id}]})
      this.set('selectedMedicationContentWithId.medicationValue.regimen', [{weekday: null, date: null, administratedQuantity: {quantity: 1, unit: mppInfos.gal.name}}])
      this.$['medication-detail'].open()
    })
  }

  addPosologyRegimen() {
    const reg = this.selectedMedicationContentWithId.medicationValue.regimen
    this.push('selectedMedicationContentWithId.medicationValue.regimen', {
      weekday: null,
      date: null,
      administratedQuantity: {quantity: 1, unit: reg && reg[0] && reg[0].administratedQuantity && reg[0].administratedQuantity.unit}
    })
  }

  clearPosologyRegimen(event, target) {
    const rgModel = this.$.rgRepeat.modelForElement(event.target)
    this.splice('selectedMedicationContentWithId.medicationValue.regimen', this.selectedMedicationContentWithId.medicationValue.regimen.indexOf(rgModel.rg), 1)
  }

  _localize(s) {
    return this.api.contact().medication().localize(s, this.language)
  }

  _selectedFrequency(rg) {
    return rg.weekday !== null && rg.weekday !== undefined ? 1 : rg.date ? 2 : 0
  }

  _selectFrequency(event, target) {
    const rgModel = this.$.rgRepeat.modelForElement(event.target)
    if (!rgModel) {
      return
    }
    if (target.item.id === 'daily') {
      rgModel.set('rg.weekday', null)
      rgModel.set('rg.date', null)
    } else if (target.item.id === 'weekly') {
      rgModel.set('rg.weekday', {})
      rgModel.set('rg.date', null)
    } else if (target.item.id === 'monthly') {
      rgModel.set('rg.weekday', null)
      rgModel.set('rg.date', -1)
    }
    this._valueChanged()
  }

  _selectDayPeriod(event, target) {
    const rgModel = this.$.rgRepeat.modelForElement(event.target)
    if (!rgModel) {
      return
    }
    rgModel.set('rg.dayPeriod', {type: "CD-DAYPERIOD", code: target.item.id})
    this._valueChanged()
  }
}

customElements.define(DynamicMedicationField.is, DynamicMedicationField)
