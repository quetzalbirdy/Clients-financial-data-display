import React, { useState } from 'react';
import AppBar from '../componentes-general/appBar';
import BottomBar from '../componentes-general/bottomBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import ValorTotal from '../componentes-general/valor-total';
import TablaBasica from '../componentes-general/tabla-basica';
import Button from '@material-ui/core/Button';

export default function HojaRuta() {

  var documentos = [
    {
      obra: "Edificio los Alerces",
      contrato: "#77455223",
      estado: 'Activo',
      documentos: [
        'F30', 'F30-1', 'Libro de Remuneraciones', 'Anexos de Traslado o Finiquito de los Trabajadores', 'Finiquito Comercial original firmado y legalizado'
      ]
    },
    {
      obra: "Edificio los Alerces",
      contrato: "#77455223",
      estado: 'Activo',
      documentos: [
        'F30', 'F30-1', 'Libro de Remuneraciones', 'Anexos de Traslado o Finiquito de los Trabajadores', 'Finiquito Comercial original firmado y legalizado'
      ]
    },
    {
      obra: "Edificio los Alerces",
      contrato: "#77455223",
      estado: 'Activo',
      documentos: [
        'F30', 'F30-1', 'Libro de Remuneraciones', 'Anexos de Traslado o Finiquito de los Trabajadores', 'Finiquito Comercial original firmado y legalizado'
      ]
    },
    {
      obra: "Edificio los Alerces",
      contrato: "#77455223",
      estado: 'Activo',
      documentos: [
        'F30', 'F30-1', 'Libro de Remuneraciones', 'Anexos de Traslado o Finiquito de los Trabajadores', 'Finiquito Comercial original firmado y legalizado'
      ]
    },
    {
      obra: "Edificio los Alerces",
      contrato: "#77455223",
      estado: 'Activo',
      documentos: [
        'F30', 'F30-1', 'Libro de Remuneraciones', 'Anexos de Traslado o Finiquito de los Trabajadores', 'Finiquito Comercial original firmado y legalizado'
      ]
    },
    {
      obra: "Edificio los Alerces",
      contrato: "#77455223",
      estado: 'Activo',
      documentos: [
        'F30', 'F30-1', 'Libro de Remuneraciones', 'Anexos de Traslado o Finiquito de los Trabajadores', 'Finiquito Comercial original firmado y legalizado'
      ]
    }
  ]

  return(
    <div className="fondo-app hoja-ruta con-bottom-bar flex flex-column">
      <AppBar />        
      <div className="contenido-ventana">
        <div className="titulo-tabla flex flex-row align-center">
          <h2>Hoja de ruta</h2>          
        </div>   
        <ContenedorDocumentos items={documentos} />                   
      </div>
      <BottomBar />
    </div>        
  )
}

function ContenedorDocumentos(props) {
  return(
    <div className="hoja-ruta__contenedores">
      {
        props.items.map((data, i) => (
          <div className="hoja-ruta__container flex flex-column">
          <div className="hoja-ruta__container__header flex flex-row align-center">
            <div className="hoja-ruta__container__header__item flex align-center flex-column">
              <p>{data.obra}</p>
              <p>Obra de solicitud</p>
            </div>
            <div className="hoja-ruta__container__header__item flex align-center flex-column">
              <p>{data.contrato}</p>
              <p>Número de contrato</p>
            </div>
            <div className="hoja-ruta__container__header__item flex align-center flex-column">
              <p>{data.estado}</p>
              <p>Estado de avance</p>
            </div>
          </div>
          <div className="hoja-ruta__container__body">
            <p>Documentos</p>
            <div className="hoja-ruta__container__body__documentos flex flex-column">
              {data.documentos.map((doc, i) => (
                <div className="flex flex-row align-center">
                  <FontAwesomeIcon  icon={faCheckCircle} style={{fontSize: '13px'}} /><p>{doc}</p>
                </div>
              ))}
            </div>
          </div>
        </div> 
        ))
      }
    </div>
  )
}