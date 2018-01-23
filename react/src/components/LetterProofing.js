
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EduIDButton from 'components/EduIDButton';
import ConfirmModal from 'components/ConfirmModal';
import GenericConfirmModal from 'components/GenericConfirmModal';

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
          <GenericConfirmModal
                modalId="letterGenericConfirmDialog"
                title={this.props.l10n('letter.confirm_title')}
                mainText={this.props.l10n('letter.confirm_info')}
                showModal={this.props.confirmingLetter}
                closeModal={this.props.handleStopConfirmationLetter}
                acceptModal={this.props.confirmLetterProofing}
          />
          <ConfirmModal
                modalId="letterConfirmDialog"
                controlId="letterConfirmDialogControl"
                title={this.props.l10n('letter.verify_title')}
                placeholder={this.props.l10n('letter.placeholder')}
                showModal={this.props.verifyingLetter}
                closeModal={this.props.handleStopVerificationLetter}
                handleConfirm={this.props.sendConfirmationCode}
                with_resend_link={false} />
        </div>
    );
  }
}

LetterProofingButton.propTypes = {
  is_fetching: PropTypes.bool,
  disabled: PropTypes.bool,
  confirmingLetter: PropTypes.bool,
  sendConfirmationCode: PropTypes.func,
  handleLetterProofing: PropTypes.func,
  confirmLetterProofing: PropTypes.func,
  handleStopConfirmationLetter: PropTypes.func
}

export default LetterProofingButton;
