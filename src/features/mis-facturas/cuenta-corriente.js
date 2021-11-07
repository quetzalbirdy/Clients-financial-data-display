import React, { useState, useEffect } from 'react';
import AppBar from '../componentes-general/appBar';
import BottomBar from '../componentes-general/bottomBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSortAmountUp } from '@fortawesome/free-solid-svg-icons'
import ValorTotal from '../componentes-general/valor-total';
import TablaBasica from '../componentes-general/tabla-basica';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { CargandoCircular } from '../componentes-general/cargador-circular';
import {serviciosFacturas} from '../../api/servicios'

export default function CuentaCorriente() {
  const [mesSeleccionado, setMesSeleccionado] = useState(1)
  const [filasCuentaCorriente, setFilasCuentaCorriente] = useState('');
  const [numeroCuenta, setNumeroCuenta] = useState(3234);  
  const [haberTotal, setHaberTotal] = useState(0);
  const [debeTotal, setDebeTotal] = useState(0);

  var servicios = new serviciosFacturas();  

  useEffect(() => {
    getCuentaCorriente()     
  }, []);

  const getCuentaCorriente =  async () => {    
    await servicios.getCuentaCorrienteList(numeroCuenta, mesSeleccionado).then((res) => {  
      var cuentaCorriente = res.payload    
      var filasCuentaCorrienteLocal = [];   
      let haberTotalLocal = 0
      let debeTotalLocal = 0
      for (var i = 0; i < cuentaCorriente.length; i++) {
        var elCuenta = cuentaCorriente[i]
        var fila = [elCuenta.fechaAsString, ['Fact. Exenta', '2344'], elCuenta.haber.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."), elCuenta.debe.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."), elCuenta.documentos]
        filasCuentaCorrienteLocal.push(fila)
        haberTotalLocal += elCuenta.haber
        debeTotalLocal += elCuenta.debe
      }
      console.log(filasCuentaCorrienteLocal)
      setHaberTotal(haberTotalLocal)
      setDebeTotal(debeTotalLocal)
      setFilasCuentaCorriente(filasCuentaCorrienteLocal)            
    });
  }

  const titulos = ['Fecha', 'Documento', 'Haber', 'Debe', 'Doc. Asociados'];  

  const handleSelect = (event) => {    
    setMesSeleccionado(event.target.value)
    setFilasCuentaCorriente('')
    getCuentaCorriente()
  };

  return(
    <div className="fondo-app factura cuenta-corriente con-bottom-bar flex flex-column">
      <AppBar />        
      <div className="contenido-ventana">
        <div className="titulo-tabla flex flex-row align-center">
          <h2>Mi cuenta corriente</h2>          
        </div>   
        <div className="select-basico flex flex-column align-center justify-center">
          <p>selecciona un mes</p>
          <Select
            labelId="simple-select-label"
            id="simple-select"
            value={mesSeleccionado}
            onChange={handleSelect}
          >
            <MenuItem value={1}>Enero 2021</MenuItem>
            <MenuItem value={2}>Febrero 2021</MenuItem>
            <MenuItem value={3}>Marzo 2021</MenuItem>
          </Select>
        </div>         
        {filasCuentaCorriente ? <TablaBasica paginacion={true} titulos={titulos} dataTabla={filasCuentaCorriente} /> : <CargandoCircular />}
        <div className="valor-total flex flex-row align-center">
          <p>8/11/20</p>
          <div>
            <p>Haber</p>
            <p className="valor-total__valor">{`$${haberTotal ? haberTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : ''}`}</p>
          </div>
          <div>
            <p>Debe</p>
            <p className="valor-total__valor">{`$${debeTotal ? debeTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : ''}`}</p>
          </div>
        </div>   
      </div>
      <BottomBar />
    </div>        
  )
}