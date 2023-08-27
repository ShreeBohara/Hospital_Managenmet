import {Link} from 'react-router-dom'
import { useAuth } from './security/AuthContext'

export default function HeaderComponent(){
    const authContext = useAuth();
    const isAuthenticated = authContext.isAuthenticated; // to check if the user is authenticated or not as per this the nav bar will change


    function logout(){ // if the user clicks the logout button this function will be called anf the value of isAuthenticated becomes false
        authContext.logout() // login in context
    }
    

    return(
            
        <header className="border-bottom border-light border-5 mb-5 p-2"> {/* Bootstrap*/}
            <div className="container">
                <div className="row">
                    <nav className="navbar navbar-expand-lg">
                        <a className="navbar-brand ms-2 fs-2 fw-bold text-black" href="https://www.deeptek.ai/">Deeptek</a>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav">
                                <li className="nav-item fs-5">
                                    {isAuthenticated && <Link className="nav-link" to="/welcome/shree">Home</Link>} {/* if and only if the value of isAuthenticated the features will be available */}
                                    
                                </li>
                                <li className="nav-item fs-5">
                                    {isAuthenticated && <Link className="nav-link" to="/hospitalList">Hospitals</Link>}
                                    
                                </li>
                            </ul>
                        </div>
                        <ul className="navbar-nav">
                            <li className="nav-item fs-5">
                                {!isAuthenticated && <Link className="nav-link" to="/login">Login</Link>}
                                
                            </li>
                            <li className="nav-item fs-5">
                                {isAuthenticated && <Link className="nav-link" to="/logout" onClick={logout}>Logout</Link>}
                                
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}

