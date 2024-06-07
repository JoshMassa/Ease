import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Layout, Row, Col, Card, Button } from 'antd';
import { Link } from 'react-router-dom';
import { GET_USER_BY_USERNAME } from '../utils/queries';
import { ADD_FRIEND, REMOVE_FRIEND } from '../utils/mutations';
import AuthService from '../utils/auth';

const { Content } = Layout;

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
            <Content style={{ padding: '24px', background: '#f0f2f5' }}>
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
                                <div className="card-header text-center border-0 pt-8 pt-md-4 pb-0">
                                    <div className="h5" style={{ fontSize: '30px' }}>
                                        <i className="ni mr-2"></i>{userData.firstName} {userData.lastName}
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <Button className="btn btn-sm btn-info mr-4" onClick={handleConnect}>{isFriend ? 'Remove Friend' : 'Add Friend'}</Button>
                                        <Button className="btn btn-sm btn-default float-right">Message</Button>
                                    </div>
                                </div>
                                <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                                    <div>
                                        <span className="heading">{userData.friends.length}</span>
                                        <span className="description">Friends</span>
                                    </div>
                                    <div>
                                        <span className="heading">{userData.messageCount}</span>
                                        <span className="description">Messages Sent</span>
                                    </div>
                                </div>
                                <Card.Meta
                                    description={
                                        <div className="text-center">
                                            <div className="h5 font-weight-600" style={{ fontSize: "24px" }}>
                                                <i className="ni location_pin mr-2"></i>{userData.username}
                                            </div>
                                            <div className="h5 font-weight-300">
                                                <i className="ni location_pin mr-2"></i>{userData.city} {userData.state} {userData.country}
                                            </div>
                                            <div className="h5" style={{ fontSize: '20px' }}>
                                                <i className="ni mr-2"></i>{userData.title} {userData.company}
                                            </div>
                                            <div>
                                                <i className="ni mr-2"></i>{userData.university}
                                            </div>
                                            <div>
                                                <i className="ni mr-2"></i>{userData.major}
                                            </div>
                                            <hr className="my-4" />
                                            <p>{userData.aboutMe}</p>
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>

                        <Col xxl={16} xl={16} lg={24} md={24} sm={12} xs={24}>
                            <Card>
                                <h6 className="heading-small text-muted mb-4">Friends</h6>
                                <div className="pl-lg-4">
                                    {userData.friends.length > 0 ? (
                                        <ul>
                                            {userData.friends.map(friend => (
                                                friend && (
                                                <li key={friend._id}>
                                                    <Link to={`/user/${friend._id}`}>
                                                        {friend.username}
                                                    </Link>
                                                </li>
                                                )
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No friends yet.</p>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    );

}

export default UserProfile;
