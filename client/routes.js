import React from 'react';
import { Route, IndexRoute } from 'react-router';
import _ from 'lodash';

import LayoutContainer from './components/LayoutContainer';
import HomePage from './components/home/HomePage';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';
import AdminHomePage from './components/home/AdminHomePage';
import UsersPage from './components/users/UsersPage';
import UsersListPage from './components/users/UsersListPage';
import ManageUserPage from './components/users/ManageUserPage';
import TurnsPage from './components/turns/TurnsPage';
import GitHubIssuesPage from './components/github/GitHubIssuesPage';
import TurnsListPage from './components/turns/TurnsListPage';
import ManageTurnPage from './components/turns/ManageTurnPage';
import NotFoundRoutePage from './components/NotFoundRoutePage';
import SelectTurnPage from './components/userturn/SelectTurnPage';
import UserTurnContainer from './components/userturn/UserTurnContainer';
import SignupDataPage from './components/userturn/signup/SignupDataPage';
import SignupTestPage from './components/userturn/signup/SignupTestPage';
import SignupStatementPage from './components/userturn/signup/SignupStatementPage';
import UserTurnHomePage from './components/userturn/UserTurnHomePage';
import TurnMembersPage from './components/turnmembers/TurnMembersPage';
import TurnMemberView from './components/turnmembers/TurnMemberView';
import SignupDataView from './components/turnmembers/SignupDataView';
import SignupTestView from './components/turnmembers/SignupTestView';
import SignupStatementView from './components/turnmembers/SignupStatementView';

import * as actions from './actions/';

import toastr from 'toastr';

const createRoutes = (store)=> {

  const requireAuthentication = (nextState, replace)=> {
    const state = store.getState();
    const isAuthenticated = _.has(state, 'auth.user.id');
    if (!isAuthenticated) {
      replace('/login');
    }
  };

  const requireRole = (nextState, replace, role) => {
    const state = store.getState();
    const isAuthorized = _.get(state, 'auth.user.role') === role;
    if (!isAuthorized) {
      toastr.error('Nincs jogosultsága az oldal eléréséhez');
      replace('/');
    }

  };

  const requireGuest = (nextState, replace) => {
    const state = store.getState();
    const role = _.get(state, 'auth.user.role', null);
    if (role === 'admin') {
      replace('/admin');
    }
    if (role === 'user') {
      var slug = _.get(state, 'userturns.currentTurn.slug', null);
      if (slug) {
        replace(`/user/${slug}/dashboard`);
      } else {
        replace('/user/select-turn');
      }
    }

  };

  const initUserTurns = (nextState, replace)=> {
    const state = store.getState();
    store.dispatch(actions.getCurrentTurn(state.auth.user.id)).then((x)=> {
      let turn_id = store.getState().userturns.currentTurn.id;
      store.dispatch(actions.getUserTurn(state.auth.user.id, turn_id));
    });
  };

  const getSignupTest = (nextState, replace)=> {
    const state = store.getState();
    store.dispatch(actions.loadUserSignupTest(state.auth.user.id, state.userturns.currentTurn.competency_test.id));
  };


  return (
    <Route path="/" component={LayoutContainer}>
      <IndexRoute component={HomePage} onEnter={requireGuest}/>
      <Route path="login" component={LoginPage}/>
      <Route path="registration" component={RegistrationPage}/>
      <Route path="user" onEnter={(n,r)=>requireRole(n,r,'user')}>
        <Route path="select-turn" component={SelectTurnPage}/>
        <Route path=":slug" component={UserTurnContainer} onEnter={initUserTurns}>
          <Route path="dashboard" component={UserTurnHomePage}/>
          <Route path="signup-data" component={SignupDataPage}/>
          <Route path="signup-test" component={SignupTestPage} onEnter={getSignupTest}/>
          <Route path="signup-statement" component={SignupStatementPage}/>
        </Route>
      </Route>
      <Route path="admin" onEnter={(n,r)=>requireRole(n,r,'admin')}>
        <IndexRoute component={AdminHomePage}/>
        <Route path="users" component={UsersPage}>
          <IndexRoute component={UsersListPage}/>
          <Route path=":id" component={ManageUserPage}/>
        </Route>
        <Route path="turns" component={TurnsPage}>
          <IndexRoute component={TurnsListPage}/>
          <Route path="new" component={ManageTurnPage}/>
          <Route path=":id" component={ManageTurnPage}/>
        </Route>
        <Route path="turnmembers" component={TurnMembersPage}/>
        <Route path="turnmembers/:user_id" component={TurnMemberView}>
          <Route path="signup-data" component={SignupDataView}/>
          <Route path="signup-test" component={SignupTestView}/>
          <Route path="signup-statement" component={SignupStatementView}/>
        </Route>


        <Route path="github" component={GitHubIssuesPage}/>
      </Route>
      <Route path="*" component={NotFoundRoutePage}/>
    </Route>
  );
};
//<Route path=":id" component={TurnMemberLayout}>
//
//</Route>
export default createRoutes;

