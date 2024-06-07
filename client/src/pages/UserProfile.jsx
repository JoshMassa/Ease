import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Layout, Input, Row, Col, Card, Button, Typography, Divider, List } from 'antd';
import { Link } from 'react-router-dom';
import { GET_USER_BY_USERNAME } from '../utils/queries';
import { ADD_FRIEND, REMOVE_FRIEND } from '../utils/mutations';
import AuthService from '../utils/auth';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

function UserProfile() {
    const { username } = useParams();
    const decoded = AuthService.getProfile();
    const currentUser = decoded._id;
    const [userData, setUserData] = useState(null);
    const [isFriend, setIsFriend] = useState(false);

    const { data, loading, error } = useQuery(GET_USER_BY_USERNAME, {
        variables: { username },
    });

    const [addFriend] = useMutation(ADD_FRIEND);
    const [removeFriend] = useMutation(REMOVE_FRIEND);

    useEffect(() => {
        if (data?.getUserByUsername) {
            setUserData(data.getUserByUsername);
            const currentUserFriends = (data.getUserByUsername.friends || []).map(friend => friend._id);
            setIsFriend(currentUserFriends.includes(currentUser));
        }
    }, [data, currentUser]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleConnect = async () => {
        try {
          if (isFriend) {
            await removeFriend({ variables: { userId: currentUser, friendId: userData._id } });
            setIsFriend(false);
          } else {
            await addFriend({ variables: { userId: currentUser, friendId: userData._id } });
            setIsFriend(true);
          }
        } catch (error) {
          console.error('Error updating friendship status:', error);
        }
      };

      if (!userData) return null;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ padding: '24px' }}>
                <div className="container-fluid mt-7" style={{ marginTop: '75px' }}>
                    <Row gutter={[16, 16]}>
                        <Col xl={8} md={24}>
                            <Card
                                className="card-profile shadow"
                                style={{ borderRadius: '10px' }}
                                cover={
                                    <div className='image-container'>
                                        <img
                                            alt="profile picture"
                                            src={userData.profilePicture}
                                            className='profile-picture'
                                        />
                                    </div>
                                }
                            >
                                    <Col style={{ textAlign: 'center' }}>
                                        <Text className="centered" style={{ fontSize: '30px', padding:'24px' }}>{userData.firstName} {userData.lastName}</Text>
                                    </Col>
                                    <Col className="d-flex justify-content-center" style={{padding: '10px'}}>
                                        <Button className="btn btn-sm btn-info mr-4" onClick={handleConnect}>{isFriend ? 'Remove Friend' : 'Add Friend'}</Button>
                                        <Button className="btn btn-sm btn-default float-right">Message</Button>
                                    </Col>
                                
                                <Col className="card-profile-stats d-flex justify-content-center mt-md-5">
                                    <Col>
                                        <span className="heading">{userData.friends.length}</span>
                                        <span className="description">Friends</span>
                                    </Col>
                                    <Col>
                                        <span className="heading">{userData.messageCount}</span>
                                        <span className="description">Messages Sent</span>
                                    </Col>
                                </Col>
                                <Card.Meta
                                    description={
                                        <Col className="" style={{textAlign: 'center'}}>
                                            <Col className="h5 font-weight-600" style={{ fontSize: "24px" }}>
                                                <Divider style={{ fontSize: "24px", fontWeight: '600'}}> @{userData.username}</Divider>
                                            </Col>
                                            <Col className="font-weight-300">
                                                <Text className=""style={{fontWeight: '600', textAlign: 'center'}}>📍 {userData.city} {userData.state} {userData.country}</Text>
                                            </Col>
                                            <Col className="" style={{ fontSize: '20px' }}>
                                                <Text className="">{userData.title} at {userData.company}</Text>
                                            </Col>
                                            <Col>
                                                <Text className=""></Text>{userData.university}
                                            </Col>
                                            <Col>
                                                <Text className=""></Text>{userData.major}
                                            </Col>
                                            <Divider>About Me</Divider>
                                            <Text>{userData.aboutMe}</Text>
                                        </Col>
                                    }
                                />
                            </Card>
                        </Col>

                        <Col xxl={16} xl={16} lg={24} md={24} sm={12} xs={24}>
                            <Card>
                                <Text className="heading-small text-muted mb-4 h6">Friends</Text>
                                <Col className="pl-lg-4">
                                    {userData.friends.length > 0 ? (
                                        <List>
                                            {userData.friends.map(friend => (
                                                friend && (
                                                <List.Item key={friend._id}>
                                                    <Link style={{color:"#3c89e8"}} to={`/user/${friend._id}`}>
                                                    ⭐️ {friend.username}
                                                    </Link>
                                                </List.Item>
                                                )
                                            ))}
                                        </List>
                                    ) : (
                                        <Text>No friends yet.</Text>
                                    )}
                                </Col>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    );

}

export default UserProfile;
