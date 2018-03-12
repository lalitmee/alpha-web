import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';

import {loadFeedsForUser} from "../../actions/userFeedActions";
import {loadUserAccounts} from "../../actions/allUserActions";
import Post from '../post';
import AddContentButton from '../addContentButton';
import Sidebar from '../sidebar';
import indexStyles from '../../index.scss';

class Feed extends React.Component {
	constructor(props) {
		super(props);
		props.loadFeedsForUser(this.props.username);
	}

	componentWillReceiveProps(newProps) {
		let usersRequired = newProps.userFeed.posts.map(i => i.author).filter(username => !_.some(Object.keys(newProps.allUsers), i => username === i));
		usersRequired.length && newProps.loadUserAccounts(usersRequired);
	}

	render() {
		return <div className={['uk-container'].join(' ')}>
			<div uk-grid="true">
				<div className={'uk-width-1-4'}>
					<Sidebar/>
				</div>
				<div className={['uk-width-1-2', 'uk-margin-top'].join(' ')}>
					<div className={['uk-padding', indexStyles.white].join(' ')}>
						{this.props.userFeed.posts && this.props.userFeed.posts.map(post => <Post key={post.id} post={post}/>)}
					</div>
					<AddContentButton/>
				</div>
			</div>
		</div>
	}
}

const mapStateToProps = state => {
	return {
		userFeed: state.userFeed.user,
		username: state.authUser.username,
		allUsers: state.allUsers.users,
	}
};

export default withRouter(connect(mapStateToProps, {
	loadFeedsForUser, loadUserAccounts
})(Feed));
