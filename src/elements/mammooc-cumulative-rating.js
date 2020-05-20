import '@polymer/paper-styles/typography.js';
import '@polymer/polymer/lib/elements/custom-style.js';
import 'flexible-rating/flexible-rating.js';
import { MammoocLocalizeMixin } from '../mixins/mammooc-localize-mixin.js';
import { PolymerElement, html } from '@polymer/polymer';

/**
 * ## `mammooc-cumulative-rating`
 *
 * An element providing an overall rating.
 *
 * @polymer
 * @customElement
 * @appliesMixin MammoocLocalizeMixin
 * @demo demo/mammooc-cumulative-rating.html
 */
class MammoocCumulativeRating extends MammoocLocalizeMixin(PolymerElement) {
    static get template() {
        return html`
        <custom-style> <!-- custom-style tag is required as Polyfill for otherwise unsupported browsers, such as IE 11 -->
            <style include="paper-material-styles">
                :host {
                    --iron-icon-height: 50px;
                    --iron-icon-width: 50px;
                }

                .heading {
                    @apply --paper-font-headline;
                }
            </style>
        </custom-style>

        <div class="heading">
            {{localize("ratings")}}
        <flexible-rating value="{{cumulativeRating}}" disabled=""></flexible-rating> ({{ratingCount}})
        </div>
`;
    }

    static get is() {
        return 'mammooc-cumulative-rating';
    }

    static get properties() {
        return {
            /** The average rating for the course */
            cumulativeRating: {
                type: Number
            },
            /** The number of ratings for the course */
            ratingCount: {
                type: Number
            }
        };
    }

    static get observers() {
        return [];
    }
}

// Register custom element definition using standard platform API
customElements.define(MammoocCumulativeRating.is, MammoocCumulativeRating);
