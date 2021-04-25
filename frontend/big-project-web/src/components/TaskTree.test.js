import { render, screen } from '@testing-library/react'
import TaskTree from './TaskTree'
import 'reactfire'
import 'react-router'
import 'react-router-dom'
import { useFirebaseApp } from 'reactfire';
import 'firebase'

// we have to create dummy implementations of API calls
const mockedUserResult = jest.fn()
const mockedFirestoreDocData = jest.fn()
const mockedFirestoreCollectionData = jest.fn()
const mockedUseFirebaseApp = jest.fn()

const mockedFirestoreResult = {
    collection: (type) => {
        if (type == 'tasks') {
            return {
                doc: () => ({ id: 1 }),
                where: () => null,
            }
        } else {
            return {
                doc: () => 1
            }
        }
    }
}
const mockedFirestoreCollectionDataResult = {
    data: [{ id: '1' }, { id: '2' }]
}
const mockedFirestoreDocResult = {
    data: { last_task_set_time: 0 }
}

jest.mock('reactfire', () => ({
    useUser: () => ({
        // we have to define any fields that the component uses
        data: mockedUserResult()
    }),
    useFirestore: () => mockedFirestoreResult,
    useFirestoreCollectionData: () => mockedFirestoreCollectionData(),
    useFirestoreDocData: () => mockedFirestoreDocData(),
    useAuth: () => 0,
    useFirebaseApp: () => mockedUseFirebaseApp()
}))
jest.mock('react-router', () => ({
    useHistory: () => ({
        push: mockedHistoryPush
    })
}))
jest.mock('react-router-dom', () => ({
    Link: 'div'
}))
jest.mock('firebase', () => ({
    firebase: {
    }
}))


describe("Task Tree", () => {
    it('renders without crashing', () => {
        mockedFirestoreCollectionData.mockImplementation(() => mockedFirestoreCollectionDataResult)
        mockedFirestoreDocData.mockImplementation(() => mockedFirestoreDocResult)
        mockedUserResult.mockImplementation(() => 1)
        mockedUseFirebaseApp.mockImplementation(() =>
        ({
            auth: () => ({
                currentUser: {
                    getIdToken: () => ({
                        then: () => ({
                            catch: jest.fn()
                        })
                    })
                }
            })
        })
        )
        render(<TaskTree />);
        // check that it doesn't redirect
    });
});