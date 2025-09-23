'use client';

import './LoadingPage.css';

export default function LoadingPage({ title }) {
    return (
        <div className="LoadingPage">
            <h1 className="loading-logo font-LilyScriptOne" style={title ? {display: 'flex'} : {display: 'none'}}>AboutMe</h1>
            <span className='loader'></span>
        </div>
    );
}