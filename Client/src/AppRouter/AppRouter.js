import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Header from "../components/Header";
import Events from '../components/Events';
import Onboard from "../components/Onboard";
import EditEvent from '../components/EditEvent';
import About from '../components/About';
import AddEditEvent from '../components/forms/AddEditEvent';
import NotFoundPage from '../components/NotFoundPage';

const AppRouter = () => (
  <Router>
    <div>
      <Header />
      <Switch>
        <Route path="/" component={Events} exact />
        <Route path="/addEdit/:id" component={AddEditEvent} />
        <Route path="/addEdit" component={AddEditEvent} />
        <Route path="/about" component={About} />
        <Route path="/how-it-works" component={Onboard} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;