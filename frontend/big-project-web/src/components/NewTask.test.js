import React from 'react';
import { render, screen } from '@testing-library/react'
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
    });
    it('renders a task', () => {
        mockedFirestoreDocData.mockImplementation(() => mockedFirestoreDocDataResult)
        mockedUserResult.mockImplementation(() => 1)
        render(<EditTaskPage />);
    });
    it('renders all the fields', () => {
        mockedFirestoreDocData.mockImplementation(() => mockedFirestoreDocDataResult)
        mockedUserResult.mockImplementation(() => 1)
        const { container } = render(<EditTaskPage />);
        const taskNameField = container.querySelector("#taskName")
        expect(taskNameField).not.toBeNull()
        const durationField = container.querySelector('#taskEstimated')
        expect(durationField).not.toBeNull()
        const notesField = container.querySelector('#notes')
        expect(notesField).not.toBeNull()
    });
});