import React, { useState } from 'react';
import AppBar from '../componentes-general/appBar';
import BottomBar from '../componentes-general/bottomBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSortAmountUp } from '@fortawesome/free-solid-svg-icons'
import ValorTotal from '../componentes-general/valor-total';
import TablaBasica from '../componentes-general/tabla-basica';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';

export default function LoQueOfrezco() {
  const [estadosSwitch, setEstadosSwitch] = useState(false)

  const GreenSwitch = withStyles({
    switchBase: {
      color: '#14D2B8',
      '&$checked': {
        color: '#14D2B8',
      },
      '&$checked + $track': {
        backgroundColor: '#14D2B8',
      },
    },
    checked: {},
    track: {},
  })(Switch);

  const handleSwitchChange = () => {        
    setEstadosSwitch(!estadosSwitch)    
  };
  const titulos = ['Código', 'Descripción', 'Tipo', ''];  
  const funcionEditar = function(index) {console.log(`funciona ${index}`)};

  return(
    <div className="fondo-app lo-que-ofrezco con-bottom-bar flex flex-column">
      <AppBar />        
      <div className="contenido-ventana">
        <div className="titulo-tabla flex flex-row align-center">
          <h2>Lo que ofrezco</h2>
          <div className="titulo-tabla__botones flex flex-row">
            {/* <Button aria-haspopup="true" className="flex flex-row align-center">
              <FontAwesomeIcon icon={faSortAmountUp} style={{fontSize: '18px'}} />
              <p>Ordenar</p>
            </Button>  */}
            <Button aria-haspopup="true" className="flex flex-row align-center">
              <FontAwesomeIcon icon={faFilter} style={{fontSize: '18px'}} />
              <p>Filtrar</p>
            </Button>                        
          </div>
        </div>    
        {/* <div className="productos-servicios flex flex-row justify-center align-center">
          <p>Productos</p>
          <GreenSwitch             
            checked={estadosSwitch}
            onChange={() => handleSwitchChange()}
            color="info"
            name={'switch'}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
          <p>Servicios</p>
        </div> */}
        <TablaBasica titulos={titulos} dataTabla={filas} editar={true} editarFunction={funcionEditar} />
        <div className="boton-accion-centro flex justify-center align-center">
          <Button variant="contained">Agregar servicio +</Button>
        </div>
      </div>
      <BottomBar />
    </div>        
  )
}