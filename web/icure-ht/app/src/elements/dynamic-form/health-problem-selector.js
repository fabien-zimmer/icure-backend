import '../../vaadin-icure-theme.js';

import _ from 'lodash/lodash'

class HealthProblemSelector extends Polymer.TkLocalizerMixin(Polymer.mixinBehaviors([], Polymer.Element)) {
  static get template() {
    return Polymer.html`
        <style>
            paper-dialog {
                width: 800px;
            }

            paper-input {
                --paper-input-container-focus-color: var(--app-primary-color);
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

            dom-if {
                padding: 0;
            }

            vaadin-combo-box {
                width: calc(100% - 48px);
                margin: 8px 0;
            }

            .flex {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
                margin: 8px 0;
            }

            .label {
                background: var(--app-background-color-dark);
                color: var(--app-primary-color-dark);
                --paper-item-min-height: 28px;
                width: 58px;
                font-size: 12px;
                padding: 0 0 0 8px;
            }

            paper-radio-group {
                --paper-radio-group-item-padding: 8px;
            }

            paper-radio-button {
                --paper-radio-button-checked-color: var(--app-secondary-color-dark);
            }

            vaadin-date-picker {
                margin: 8px 0;
            }

            tk-token-field {
                margin: 8px 0;
            }

        </style>

        <paper-dialog id="dialog">
            <h2 class="modal-title">[[okLabel]] [[entityType]]</h2>
            <vaadin-combo-box id="entities-list" filtered-items="[[items]]" on-filter-changed="_filterChanged" item-label-path="descr" selected-item="{{selectedItem}}" item-value-path="id">
                <paper-input label="Health element template" class="input" value="{{filterValue}}">
                    <paper-icon-button icon="icons:clear" slot="suffix" class="clear-button"></paper-icon-button>
                </paper-input>
            </vaadin-combo-box>
            <paper-input label="Label" value="{{entity.descr}}"></paper-input>
            <div class="flex">
                <paper-item class="label">[[localize('nat','Nature',language)]]
                    <iron-icon icon="icons:chevron-right"></iron-icon>
                </paper-item>
                <paper-radio-group selected="[[_nature(entity, entity.tags, entity.tags.*)]]" on-selected-changed="_natureChanged">
                    <paper-radio-button name="healthcareelement">[[localize('pro','Problem',language)]]</paper-radio-button>
                    <paper-radio-button name="allergy">[[localize('alle','Allergy',language)]]</paper-radio-button>
                    <paper-radio-button name="familyrisk">[[localize('fami_risk','Family Risk',language)]]</paper-radio-button>
                    <paper-radio-button name="risk">[[localize('risk','Risk',language)]]</paper-radio-button>
                </paper-radio-group>
            </div>
            <div class="flex">
                <paper-item class="label">[[localize('sta','Status',language)]]
                    <iron-icon icon="icons:chevron-right"></iron-icon>
                </paper-item>
                <paper-radio-group selected="[[_status(entity, entity.tags, entity.tags.*, entity.status, entity.closingDate)]]" on-selected-changed="_statusChanged">
                    <paper-radio-button name="active">[[localize('act','Active',language)]]</paper-radio-button>
                    <paper-radio-button name="inactive">[[localize('ina','Inactive',language)]]</paper-radio-button>
                    <paper-radio-button name="archived">[[localize('archiv','Archived',language)]]</paper-radio-button>
                </paper-radio-group>
            </div>

            <vaadin-date-picker label="Start Date" i18n="[[i18n]]" value="{{_openingDateAsString}}"></vaadin-date-picker>
            <vaadin-date-picker label="End Date" i18n="[[i18n]]" value="{{_closingDateAsString}}"></vaadin-date-picker>

            <tk-token-field label="Code" value="{{entity.codes}}" data-value-path="id" label-path="[[_label(language)]]" data-label-path="[[_label(language)]]"></tk-token-field>
            <tk-token-field label="Plans of action" value="{{entity.plansOfAction}}" data-value-path="id" data-label-path="descr"></tk-token-field>

            <slot name="suffix"></slot>
            <div class="buttons">
                <paper-button class="modal-button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="modal-button--save" dialog-confirm="" autofocus="" on-tap="confirm">[[okLabel]]</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
    return 'health-problem-selector'
  }

  static get properties() {
    return {
      columns: {
        type: Array,
        value: function () {
          return []
        }
      },

      entityType: {
        type: String,
        value: 'entity'
      },

      entity: {
        type: Object,
        value: () => ({plansOfAction: []}),
        notify: true
      },

      okLabel: {
        type: String
      },

      filterValue: {
        type: String
      },

      dataProvider: {
        type: Object,
        value: null
      },

      i18n: {
        type: Object
      },

      selectedItem: {
        type: Object,
        value: null
      },

      items: {
        type: Array,
        value: () => []
      },

      _openingDateAsString: {
        type: String
      },

      _closingDateAsString: {
        type: String
      }
    }
  }

  static get observers() {
    return ['_filterChanged(filterValue)', '_selectedItemChanged(selectedItem)', '_openingDateChanged(entity.openingDate)', '_closingDateChanged(entity.closingDate)', '_openingDateAsStringChanged(_openingDateAsString)', '_closingDateAsStringChanged(_closingDateAsString)']
  }

  constructor() {
    super()
  }

  _filterChanged(e) {
    let latestSearchValue = this.filterValue || e && e.detail.value
    this.latestSearchValue = latestSearchValue

    if (!latestSearchValue || latestSearchValue.length < 2) {
      console.log("Cancelling empty search")
      this.set('items', [])
      return
    }

    this.dataProvider && this.dataProvider.filter(latestSearchValue, 120, 0, null, false).then(res => {
      if (latestSearchValue !== this.latestSearchValue) {
        console.log("Cancelling obsolete search")
        return
      }
      this.set('items', res.rows)
    })
  }

  _selectedItemChanged() {
    if (this.selectedItem) {
      this.set('entity.descr', this.selectedItem.descr)
      this.set('entity.plansOfAction', this.selectedItem.plansOfAction || [])
      this.api.code().getCodes(this.selectedItem.codes.join(',')).then(codes => {
        this.set('entity.codes', codes)
      })
    }
  }

  _cdItemTagForEntity(e, create) {
    const tags = e && (e.tags || (e.tags = []))
    return tags.find(t => t.type === 'CD-ITEM') || create && (tags[tags.length] = {type: 'CD-ITEM', code: 'healthcareelement', version: '1'})
  }

  _nature() {
    const code = this._cdItemTagForEntity(this.entity, true)
    return code && code.code
  }

  _status() {
    return !this.entity ? null : ((this.entity.status || 0) & 2) === 1 ? 'archived' : ((this.entity.status || 0) & 1) === 1 || this.entity.closingDate ? 'inactive' : 'active'
  }

  _natureChanged(e) {
    this._cdItemTagForEntity(this.entity, true).code = e.detail.value
  }

  _statusChanged(e) {
    switch (e.detail.value) {
      case 'active':
        this.set('entity.closingDate', null);
        ((this.entity.status || 0) & 1) === 1 && this.set('entity.status', (this.entity.status || 0) - 1);
        ((this.entity.status || 0) & 2) === 1 && this.set('entity.status', (this.entity.status || 0) - 2)
        break
      case 'inactive':
        ((this.entity.status || 0) & 1) === 0 && this.set('entity.status', (this.entity.status || 0) + 1);
        ((this.entity.status || 0) & 2) === 1 && this.set('entity.status', (this.entity.status || 0) - 2)
        break
      case 'archived':
        ((this.entity.status || 0) & 2) === 0 && this.set('entity.status', (this.entity.status || 0) + 2)
        break
    }
  }

  _cellContent(item, column) {
    return _.isFunction(column.key) ? column.key(item) : _.get(item, column.key)
  }

  _key(column) {
    return _.isFunction(column.key) ? column.sortKey : column.key
  }

  _label(language) {
    return `type:label.${['fr', 'nl'].includes(language) ? language : 'fr'}`
  }

  click(e) {
    const selected = this.activeItem

    console.log('selected ' + selected + ' - ' + this.latestSelected)
    if (this.inDoubleClick && (this.latestSelected === selected || this.latestSelected && !selected || !this.latestSelected && selected)) {
      this.select(this.latestSelected || selected)
    } else {
      this.latestSelected = selected
      this.inDoubleClick = true
      this.set('entity', _.assign(_.assign({}, this.entity || {}), selected))
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
    if (this.entity || this.activeItem) {
      this.select(this.entity || this.activeItem)
    }
  }

  select(item) {
    if (item) {
      this.dispatchEvent(new CustomEvent('entity-selected', {detail: item, composed: true}))
      this.$.dialog.close()
    }
  }

  open() {
    this.$.dialog.open()
  }

  _closingDateChanged(date) {
    const dateString = date && this.api.moment(date).format('YYYY-MM-DD') || ''
    if (dateString !== this._openingDateAsString) {
      this.set('_closingDateAsString', dateString)
    }
  }

  _openingDateChanged(date) {
    const dateString = date && this.api.moment(date).format('YYYY-MM-DD') || ''
    if (dateString !== this._openingDateAsString) {
      this.set('_openingDateAsString', dateString)
    }
  }

  _closingDateAsStringChanged(dateAsString) {
    if (!dateAsString) {
      this.entity && this.set('entity.closingDate', null)
      return
    }
    const date = parseInt(dateAsString.replace(/(....)-(..)-(..)/, '$1$2$3')) * (this.displayTime ? 1000000 : 1)
    if (date !== this.value) {
      this.entity && this.set('entity.closingDate', date)
    }
  }

  _openingDateAsStringChanged(dateAsString) {
    if (!dateAsString) {
      this.entity && this.set('entity.openingDate', null)
      return
    }
    const date = parseInt(dateAsString.replace(/(....)-(..)-(..)/, '$1$2$3')) * (this.displayTime ? 1000000 : 1)
    if (date !== this.value) {
      this.entity && this.set('entity.openingDate', date)
    }
  }
}

customElements.define(HealthProblemSelector.is, HealthProblemSelector)
