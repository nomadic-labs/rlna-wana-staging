import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button"
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import ImageUpload from '../editing/ImageUpload';
import {uploadImage} from "../../firebase/operations";
import { saveSession, removeSession } from "../../redux/actions"

const mapDispatchToProps = dispatch => {
  return {
    saveSession: (id, data) => {
      dispatch(saveSession(id, data));
    },
    removeSession: (id) => {
      dispatch(removeSession(id));
    },
  };
};

const emptySession = {
    image: "",
    title: { "text": "Title" },
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    link: { "link": "/", "anchor": "Zoom Link" },
    description: { "text": `<p>Description text</p>` },

  }

class SessionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newSession: props.session || emptySession }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.session !== this.props.session && !Boolean(this.props.session)) {
      this.setState({ newSession: emptySession })
    }

    if (prevProps.session !== this.props.session && this.props.session?.id) {
      this.setState({ newSession: this.props.session })
    }
  }

  handleChange = key => event => {
    const value = event.currentTarget.value
    this.setState({ newSession: {...this.state.newSession, [key]: value} })
  }

  handleImageChange = key => image => {
    this.setState({ newSession: {...this.state.newSession, [key]: image} })
  }

  handleDescChange = key => desc => {
    this.setState({ newSession: {...this.state.newSession, [key]: desc.text} })
  }

  handleSaveSession = () => {
    const { newSession } = this.state;

    const id = newSession.id ? newSession.id : `session-${Date.now()}`

    const data = {
      ...newSession,
      id
    }

    this.props.saveProfile(id, data)
    this.props.closeModal()
    this.setState({ newSession: emptySession })
  }

  handleDeleteParticipant = () => {
    this.props.removeProfile(this.state.newSession.id)
    this.props.closeModal()
    this.setState({ newSession: emptySession })
  }

  render() {
    const { showModal, closeModal } = this.props;
    const {
      image,
      message,
      url,
    } = this.state.newSession;

    return (
      <Dialog open={showModal} onClose={closeModal} aria-labelledby="form-dialog-title" scroll="body">
        <DialogTitle id="form-dialog-title">{id ? 'Edit Participant' : 'Create a Profile' }</DialogTitle>
        <DialogContent>
          <ImageUpload
            content={image}
            onContentChange={handleImageChange('image')}
            uploadImage={uploadImage}
          />
          <TextField
            value={message || ''}
            margin="dense"
            id="message"
            label="Message"
            type="text"
            fullWidth
            onChange={handleChange('message')}
            variant="outlined"
            required
          />
          <TextField
            value={url || ''}
            margin="dense"
            id="url"
            label="URL"
            type="text"
            fullWidth
            onChange={handleChange('url')}
            variant="outlined"
            required
          />
        </DialogContent>
        <DialogActions>
          <div className="pr-3 pl-3 pb-2 width-100">
            <Grid container justify="space-between">
              <Grid item>
                <Button
                  onClick={closeModal}
                  color="default"
                  variant="text"
                  style={{borderRadius:0, marginRight: '8px'}}
                  disableElevation>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  color="primary"
                  variant="contained"
                  style={{borderRadius:0}}
                  disableElevation>
                  Save
                </Button>
              </Grid>
            </Grid>
          </div>
        </DialogActions>
      </Dialog>
    );
  }

}

SessionModal.defaultProps = {
  onSaveItem: () => console.log("uh oh you're missing onSaveItem"),
  session: emptyEvent,
  showModal: false
}

export default connect(null, mapDispatchToProps)(SessionModal)

