import React,{useEffect} from 'react';
import { useNavigate,useRoutes } from 'react-router-dom';
import { useAuth } from './src/authContext';
import Login from './src/components/auth/login';
import Signup from './src/components/auth/signup';
import Dashboard from './src/components/dashboard/dashboard';
const projectRoutes=()=>{
      const {currentUser,setCurrentUser}=useAuth();
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
            element:<Login/>,
        },
        {
            path:'/signup',
            element:<Signup/>,
        },
        {
            path:'/',
            element:<Dashboard/>,
        }
      ])
      return element;
}
export default projectRoutes;