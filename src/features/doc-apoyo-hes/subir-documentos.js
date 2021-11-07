import React, { useState } from 'react';
import AppBar from '../componentes-general/appBar';
import BottomBar from '../componentes-general/bottomBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import ValorTotal from '../componentes-general/valor-total';
import TablaBasica from '../componentes-general/tabla-basica';
import Button from '@material-ui/core/Button';

export default function SubirDocumentos() {

  const filas = [
    ['F30', '4ta Avenida Conquista', '01/10/20'],
    ['CONTRATO', '4ta Avenida Conquista', '01/10/20'],
    ['DOC. PREVENCION', '4ta Avenida Conquista', '01/10/20'],
    ['CONTRATO', '4ta Avenida Conquista', '01/10/20'],
    ['DOC. PREVENCION', '4ta Avenida Conquista', '01/10/20'],
    ['CONTRATO', '4ta Avenida Conquista', '01/10/20'],
    ['CONTRATO', '4ta Avenida Conquista', '01/10/20'],
    ['CONTRATO', '4ta Avenida Conquista', '01/10/20'],
    ['DOC. PREVENCION', '4ta Avenida Conquista', '01/10/20'],
    ['DOC. PREVENCION', '4ta Avenida Conquista', '01/10/20'],
    ['DOC. PREVENCION', '4ta Avenida Conquista', '01/10/20'],
    ['CONTRATO', '4ta Avenida Conquista', '01/10/20'],
    ['CONTRATO', '4ta Avenida Conquista', '01/10/20'],
  ];
  const titulos = ['Documento', 'Obra', 'Fecha carga'];
  const menuTitulos = ['Detalle','Bitácora','Fimax','Orden de Compra','Recepción']
  const menuFunciones = [
    function() {console.log('funciona1')},
    function() {console.log('funciona2')},
    function() {console.log('funciona3')},
    function() {console.log('funciona4')},
    function() {console.log('funciona5')}
  ];

  return(
    <div className="fondo-app subir-documentos con-bottom-bar flex flex-column">
      <AppBar />        
      <div className="contenido-ventana">
        <div className="titulo-tabla flex flex-row align-center">
          <h2>Documentos cargados</h2>
          {/* <div className="titulo-tabla__botones flex flex-row">
            <Button aria-haspopup="true" className="flex flex-row align-center">
              <FontAwesomeIcon icon={faSortAmountUp} style={{fontSize: '18px'}} />
              <p>Ordenar</p>
            </Button> 
            <Button aria-haspopup="true" className="flex flex-row align-center">
              <FontAwesomeIcon icon={faFilter} style={{fontSize: '18px'}} />
              <p>Filtrar</p>
            </Button>                        
          </div> */}
        </div>            
        <TablaBasica titulos={titulos} dataTabla={filas} />
        <div className="boton-accion-centro flex justify-center align-center">
          <Button variant="contained"><FontAwesomeIcon icon={faFileUpload} style={{fontSize: '18px'}} />Cargar Nuevo</Button>
        </div>
      </div>
      <BottomBar />
    </div>        
  )
}