import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Card, Image, Feed } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Websites } from '../../api/website/Websites';
import Comment from './Comment';
import AddComment from './AddComment';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Website extends React.Component {
  render() {
    const website = this.props.website;
    return (
        <Card centered>
          <Card.Content>
            {this.props.location.pathname !== `/profile/${this.props.profile._id}` &&
            <Image
                floated='left'
                size='tiny'
                src={website.image}
            />}
            <Card.Header><a href={website.url} rel="noreferrer" target="_blank">{website.title}</a></Card.Header>
            {this.props.location.pathname !== `/profile/${this.props.profile._id}` &&
            <Card.Meta>Posted by <Link to={`/profile/${this.props.profile._id}`}>{website.firstname} {website.lastname}</Link></Card.Meta>}
            <Card.Meta>{website.date.toLocaleDateString('en-US')}</Card.Meta>
            <Card.Description>
              {website.description}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            {Meteor.user().username === website.owner &&
            <Link to={`/editsite/${this.props.website._id}`}>Edit</Link>
            }
            {(Meteor.user().username === website.owner || Roles.userIsInRole(Meteor.userId(), 'admin')) ? (
                <a className={'delete'} onClick={() => {
                  Websites.collection.remove(this.props.website._id);
                }} >Delete</a>
            ) : ''}
          </Card.Content>
          {this.props.location.pathname !== `/profile/${this.props.profile._id}` && <Card.Content extra>
            <Feed>
              {this.props.comments.map((comment, index) => <Comment key={index} comment={comment}/>)}
            </Feed>
          </Card.Content>}
          {this.props.location.pathname !== `/profile/${this.props.profile._id}` && <Card.Content extra>
            <AddComment profile={this.props.currentUser} elementId={this.props.website._id}/>
          </Card.Content>}
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
Website.propTypes = {
  location: PropTypes.object,
  website: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  comments: PropTypes.array,
  currentUser: PropTypes.object,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Website);
