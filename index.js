/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

/* eslint no-path-concat: 0 */

'use strict';

var Component = require('spa-component');


/**
 * Tab item implementation.
 * This component has redefined methods 'show' and 'hide', use them to switch between tabs.
 * All tab items are created invisible by default.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 *
 * @example
 * var Tab = require('stb/ui/tab.item'),
 *     tabItem = new Tab({
 *         $node: window.someId,
 *         children: [
 *             new Panel({
 *                 $node: window.anotherId
 *             })
 *         ],
 *         events: {
 *             show: function ( event ) {
 *                 // tab was activated
 *             },
 *             hide: function ( event ) {
 *                 // tab was hidden
 *             }
 *         }
 *     });
 *
 * tabList.add(tabItem);
 */
function Tab ( config ) {
    // sanitize
    config = config || {};

    if ( DEVELOP ) {
        if ( typeof config !== 'object' ) {
            throw new Error(__filename + ': wrong config type');
        }
        if ( 'className' in config && (!config.className || typeof config.className !== 'string') ) {
            throw new Error(__filename + ': wrong or empty config.className');
        }
    }

    // can't accept focus
    config.focusable = config.focusable || false;

    // set default className if classList property empty or undefined
    //config.className = 'tabItem hidden ' + (config.className || '');

    config.className += ' hidden';

    // prevent parent hiding
    config.visible = null;

    // parent constructor call
    Component.call(this, config);

    this.visible = false;
}


// inheritance
Tab.prototype = Object.create(Component.prototype);
Tab.prototype.constructor = Tab;

// set component name
Tab.prototype.name = 'spa-component-tab';


/**
 * Make the tab visible, i.e. set active tab, and notify subscribers.
 * Hide previous visible tab if exists.
 *
 * @param {Object} [data] custom data which passed into handlers
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/ui/tab.item~Tab#show
 */
Tab.prototype.show = function ( data ) {
    var prev = null;

    if ( DEVELOP ) {
        if ( !this.parent ) {
            throw new Error(__filename + ': no parent for tab item');
        }
        // if ( this.parent.constructor.name !== 'TabList' ) {
        //     throw new Error(__filename + ': wrong parent for tab item');
        // }
        if ( this.parent.currentTab && !(this.parent.currentTab instanceof Tab) ) {
            throw new Error(__filename + ': wrong current tab item type');
        }
    }

    // is it hidden
    if ( !this.visible ) {
        // hide previous tab
        if ( this.parent.currentTab ) {
            prev = this.parent.currentTab;
            prev.hide(data);
        }

        Component.prototype.show.call(this, data);
        this.parent.currentTab = this;

        /*// there are some listeners
         if ( this.parent.events['switch'] ) {
         this.parent.emit('switch', {prev: prev, curr: this});
         }*/

        return true;
    }

    // nothing was done
    return true;
};


/**
 * Make the tab hidden and notify subscribers.
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/ui/tab.item~Tab#hide
 */
Tab.prototype.hide = function () {
    if ( DEVELOP ) {
        if ( !this.parent ) {
            throw new Error(__filename + ': no parent for tab item');
        }
        // if ( this.parent.constructor.name !== 'TabList' ) {
        //     throw new Error(__filename + ': wrong parent for tab item');
        // }
        if ( this.parent.currentTab && !(this.parent.currentTab instanceof Tab) ) {
            throw new Error(__filename + ': wrong current tab item type');
        }
    }

    if ( Component.prototype.hide.call(this) ) {
        this.parent.currentTab = null;

        return true;
    }

    // nothing was done
    return true;
};


// public
module.exports = Tab;
