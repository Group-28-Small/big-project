import React from 'react';
import { render, screen } from '@testing-library/react'
import VerifyEmailPage from './VerifyEmailPage';


describe("Verify Email Page", () => {
    it('renders without crashing', () => {
        render(<VerifyEmailPage />);
        // check that it doesn't redirect
    });
});