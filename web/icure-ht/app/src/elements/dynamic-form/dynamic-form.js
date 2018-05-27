import './dynamic-number-field.js';
import './dynamic-token-field.js';
import './dynamic-text-field.js';
import './dynamic-text-area.js';
import './dynamic-measure-field.js';
import './dynamic-popup-menu.js';
import './dynamic-date-field.js';
import './dynamic-sub-form.js';
import './dynamic-checkbox.js';
import './dynamic-medication-field.js';
import './ckmeans-grouping.js';
class DynamicForm extends Polymer.TkLocalizerMixin(Polymer.mixinBehaviors([], Polymer.Element)) {
  static get template() {
    return Polymer.html`
        <style>
            paper-spinner.center {
                position: absolute;
                left: calc(50% - 14px);
                top: calc(50% - 14px);
            }

            paper-card.subform-card {
                min-height: 16px;
                padding: 0 0 8px 0;
                box-shadow: none;
                border-bottom: 1px solid lightgrey;
                margin: 0;
                width: 100%;
                background: transparent;
            }

            .pat-details-card > .card-content {
                padding: 16px 16px 32px !important;
            }

            .pat-details-card {
                min-height: 200px;
                width: calc(100% - 64px);
                margin: 0 32px 32px;
                padding: 0 8px 8px;
            }

            .horizontal {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                flex-basis: 100%;
            }

            .edit-pat-details-btn {
                position: absolute;
                left: 50%;
                transform: translate(-50%, 0);
                bottom: -20px;
                background: var(--app-secondary-color);
                border-radius: 50%;
                @apply --shadow-elevation-4dp;
            }

            .justified {
                justify-content: space-between;
            }

            .form-title {
                color: var(--app-primary-color);
                border-top: 2px solid var(--app-background-color-dark);
                border-radius: 2px 2px 0 0;
                background: var(--app-background-color-dark);
                font-size: 12px;
                margin: 0 0 8px -8px;
                padding: 2px 24px;
                display: inline-block;
                width: calc(100% - 32px);
                text-align: left;
                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
            }

            paper-spinner {
                --paper-spinner-layer-1-color: var(--app-secondary-color);
                --paper-spinner-layer-2-color: var(--app-primary-color-light);
                --paper-spinner-layer-3-color: var(--app-secondary-color-dark);
                --paper-spinner-layer-4-color: var(--app-primary-color-dark);
            }

        </style>

        <ckmeans-grouping id="ckmeans-grouping"></ckmeans-grouping>
        <ckmeans-grouping id="ckmeans-flow-grouping" max-distance="8"></ckmeans-grouping>

        <paper-card class\$="{{_patCardClass(isSubForm)}}">
            <template is="dom-if" if="[[showTitle]]">
                <div class="form-title">
                    <span>[[displayedTitle]]</span>
                    <slot name="titlebar"></slot>
                </div>
            </template>
            <template is="dom-if" if="[[!dataProvider]]">
                <paper-spinner class="center" active=""></paper-spinner>
            </template>

            <form id="general-info" is="iron-form">
                <div class="card-content horizontal justified">
                    <template is="dom-repeat" items="[[template.sections]]" as="section">
                        <template is="dom-repeat" items="[[section.formColumns]]" as="column">
                            <template id="layoutitems-repeat" is="dom-repeat" items="[[_sortedGroupedFormDataList(column.formDataList)]]" as="layoutItem">
                                <template is="dom-if" if="[[_shouldDisplay(layoutItem, readOnly, compact)]]">
                                    <template is="dom-if" if="[[_isTextField(layoutItem)]]">
                                        <dynamic-text-field id="[[layoutItem.name]]" label="[[layoutItem.label]]" was-modified="[[_wasModified(layoutItem)]]" is-modified-after="[[_isModifiedAfter(layoutItem)]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" linkables="[[healthElements]]" last-modified="[[_lastModified(layoutItem)]]" value="[[_value(layoutItem,dataMap.*)]]" width="[[layoutItem.editor.flow]]" on-field-changed="_valueChanged" read-only="[[readOnly]]"></dynamic-text-field>
                                    </template>
                                    <template is="dom-if" if="[[_isTextArea(layoutItem)]]">
                                        <dynamic-text-area id="[[layoutItem.name]]" label="[[layoutItem.label]]" was-modified="[[_wasModified(layoutItem)]]" is-modified-after="[[_isModifiedAfter(layoutItem)]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" linkables="[[healthElements]]" last-modified="[[_lastModified(layoutItem)]]" value="[[_value(layoutItem,dataMap.*)]]" width="[[layoutItem.editor.flow]]" on-field-changed="_valueChanged" read-only="[[readOnly]]"></dynamic-text-area>
                                    </template>
                                    <template is="dom-if" if="[[_isCheckboxField(layoutItem)]]">
                                        <dynamic-checkbox id="[[layoutItem.name]]" label="[[layoutItem.label]]" was-modified="[[_wasModified(layoutItem)]]" is-modified-after="[[_isModifiedAfter(layoutItem)]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" linkables="[[healthElements]]" last-modified="[[_lastModified(layoutItem)]]" value="[[_value(layoutItem,dataMap.*)]]" width="[[layoutItem.editor.flow]]" on-field-changed="_valueChanged" read-only="[[readOnly]]"></dynamic-checkbox>
                                    </template>
                                    <template is="dom-if" if="[[_isNumberField(layoutItem)]]">
                                        <dynamic-number-field id="[[layoutItem.name]]" label="[[layoutItem.label]]" was-modified="[[_wasModified(layoutItem)]]" is-modified-after="[[_isModifiedAfter(layoutItem)]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" linkables="[[healthElements]]" last-modified="[[_lastModified(layoutItem)]]" value="[[_value(layoutItem,dataMap.*)]]" width="[[layoutItem.editor.flow]]" on-field-changed="_valueChanged" read-only="[[readOnly]]"></dynamic-number-field>
                                    </template>
                                    <template is="dom-if" if="[[_isMeasureField(layoutItem)]]">
                                        <dynamic-measure-field id="[[layoutItem.name]]" label="[[layoutItem.label]]" was-modified="[[_wasModified(layoutItem)]]" is-modified-after="[[_isModifiedAfter(layoutItem)]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" linkables="[[healthElements]]" last-modified="[[_lastModified(layoutItem)]]" value-with-unit="[[_value(layoutItem,dataMap.*)]]" width="[[layoutItem.editor.flow]]" on-field-changed="_valueChanged" read-only="[[readOnly]]"></dynamic-measure-field>
                                    </template>
                                    <template is="dom-if" if="[[_isPopupMenu(layoutItem)]]">
                                        <dynamic-popup-menu id="[[layoutItem.name]]" label="[[layoutItem.label]]" was-modified="[[_wasModified(layoutItem)]]" is-modified-after="[[_isModifiedAfter(layoutItem)]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" data-source="[[_popupDataSource(layoutItem, layoutItem.editor.menuOptions)]]" linkables="[[healthElements]]" last-modified="[[_lastModified(layoutItem)]]" value="[[_value(layoutItem,dataMap.*)]]" width="[[layoutItem.editor.flow]]" options="[[layoutItem.editor.menuOptions]]" on-field-changed="_valueChanged" read-only="[[readOnly]]"></dynamic-popup-menu>
                                    </template>
                                    <template is="dom-if" if="[[_isDateField(layoutItem)]]">
                                        <dynamic-date-field id="[[layoutItem.name]]" label="[[layoutItem.label]]" was-modified="[[_wasModified(layoutItem)]]" is-modified-after="[[_isModifiedAfter(layoutItem)]]" linkables="[[healthElements]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" last-modified="[[_lastModified(layoutItem)]]" value="[[_value(layoutItem,dataMap.*)]]" width="[[layoutItem.editor.flow]]" on-field-changed="_valueChanged" read-only="[[readOnly]]"></dynamic-date-field>
                                    </template>
                                    <template is="dom-if" if="[[_isValueDateField(layoutItem)]]">
                                        <dynamic-date-field id="[[layoutItem.name]]" label="[[layoutItem.label]]" was-modified="[[_wasModified(layoutItem)]]" is-modified-after="[[_isModifiedAfter(layoutItem)]]" linkables="[[healthElements]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" last-modified="[[_lastModified(layoutItem)]]" value="[[_valueDate(layoutItem,dataMap.*)]]" width="[[layoutItem.editor.flow]]" on-field-changed="_valueDateChangedWithBooleanSet" read-only="[[readOnly]]"></dynamic-date-field>
                                    </template>
                                    <template is="dom-if" if="[[_isTokenField(layoutItem)]]">
                                        <dynamic-token-field id="[[layoutItem.name]]" label="[[layoutItem.label]]" api="[[api]]" was-modified="[[_wasModified(layoutItem)]]" is-modified-after="[[_isModifiedAfter(layoutItem)]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" data-source="[[_tokenDataSource(layoutItem, layoutItem.codeTypes)]]" last-modified="[[_lastModified(layoutItem)]]" linkables="[[healthElements]]" value="[[_valueContainers(layoutItem,dataMap.*)]]" width="[[layoutItem.editor.flow]]" on-field-changed="_valueContainersChanged" read-only="[[readOnly]]"></dynamic-token-field>
                                    </template>
                                    <template is="dom-if" if="[[_isMedicationField(layoutItem)]]">
                                        <dynamic-medication-field id="[[layoutItem.name]]" label="[[layoutItem.label]]" api="[[api]]" was-modified="[[_wasModified(layoutItem)]]" is-modified-after="[[_isModifiedAfter(layoutItem)]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" linkables="[[healthElements]]" last-modified="[[_lastModified(layoutItem)]]" value="[[_valueContainers(layoutItem,dataMap.*)]]" width="[[layoutItem.editor.flow]]" on-field-changed="_valueContainersChanged" read-only="[[readOnly]]"></dynamic-medication-field>
                                    </template>
                                    <template is="dom-if" if="[[_isSubForm(layoutItem)]]">
                                        <dynamic-sub-form id="sf_[[layoutItem.name]]" label="[[layoutItem.label]]" layout-item="[[layoutItem]]" api="[[api]]" user="[[user]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" sub-contexts="[[_subForms(layoutItem,dataMap.*)]]" on-delete-subform="_deleteSubForm" on-add-subform="_addSubForm" read-only="[[readOnly]]"></dynamic-sub-form>
                                    </template>
                                </template>
                            </template>
                        </template>
                    </template>
                </div>
            </form>
            <template is="dom-if" if="[[showEdit]]">
                <paper-icon-button class="edit-pat-details-btn" icon="create" on-tap="editForm"></paper-icon-button>
            </template>
        </paper-card>
`;
  }

  static get is() {
    return 'dynamic-form'
  }

  static get properties() {
    return {
      api: {
        type: Object
      },
      user: {
        type: Object
      },
      template: {
        type: Object,
        observer: '_templateChanged'
      },
      readOnly: {
        type: Boolean,
        value: false
      },
      compact: {
        type: Boolean,
        value: false
      },
      dataProvider: {
        type: Object
      },
      dataMap: {
        type: Object,
        value: null
      },
      isSubForm: {
        type: Boolean,
        value: false
      },
      showTitle: {
        type: Boolean,
        value: false
      },
      title: {
        type: String,
        value: null
      },
      displayedTitle: {
        type: String,
        computed: "_displayedTitle(title, showTitle, dataProvider)"
      },
      showEdit: {
        type: String,
        computed: "_showEdit(isSubForm, readOnly)"
      },
      healthElements: {
        type: Array
      }
    }
  }

  constructor() {
    super()
  }

  _showEdit() {
    return this.readOnly && !this.isSubForm
  }

  notify(path) {
    if (!this.template) {
      return
    }
    let pathParts = path.split('.')
    const firstPathElement = pathParts[0]
    const item = Polymer.dom(this.root).querySelector('#sf_' + firstPathElement)

    const layoutItem = _.flatten(_.flatten(this.template.sections.map(s => s.formColumns.map(c => c.formDataList)))).find(fdl => fdl.name === firstPathElement)

    if (pathParts.length > 1) {
      item.subContexts = this._subForms(layoutItem)
      item.notify && item.notify(pathParts.slice(1).join('.'))
    } else {
      item.notify && item.notify()
    }
  }

  _displayedTitle() {
    return this.title && this.dataProvider ? this.title : "Loading …"
  }

  _patCardClass(isSubForm) {
    return !isSubForm ? "pat-details-card" : "pat-details-card subform-card"
  }

  _value(layoutItem) {
    if (!this.dataProvider) {
      return null
    }
    return this._isCheckboxField(layoutItem) ? '' + !!this._rawValue(layoutItem) : this._rawValue(layoutItem)
  }

  _rawValue(layoutItem) {
    if (!this.dataProvider) {
      return null
    }
    return this._isDateField(layoutItem) ? this.dataProvider.getDateValue(layoutItem.name) : this._isMeasureField(layoutItem) ? this.dataProvider.getMeasureValue(layoutItem.name) : this._isCheckboxField(layoutItem) ? this.dataProvider.getBooleanValue(layoutItem.name) : this._isNumberField(layoutItem) ? this.dataProvider.getNumberValue(layoutItem.name) : this.dataProvider.getStringValue(layoutItem.name)
  }

  _shouldDisplay(layoutItem, readOnly, compact) {
    return !readOnly && !compact || this._isSubForm(layoutItem) || this._isMedicationField(layoutItem) && this.dataProvider.getValueContainers(layoutItem.name).length || this._rawValue(layoutItem)
  }

  _valueContainers(layoutItem) {
    if (!this.dataProvider) {
      return null
    }
    return this.dataProvider.getValueContainers(layoutItem.name) || []
  }

  _valueDate(layoutItem) {
    if (!this.dataProvider) {
      return null
    }
    return this.dataProvider.getValueDateOfValue(layoutItem.name)
  }

  _subForms(layoutItem) {
    if (!this.dataProvider) {
      return null
    }
    return this.dataProvider.getSubForms(layoutItem.name)
  }

  _templateChanged(change) {
    if (!this.template || !this.template.sections) {
      return
    }
    this.layoutItemPerName = _.flatten(this.template.sections.map(s => _.flatten(s.formColumns.map(c => c.formDataList)))).reduce((acc, val) => {
      acc[val.name] = val
      return acc
    }, {})
  }

  _valueChanged(event) {
    if (!this.dataProvider) {
      return
    }
    const change = event.detail
    if (!this.layoutItemPerName || !event.target.id) {
      return
    }
    const layoutItem = this.layoutItemPerName[event.target.id]
    if (layoutItem) {
      this._isDateField(layoutItem) ? this.dataProvider.setDateValue(layoutItem.name, change.value) : this._isMeasureField(layoutItem) ? this.dataProvider.setMeasureValue(layoutItem.name, typeof change.value === "object" ? change.value : {value: change.value}) : this._isCheckboxField(layoutItem) ? this.dataProvider.setBooleanValue(layoutItem.name, change.value && change.value !== 'false') : this._isNumberField(layoutItem) ? this.dataProvider.setNumberValue(layoutItem.name, change.value) : this.dataProvider.setStringValue(layoutItem.name, change.value)
    }
  }

  _valueContainersChanged(event) {
    if (!this.dataProvider) {
      return
    }
    const change = event.detail
    if (!this.layoutItemPerName || !event.target.id) {
      return
    }
    const layoutItem = this.layoutItemPerName[event.target.id]
    if (layoutItem) {
      this._isTokenField(layoutItem) ? this.dataProvider.setValueContainers(layoutItem.name, change.value) : this._isMedicationField(layoutItem) ? this.dataProvider.setValueContainers(layoutItem.name, change.value) : null
    }
  }

  _valueDateChanged(event) {
    if (!this.dataProvider) {
      return
    }
    const change = event.detail
    if (!this.layoutItemPerName || !event.target.id) {
      return
    }
    const layoutItem = this.layoutItemPerName[event.target.id]
    if (layoutItem) {
      this.dataProvider.setValueDateOfValue(layoutItem.name, change.value)
    }
  }

  _valueDateChangedWithBooleanSet(event) {
    if (!this.dataProvider) {
      return
    }
    const change = event.detail
    if (!this.layoutItemPerName || !event.target.id) {
      return
    }
    const layoutItem = this.layoutItemPerName[event.target.id]
    if (layoutItem) {
      this.dataProvider.setValueDateOfValue(layoutItem.name, change.value, true)
    }
  }

  _unit(layoutItem, dataMap) {
    if (!this.dataProvider) {
      return null
    }
    return this._isMeasureField(layoutItem) ? (() => {
      const v = this.dataProvider.getMeasureValue(layoutItem.name)
      return v && v.unit
    })() : null
  }

  width(layoutItem) {
    return layoutItem
  }

  _sortedGroupedFormDataList(formDataList) {
    const widthsStruct = formDataList.reduce((acc, i) => {
      acc.widths[i.name] = i.editor.left + i.editor.width
      acc.maxWidth = Math.max(acc.widths[i.name], acc.maxWidth)
      return acc
    }, {widths: {}, maxWidth: 32})
    const sortedList = _.sortBy(formDataList, fd => fd.editor.top)
    const clusters = this.$['ckmeans-grouping'].cluster(sortedList.map(fd => fd.editor.top)).clusters

    const formDataClusters = sortedList.reduce((cs, fd) => cs[_.findIndex(clusters, c => c.includes(fd.editor.top))].push(fd) && cs, new Array(clusters.length).fill(null).map(u => [])).map(c => _.sortBy(c, "editor.left"))
    formDataClusters.forEach(c => {
      let prevWidth = 0
      for (let i = 0; i < c.length; i++) {
        let width = widthsStruct.widths[c[i].name]
        c[i].editor.flow = Math.floor(10000 * (width - prevWidth) / widthsStruct.maxWidth) / 100
        prevWidth = width
      }
    })

    //Now that the flow have been determined restart a kmeans
    const flowSortedList = _.sortBy(formDataList, fd => fd.editor.flow)
    const flowClustering = this.$['ckmeans-flow-grouping'].cluster(flowSortedList.map(fd => fd.editor.flow))

    //Round centroids
    flowClustering.centroids = flowClustering.centroids.map(c => Math.round(c * 12 / 100.0) * 100 / 12 - 0.00001)
    const treatedFormDataList = _.flatten(formDataClusters)
    treatedFormDataList.forEach(c => {
      c.editor.flow = flowClustering.centroids[_.findIndex(flowClustering.clusters, cc => cc.includes(c.editor.flow))]
    })
    formDataClusters.forEach(cs => {
      while (cs.reduce((acc, i) => acc + i.editor.flow, 0) > 100) {
        cs.reduce((max, i) => i.editor.flow > max.editor.flow ? i : max, {editor: {flow: 0}}).editor.flow -= 8.33334
      }
    })
    return treatedFormDataList
  }

  _isTextArea(layoutItem) {
    return layoutItem.editor.key === 'StringEditor' && layoutItem.editor.multiline === true
  }

  _isTextField(layoutItem) {
    return layoutItem.editor.key === 'StringEditor' && layoutItem.editor.multiline === false
  }

  _isPopupMenu(layoutItem) {
    return layoutItem.editor.key === 'PopupMenuEditor'
  }

  _isNumberField(layoutItem) {
    return layoutItem.editor.key === 'NumberEditor'
  }

  _isDateField(layoutItem) {
    return layoutItem.editor.key === 'DateTimeEditor'
  }

  _isValueDateField(layoutItem) {
    return layoutItem.editor.key === 'CheckBoxEditor' && layoutItem.editor.displayValueDate
  }

  _isCheckboxField(layoutItem) {
    return layoutItem.editor.key === 'CheckBoxEditor' && !layoutItem.editor.displayValueDate
  }

  _isMeasureField(layoutItem) {
    return layoutItem.editor.key === 'MeasureEditor'
  }

  _isTokenField(layoutItem) {
    return layoutItem.editor.key === 'TokenFieldEditor'
  }

  _isMedicationField(layoutItem) {
    return layoutItem.editor.key === 'MedicationTableEditor'
  }

  _isSubForm(layoutItem) {
    return layoutItem.subForm === true
  }

  _isModifiedAfter(layoutItem) {
    return this.dataProvider && this.dataProvider.isModifiedAfter && this.dataProvider.isModifiedAfter(layoutItem.name) || false
  }

  _wasModified(layoutItem) {
    return this.dataProvider && this.dataProvider.wasModified && this.dataProvider.wasModified(layoutItem.name) || false
  }

  _lastModified(layoutItem) {
    return this.dataProvider && this.dataProvider.latestModification && this.dataProvider.latestModification(layoutItem.name) || "0"
  }

  loadDataMap() {
    console.log("Form ready")
  }

  editForm() {
    this.dataProvider.editForm && this.dataProvider.editForm()
  }

  _deleteSubForm(e, detail) {
    e.stopPropagation()
    const layoutItem = Polymer.dom(this.root).querySelector('#layoutitems-repeat').itemForElement(e.target)
    this.dataProvider.deleteSubForm && this.dataProvider.deleteSubForm(layoutItem.name, detail.id)
  }

  _addSubForm(e, detail) {
    e.stopPropagation()
    const layoutItem = Polymer.dom(this.root).querySelector('#layoutitems-repeat').itemForElement(e.target)
    this.dataProvider.addSubForm && this.dataProvider.addSubForm(layoutItem.name, detail.guid)
  }

  _tokenDataSource(d) {
    return d && {
      filter: text => this.dataProvider && this.dataProvider.filter && this.dataProvider.filter(d.editor.dataSource || d.codeTypes && {
        source: "codes",
        types: d.codeTypes
      }, text) || Promise.resolve([])
    } || null
  }

  _popupDataSource(d, options) {
    return d && {
      filter: text => this.dataProvider && this.dataProvider.filter && this.dataProvider.filter(d.editor.dataSource || d.codeTypes && {
        source: "codes",
        types: d.codeTypes
      }, text) || Promise.resolve([]), get: id => this.dataProvider && this.dataProvider.filter && this.dataProvider.filter(d, null, id) || Promise.resolve(null)
    } || null
  }
}

customElements.define(DynamicForm.is, DynamicForm)
