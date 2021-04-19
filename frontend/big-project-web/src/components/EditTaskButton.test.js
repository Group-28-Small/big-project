import React from 'react';
import ReactDOM from 'react-dom';
import EditTaskButton from './EditTaskButton';

describe("Edit Task Button", () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<EditTaskButton />, div);
    });
});