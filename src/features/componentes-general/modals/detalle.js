import React, { useState, useEffect } from 'react';
import TablaBasica from '../../componentes-general/tabla-basica';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Check from '@material-ui/icons/Check';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {serviciosFacturas} from '../../../api/servicios'
import {CargandoCircularModal} from '../../componentes-general/cargador-circular'

export default function Detalle({num, dataFactura}) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [datosDetalle, setDatosDetalle] = useState('')
    const [filas, setFilas] = useState('')
    const [estado, setEstado] = useState('');
    const [estadoString, setEstadoString] = useState('');
    const [estados, setEstados] = useState(['Emisión', 'Recepción', 'Aprobación']);
    const steps = getSteps();

    useEffect(() => { 
      generarEstado(dataFactura.estado/*  ? dataFactura.estado : "" */)
      console.log(generarRazonRechazo(dataFactura.motivoRechazo))
      setFilas(
        [
          [[dataFactura.numero, 'Factura'],[estadoString, 'Estado'], [dataFactura.montoAsString, 'Monto'], [dataFactura.pepObra, 'Obra'], dataFactura.numeroOC && ''],
          [[dataFactura.fechaEmisionAsString, 'Emisión'],[dataFactura.fechaVencimientoAsString, 'Vencimiento'], [dataFactura.fechaEstimadaPagoAsString, 'Fecha pago estimada'], dataFactura.numeroOC && [dataFactura.numeroOC, 'Numero OC']],
          [dataFactura.medioPago && [dataFactura.medioPago, 'Medio de pago'], dataFactura.motivoRechazo && [generarRazonRechazo(dataFactura.motivoRechazo), 'Motivo de rechazo']]
        ]
      )                                
    }, [estadoString]);

    const generarEstado = async (estadoNumero) => {
      setEstados(['Emisión', 'Recepción', 'Aprobación'])
      switch (estadoNumero) {
        case "F":    
          setEstado(2)
          setEstadoString('Aprobada')
          break;
        case "1":
        case "3":
        case "7":
        case "8":       
          setEstado(1)
          setEstadoString('Recebida')
          break;
        case "5": 
        case "F":                     
          setEstado(2)
          setEstadoString('Aprobada')
          break;
        case "C":
          setEstadoString('Pagada')
          break;
        case "6":
        case "N":        
          setEstados(['Emisión', 'Recepción', 'Rechazada'])
          setEstado(2)
          setEstadoString('Rechazada')
          break;
        case "":
          break;
      }            
    }

    const generarRazonRechazo = (motivoRechazo) => {           
      switch (motivoRechazo.toString()) {
        case "1":    
          return "Sin HES"
        case "2":
          return "Sin OC"
        case "3":
          return "OC sin saldo"
        case "4":
          return "HES sin saldo"
        case "5":
          return "RUT de facturación errónea"
        case "6":
          return "HES sin retención"
        case "7":
          return "Falta documentación"
        case "8":
          return "Cobro duplicado"
        case "9":
          return "Material no recepcionado"
        case "10":    
          return "Sin recepción completa"     
        case "11":    
          return "Cobro erróneo"     
        case "12":    
          return "Cobro no corresponde"
        case "13":    
          return "Con NC 100%"
        case "14":    
          return "CTTO no aprobado"
        case "15":
          return "Devolución de material"
        case "16":
          return "Diferencia de cantidad"
        case "17":
          return "Diferencia de precio"
        case "18":
          return "Espera SOLPED"
        case "19":
          return "MIGO erróneo-sin respuesta de obra"
        case "20":
          return "MIGO incompleto-sin respuesta de obra"
        case "21":
          return "Obra en cuarentena"
        case "22":
          return "OC no aprobada"
        case "23":
          return "OC no existe"
        case "24":
          return "Sin GD"
        case "25":
          return "Sin MIGO-sin respuesta de obra"
        case "26":
          return "Sin PDF"
        case "27":
          return "No aplica pago/paga mandante"
        case "28":
          return "Aplica factura reclamada"
        case "":
          return ""
      }            
    }

    var servicios = new serviciosFacturas();  

    /* const obtenerFacturaDetalle =  async (num) => {          
      await servicios.getFacturaDetalle(num).then((res) => {          
        setDatosDetalle(res.payload)               
        var factura = res.payload
        var fila = [
          [[factura.numero, 'Factura'],['Aprobación', factura.estado], [`$${factura.monto}`, 'Monto']],
          [[factura.fechaEmisionAsString, 'Emisión'],[factura.fechaVencimientoAsString, 'Vencimiento'], [factura.fechaEstimadaPagoAsString, 'Fecha pago']],
        ]          
        setFilas(fila)             
      });
    } */
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    const handleReset = () => {
      setActiveStep(0);
    };    
           
    function getSteps() {
      return estados;
    }
  
    const useIconoEstadosStyles = makeStyles({
      root: {
        color: '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
      },
      active: {
        color: '#14D2B8',           
      },
      circle: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
        marginLeft: '8px',
      },
      completed: {
        color: '#14D2B8',
        zIndex: 1,
        fontSize: 18,  
        marginLeft: '3px',    
      },
    });
  
    function IconoEstados(props) {
      const classes = useIconoEstadosStyles();
      const { active, completed } = props;
    
      return (
        <div
          className={clsx(classes.root, {
            [classes.active]: active,
          })}
        >
          {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
        </div>
      );
    }
  
    return(
      <div>
        { filas ? <div className="datos-modal detalle">
          <div>
            {false && ((estado !== '') && <Stepper /* alternativeLabel  */activeStep={estado} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={IconoEstados}>{label}</StepLabel>                
                </Step>
              ))}
            </Stepper>)}
            {false && (activeStep === steps.length && (
              <Paper square elevation={0} /* className={classes.resetContainer} */>
                <Typography>All steps completed - you&apos;re finished</Typography>
                <Button onClick={handleReset} /* className={classes.button} */>
                  Reset
                </Button>
              </Paper>
            ))}
          </div>
          <TablaBasica dataTabla={filas} />      
          {/* <div className="medio-pago">
            <p>{dataFactura.pepObra}</p>
            <p>Obra</p>
          </div>
          <div className="medio-pago">
            <p>{dataFactura.medioPago}</p>
            <p>Medio de pago</p>
          </div> */}
        </div> : <CargandoCircularModal />}
      </div>
    )
  }