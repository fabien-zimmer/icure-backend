import '../../icd-styles.js';

class DynamicLink extends Polymer.TkLocalizerMixin(Polymer.mixinBehaviors([], Polymer.Element)) {
  static get template() {
    return Polymer.html`
        <style include="icd-styles">
            paper-menu-button {
                padding: 0;
                color: grey;
            }

            paper-icon-button {
                padding: 0 4px 8px 4px;
                width: 20px;
                height: 20px;
            }

            .link .ICD-10 span {
                content: '';
                display: inline-block;
                height: 6px;
                width: 6px;
                border-radius: 3px;
                margin-right: 3px;
                margin-bottom: 1px;
            }

            paper-item {
                font-size: 14px;
                min-height: 30px;
            }
        </style>

        <paper-menu-button id="mb" horizontal-align="left" dynamic-align="true" allow-outside-scroll="">
            <paper-icon-button class="form-title-bar-btn" icon="link" slot="dropdown-trigger" alt="menu" on-tap="_show"></paper-icon-button>
            <paper-listbox slot="dropdown-content">
                <template is="dom-repeat" items="[[linkables]]" as="he">
                    <paper-item id="[[he.id]]" class="link" on-tap="link"><label class\$="ICD-10 [[he.colour]]"><span></span></label>[[he.descr]]</paper-item>
                </template>
            </paper-listbox>
        </paper-menu-button>
`;
  }

  static get is() {
    return 'dynamic-link'
  }

  static get properties() {
    return {
      linkables: {
        type: Array,
        value: function () {
          return []
        }
      },
      representedObject: {
        type: Object
      }
    }
  }

  static get observers() {
    return []
  }

  ready() {
    super.ready()
  }

  _show(e) {
    e.preventDefault()
    e.stopPropagation()
    this.$.mb.open()
  }

  link(e, target) {
    const he = this.linkables.find(he => he.id === e.target.id)
    if (!he) {
      return
    }
    this.dispatchEvent(new CustomEvent('link-to-health-element', {bubbles: true, composed: true, detail: {representedObject: this.representedObject, healthElement: he}}))
  }
}

customElements.define(DynamicLink.is, DynamicLink)
