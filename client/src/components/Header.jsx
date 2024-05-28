import React from 'react';
import Navigation from './Navigation';
import '../styles/Header.css';

function Header() {
    console.log('Header component rendered');
    return (
        <header className='header'>
            <Navigation />
        </header>
    );
}

export default Header;