import React from 'react';
import { render, screen } from '@testing-library/react'
import SessionHistory from './SessionHistory';
import 'reactfire'
const mockedUserResult = jest.fn()
const mockedFirestoreResult = {
    collection: (type) => {
        if (type == 'tasks') {
            return {
                doc: () => ({ id: 1 }),
                where: () => null,
            }
        } else {
            return {
                doc: () => 1,
                where: () => ({
                    orderBy: () => ({
                        orderBy: jest.fn()
                    })
                })
            }
        }
    }
}
const mockedFirestoreCollection = jest.fn();
jest.mock('reactfire', () => ({
    useUser: () => ({
        // we have to define any fields that the component uses
        data: mockedUserResult()
    }),
    useFirestore: () => mockedFirestoreResult,
    useFirestoreDocData: () => mockedFirestoreDocData(),
    useFirestoreCollectionData: () => ({ data: mockedFirestoreCollection() }),
    useAuth: () => 0
}))

describe("Session History page", () => {
    it('renders without crashing', () => {
        mockedFirestoreCollection.mockReturnValueOnce([{ task: "tasks/1" }]).mockReturnValueOnce([{ id: 1 }])
        render(<SessionHistory />);
        // check that it doesn't redirect
    });
});