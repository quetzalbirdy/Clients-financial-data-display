import React, { useState } from 'react';

export default function ValorTotal(props) {
    return(
      <div className="valor-total flex flex-row align-center">
        <p className="text">{props.texto}</p>
        <p className="valor-total__valor">{'$' + props.valorTotal}</p>
      </div>       
    )
}