
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/polymer/lib/elements/dom-if.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import 'flexible-rating/flexible-rating.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-toast/paper-toast.js';
import { IronJsonpLibraryBehavior } from '@polymer/iron-jsonp-library/iron-jsonp-library.js';
import { MammoocLocalizeBehavior } from './mammooc-localize-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

/**
An element providing a form for the evaluation of a course.

Example:

    <mammooc-course-evaluation-form></mammooc-course-evaluation-form>

@element mammooc-course-evaluation-form
*/
class MammoocCourseEvaluationForm extends mixinBehaviors([
    MammoocLocalizeBehavior,
    IronJsonpLibraryBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                    --iron-icon-height: 40px;
                    --iron-icon-width: 40px;
                    --primary-color: var(--mammooc-rating-widget-primary-color, #ffac33);
            }

            .heading {
                @apply --paper-font-headline;
            }

            .submit-button {
                float: right;
            }

            #form img {
                float: left;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin-right: 5px;
                border: 1px solid var(--mammooc-rating-widget-secondary-color, #9999);
            }

            #form .description {
                overflow: auto;
            }
        </style>

        <!-- Library for loading the data from mammooc -->
        <iron-jsonp-library id="evaluationRequest" library-url="{{_generateUrl(provider, courseId)}}" notify-event="api-load">
        </iron-jsonp-library>
        <!-- local DOM goes here -->
        <div class="heading">
            {{localize("yourrating")}}
        </div>
        <iron-form id="form">
            <form>
                <div>
                    <template is="dom-if" if="{{loggedIn}}">
                        <img id="profile_image" alt="mammooc profile image">
                        <div id="profile_name"></div>
                    </template>
                    <div class="description">
                        <paper-textarea placeholder="{{localize('descriptionplaceholder')}}" name="description" label="{{localize('descriptionlabel')}}" id="description"></paper-textarea>
                    </div>
                </div>
                <label id="statusLabel">
                    {{localize("status")}}
                    </label>
                <paper-radio-group id="status" aria-labelledby="statusLabel" selected="enrolled">
                    <paper-radio-button name="aborted">
                        {{localize("aborted")}}
                    </paper-radio-button>
                    <paper-radio-button name="enrolled">
                        {{localize("enrolled")}}
                    </paper-radio-button>
                    <paper-radio-button name="finished">
                        {{localize("finished")}}
                    </paper-radio-button>
                </paper-radio-group>
                <paper-checkbox id="anonymously" name="anonymously">
                    {{localize("submitanonymously")}}
                </paper-checkbox>
                <flexible-rating id="stars" name="stars" required=""></flexible-rating>
                <paper-button class="submit-button" raised="" on-click="_submitForm">
                    {{localize("submit")}}
                </paper-button>
            </form>
        </iron-form>

        <!-- Send form if user is not logged in -->
        <form method="post" target="_blank" action="https://mammooc.org/evaluations/login_and_save" id="nativeForm">
        </form>

        <!-- Callback for finished post, flashes success message -->
        <iron-jsonp-library id="postJsonP" callback-name="callback" notify-event="post-sent">
        </iron-jsonp-library>

        <paper-toast id="successToast" text="{{localize('successtext')}}"></paper-toast>
`;
    }

    static get is() {
        return 'mammooc-course-evaluation-form';
    }

    static get properties() {
        return {
          /**
           *    The provider of the course, e.g. "openHPI"
           *    @type {string}
           */
            provider: {
                type: String
            },

          /**
           *   The ID of the course in the provider's system
           *   @type {string}
           */
            courseId: {
                type: String
            },

          /**
           *   A boolean stating whether the user is logged in on mammooc
           *   @type {boolean}
           */
            loggedIn: {
                type: Boolean,
                value: false,
                readOnly: true
            },

            _tries: {
                type: Number,
                value: 0
            }
        };
    }

    static get observers() {
        return [
        ];
    }

    ready() {
        this.addEventListener('api-load', this._apiLoaded.bind(this));
        this.addEventListener('post-sent', this._postSent.bind(this));
      // Every time the window gets focus, send a new request in case of changes on mammooc
      // _tries is needed because the jsonp library won't resend if the url is the same
        let that = this;
        window.onfocus = function() {
            that.$.evaluationRequest.libraryUrl = that._generateUrl(that.provider, that.courseId) + '&try=' + that._tries;
            that._tries += 1;
        };
        super.ready();
    }

    _postSent() {
        this.getRootNode().host.updateEvaluations();
        this.$.successToast.open();
    }

    _submitForm() {
        if (this.loggedIn)
            this._jsonPSubmit();
        else
          this._nativeSubmit();
    }

    _jsonPSubmit() {
        const serializedItems = this._serializeFormData();
        let url = 'https://mammooc.org/evaluations/save.js?callback=callback&';
        url = url + Object.keys(serializedItems).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(serializedItems[k])).join('&');
        this.shadowRoot.querySelector('#postJsonP').libraryUrl = url;
    }

    _serializeFormData() {
      /* eslint-disable camelcase */
        const formData = this.$.form.serializeForm();
        let newFormData = {};

        if (formData.description !== undefined && formData.description !== null && formData.description !== '') {
            newFormData.description = formData.description;
        }
        newFormData.rating = formData.stars;
        newFormData.rated_anonymously = formData.anonymously === 'on';

        newFormData.course_status = this.shadowRoot.querySelector('#status').selected;

        newFormData.course_id = this.courseId;
        newFormData.provider = this.provider;

        return newFormData;
      /* eslint-enable camelcase */
    }

    _nativeSubmit() {
        const form = this.$.form;
        let nativeForm = this.$.nativeForm;

        while (nativeForm.firstChild) {
            nativeForm.removeChild(nativeForm.firstChild);
        }

        if (form.validate()) {
          // For each element the iron-form wants to submit, create a hidden
          // input in the submission form.
            const serializedItems = this._serializeFormData();

            for (const name in serializedItems) {
                if (serializedItems.hasOwnProperty(name)) {
                    let input = document.createElement('input');
                    input.hidden = true;
                    input.name = name;
                    input.value = serializedItems[name];
                    nativeForm.appendChild(input);
                }
            }
            nativeForm.submit();
        }
    }

    _generateUrl(provider, courseId) {
        return 'https://mammooc.org/api/current_user_with_evaluation.js?provider=' + provider + '&course_id=' + courseId + '&callback=%%callback%%';
    }

    _apiLoaded(response) {
        const result = response.detail[0];
        this._setLoggedIn(result.logged_in);
        flush();
        if (!this.loggedIn) {
            return;
        }
        if (result.user) {
            this.shadowRoot.querySelector('#profile_image').src = result.user.profile_picture;
            this.shadowRoot.querySelector('#profile_name').innerHTML = result.user.name;
        }
        if (result.evaluation) {
            this.shadowRoot.querySelector('#description').value = result.evaluation.description;
            this.shadowRoot.querySelector('#stars').value = result.evaluation.rating;
            this.shadowRoot.querySelector('#status').selected = result.evaluation.course_status;
            this.shadowRoot.querySelector('#anonymously').checked = result.evaluation.rated_anonymously;
        }
    }
}

// Register custom element definition using standard platform API
customElements.define(MammoocCourseEvaluationForm.is, MammoocCourseEvaluationForm);
