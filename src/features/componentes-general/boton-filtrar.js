import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import AppBar from '../componentes-general/appBar';
import BottomBar from '../componentes-general/bottomBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSortAmountUp, faInfoCircle, faDollarSign, faFileInvoice} from '@fortawesome/free-solid-svg-icons'
import ValorTotal from '../componentes-general/valor-total';
import TablaBasica from '../componentes-general/tabla-basica';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import ModalBasico from '../componentes-general/modals/modal-basico'
import {serviciosFacturas} from '../../api/servicios'
import {CargandoCircular} from '../componentes-general/cargador-circular'

export default function BotonFiltrar({funcion}) {
  return(
  /* false &&  */<Button aria-haspopup="true" className="flex flex-row align-center" onClick={() => {funcion()}}>
        <FontAwesomeIcon icon={faFilter} style={{fontSize: '18px'}} />
        <p>Filtrar</p>
  </Button>
  )
}

