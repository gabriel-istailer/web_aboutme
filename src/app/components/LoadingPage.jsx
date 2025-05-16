'use client';

import './LoadingPage.css';

export default function LoadingPage() {
    return (
        <div className="LoadingPage">
            <h1 className="loading-logo flex-h-center font-LilyScriptOne smooth-animation">AboutMe</h1>
            <h1 className="loading-message flex-center text-center font-Sanchez smooth-animation">Loading...</h1>
        </div>
    );
}