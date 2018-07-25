
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/polymer/lib/elements/custom-style.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import 'flexible-rating/flexible-rating.js';
import '@polymer/paper-styles/typography.js';
import { MammoocLocalizeBehavior } from './mammooc-localize-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

/**
An element providing an overall rating.

Example:

    <mammooc-cumulative-rating></mammooc-cumulative-rating>

@element mammooc-cumulative-rating
*/
class MammoocCumulativeRating extends mixinBehaviors([
    MammoocLocalizeBehavior
], PolymerElement) {
    static get template() {
        return html`
        <custom-style>
            <style>
                :host {
                    --iron-icon-height: 50px;
                    --iron-icon-width: 50px;
                }

                .heading {
                    @apply --paper-font-headline;
                }
            </style>
        </custom-style>

        <!-- local DOM goes here -->
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
          /**
           *   The average rating for the course
           *   @type {number}
           */
            cumulativeRating: {
                type: Number
            },
          
          /**
           *   The number of ratings for the course
           *   @type {number}
           */
            ratingCount: {
                type: Number
            }
        };
    }

    static get observers() {
        return [];
    }

    ready() {
        super.ready();
    }
}

// Register custom element definition using standard platform API
customElements.define(MammoocCumulativeRating.is, MammoocCumulativeRating);
