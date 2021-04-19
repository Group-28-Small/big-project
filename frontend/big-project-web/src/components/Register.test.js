
import React from 'react';
import ReactDOM from 'react-dom';
import RegisterPage from './Register';
import 'reactfire'
import 'react-router'

// we have to create dummy implementations of API calls
const mockedUserResult = jest.fn()
const mockedHistoryPush = jest.fn()
jest.mock('reactfire', () => ({
    useUser: () => ({
        // we have to define any fields that the component uses
        data: mockedUserResult()
    }),
    useFirestore: () => null,
    useAuth: () => 0
}))
jest.mock('react-router', () => ({
    useHistory: () => ({
        push: mockedHistoryPush
    }),
}))

describe("Register Page", () => {
    it('renders without crashing', () => {
        // we set the user to null so it doesn't try to redirect to home
        mockedUserResult.mockImplementation(() => null);
        const div = document.createElement('div');
        ReactDOM.render(<RegisterPage />, div);
        // check that it doesn't redirect
        expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
});