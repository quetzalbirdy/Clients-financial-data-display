import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import TimelineIcon from '@material-ui/icons/Timeline';
import SettingsIcon from '@material-ui/icons/Settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import logo from '../../assets/logo-ebco.png';
import Button from '@material-ui/core/Button';
import context from '../../features/constants/Context'
import { faFileInvoice, faFileUpload, faShoppingCart, faHandshake } from '@fortawesome/free-solid-svg-icons'
import { 
  useHistory
} from "react-router-dom";

export default function AppBar() {

  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  let history = useHistory();

  const irHome = () => {
    history.push("/");
  }

  return(
    <div className="app-bar flex align-center">
      <Button className="burger" aria-haspopup="true" onClick={() => {toggleDrawer()}}>
        <MenuIcon style={{fontSize: '30px'}} />
      </Button>  
      
      <DrawerMenu drawer={drawerOpen} onCerrar={toggleDrawer}  />
      <div className="app-bar__texto-logo flex align-center">
        <a href="/c/portal/logout">
          <FontAwesomeIcon icon={faSignOutAlt} style={{fontSize: '25px', color: 'grey'}} />        
        </a>          
        <div className="drawer__menu__ajustes__usuario flex flex-column">          
          <p>{context.proveedorName}</p>
        </div> 
        <p>CRECIENDO JUNTO A NUESTROS SOCIOS DE NEGOCIOS</p>
        <Button aria-haspopup="true" className="flex flex-column justify-center align-center" onClick={() => irHome()}>
          <img src={logo} alt=""/>
        </Button>           
      </div>
    </div>
  )
}

const DrawerMenu = (props) => {  
  let history = useHistory();

  const navegar = (index) => {
    switch (index) {
      case 0:
        history.push({
          pathname: "/ordenes-compra",          
        }); 
        break;
      case 1:
        history.push("/recepciones");
        break;
      case 2:
        history.push({
          pathname: "/historia-de-facturas",          
        });  
        break;
      case 3:
        history.push("/pagos");
        break;
      case 4:
        history.push("/cuenta-corriente");
        break;
      case 5:
        history.push("/pendiente-pago");
        break;
      case 6:
        history.push("/sin-facturar");
        break;
      case 7:
        history.push("/entregas-en-proceso");
        break;
    }    
  }

  return(
    <Drawer
      open={props.drawer}
      onClose={props.onCerrar}
    >
      <div className="drawer__top-bar">
        <Button onClick={props.onCerrar}>
          <CloseIcon style={{fontSize: '35px', color: 'white'}} />
        </Button>
      </div>
      <div className="drawer__menu flex flex-column">
        <div className="drawer__menu__grupos">
          {/* Mis facturas */}
          <div className="drawer__menu__grupo flex flex-column">
            <div className="drawer__menu__grupo__elem-titulo flex flex-row align-center">
              <FontAwesomeIcon icon={faFileInvoice} style={{fontSize: '25px', color: 'white', marginRight: '10px'}} />  
              <p>NUESTRA HISTORIA</p>
            </div>
            <Button onClick={() => navegar(0)} className="drawer__menu__grupo__elem">
              <p>OC EMITIDAS</p>
            </Button>
            <Button onClick={() => navegar(1)} className="drawer__menu__grupo__elem">
              <p>ENTREGAS REALIZADAS</p>
            </Button>
            <Button onClick={() => navegar(2)} className="drawer__menu__grupo__elem">
              <p>FACTURAS EMITIDAS</p>
            </Button>
            <Button onClick={() => navegar(3)} className="drawer__menu__grupo__elem">
              <p>PAGOS RECIBIDOS</p>
            </Button>
            {/* <Button onClick={() => navegar(4)} className="drawer__menu__grupo__elem">
              <p>CUENTA CORRIENTE</p>
            </Button> */}
            <div className="linea-horizontal"></div>
          </div>
          {/* documentos de apoyo a la hes */}
          <div className="drawer__menu__grupo flex flex-column">
            <div className="drawer__menu__grupo__elem-titulo flex flex-row align-center">
              <FontAwesomeIcon icon={faFileUpload} style={{fontSize: '25px', color: 'white', marginRight: '10px'}} />  
              <p>PROCESOS COMERCIALES EN CURSO</p>
            </div>
            <Button onClick={() => navegar(5)} className="drawer__menu__grupo__elem">
              <p>FACTURAS POR PAGAR</p>
            </Button>
            <Button onClick={() => navegar(6)} className="drawer__menu__grupo__elem">
              <p>ENTREGAS SIN FACTURAR</p>
            </Button> 
            <Button onClick={() => navegar(7)} className="drawer__menu__grupo__elem">
              <p>ENTREGAS EN PROCESO</p>
            </Button>   
           {/*  <Button onClick={() => navegar(7)} className="drawer__menu__grupo__elem">
              <p>PENDIENTES DE ENTREGA</p>
            </Button>    */}       
            <div className="linea-horizontal"></div>
          </div>
          {/* Compras */}
          {/* <div className="drawer__menu__grupo flex flex-column">
            <div className="drawer__menu__grupo__elem-titulo flex flex-row align-center">
              <FontAwesomeIcon icon={faShoppingCart} style={{fontSize: '20px', color: 'white', marginRight: '7px'}} />  
              <p>Compras</p>
            </div>
            <Button className="drawer__menu__grupo__elem">
              <p>Ordenes de compra</p>
            </Button>
            <Button className="drawer__menu__grupo__elem">
              <p>recepciones</p>
            </Button>         
            <div className="linea-horizontal"></div>
          </div> */}
          {/* Mi relacion con ebco */}
          {/* <div className="drawer__menu__grupo flex flex-column">
            <div className="drawer__menu__grupo__elem-titulo flex flex-row align-center">
              <FontAwesomeIcon icon={faHandshake} style={{fontSize: '20px', color: 'white', marginRight: '6px'}} />  
              <p>Mi relacion con ebco</p>
            </div>
            <Button className="drawer__menu__grupo__elem">
              <p>Perfil</p>
            </Button>
            <Button className="drawer__menu__grupo__elem">
              <p>Evaluación</p>
            </Button>
            <Button className="drawer__menu__grupo__elem">
              <p>lo que ofrezco</p>
            </Button>                    
          </div> */}
        </div>
        <div className="drawer__menu__ajustes flex align-center">
          <Button>
            <SettingsIcon style={{fontSize: '25px', color: 'white'}} />
          </Button>
          <a href="/c/portal/logout">
            <FontAwesomeIcon icon={faSignOutAlt} style={{fontSize: '25px', color: 'white'}} />          
          </a>            
          <img src="https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_1280.png" alt=""/>
          <div className="drawer__menu__ajustes__usuario flex flex-column">            
            <p>{context.proveedorName}</p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}