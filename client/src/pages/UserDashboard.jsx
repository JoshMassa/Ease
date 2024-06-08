import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Card, Row, Col, Typography, Divider, List } from 'antd';
import '../styles/UserDashboard.css';
import { UploadOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, Link, Form } from 'react-router-dom';
import { ADD_FRIEND, REMOVE_FRIEND, UPDATE_USER } from '../utils/mutations';
import { GET_USER } from '../utils/queries';
import AuthService from '../utils/auth';
import UserProfile from './UserProfile';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

function UserDashboard() {
  const decoded = AuthService.getProfile();
  const userId = decoded._id;
  const usernames = decoded.username;
  const navigate = useNavigate();

  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (decoded && !hasRedirected) {
      navigate(`/user/${usernames}`);
      setHasRedirected(true);
    }
  }, [navigate, decoded, hasRedirected, usernames]);

  const currentUser = AuthService.getProfile();
  console.log('userId:', userId);
  console.log('currentUser:', currentUser);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isFriend, setIsFriend] = useState(false);
  const [friends, setFriends] = useState([]);
  const { data, loading, error } = useQuery(GET_USER, { variables: { id: userId } });
  const [addFriend] = useMutation(ADD_FRIEND);
  const [removeFriend] = useMutation(REMOVE_FRIEND);
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [updateUser] = useMutation(UPDATE_USER);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/latest/global/all.js';
    script.async = true;
    script.onload = () => {
      console.log('Cloudinary script loaded');
    };
    script.onerror = () => {
      console.error('Cloudinary script failed to load');
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (data) {
      setUsername(data.user.username || '');
      setEmail(data.user.email || '');
      setFirstName(data.user.firstName || '');
      setLastName(data.user.lastName || '');
      setCity(data.user.city || '');
      setState(data.user.state || '');
      setCountry(data.user.country || '');
      setAboutMe(data.user.aboutMe || '');
      setProfilePicture(data.user.profilePicture || '');
      setFriends(data.user.friends || []);
      setUniversity(data.user.university || '');
      setMajor(data.user.major || '');
      setTitle(data.user.title || '');
      setCompany(data.user.company || '');

      const currentUserFriends = (data.user.friends || []).map(friend => friend._id);
      setIsFriend(currentUserFriends.includes(currentUser._id));
    }
  }, [data, currentUser._id]);
  
  useEffect(() => {
    if (profilePicture) {
      handleSaveProfilePicture(profilePicture);
    }
  }, [profilePicture]);

  const handleImageUpload = () => {
    if (window.cloudinary && window.cloudinary.createUploadWidget) {
      const myWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
          sources: ['local', 'url', 'camera', 'dropbox'],
          multiple: false,
          defaultSource: 'local',
          resourceType: 'image',
          cropping: true,
          croppingAspectRatio: 1,
          croppingShowDimensions: true,
          showSkipCropButton: false,
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log('Uploaded image info:', result.info);
            setProfilePicture(result.info.secure_url);
          } else if (error) {
            console.error('Error during upload:', error);
          }
        }
      );
      
      myWidget.open();
    } else {
      console.error('Cloudinary widget not loaded');
    }
  };

  const handleSaveProfilePicture = async (profilePictureUrl) => {
    try {
      const { data } = await updateUser({
        variables: {
          id: userId,
          input: { profilePicture: profilePictureUrl },
        },
      });
      if (data && data.updateUser) {
        setProfilePicture(data.updateUser.profilePicture);
      }
    } catch (error) {
      console.error('Error saving profile picture:', error);
    }
  };
  
  const handleSave = async () => {
    const updatedUserData = {
      username,
      email,
      firstName,
      lastName,
      city,
      state,
      country,
      aboutMe,
      profilePicture,
      university,
      major,
      title,
      company,
    };
    
    console.log('User information saved:', updatedUserData);

    try {
      const { data } = await updateUser({
        variables: {
          id: userId,
          input: updatedUserData,
        },
      });

      if (data && data.updateUser) {
        setUsername(data.updateUser.username || '');
        setEmail(data.updateUser.email || '');
        setFirstName(data.updateUser.firstName || '');
        setLastName(data.updateUser.lastName || '');
        setCity(data.updateUser.city || '');
        setState(data.updateUser.state || '');
        setCountry(data.updateUser.country || '');
        setAboutMe(data.updateUser.aboutMe || '');
        setProfilePicture(data.updateUser.profilePicture || '');
        setFriends(data.updateUser.friends || []);
        setUniversity(data.updateUser.university || '');
        setMajor(data.updateUser.major || '');
        setTitle(data.updateUser.title || '');
        setCompany(data.updateUser.company || '');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleConnect = async () => {
    try {
      if (isFriend) {
        await removeFriend({ variables: { userId: currentUser._id, friendId: userId } });
        setIsFriend(false);
      } else {
        await addFriend({ variables: { userId: currentUser._id, friendId: userId } });
        setIsFriend(true);
      }
    } catch (error) {
      console.error('Error updating friendship status:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
                      src={profilePicture}
                      className='profile-picture'
                    />
                  </div>
                }
              >
                <Col style={{textAlign: 'center'}}>
                    <Text className="centered" style={{ fontSize: '30px', padding: '24px' }}>{firstName} {lastName}</Text>
                  </Col>
                
                <Col className="text-center mt-4">
                  <Button icon={<UploadOutlined />} onClick={handleImageUpload}>
                    Change Profile Picture
                  </Button>
                </Col>
                <Col className="card-profile-stats d-flex justify-content-center mt-md-5">
                  <Col>
                    <span className="heading">{data.user.friends.length}</span>
                    <span className="description">Friends</span>
                  </Col>
                  <Col>
                    <span className="heading">{data.user.messageCount}</span>
                    <span className="description">Messages Sent</span>
                  </Col>
                </Col>
                <Card.Meta
                  description={
                    <Col className="" style={{textAlign: 'center'}}>
                      <Col className="" style={{ }}>
                        <Divider style={{ fontSize: "24px", fontWeight: '600'}}> @{username}</Divider>
                      </Col>
                      <Col className="font-weight-300">
                        <Text className=""style={{fontWeight: '600', textAlign: 'center'}}>📍 {city} {state} {country}</Text>
                      </Col>
                      <Col className="" style={{ fontSize: '20px', textAlign: 'center' }}>
                        <Text className="">{title} at {company}</Text>
                      </Col>
                      <Col>
                        <Text className=""></Text>{university}
                      </Col>
                      <Col>
                        <Text className=""></Text>{major}
                      </Col>
                      <Divider>About Me</Divider>
                      <Text>{aboutMe}</Text>
                    </Col>
                  }
                />
              </Card>
            </Col>

            <Col xxl={16} xl={16} lg={24} md={24} sm={12} xs={24}>
                <Card>
                  <Text className="heading-small text-muted mb-4 h6">Friends</Text>
                  <Col className="pl-lg-4">
                    {friends.length > 0 ? (
                      <List>
                        {friends.map(friend => (
                          <List.Item key={friend._id}>
                            <Link style={{color:"#3c89e8"}} to={`/user/${friend._id}` } >
                            ⭐️ {friend.username}
                            </Link>
                          </List.Item>
                        ))}
                      </List>
                    ) : (
                      <Text>No friends yet.</Text>
                    )}
                  </Col>
                </Card>
              </Col>

            <Col xl={8} md={24}>
              <Card
                title="My account"
                className=""
                bordered={false}
                extra={<Button onClick={handleSave}>Save</Button>}
              >
                <Form>
                  <Text className="heading-small text-muted mb-4 h6">User information</Text>
                  <Col className="">
                    <Row gutter={[16, 16]}>
                      <Col lg={12} xs={24}>
                        <Col className="form-group focused">
                          <label className="form-control-label" htmlFor="input-username">Username</label>
                          <Input
                            id="input-username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </Col>
                      </Col>
                      <Col lg={12} xs={24}>
                        <div className="form-group">
                          <label className="form-control-label" htmlFor="input-email">Email address</label>
                          <Input
                            type="email"
                            id="input-email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col lg={12} xs={24}>
                        <Col className="form-group focused">
                          <label className="form-control-label" htmlFor="input-first-name">First name</label>
                          <Input
                            id="input-first-name"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </Col>
                      </Col>
                      <Col lg={12} xs={24}>
                        <div className="form-group focused">
                          <label className="form-control-label" htmlFor="input-last-name">Last name</label>
                          <Input
                            id="input-last-name"
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <hr className="my-4" />
                  <Text className="heading-small text-muted mb-4 h6">Location</Text>
                  <div className="pl-lg-4">
                    <Row gutter={[16, 16]}>
                      <Col lg={8} xs={24}>
                        <div className="form-group focused">
                          <label className="form-control-label" htmlFor="input-city">City</label>
                          <Input
                            id="input-city"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                      </Col>
                      <Col lg={8} xs={24}>
                        <div className="form-group focused">
                          <label className="form-control-label" htmlFor="input-state">State</label>
                          <Input
                            id="input-state"
                            placeholder="State"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                          />
                        </div>
                      </Col>
                      <Col lg={8} xs={24}>
                        <div className="form-group focused">
                          <label className="form-control-label" htmlFor="input-country">Country</label>
                          <Input
                            id="input-country"
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <Divider className="my-4" />
                  <Text className="heading-small text-muted mb-4 h6">Employment</Text>
                  <Col className="pl-lg-4">
                    <div className="form-group focused">
                      <label className="form-control-label" htmlFor="title">Title</label>
                      <Input
                        id="title"
                        rows="1"
                        className=""
                        placeholder="What is your job title?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        resize="none"
                      />
                    </div>
                    <div className="form-group focused">
                      <label className="form-control-label" htmlFor="company">Company</label>
                      <Input
                        id="company"
                        rows="1"
                        className=""
                        placeholder="What company do you work for?"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        resize="none"
                      />
                    </div>
                  </Col>
                  <Divider className="my-4" />
                  <h6 className="heading-small text-muted mb-4">Education</h6>
                  <div className="pl-lg-4">
                    <div className="form-group focused">
                      <label htmlFor="university">University</label>
                      <TextArea
                        id="university"
                        rows="1"
                        className=""
                        placeholder="What University did you attend?"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        resize="none"
                      />
                    </div>
                    <div className="form-group focused">
                      <label htmlFor="major">Major</label>
                      <TextArea
                        id="major"
                        rows="1"
                        className=""
                        placeholder="What Major did you study?"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        resize="none"
                      />
                    </div>
                  </div>
                  <Divider className="my-4" />
                  <h6 className="heading-small text-muted mb-4">About me</h6>
                  <div className="pl-lg-4">
                    <div className="form-group focused">
                      <TextArea rows={4}
                        id="about-me"
                        className=""
                        placeholder="A few words about you ..."
                        value={aboutMe}
                        onChange={(e) => setAboutMe(e.target.value)}
                        resize="none"
                      />
                    </div>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>
          <div style={{ display: 'none' }}>
            <UserProfile 
              profilePicture={profilePicture}
              firstName={firstName}
              lastName={lastName}
              username={username}
              city={city}
              state={state}
              country={country}
              title={title}
              company={company}
              university={university}
              major={major}
              aboutMe={aboutMe}
              friends={friends}
              isFriend={isFriend}
              handleConnect={handleConnect}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default UserDashboard;