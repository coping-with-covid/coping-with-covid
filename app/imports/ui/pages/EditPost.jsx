import React from 'react';
import { Redirect } from 'react-router-dom';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import {
  AutoForm,
  ErrorsField,
  HiddenField,
  LongTextField,
  SubmitField,
  TextField } from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Posts } from '../../api/post/Posts';

const bridge = new SimpleSchema2Bridge(Posts.schema);

/** Renders the Page for editing a single document. */
class EditPost extends React.Component {

  constructor(props) {
    super(props);
    this.state = { redirectToReferer: false };
  }

  /** On successful submit, insert the data. */
  submit(data) {
    const { image, title, firstname, lastname, date, description, owner, _id } = data;
    Posts.collection.update(_id, { $set: { image, title, firstname, lastname, date, description, owner } }, (error) => (error ?
        swal('Error', error.message, 'error') :
        swal('Success', 'Item updated successfully', 'success')));
    this.setState({ redirectToReferer: true });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    const { from } = this.props.location.state || { from: { pathname: '/forum' } };
    // redirect if incorrect authentication
    if (Meteor.user().username !== this.props.doc.owner) {
      this.setState({ redirectToReferer: true });
    }
    // if correct authentication, redirect to page instead of login screen
    if (this.state.redirectToReferer) {
      return <Redirect to={from}/>;
    }
    return (
        <Grid container centered>
          <Grid.Column>
            <Header className="ui large header sign" textAlign="center">Edit Post</Header>
            <AutoForm schema={bridge} onSubmit={data => this.submit(data)} model={this.props.doc}>
              <Segment>
                <TextField name='title'/>
                <LongTextField name='description'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
                <HiddenField name='owner' />
                <HiddenField name='image' />
                <HiddenField name='firstname' />
                <HiddenField name='lastname' />
                <HiddenField name='date' />
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

/** Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use. */
EditPost.propTypes = {
  location: PropTypes.object,
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Posts.userPublicationName);
  return {
    doc: Posts.collection.findOne(documentId),
    ready: subscription.ready(),
  };
})(EditPost);
