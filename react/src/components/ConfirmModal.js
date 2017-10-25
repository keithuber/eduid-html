
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Alert from 'react-bootstrap/lib/Alert';
import FormGroup from 'react-bootstrap/lib/FormGroup';

import i18n from 'i18n-messages';
import TextInput from 'components/EduIDTextInput';
import EduIDButton from 'components/EduIDButton';
import EduiDAlert from 'components/EduIDAlert';


const getConfirmForm = inputName => {

    const validate = values => {
        const errors = {},
            code = values[inputName];
        if (!code) {
            errors[inputName] = 'required';
        }
        return errors;
    };

    let ConfirmForm = props => {
        let spinning = false,
            msg, msgClass, alertElem;

        if (props.is_fetching) spinning = true;

        if (props.message) {
          msg = props.l10n(props.message, props.messageArgs);
          alertElem = ( <EduiDAlert className="help-block"
                                    levelMessage={props.levelMessage}
                                    Msg={msg}>
                        </EduiDAlert>);
        }
        return (
            <form id={inputName + '-form'}
                  className="form-horizontal"
                  role="form">
                <Modal.Header>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <span className="help-block" id="alert">
                         {alertElem}
                    </span>
                    <div id="confirmation-code-area">
                        <Field component={TextInput}
                               componentClass="input"
                               type="text"
                               label={props.l10n('cm.enter_code')}
                               placeholder={props.placeholder}
                               controlId={inputName}
                               name={inputName} />
                        {props.resendHelp}
                        <a href="#" onClick={props.handleResend}
                           className="resend-code">
                            {props.resendText}
                        </a>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button className="cancel-button"
                            onClick={props.closeModal} >
                         {props.l10n('cm.cancel')}
                    </Button>
                    <EduIDButton bsStyle="primary"
                          className="ok-button"
                          spinning={spinning}
                          disabled={props.invalid}
                          onClick={props.handleConfirm} >
                        {props.l10n('cm.ok')}
                    </EduIDButton>
                </Modal.Footer>
            </form>
        );
    };

    ConfirmForm = reduxForm({
      form: inputName + '-form',
      validate
    })(ConfirmForm);
    
    return ConfirmForm;
}


class ConfirmModal extends Component {

  render () {
    const ConfirmForm = getConfirmForm(this.props.controlId);
    return (
      <div id={this.props.modalId}
           tabIndex="-1"
           role="dialog"
           aria-labelledby="askDialogPrompt"
           aria-hidden="true"
           data-backdrop="true">
          <Modal show={this.props.showModal}>
              <ConfirmForm {...this.props} />
          </Modal>
      </div>
    );
  }
}

ConfirmModal.propTypes = {
  placeholder: PropTypes.string,
  handleConfirm: PropTypes.func,
  confirming: PropTypes.string,
  handleResend: PropTypes.func,
  closeModal: PropTypes.func,
  showModal: PropTypes.bool,
  message: PropTypes.string,
  levelMessage: PropTypes.string,
  messageArgs: PropTypes.object,
  is_fetching: PropTypes.bool
}

export default i18n(ConfirmModal);
