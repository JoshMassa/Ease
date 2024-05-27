import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import HomePage from './pages/HomePage';
import Messages from './pages/Messages';

const App = () => {
  return (
    <SocketProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/messages" component={Messages} />
        </Switch>
      </Router>
    </SocketProvider>
  );
};

export default App;
