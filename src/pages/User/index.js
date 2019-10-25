import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from '../../services/api';
import { Container, Header, Avatar, Name, Bio, Stars,
    Starred, OwnerAvatar, Info, Title, Author } from './styles';

export default class User extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').name,
    });

    state = {
        stars: [],
        refresh: false,
    }

    static propTypes = {
        navigation: PropTypes.shape({
            navigate: PropTypes.func,
        }).isRequired,
    };

    async componentDidMount() {
        const { navigation } = this.props;
        const user = navigation.getParam('user');

        this.setState({ refresh: true });

        const response = await api.get(`/users/${user.login}/starred`);

        this.setState({
            stars: response.data,
            refresh: false,
        });
    }

    onRefresh() {
        this.componentDidMount();
    }

    render() {
        const { navigation } = this.props;
        const { stars, refresh } = this.state;

        const user = navigation.getParam('user');

        return (
            <Container>
                <Header>
                    <Avatar source={{ uri: user.avatar }} />
                        <Name>{user.name}</Name>
                        <Bio>{user.bio}</Bio>
                </Header>

                <Stars
                    data={stars}
                    onRefresh={() => this.onRefresh()}
                    refreshing={refresh}
                    keyExtractor={star => String(star.id)}
                    renderItem={({ item }) => (
                        <Starred>
                            <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                            <Info>
                                <Title>{item.name}</Title>
                                <Author>{item.owner.login}</Author>
                            </Info>
                        </Starred>
                    )}
                />
            </Container>
        );
    }
}
