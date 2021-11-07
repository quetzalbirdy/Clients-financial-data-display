import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SettingsIcon from '@material-ui/icons/Settings';
import AppsIcon from '@material-ui/icons/Apps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faSearch } from '@fortawesome/free-solid-svg-icons'
import Button from '@material-ui/core/Button';
import {
  BrowserRouter as Router, 
  useHistory,  
} from "react-router-dom";

export default function BottomBar() {  
  
  /* contextTypes = {
    router: () => true, // replace with PropTypes.object if you use them
  } */

  let history = useHistory();

  const irHome = () => {
    history.push("/");
  }

  return(
    <div className="bottom-bar flex justify-center align-center">
      <Button onClick={history.goBack} aria-haspopup="true" className="flex flex-column justify-center align-center">
        <ChevronLeftIcon style={{fontSize: '35px'}} />  
        <p>atrás</p>
      </Button>       
      <Button aria-haspopup="true" className="flex flex-column justify-center align-center" onClick={() => irHome()}>
        <AppsIcon style={{fontSize: '25px'}} />  
        <p>home</p>
      </Button>
      <Button aria-haspopup="true" className="flex flex-column justify-center align-center">
        <FontAwesomeIcon icon={faSearch} style={{fontSize: '22px'}} />
        <p>buscar</p>
      </Button>          
    </div>
  )
}

