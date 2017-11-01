
import { connect } from 'react-redux';
import PersonalData from 'components/PersonalData';
import { postUserdata, changeUserdata } from "actions/PersonalData";


const mapStateToProps = (state, props) => {
  return {
    data: state.personal_data.data,
    langs: state.config.AVAILABLE_LANGUAGES,
    is_fetching: state.personal_data.is_fetching
  }
};


const mapDispatchToProps = (dispatch, props) => {
  return {
    handleSave: (e) => {
      e.preventDefault();
      dispatch(postUserdata());
    },
  }
};

const PersonalDataContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalData);

export default PersonalDataContainer;
