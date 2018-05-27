import './dynamic-form.js';
class DynamicSubForm extends Polymer.TkLocalizerMixin(Polymer.mixinBehaviors([], Polymer.Element)) {
  static get template() {
    return Polymer.html`
        <style>
            :host {
                flex-grow: 9999;
                min-width: 100%;
                margin: 0;
                position: relative;
            }

            .modified-icon {
                width: 18px;
            }

            .subform-container {
                border: 1px solid rgba(0, 0, 0, 0.1);
                margin: 0 16px 16px;
            }

            span {
                color: var(--app-primary-color);
                background: rgba(0, 0, 0, 0.1);
                font-size: 12px;
                margin: 32px 0 0 16px;
                padding: 2px 4px;
                display: inline-block;
                max-width: 256px;
                text-align: center;
            }

            .add-button {
                position: absolute;
                left: calc(100% - 32px);
                bottom: -14px;
                width: 32px;
                height: 32px;
                padding: 2px;
                @apply --shadow-elevation-4dp;
                background: var(--app-secondary-color);
                --paper-icon-button-ink-color: var(--app-primary-color);
                color: var(--app-text-color);
            }

            paper-fab#remove {
                height: 18px;
                width: 18px;
                padding: 2px;
                position: absolute;
                left: calc(100% - 8px);
                top: 30px;
                z-index: 12;
                border-radius: 50%;
                color: var(--app-text-color);
                background: var(--app-background-color-darker);
                box-shadow: none;
                margin: 0;
            }

            .relative {
                position: relative;
            }

            .overlay {
                position: absolute;
                right: 0px;
                background: var(--app-background-color-light);
                width: 300px;
                border-radius: 2px;
                z-index: 99;
                padding: 8px 2px 0 0;
            }

            .above {
                bottom: 24px;
            }

            .below {
                top: 24px;
            }

            .btn-container {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                align-items: center;
                margin-bottom: 16px;
            }

            .btn-container:last-child {
                margin-bottom: 0px;
            }

            .add-sub-button {
                height: 28px;
                width: 28px;
                padding: 6px;
                color: var(--app-text-color-light);
                --paper-fab-background: var(--app-primary-color);
            }

            .label {
                align-self: center;
                margin: 0 8px;
                border-radius: 2px;
                background: transparent;
            }

            .hidden-menu {
                height: 0 !important;
                overflow: hidden;
                visibility: hidden;
            }

        </style>
        <span>[[label]]</span>
        <template is="dom-if" if="[[!readOnly]]">
            <div class="relative">
                <template is="dom-if" if="[[_singleAction(layoutItem.editor.compulsoryFormGuids.*, layoutItem.editor.optionalFormGuids.*)]]">
                    <paper-fab class="add-button" icon="add" on-tap="_add"></paper-fab>
                </template>
                <template is="dom-if" if="[[!_singleAction(layoutItem.editor.compulsoryFormGuids.*, layoutItem.editor.optionalFormGuids.*)]]">
                    <paper-fab id="add" class="add-button" icon="add" on-tap="_openAdd"></paper-fab>
                    <div class\$="overlay [[_isHiddenClass(isAdding)]] [[overlayClass]]">
                        <template is="dom-repeat" items="[[_allGuids(layoutItem.editor.compulsoryFormGuids.*, layoutItem.editor.optionalFormGuids.*)]]" as="guid">
                            <div class="btn-container">
                                <span class="label">[[_formTemplateLabel(guid, templates.*)]]</span>
                                <paper-fab class="add-sub-button" id="[[guid]]" icon="icons:create-new-folder" on-tap="_add"></paper-fab>
                            </div>
                        </template>
                    </div>
                </template>
            </div>
        </template>

        <div class="subform-container">
            <template id="subforms-repeat" is="dom-repeat" items="[[subContexts]]" as="subContext">
                <div class="relative">
                    <paper-fab id="remove" icon="close" on-tap="_delete"></paper-fab>
                    <dynamic-form id="sf-[[index]]" api="[[api]]" user="[[user]]" template="[[_getTemplate(subContext)]]" data-map="[[subContext.dataMap]]" data-provider="[[subContext.dataProvider]]" read-only="[[readOnly]]" is-sub-form=""></dynamic-form>
                </div>
            </template>
        </div>
`;
  }

  static get is() {
    return 'dynamic-sub-form'
  }

  static get properties() {
    return {
      api: {
        type: Object
      },
      readOnly: {
        type: Boolean,
        value: false
      },
      label: {
        type: String
      },
      layoutItem: {
        type: Object,
        value: null
      },
      user: {
        type: Object
      },
      subContexts: {
        type: Array,
        value: function () {
          return []
        }
      },
      templates: {
        type: Object,
        value: null
      },
      isAdding: {
        type: Boolean,
        value: false
      }
    }
  }

  constructor() {
    super()
  }

  ready() {
    super.ready()

    this.uuid = this.api.crypto().randomUuid()
  }

  notify(path) {
    let pathParts = path.split('.')
    const firstPathElement = pathParts[0]

    if (firstPathElement === '*') {
      this.notifyPath('subContexts.*')
    } else if (firstPathElement.match(/[0-9]+/)) {
      if (pathParts.length > 1) {
        const idx = parseInt(firstPathElement)
        const item = Polymer.dom(this.root).querySelector('#sf-' + idx)
        item.notify(pathParts.slice(1).join('.'))
      } else {
        this.notifyPath('subContexts.' + firstPathElement)
      }
    }
  }

  _getTemplate(sc) {
    return sc && sc.template
  }

  _singleAction() {
    return (this.layoutItem.editor.optionalFormGuids && this.layoutItem.editor.optionalFormGuids.length || 0) + (this.layoutItem.editor.compulsoryFormGuids && this.layoutItem.editor.compulsoryFormGuids.length || 0) < 2
  }

  _allGuids() {
    return (this.layoutItem.editor.compulsoryFormGuids || []).concat(this.layoutItem.editor.optionalFormGuids || [])
  }

  _formTemplateLabel(guid) {
    if (!this.templates) {
      this.set('templates', {})
      this.api.hcparty().getCurrentHealthcareParty().then(hcp => Promise.all(this._allGuids().map(guid => this.api.form().getFormTemplatesByGuid(guid, hcp.specialityCodes && hcp.specialityCodes[0] && hcp.specialityCodes[0].code || 'deptgeneralpractice')))).then(templates => this.set('templates', templates.reduce((acc, t) => {
        if (t[0]) {
          acc[t[0].guid] = t[0]
        }
        return acc
      }, {})))
      return "Loading …"
    }
    return this.templates[guid] && this.templates[guid].name || "Loading …"
  }

  _delete(e) {
    const subContext = this.$['subforms-repeat'].itemForElement(e.target)
    this.dispatchEvent(new CustomEvent('delete-subform', {detail: {id: subContext.dataProvider.getId()}, composed: true}))
  }

  _add(e) {
    this.set('isAdding', false)

    const guid = e.target.id || this._allGuids()[0]
    if (guid) {
      this.dispatchEvent(new CustomEvent('add-subform', {detail: {guid: guid}, composed: true}))
    }
  }

  _openAdd(li) {
    this.set('overlayClass', li.target.getBoundingClientRect().y < 480 ? 'below' : 'above')
    this.set('isAdding', !this.isAdding)
  }

  _isHiddenClass() {
    return this.isAdding ? '' : 'hidden-menu'
  }
}

customElements.define(DynamicSubForm.is, DynamicSubForm)
