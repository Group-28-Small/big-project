
import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import RegisterPage from './Register';
import { getOrCreateUserDocument } from 'big-project-common';
import 'reactfire'
import 'react-router'

// we have to create dummy implementations of API calls
const mockedUserResult = jest.fn()
const mockedHistoryPush = jest.fn()
const mockedCreateUser = jest.fn()
const mockedEmailVerify = jest.fn()
jest.mock('reactfire', () => ({
    useUser: () => ({
        // we have to define any fields that the component uses
        data: mockedUserResult()
    }),
    useFirestore: () => null,
    useAuth: () => ({
        createUserWithEmailAndPassword: mockedCreateUser,
    })
}))
jest.mock('react-router', () => ({
    useHistory: () => ({
        push: mockedHistoryPush
    }),
}))
jest.mock('big-project-common', () => ({
    getOrCreateUserDocument: jest.fn(),
}))

describe("Register Page", () => {
    it('renders without crashing', () => {
        // we set the user to null so it doesn't try to redirect to home
        mockedUserResult.mockImplementation(() => null);
        const div = document.createElement('div');
        render(<RegisterPage />, div);
        // check that it doesn't redirect
        expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
    it('the register function calls firebase w/ the entered data', () => {
        // we set the user to null so it doesn't try to redirect to home
        mockedUserResult.mockImplementation(() => null);
        const div = document.createElement('div');
        mockedCreateUser.mockImplementation((email, password) => Promise.resolve({ user: { sendEmailVerification: mockedEmailVerify } }))
        mockedEmailVerify.mockImplementation(() => Promise.resolve().then(() => { expect(mockedEmailVerify).toBeCalled(); return Promise.resolve() }))
        render(<RegisterPage />, div);
        const main = screen.getByRole('main');
        // fill email
        const emailBox = screen.getByRole('textbox', {
            name: /email address/i
        });
        fireEvent.change(emailBox, { target: { value: 'test@email.com' } })

        // fill pass
        const passBox = screen.getAllByLabelText(/password/i)
        passBox.forEach((box) => {
            fireEvent.change(box, { target: { value: '123456' } })
        })

        const registerButton = within(main).getByRole('button', {
            name: /register/i
        });
        fireEvent.click(registerButton);
        expect(mockedCreateUser).toBeCalledWith("test@email.com", "123456")
        expect(mockedCreateUser).toBeCalledTimes(1)
    });

    it('doesn\'t crash if registration fails', () => {
        // we set the user to null so it doesn't try to redirect to home
        mockedUserResult.mockImplementation(() => null);
        const div = document.createElement('div');
        mockedCreateUser.mockImplementation((email, password) => Promise.reject("could not register"))
        render(<RegisterPage />, div);
        const main = screen.getByRole('main');
        // fill email
        const emailBox = screen.getByRole('textbox', {
            name: /email address/i
        });
        fireEvent.change(emailBox, { target: { value: 'test@email.com' } })

        // fill pass
        const passBox = screen.getAllByLabelText(/password/i)
        passBox.forEach((box) => {
            fireEvent.change(box, { target: { value: '123456' } })
        })

        const registerButton = within(main).getByRole('button', {
            name: /register/i
        });
        fireEvent.click(registerButton);
        // don't crash
    });
    it('Doesn\'t register if passwords are different', () => {
        // we set the user to null so it doesn't try to redirect to home
        mockedUserResult.mockImplementation(() => null);
        const div = document.createElement('div');
        render(<RegisterPage />, div);
        const main = screen.getByRole('main');
        // fill email
        const emailBox = screen.getByRole('textbox', {
            name: /email address/i
        });
        fireEvent.change(emailBox, { target: { value: 'test@email.com' } })

        // fill pass
        const passBox = screen.getAllByLabelText(/password/i)
        fireEvent.change(passBox[0], { target: { value: '123456' } })
        fireEvent.change(passBox[1], { target: { value: '132456' } })

        const registerButton = within(main).getByRole('button', {
            name: /register/i
        });
        fireEvent.click(registerButton);
        expect(mockedCreateUser).not.toBeCalled()
    });
});