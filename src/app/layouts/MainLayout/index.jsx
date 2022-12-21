import { React } from 'react';
import Header from './Header/index.js';

export default function DefaultLayout({ children }) {
    window.scrollTo(0, 0);

    return (
        <div className="MainLayout">
            <Header />
            <div className="main">{children}</div>
            <div className="footer">@2022 KeyQuiz All Rights Reserved</div>
        </div>
    );
}
