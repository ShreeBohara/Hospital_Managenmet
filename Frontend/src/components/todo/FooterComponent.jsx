import { useContext } from "react"
import { AuthContext } from "./security/AuthContext";

export default function FooterComponent(){

    const authContext = useContext(AuthContext);

    console.log(authContext.number)

    return(
        <footer className="FooterComponent">
            <div className='container'>
                This is Footer
            </div>
             
            
        </footer>
    )
}
