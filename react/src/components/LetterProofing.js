
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EduIDButton from 'components/EduIDButton';
import ConfirmModal from 'components/ConfirmModal';

import 'style/LetterProofing.scss';


class LetterProofingButton extends Component {

  render () {
    let spinning = false;

    if (this.props.is_fetching) spinning = true;

    return (
        <div>
          <form id="letter-proofing-form"
                className="form-horizontal"
                role="form">
            <fieldset id="letter-proofing">
              <EduIDButton bsStyle="primary"
                      spinning={spinning}
                      disabled={this.props.disabled}
                      onClick={this.props.handleLetterProofing}>
                {this.props.l10n('letter.letter_button_text')}
              </EduIDButton>
            </fieldset>
          </form>
          <ConfirmModal
                modalId="letterConfirmDialog"
                controlId="letterConfirmDialogControl"
                title={this.props.l10n('letter.confirm_title')}
                placeholder={this.props.l10n('letter.placeholder')}
                showModal={this.props.confirmingLetter}
                closeModal={this.props.handleStopConfirmationLetter}
                handleConfirm={this.props.sendConfirmationCode}
                with_resend_link={false}
                is_fetching={this.props.resending.is_fetching} />
        </div>
    );
  }
}

LetterProofingButton.propTypes = {
  letter_sent: PropTypes.string,
  letter_expires: PropTypes.string,
  resending: PropTypes.object,
  is_fetching: PropTypes.bool,
  disabled: PropTypes.bool,
  confirmingLetter: PropTypes.bool,
  sendConfirmationCode: PropTypes.func,
  handleLetterProofing: PropTypes.func,
  handleStopConfirmationLetter: PropTypes.func
}

export default LetterProofingButton;
