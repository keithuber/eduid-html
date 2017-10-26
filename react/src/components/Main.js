
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider, addLocaleData } from 'react-intl';
import { connect } from 'react-redux';
import { Route, NavLink } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter } from 'react-router-redux'

import i18n from 'i18n-messages';
import HeaderContainer from "containers/Header";
import FooterContainer from "containers/Footer";

import PersonalDataContainer from 'containers/PersonalData';
import NinsContainer from 'containers/Nins';
import EmailsContainer from 'containers/Emails';
import MobileContainer from 'containers/Mobile';
import SecurityContainer from 'containers/Security';
import ChangePasswordContainer from 'containers/ChangePassword';
import NotificationsContainer from 'containers/Notifications';
import ProfileFilledContainer from 'containers/ProfileFilled';
import PendingActionsContainer from 'containers/PendingActions';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'style/base.scss';
import 'style/Main.scss';


export const history = createHistory()

/* SubMain is the main component, before internationalization */

class SubMain extends Component {

    render () {

        let tabsElem = '';

        if (this.props.show_sidebar) {

            const tabs = [{id: 'personaldata', label: this.props.l10n('main.personal_data')},
                          {id: 'nins', label: this.props.l10n('main.nins')},
                          {id: 'emails', label: this.props.l10n('main.emails')},
                          {id: 'phones', label: this.props.l10n('main.phones')},
                          {id: 'security', label: this.props.l10n('main.security')}];
            const tabsElems = tabs.map( (tab, index) => {
                //let classes;
                //if (tab.id === 'personaldata') {
                    //classes = 'main-nav-tabs active';
                //} else {
                    //classes = 'main-nav-tabs';
                //}
                return (
                    <li key={index}>
                      <NavLink className='main-nav-tabs'
                            activeClassName="active"
                            to={`/profile/${tab.id}`}
                            id={`${tab.id}-router-link`}>
                        {tab.label}
                      </NavLink>
                    </li>
                );
            });
            tabsElem = (
                    <div className='col-md-3'>
                      <div className="profile-head">
                        <h3>{this.props.l10n('main.profile_title')}</h3>
                        <PendingActionsContainer />
                      </div>
                      <div className="tabs-left hidden-xs" id="profile-menu-large">
                        <ul className='nav nav-tabs nav-stacked'>
                          {tabsElems}
                          <ProfileFilledContainer />
                          <li id="profile-menu-eppn-li">
                            <div className="profile-menu-eppn">
                              <p className="eppn-text-muted">{this.props.l10n('main.eduid_id')}: {this.props.eppn}</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
            );
        }

        const content = (
              <div className="container position-relative">
                <noscript><div id="no-script"><h3>{this.props.l10n('main.noscript')}</h3></div></noscript>
                <div id="content-block">

                  <div className='profile-combo tabbable well row' id="profile-content-area">
                    {tabsElem}
                    <div className="tab-content info-container col-md-8 col-md-offset-1">
                      <div className="tab-pane active">
                        <NotificationsContainer />
                        <Route exact path="/profile/" component={PersonalDataContainer} />
                        <Route path="/profile/personaldata" component={PersonalDataContainer} />
                        <Route path="/profile/nins" component={NinsContainer} />
                        <Route path="/profile/emails" component={EmailsContainer} />
                        <Route path="/profile/phones" component={MobileContainer} />
                        <Route path="/profile/security" component={SecurityContainer} />
                        <Route path="/profile/chpass" component={ChangePasswordContainer} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='push'></div>
              </div>
        );
        if (this.props.testing) {
            return ([
              <HeaderContainer key="1" />,
                <div key="2">
                {content}
                </div>,
              <FooterContainer key="3" />
            ]);
        } else {
            return ([
              <HeaderContainer key="1" />,
              <ConnectedRouter history={history} key="2">
                {content}
              </ConnectedRouter>,
              <FooterContainer key="3" />
            ]);
        }
    }
}

SubMain.propTypes = {
    window_size: PropTypes.string,
    show_sidebar: PropTypes.bool,
    eppn: PropTypes.string,
    testing: PropTypes.bool
};

const SubMainContainer = connect(
   (state, props) => ({
        window_size: state.config.window_size,
        show_sidebar: state.config.show_sidebar,
        eppn: state.personal_data.data.eppn
    }),
    (dispatch, props) => ({}),
)(i18n(SubMain));


export { SubMainContainer };


/* localize the internationalized SubMain component,
 * and wrap it with IntlProvider, to produce the final
 * Main Component */

class Main extends Component {

    componentWillMount() {
        window.addEventListener('resize', this.props.handleWindowSizeChange);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.props.handleWindowSizeChange);
    }

    render () {
        const lang = this.props.language,
              locale = require('react-intl/locale-data/' + lang),
              messages = require('../../i18n/l10n/' + lang);

        addLocaleData(locale);

        return (
          <IntlProvider locale={ lang } messages={ messages }>
            <SubMainContainer testing={false} />
          </IntlProvider>
        );
    }
}

Main.propTypes = {
    language: PropTypes.string,
    handleWindowSizeChange: PropTypes.func
}

export default Main;
