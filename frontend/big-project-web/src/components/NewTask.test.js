

import React from 'react';
import { render } from '@testing-library/react'
import { NewTaskPage, EditTaskPage } from './NewTask'
import 'reactfire'
import 'react-router'
import 'react-router-dom'

// we have to create dummy implementations of API calls
const mockedUserResult = jest.fn()
const mockedFirestoreDocData = jest.fn()

const mockedFirestoreResult = {
    collection: (type) => {
        if (type == 'tasks') {
            return {
                doc: () => ({ id: 1 })
            }
        } else {
            return {
                doc: () => 1
            }
        }
    }
}
const mockedFirestoreDocDataEmptyResult = {
    data: () => null
}
const mockedFirestoreDocDataResult = {
    data: () => 1
}

jest.mock('reactfire', () => ({
    useUser: () => ({
        // we have to define any fields that the component uses
        data: mockedUserResult()
    }),
    useFirestore: () => mockedFirestoreResult,
    useFirestoreDocData: () => mockedFirestoreDocData(),
    useAuth: () => 0
}))
jest.mock('react-router', () => ({
    useHistory: () => ({
        push: mockedHistoryPush
    })
}))
jest.mock('react-router-dom', () => ({
    Link: 'div'
}))


describe("New/Edit Task Page", () => {
    it('renders without crashing', () => {
        mockedFirestoreDocData.mockImplementation(() => mockedFirestoreDocDataEmptyResult)
        mockedUserResult.mockImplementation(() => 1)
        render(<NewTaskPage />);
        // check that it doesn't redirect
    });
    it('renders a task', () => {
        mockedFirestoreDocData.mockImplementation(() => mockedFirestoreDocDataResult)
        mockedUserResult.mockImplementation(() => 1)
        render(<EditTaskPage />);
        // check that it doesn't redirect
    });
});