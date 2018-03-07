// Polyfill for Element.closest for IE9+
// see https://developer.mozilla.org/en-US/docs/Web/API/Element/closest

import "babel-polyfill";

if (!Element.prototype.matches)
      Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                    Element.prototype.webkitMatchesSelector;

if (!Element.prototype.closest)
      Element.prototype.closest = function(s) {
                var el = this;
                if (!document.documentElement.contains(el)) return null;
                do {
                              if (el.matches(s)) return el;
                              el = el.parentElement || el.parentNode;
                          } while (el !== null); 
                return null;
            };

// end Polyfill

/*jslint vars: false, nomen: true, browser: true */
/*global $, console, alert, deform */

import React from 'react';
import init_app from "../init-app";
import OpenidConnectFrejaContainer from 'containers/OpenidConnectFreja';

import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import sv from 'react-intl/locale-data/sv';

addLocaleData([...en, ...sv])

let component = <OpenidConnectFrejaContainer />;


if (window.tabbedform === undefined) {
    window.tabbedform = {};
}

if (window.tabbedform.changetabs_calls === undefined) {
    window.tabbedform.changetabs_calls = [];
}

jQuery.fn.initDeformCallbacks = function () {
    "use strict";
    if (deform.callbacks !== undefined &&
            deform.callbacks.length === 0) {
        $(this).find('span.scriptholder').each(function (i, e) {
            var script = $(e).data('script');
            console.log('Executing form script: ' + script);
            window.forms_helper_functions[script]();
        });
        const root = document.getElementById('openid-connect-root');
        if (root) {
            init_app(root, component, true);
        }
    }
};

var TabbedForm = function (container) {
    "use strict";

    var get_form = function (url, target) {
          $.get(url + '/', {}, function (data, status_text, xhr) {
              var loc = xhr.getResponseHeader('X-Relocate');
              if (loc) {
                    document.location = loc;
              };
              target.html(data);
              $('div.tab-pane.active button.btn-primary').enable(false);
              target.initDeformCallbacks();
              deform.processCallbacks();
              $('div.tab-pane.active button.btn-primary').enable(true);

              container.find("a[data-toggle=tooltip]").tooltip();
              container.find("button[data-toggle=tooltip]").tooltip();
              container.find("label[data-toggle=tooltip]").tooltip();
              if (url === "nins") {
                const root = document.getElementById('openid-connect-root');
                      init_app(root, component, true);
              }

          }, 'html').fail(function (xhr) {
              if (xhr.status == 401) {
                  $('body').trigger('communication-error-permissions');
              } else {
                  $('body').trigger('communication-error');
              }
          });
        },

        initialize_nav_tabs = function () {
            var nav_tabs = container.find('.nav-tabs a.main-nav-tabs');
            $(nav_tabs).unbind('click');
            $(nav_tabs).click(function (e) {
                var named_tab = e.target.href.split('#')[1],
                    url = named_tab;

                container.find('ul.nav-tabs a').parent().removeClass('active');
                container.find('ul.nav-tabs a[href=#' + named_tab + ']').
                    parent().addClass('active');

                get_form(url, $(".tab-pane.active"));
            });
        },

        initialize = function () {
            var opentab = location.toString().split('#')[1];

            initialize_nav_tabs();

            window.forms_helper_functions.initialize_pending_actions();


            $('body').bind('formready', function () {
                // callbacks
                window.tabbedform.changetabs_calls.forEach(function (func) {
                    if (func !== undefined) {
                        func(container);
                    }
                });
            });

            $('body').one('reloadtabs', function () {
                initialize_nav_tabs();
                window.forms_helper_functions.initialize_pending_actions();
            });

            if (opentab === undefined || opentab === "") {
                container.find('.nav-tabs a.main-nav-tabs').first().click();
            } else {
                window.forms_helper_functions.initialize_verification(opentab);
            }
            window.tabbedform.changetabs_calls.push(window.forms_helper_functions.auto_displayname);
        };

    initialize();
};

$(document).ready(new TabbedForm($('.tabbable')));
