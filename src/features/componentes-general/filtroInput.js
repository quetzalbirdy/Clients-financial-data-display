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

export default function FiltroInput({funcion, data}) {
  const [valorBuscar, setValorBuscar] = useState('');

  const handleChange = e => { 
    setValorBuscar(e.target.value) 
  }
  
  const filtrarData = () => {
    if (valorBuscar) {
      let dataFiltrada = [] 
      for (let index = 0; data.length > index; index++) {
        for (let i = 0; Object.values(data[index]).length > i; i++) {
          if (dataFiltrada.some(fila => fila === data[index])) {
            continue
          } else {
            if (String(Object.values(data[index])[i]).trim().toLowerCase().includes(valorBuscar.toString().trim().toLowerCase())) {
              dataFiltrada.push(data[index]) 
              continue                             
            }
          }            
        } 
      }
      console.log(dataFiltrada)
      funcion(dataFiltrada)
    } else {
      funcion(data)
    }    
  }

  return(
    /* false &&  */<div>
        <div className="filtro-input-boton">
            <input type="text" placeholder="Buscar" value={valorBuscar} onChange={handleChange} />
            <Button onClick={() =>filtrarData()}>
              filtrar
            </Button>
        </div>
    </div>
  )
}

