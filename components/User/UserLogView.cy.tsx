import React from 'react';
import { UserLogModel } from '@util/models';
import UserLogView from './UserLogView';

describe('<UserLogView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<UserLogView
      fetchUserLogs={async () => [
        {
          id: 0,
          type: 'test',
          message: 'test',
          createdAt: new Date(),
          user_id: 0,
        }
      ] as unknown as UserLogModel[]}
    />);
  });
});
