import React, { useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Detalle from './detalle'
import Bitacora from './bitacora'
import Fimax from './fimax'
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faDollarSign, faFileInvoice} from '@fortawesome/free-solid-svg-icons'

export default function ModalBasico({index, cerrarModal, modificarIndex, cantMenu, numFactura, detalleFactura}) {  
  
    const cambiarIndex = (index) => {
      modificarIndex(index)
    }
  
    return(
      <div className="modal-basico flex flex-column">
        <Button className="modal-basico__cerrar" onClick={() => cerrarModal()}>
          <CloseIcon />
        </Button>
        <div className="modal__contenido">
          <div className="modal__contenido__elementos">
            {index == 0 ? <Detalle dataFactura={detalleFactura} /> : (index == 1 ? <Bitacora numeroFactura={numFactura} /> : < Fimax/>)}
          </div>
          {/* <div className="menu-modal flex flex-row align-center justify-center">
            <Button onClick={() => cambiarIndex(0)} className={(index == 0 ? 'activo ' : '') + "menu-modal__elem-detalle menu-modal__elem flex"}>
              <FontAwesomeIcon icon={faInfoCircle} style={{fontSize: '18px'}} />
              <p>Detalle</p>
            </Button>
            <Button onClick={() => cambiarIndex(1)} className={(index == 1 ? 'activo ' : '') + "menu-modal__elem-bitacora menu-modal__elem flex"}>
              <FontAwesomeIcon icon={faFileInvoice} style={{fontSize: '18px'}} />
              <p>Bitácora</p>
            </Button>
            {cantMenu == 3 && <Button onClick={() => cambiarIndex(2)} className={(index == 2 ? 'activo ' : '') + "menu-modal__elem-fimax menu-modal__elem flex"}>
              <FontAwesomeIcon icon={faDollarSign} style={{fontSize: '18px'}} />
              <p>Fimax</p>
            </Button>}
          </div> */}
        </div>      
      </div>       
    )
  }