import _ from 'lodash/lodash'

class EntitySelector extends Polymer.TkLocalizerMixin(Polymer.mixinBehaviors([], Polymer.Element)) {
  static get template() {
    return Polymer.html`
        <style>
            paper-dialog {
                width: 80%;
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
        </style>

        <paper-dialog id="dialog">
            <h2 class="modal-title">Select [[entityType]]</h2>
            <paper-input id="filter" label="Filter" value="{{filterValue}}" on-keydown="refresh"></paper-input>
            <vaadin-grid id="entities-list" class="material" active-item="{{activeItem}}" on-tap="click">
                <template is="dom-repeat" items="[[columns]]" as="column">
                    <vaadin-grid-column width="100px">
                        <template class="header">
                            <vaadin-grid-sorter path="[[_key(column)]]">[[column.title]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[_cellContent(item, column)]]</div>
                        </template>
                    </vaadin-grid-column>
                </template>
            </vaadin-grid>
            <slot name="suffix"></slot>
            <div class="buttons">
                <paper-button class="modal-button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="modal-button--save" dialog-confirm="" autofocus="" on-tap="confirm">[[okLabel]]</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
    return 'entity-selector'
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
        value: function () {
          return {}
        },
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

      activeItem: {
        type: Object,
        value: null,
        observer: "_activeItemChanged"
      }

    }
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
      const sort = params.sortOrders && params.sortOrders[0] && params.sortOrders[0].path || this.columns[0] && this._key(this.columns[0])
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

      this.dataProvider && this.dataProvider.filter(latestSearchValue, endIndex || grid.pageSize, params.index, sort, desc).then(function (res) {
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
    return _.isFunction(column.key) ? column.key(item) : _.get(item, column.key)
  }

  _key(column) {
    return _.isFunction(column.key) ? column.sortKey : column.key
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

  _activeItemChanged(item) {
    var grid = this.$['entities-list']
    grid.selectedItems = item ? [item] : []
  }
}

customElements.define(EntitySelector.is, EntitySelector)
