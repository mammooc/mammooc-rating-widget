
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/polymer/lib/elements/dom-if.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-styles/color.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/default-theme.js';
import { MammoocLocalizeBehavior } from './mammooc-localize-behavior.js';
import './mammooc-cumulative-rating.js';
import './mammooc-course-evaluation.js';
import './mammooc-course-evaluation-form.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

/**
An element providing a rating widget for [mammooc.org](https://mammooc.org/), the platform for managing and evaluating MOOCs.

Example:

    <mammooc-rating-widget provider="openHPI" course-id="2">
    </mammooc-rating-widget>

The element consists of three smaller elements: one displaying the overall rating by other users, one displaying detailed evaluations by other users, and one form allowing the user to submit an evaluation for the course.

All of these can be disabled with the attributes `disable-rating`, `disable-evaluations` and `disable-evaluation-form`.

### Styling

`<mammooc-rating-widget>` provides the following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--mammooc-rating-widget-primary-color` | The primary color used for filled stars and highlights | #ffac33
`--mammooc-rating-widget-secondary-color` | The secondary color used for unfilled stars and secondary text | #ccd6dd
`--mammooc-rating-widget-background-color` | Background color of the entire widget | #fff


@demo demo/index.html
@element mammooc-rating-widget
*/
class MammoocRatingWidget extends mixinBehaviors([
    MammoocLocalizeBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style>
          :host {
                  --flexible-rating-filled-color: var(--mammooc-rating-widget-primary-color, #ffac33);
                  --flexible-rating-unfilled-color: var(--mammooc-rating-widget-secondary-color, #ccd6dd);
                  --paper-card-background-color: var(--mammooc-rating-widget-background-color, #fff);
                  max-width: 100%;
          }

          paper-card {
              max-width: 100%;
              width: inherit;
              height: auto;
          };

          .footer {
            color: var(--mammooc-rating-widget-secondary-color, #ccd6dd);
            text-align: center;
          }

          .footer a {
            color: var(--mammooc-rating-widget-secondary-color, #ccd6dd);
            text-decoration: underline;
          }

          .noratings {
            color: var(--mammooc-rating-widget-secondary-color, #ccd6dd);
            @apply --paper-font-headline;
          }

        </style>
        <iron-ajax id="evaluationsXHR" auto="" url="{{_generateRatingUrl(provider, courseId)}}" on-response="_handleRatingResponse">
        </iron-ajax>
        <paper-card>
          <template is="dom-if" if="{{_ratingCount}}">
            <template is="dom-if" if="{{!disableRating}}">
              <div class="card-content">
                  <mammooc-cumulative-rating cumulative-rating="{{_cumulativeRating}}" rating-count="{{_ratingCount}}"></mammooc-cumulative-rating>
              </div>
            </template>
            <template is="dom-if" if="{{!disableEvaluations}}">
              <div class="card-content">
                  <mammooc-course-evaluation provider="{{provider}}" rating-count="{{_ratingCount}}" course-id="{{courseId}}" per-page="5"></mammooc-course-evaluation>
              </div>
            </template>
          </template>
          <template is="dom-if" if="{{!_ratingCount}}">
            <div class="card-content">
              <div class="noratings">
                <i>{{localize("noevaluations")}}</i>
              </div>
            </div>
          </template>
          <template is="dom-if" if="{{!disableEvaluationForm}}">
            <div class="card-actions">
                <mammooc-course-evaluation-form provider="{{provider}}" course-id="{{courseId}}"></mammooc-course-evaluation-form>
            </div>
          </template>
          <div class="footer">
            {{localize("poweredby")}} <a target="_blank" href="https://mammooc-dev.herokuapp.com">mammooc</a>
          </div>
        </paper-card>
`;
    }

    static get is() {
        return 'mammooc-rating-widget';
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
           *   Disable the form allowing a user to submit an evaluation for the course
           *   @type {boolean}
           */
            disableEvaluationForm: {
                type: Boolean,
                value: false
            },

          /**
           *   Disable the component showing the detailed evaluations by other users
           *   @type {boolean}
           */
            disableEvaluations: {
                type: Boolean,
                value: false
            },

          /**
           *   Disable the component showing the overall rating by other users
           *   @type {boolean}
           */
            disableRating: {
                type: Boolean,
                value: false
            },

            _cumulativeRating: Number,
            _ratingCount: {
                type: Number,
                value: 0
            },

            _evaluations: {
                type: Object
            }

        };
    }

  /**
   *  Request the current evaluations present on mammooc and update the visuals accordingly.
   *  @returns {void}
   */
    updateEvaluations() {
        this.$.evaluationsXHR.generateRequest();
    }

    ready() {
        super.ready();
    }

    _generateRatingUrl(provider, courseId) {
        return 'https://mammooc-dev.herokuapp.com/evaluations/export_overall_course_rating?provider=' + provider + '&course_id=' + courseId;
    }

    _handleRatingResponse(request) {
        const evaluation = request.detail.response.evaluations;

        this._cumulativeRating = evaluation.overall_rating;
        this._ratingCount = evaluation.number_of_evaluations;

        this.dispatchEvent(new CustomEvent('data-loaded', { bubbles: true, composed: true }));
    }
}

// Register custom element definition using standard platform API
customElements.define(MammoocRatingWidget.is, MammoocRatingWidget);
