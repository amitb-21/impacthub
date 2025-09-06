import react,{useEffect} from react;
import { useNavigate,useRoutes } from 'react-router-dom';
import { useAuth } from './src/authContext';
import login from './src/components/auth/login';
import signup from './src/components/auth/signup';
const projectRoutes=()=>{
      const [currentUser,setCurrentUser]=useAuth();
      const navigate=useNavigate();
      useEffect(()=>{
          let useridfromstorage=localStorage.getItem('userId');
          if(useridfromstorage && !currentUser){
            setCurrentUser(useridfromstorage);
          }
          if(!currentUser && !['/auth','/signup'].includes(window.location.pathname)){
            navigate('/auth');
          }
          if(currentUser && window.location.pathname==='/auth'){
            navigate('/');
          }
      },[currentUser,setCurrentUser,navigate]);
      let element=useRoutes([
        {
            path:'/auth',
            element:<login/>,
        },
        {
            path:'/signup',
            element:<signup/>,
        }
      ])
      return element;
}
export default projectRoutes;