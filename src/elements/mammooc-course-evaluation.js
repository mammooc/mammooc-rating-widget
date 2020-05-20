import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/polymer/lib/elements/custom-style.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import 'flexible-rating/flexible-rating.js';
import { MammoocLocalizeMixin } from '../mixins/mammooc-localize-mixin.js';
import { PolymerElement, html } from '@polymer/polymer';

/**
 * ## `mammooc-course-evaluation`
 *
 * An element providing course ratings.
 *
 * @polymer
 * @customElement
 * @appliesMixin MammoocLocalizeMixin
 * @demo demo/mammooc-course-evaluation.html
 */
class MammoocCourseEvaluation extends MammoocLocalizeMixin(PolymerElement) {
    static get template() {
        return html`
        <custom-style> <!-- custom-style tag is required as Polyfill for otherwise unsupported browsers, such as IE 11 -->
            <style include="paper-material-styles">
                :host {
                    --iron-icon-height: 20px;
                    --iron-icon-width: 20px;
                }
    
                .heading {
                    display:inline;
                    margin-right: 5px;
                }
    
                a {
                    color: var(--mammooc-rating-widget-primary-color, #ffac33);
                }
    
                .evaluations > iron-scroll-threshold {
                    max-height: 200px;
                    overflow-y: scroll;
                }
    
                .evaluation-card, .evaluation-card-fixed {
                    min-height: 50px;
                    padding-bottom: 3px;
                }
    
                .evaluation-card {
                    cursor: pointer;
                }
    
                .evaluation-card img, .evaluation-card-fixed img {
                    float: left;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    margin-right: 5px;
                    border: 1px solid var(--mammooc-rating-widget-secondary-color, #999);
                }
    
                .evaluation-content-short {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
    
                .evaluation-content-long {
                    display: none;
                }
    
                .evaluation-card:hover .evaluation-header::after {
                    content: ' [+]';
                    color: var(--mammooc-rating-widget-secondary-color, #999);
                }
    
                .evaluation-card.expanded {
                    padding-bottom: 15px;
                }
    
                .evaluation-card.expanded:hover .evaluation-header::after {
                    content: '';
                }
    
                .evaluation-card.expanded .evaluation-content-long {
                    display: flex;
                    white-space: normal;
                    text-overflow: initial;
                    overflow: visible;
                }
    
                .evaluation-card.expanded .evaluation-content-short {
                    display: none;
                }
    
                .evaluation-card.expanded:hover .evaluation-header::after {
                    content: ' [–]';
                    color: var(--mammooc-rating-widget-secondary-color, #999);
                }
                
                .evaluation-container {
                    padding-bottom: 3px;
                }
    
                .heading {
                    @apply --paper-font-headline;
                }
            </style>
        </custom-style>

        <iron-ajax auto="" url="{{_generateEvaluationUrl(provider, courseId, perPage, _page)}}" on-response="_handleEvaluationResponse">
        </iron-ajax>
        <div class="heading">
            {{localize("courseevaluations")}}
        </div>
        <a target="_blank" href="{{_generateCourseUrl(provider, courseId)}}">{{localize("seeall")}}</a>
        <div class="evaluations">
            <iron-scroll-threshold id="scrollThreshold" on-lower-threshold="_loadMoreData">
                <iron-list scroll-target="scrollThreshold" items="[[_evaluations]]" as="evaluation" selection-enabled="" multi-selection="">
                    <template>
                        <div class="evaluation-container">
                            <template is="dom-if" if="{{_showEvaluation(evaluation)}}">
                                <div class\$="{{_getClassForEvaluation(evaluation, selected)}}">
                                    <img src="{{evaluation.user_profile_picture}}" alt="mammooc profile image">
                                    <div class="evaluation-header">
                                        <flexible-rating value="{{evaluation.rating}}" disabled=""></flexible-rating> <b>{{evaluation.user_name}}</b>
                                    </div>
                                    <div class="evaluation-content-short">{{evaluation.description}}</div>
                                    <div class="evaluation-content-long">{{evaluation.description}}</div>
                                </div>
                            </template>
                        </div>
                    </template>
                </iron-list>
            </iron-scroll-threshold>
        </div>
`;
    }

    static get is() {
        return 'mammooc-course-evaluation';
    }

    static get properties() {
        return {
            _evaluations: {
                type: Object,
                value: []
            },
            /** The provider of the course, e.g. "openHPI" */
            provider: {
                type: String
            },
            /** The ID of the course in the provider's system */
            courseId: {
                type: String
            },
            /** The number of items shown per page */
            perPage: {
                type: Number
            },
            /** The number of ratings in general */
            ratingCount: {
                type: Number
            },
            /** Whether to hide evaluations without a written review in the list or not */
            hideEmptyEvaluations: {
                type: Boolean,
                value: false
            },
            _page: {
                type: Number,
                value: 1
            },
            _reachedEnd: {
                type: Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return [];
    }

    _generateCourseUrl(provider, courseId) {
        return 'https://mammooc.org/courses/' + provider + '~' + courseId;
    }

    _generateEvaluationUrl(provider, courseId, perPage, page) {
        return 'https://mammooc.org/evaluations/export_course_evaluations?provider=' + provider + '&course_id=' + courseId + '&page=' + page + '&per_page=' + perPage;
    }

    _loadMoreData() {
        if (this._reachedEnd)
            return;

      // Iron ajax will automatically send a new request when the _page changes
        this._page++;
    }

    _handleEvaluationResponse(request) {
        const newEvaluations = request.detail.response.evaluations[0].user_evaluations;
      // If we got less evaluations than requested, we are done
        if (newEvaluations.length < this.perPage) {
            this._reachedEnd = true;
        }
      // Add all new evaluations to the list
      // IMPORTANT: Use Polymer's array mutation methods here in order to prevent scrolling to top
        for (let i = 0; i < newEvaluations.length; ++i)
            this.push('_evaluations', newEvaluations[i]);

        this.$.scrollThreshold.clearTriggers();
    }

    _getClassForEvaluation(evaluation, selected) {
        if (!this._textWillOverflow(evaluation.description)) {
            return 'evaluation-card-fixed';
        } else {
            return selected ? 'evaluation-card expanded' : 'evaluation-card';
        }
    }

    _textWillOverflow(text) {
        const tag = document.createElement('div');
        tag.className = 'evaluation-content-short';
        tag.innerHTML = text;

        this.shadowRoot.querySelector('.evaluations').appendChild(tag);
        const result = tag.clientWidth < tag.scrollWidth;
        this.shadowRoot.querySelector('.evaluations').removeChild(tag);

        return result;
    }

    _showEvaluation(evaluation) {
        return (!this.hideEmptyEvaluations || evaluation.description);
    }
}

// Register custom element definition using standard platform API
customElements.define(MammoocCourseEvaluation.is, MammoocCourseEvaluation);
