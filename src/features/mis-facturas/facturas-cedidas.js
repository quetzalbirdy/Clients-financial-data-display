import React, { useState } from 'react';
import AppBar from '../componentes-general/appBar';
import BottomBar from '../componentes-general/bottomBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSortAmountUp } from '@fortawesome/free-solid-svg-icons'
import ValorTotal from '../componentes-general/valor-total';
import TablaBasica from '../componentes-general/tabla-basica';
import Button from '@material-ui/core/Button';

export default function FacturasCedidas() {

  const filas = [
    [['001478541', '01/10/20'], '4ta Avenida Conquista', ['$325.548.248', 'Tanner Factoring']],
    [['001478541', '01/10/20'], '4ta Avenida Conquista', ['$325.548.248', 'Tanner Factoring']],
    [['001478541', '01/10/20'], '4ta Avenida Conquista', ['$325.548.248', 'Fimax']],
    [['001478541', '01/10/20'], '4ta Avenida Conquista', ['$325.548.248', 'Tanner Factoring']],
    [['001478541', '01/10/20'], '4ta Avenida Conquista', ['$325.548.248', 'Banco Chile']],
    [['001478541', '01/10/20'], '4ta Avenida Conquista', ['$325.548.248', 'Tanner Factoring']],
    [['001478541', '01/10/20'], '4ta Avenida Conquista', ['$325.548.248', 'Tanner Factoring']],
    [['001478541', '01/10/20'], '4ta Avenida Conquista', ['$325.548.248', 'Tanner Factoring']],
    [['001478541', '01/10/20'], '4ta Avenida Conquista', ['$325.548.248', 'Tanner Factoring']],
    [['001478541', '01/10/20'], '4ta Avenida Conquista', ['$325.548.248', 'Tanner Factoring']],
    [['001478541', '01/10/20'], '4ta Avenida Conquista', ['$325.548.248', 'Tanner Factoring']],
    [['001478541', '01/10/20'], '4ta Avenida Conquista', ['$325.548.248', 'Tanner Factoring']],
    [['001478541', '01/10/20'], '4ta Avenida Conquista', ['$325.548.248', 'Tanner Factoring']],
  ];
  const titulos = ['N°/Fecha', 'Obra', 'Monto/Cedida a', ''];
  const menuTitulos = ['Detalle','Bitácora','Fimax','Orden de Compra','Recepción']
  const menuFunciones = [
    function() {console.log('funciona1')},
    function() {console.log('funciona2')},
    function() {console.log('funciona3')},
    function() {console.log('funciona4')},
    function() {console.log('funciona5')}
  ];

  return(
    <div className="fondo-app facturas-cedidas con-bottom-bar flex flex-column">
      <AppBar />        
      <div className="contenido-ventana">
        <div className="titulo-tabla flex flex-row align-center">
          <h2>Facturas Cedidas</h2>
          <div className="titulo-tabla__botones flex flex-row">            
            <Button aria-haspopup="true" className="flex flex-row align-center">
              <FontAwesomeIcon icon={faFilter} style={{fontSize: '18px'}} />
              <p>Filtrar</p>
            </Button>                        
          </div>
        </div>            
        <TablaBasica titulos={titulos} dataTabla={filas} menuTitulos={menuTitulos} menuFunciones={menuFunciones} />
        {/* <div className="boton-accion-centro flex justify-center align-center">
          <Button variant="contained">Mi cuenta corriente</Button>
        </div> */}
      </div>
      <BottomBar />
    </div>        
  )
}