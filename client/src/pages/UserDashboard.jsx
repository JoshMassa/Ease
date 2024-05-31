import React, { useState } from 'react';
import { Layout, Input, Button, Card, Row, Col } from 'antd';
import '../styles/UserDashboard.css';

const { Header, Content } = Layout;

function UserDashboard() {
    const [username, setUsername] = useState("lucky.jesse");
    const [email, setEmail] = useState("jesse@example.com");
    const [firstName, setFirstName] = useState("Lucky");
    const [lastName, setLastName] = useState("Jesse");
    const [address, setAddress] = useState("Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09");
    const [city, setCity] = useState("New York");
    const [country, setCountry] = useState("United States");
    const [postalCode, setPostalCode] = useState("");
    const [aboutMe, setAboutMe] = useState("A beautiful Dashboard for Bootstrap 4. It is Free and Open Source.");

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
                                    <img
                                        alt="example"
                                        src="https://demos.creative-tim.com/argon-dashboard/assets-old/img/theme/team-4.jpg"
                                        className="rounded-circle"
                                        style={{ width: '150px', height: '150px', margin: '0 auto', display: 'block', marginTop: '-75px', border: '3px solid #fff' }}
                                    />
                                }
                            >
                                <div className="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                                    <div className="d-flex justify-content-center">
                                        <Button className="btn btn-sm btn-info mr-4">Connect</Button>
                                        <Button className="btn btn-sm btn-default float-right">Message</Button>
                                    </div>
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
                                    title="Jessica Jones"
                                    description={
                                        <div className="text-center">
                                            <div className="h5 font-weight-300">
                                                <i className="ni location_pin mr-2"></i>Bucharest, Romania
                                            </div>
                                            <div className="h5 mt-4">
                                                <i className="ni business_briefcase-24 mr-2"></i>Solution Manager - Creative Tim Officer
                                            </div>
                                            <div>
                                                <i className="ni education_hat mr-2"></i>University of Computer Science
                                            </div>
                                            <hr className="my-4" />
                                            <p>Ryan — the name taken by Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs and records all of his own music.</p>
                                            <a href="#">Show more</a>
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                        <Col xl={16} md={24}>
                            <Card
                                title="My account"
                                className="bg-secondary shadow"
                                bordered={false}
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
                                                        placeholder="jesse@example.com"
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
                                    <h6 className="heading-small text-muted mb-4">Contact information</h6>
                                    <div className="pl-lg-4">
                                        <Row gutter={[16, 16]}>
                                            <Col span={24}>
                                                <div className="form-group focused">
                                                    <label className="form-control-label" htmlFor="input-address">Address</label>
                                                    <Input
                                                        id="input-address"
                                                        placeholder="Home Address"
                                                        value={address}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
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
                                                    <label className="form-control-label" htmlFor="input-country">Country</label>
                                                    <Input
                                                        id="input-country"
                                                        placeholder="Country"
                                                        value={country}
                                                        onChange={(e) => setCountry(e.target.value)}
                                                    />
                                                </div>
                                            </Col>
                                            <Col lg={8} xs={24}>
                                                <div className="form-group">
                                                    <label className="form-control-label" htmlFor="input-postal-code">Postal code</label>
                                                    <Input
                                                        type="number"
                                                        id="input-postal-code"
                                                        placeholder="Postal code"
                                                        value={postalCode}
                                                        onChange={(e) => setPostalCode(e.target.value)}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
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
                                                defaultValue={aboutMe}
                                                onChange={(e) => setAboutMe(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    );
}

export default UserDashboard;
