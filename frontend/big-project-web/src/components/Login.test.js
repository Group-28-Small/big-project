
import React from 'react';
import ReactDOM from 'react-dom';
import LoginPage from './Login';
import 'reactfire'
import 'react-router'

// we have to create dummy implementations of API calls
const mockedUserResult = jest.fn()
const mockedHistoryPush = jest.fn()
jest.mock('reactfire', () => ({
    useUser: () => ({
        data: mockedUserResult()
    }),
    useAuth: () => 0
}))
jest.mock('react-router', () => ({
    useHistory: () => ({
        push: mockedHistoryPush
    }),
}))

describe("Login Page", () => {
    it('renders without crashing', () => {
        mockedUserResult.mockImplementation(() => null);
        const div = document.createElement('div');
        ReactDOM.render(<LoginPage />, div);
    });
    it('redirects to home if the user is logged in', () => {
        // make it look like the user is logged in
        mockedUserResult.mockImplementation(() => 1);
        const div = document.createElement('div');
        ReactDOM.render(<LoginPage />, div);
        expect(mockedHistoryPush).toBeCalled()

    });
});