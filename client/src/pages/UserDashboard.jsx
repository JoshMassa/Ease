import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Card, Row, Col } from 'antd';
import '../styles/UserDashboard.css';
import { UploadOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import { ADD_FRIEND, REMOVE_FRIEND, UPDATE_USER } from '../utils/mutations';
import { GET_USER } from '../utils/queries';
import AuthService from '../utils/auth';
import UserProfile from './UserProfile';

const { Content } = Layout;

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
                      src={profilePicture}
                      className='profile-picture'
                    />
                  </div>
                }
              >
                <div className="card-header text-center border-0 pt-8 pt-md-4 pb-0">
                  <div className="h5" style={{ fontSize: '30px' }}>
                    <i className="ni mr-2"></i>{firstName} {lastName}
                  </div>
                  <div className="d-flex justify-content-center">
                    <Button className="btn btn-sm btn-info mr-4" onClick={handleConnect}>{isFriend ? 'Remove Friend' : 'Add Friend'}</Button>
                    <Button className="btn btn-sm btn-default float-right">Message</Button>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <Button icon={<UploadOutlined />} onClick={handleImageUpload}>
                    Change Profile Picture
                  </Button>
                </div>
                <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                  <div>
                    <span className="heading">22</span>
                    <span className="description">Friends</span>
                  </div>
                  <div>
                    <span className="heading">10</span>
                    <span className="description">Photos</span>
                  </div>
                  <div>
                    <span className="heading">89</span>
                    <span className="description">Comments</span>
                  </div>
                </div>
                <Card.Meta
                  description={
                    <div className="text-center">
                      <div className="h5 font-weight-600" style={{ fontSize: "24px" }}>
                        <i className="ni location_pin mr-2"></i>{username}
                      </div>
                      <div className="h5 font-weight-300">
                        <i className="ni location_pin mr-2"></i>{city} {state} {country}
                      </div>
                      <div className="h5" style={{ fontSize: '20px' }}>
                        <i className="ni mr-2"></i>{title} {company}
                      </div>
                      <div>
                        <i className="ni mr-2"></i>{university}
                      </div>
                      <div>
                        <i className="ni mr-2"></i>{major}
                      </div>
                      <hr className="my-4" />
                      <p>{aboutMe}</p>
                    </div>
                  }
                />
              </Card>
            </Col>

            <Col xxl={16} xl={16} lg={24} md={24} sm={12} xs={24}>
                <Card>
                  <h6 className="heading-small text-muted mb-4">Friends</h6>
                  <div className="pl-lg-4">
                    {friends.length > 0 ? (
                      <ul>
                        {friends.map(friend => (
                          <li key={friend._id}>
                            <Link to={`/user/${friend._id}`}>
                              {friend.username}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No friends yet.</p>
                    )}
                  </div>
                </Card>
              </Col>

            <Col xl={8} md={24}>
              <Card
                title="My account"
                className="bg-secondary shadow"
                bordered={false}
                extra={<Button onClick={handleSave}>Save</Button>}
              >
                <form>
                  <h6 className="heading-small text-muted mb-4">User information</h6>
                  <div className="pl-lg-4">
                    <Row gutter={[16, 16]}>
                      <Col lg={12} xs={24}>
                        <div className="form-group focused">
                          <label className="form-control-label" htmlFor="input-username">Username</label>
                          <Input
                            id="input-username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
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
                        <div className="form-group focused">
                          <label className="form-control-label" htmlFor="input-first-name">First name</label>
                          <Input
                            id="input-first-name"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
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
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">Location</h6>
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
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">Employment</h6>
                  <div className="pl-lg-4">
                    <div className="form-group focused">
                      <label htmlFor="title">Title</label>
                      <textarea
                        id="title"
                        rows="1"
                        className="form-control form-control-alternative"
                        placeholder="What is your job title?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        resize="none"
                      />
                    </div>
                    <div className="form-group focused">
                      <label htmlFor="company">Company</label>
                      <textarea
                        id="company"
                        rows="1"
                        className="form-control form-control-alternative"
                        placeholder="What company do you work for?"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        resize="none"
                      />
                    </div>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">Education</h6>
                  <div className="pl-lg-4">
                    <div className="form-group focused">
                      <label htmlFor="university">University</label>
                      <textarea
                        id="university"
                        rows="1"
                        className="form-control form-control-alternative"
                        placeholder="What University did you attend?"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        resize="none"
                      />
                    </div>
                    <div className="form-group focused">
                      <label htmlFor="major">Major</label>
                      <textarea
                        id="major"
                        rows="1"
                        className="form-control form-control-alternative"
                        placeholder="What Major did you study?"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        resize="none"
                      />
                    </div>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">About me</h6>
                  <div className="pl-lg-4">
                    <div className="form-group focused">
                      <label htmlFor="about-me">About Me</label>
                      <textarea
                        id="about-me"
                        rows="4"
                        className="form-control form-control-alternative"
                        placeholder="A few words about you ..."
                        value={aboutMe}
                        onChange={(e) => setAboutMe(e.target.value)}
                        resize="none"
                      />
                    </div>
                  </div>
                </form>
              </Card>
            </Col>
          </Row>
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
      </Content>
    </Layout>
  );
}

export default UserDashboard;