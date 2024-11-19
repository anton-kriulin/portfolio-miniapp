'use client'
import Link from 'next/link';
import { Config } from '@/lib/Config';
import { IPage } from '@/lib/Types';
import './styles.css';
import { useSession } from '@/hooks';

export const NavBar = ({currentPage}: {currentPage: IPage}) => {
    const {phrases} = useSession();

    return (
        <div className="navbar">
            <div className="navbar-row">
                {
                    Config.pages.map((page) => {
                        if(currentPage.code == page.code) {
                            return (
                                <div key={page.code} className="navbar-item-container">
                                    <div className="navbar-item navbar-item-active">
                                        <div className="navbar-item-icon">
                                            {page.icon}
                                        </div>
                                        <div className="navbar-item-text">
                                            {phrases[page.code]}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        return (
                            <div key={page.code} className="navbar-item-container">
                                <Link
                                    className="navbar-item-container-link"
                                    href={page.url ?? ""}
                                >
                                    <div className="navbar-item">
                                        <div className="navbar-item-icon">
                                            {page.icon}
                                        </div>
                                        <div className="navbar-item-text">
                                            {phrases[page.code]}
                                        </div>
                                    </div>
                                </Link>
                            </div>    
                        )
                    })
                }
            </div>
        </div>
    )
}