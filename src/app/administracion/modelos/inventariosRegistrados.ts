import { Sucursal } from "./sucursal.model";
import { Usuario } from "./usuario.model";

export interface RespuestaFiltros{
    usuarios:Usuario[];
    sucursales:Sucursal[];
}

export interface datosCabecera{
    idCabecera:number;
    fechaApertura:Date;
    fechaCierre:Date;
    montoApertura:number;
    montoCierre:number;
    montoDiferencia:number;
    montoPendiente:number;
    //TODO:PROBANDO COBROS POR CREDITOS
    montoOtrosCobros: number;
    idsucursal:number;
    idusuario:number;
    observacion:string;
    estado:string;
    turno:string;
    createdAt:Date;
    updatedAt:Date;
    Usuario:{
        nombre:string
    },
    Sucursal:{
        nombre:string;
    }

    //todo -- > add 
    // megasIniciales:string,
    // megasFinales:string
}

export interface RespuestaCabecera{
    total:number;
    cabecera:datosCabecera[];
}

//para obtenerCalculoRendicion
export interface DatosDetalleInventario{
    idproducto:number;
    cantidadApertura:number;
    cantidadCierre:number;
    cantidadRecepcion:number;
    cantidadSalida:number;
    precio:number;
    cantidadTotal:number; // para inventarios cerrados
    totalMultiplicado:number; // para inventarios cerrados
    Producto:{
        nombre:string;
    }
}

//para obtenerCalculoRendicion
export interface DatosDetalleRendicion{
    cantidadApertura:number;
    cantidadCierre:number;
    totalApertura:number;
    totalCierre:number;
    montoTotal:number; // para inventarios cerrados
    Dinero:{
        nombreBillete:string;
        monto:number;
    }
}


//FIXME:para obtener todos los datos de una vez (mostrar las tablas en modales)
export interface RespuestaCalculosRendicion{
    detalleInventario:DatosDetalleInventario[];
    detalleRendicion:DatosDetalleRendicion[];
    totalVenta:number;
    totalAperturaDinero:number;
    totalCierreDinero:number;
    totalDiferenciaDinero:number;
    totalPendiente:number;
    diferenciaVentaCaja:number;
    descVentaCaja:string;
}

//para utilizar al visualizar los inventarios registrados 
export interface datosCabeceraAmostrar{
    fechaApertura:string;
    fechaCierre:string;
    turno:string;
    Sucursal:{ 
        nombre:string
    }
}

export interface RespuestaCalculos{
    totalVenta:number;
    totalAperturaDinero:number;
    totalCierreDinero:number;
    totalDiferenciaDinero:number;
    totalPendiente:number;
    //TODO:PROBANDO COBROS POR CREDITOS
    totalOtrosCobros:number;
    diferenciaVentaCaja:number;
    descVentaCaja:string;
    cabecera:datosCabeceraAmostrar;
}

//FIXME:para obtener todos los datos de por separado (mostrar las tablas en paginas)

export interface RespuestaDetalleInventario{
    detalleInventario:DatosDetalleInventario[];
    cabecera:datosCabeceraAmostrar;
}

export interface RespuestaDetalleRendicion{
    detalleRendicion:DatosDetalleRendicion[];
    cabecera:datosCabeceraAmostrar;
}
//FIXME:





export interface DatosDetRecepcion{
    idcrecepcion: number;
    idproducto:number;
    cantidad:number;
    total:number;
    Crecepcion:{
        idRecepcion: number;
        fecha: Date;
        observacion: string;
        idusuario: number;
        nroComprobante: number;
        estado: boolean;
        idSucursal:number;
        idcabinventario: number;
        createdAt: Date;
        updatedAt: Date;
        Usuario:{
            nombre:string;
        }
    },
    Producto:{
        nombre:string;
    },

}

export interface RespuestaDetRecepcion{
    dRecepcion:DatosDetRecepcion[];
    cabecera:datosCabeceraAmostrar;
}

//para mostrar todas las recepciones de un inventario
export interface RecepcionVisualizar{
    idcrecepcion:number;
    idproducto:number;
    cantidad:number;
    precio:number;
    total:number;
    Crecepcion:{
        idcabinventario:number;
        estado: boolean;
        fecha:Date
        observacion:string;
        nroComprobante:number;
        Usuario:{
            nombre:string
        }
    };
    Producto:{
        nombre:string;
        idproducto:number;
    }
  
}

export interface RespuestaRecepcionesVisualizar{
    dRecepcion:RecepcionVisualizar[];
    cabecera:datosCabeceraAmostrar;
}

export interface DatosDetSalida{
    idcsalida: number,
    idproducto: number,
    idsalida: number,
    cantidad: number,
    total: number,
    Csalida: {
        idCabecera: number;
        idcabinventario:number;
        fecha:Date;
        observacion:string;
        idusuario:number;
        idsucursal:number;
        createdAt:Date;
        updatedAt:Date;
        Usuario:{
            nombre:string;
        }
    },
    Salida:{
        descripcion:string;
    },
    Producto:{
        nombre:string;
    }
}

export interface RespuestaDetSalida{
    dSalida:DatosDetSalida[];
    cabecera:datosCabeceraAmostrar;
}

//para ver todas las salidas de un inventario
//para mostrar todas las recepciones de un inventario
export interface SalidasVisualiza{
    idcsalida:number;
    idproducto:number;
    cantidad:number;
    precio:number;
    total:number;
    Csalida:{
        idCabecera:number
        fecha:Date
        observacion:string;
        Usuario:{
            nombre:string
        }
    };
    Producto:{
        nombre:string;
        idproducto:number;
    };
    Salida:{
        descripcion:string;
    }
  
}

export interface RespuestaSalidasVisualiza{
    dSalida:SalidasVisualiza[];
    cabecera:datosCabeceraAmostrar;
}


////////////////para ver inventarios no cerrados
export interface ProductoInventario{
    idproducto:number;
    cantidadApertura:number;
    cantidadCierre:number;
    cantidadRecepcion:number;
    cantidadSalida:number;
    precio:number;
    Producto:{
        nombre:String;
    }
}

export interface DineroRendicion{
    cantidadApertura:number;
    cantidadCierre:number | null;
    totalApertura:number;
    totalCierre:number | null;
    Dinero:{
        nombreBillete:string;
    }
}

export interface RespuestaRendicion{
    detalleInventario:ProductoInventario[];
    detalleRendicion:DineroRendicion[];
}


//////filtro de cabeceras

export interface DatosFiltro{
    desde:Date;
    hasta:Date;
    estado:string;
    sucursal:number | 'todos';
    turno:string;
}

//para obtener pdf de comparaciones de inventarios
export interface DatosFiltroComparacionInv{
    idSucursal:number,
    fecha1:string,//porque el formulario lo devuelve como string
    fecha2:string,//porque el formulario lo devuelve como string
    turno1:string,
    turno2:string
}

//para editar las cantidades de productos 
export interface ProductoControl {
    cantidadApertura: number;
    cantidadCierre: number;
    idProducto: number;
  }
  
export interface ActualizarCantidades {
    productosControles: ProductoControl[];
  }

  //para editar recepciones

  export interface CabeceraRecepcion {
    idRecepcion:number;
    fecha:Date;
    observacion:string;
    idusuario:number;
    nroComprobante:number;
    estado:boolean;  
  }

  export interface RespuestaCabeceraRecepcion{
    cRecepcion: CabeceraRecepcion[];
  }


  //para editar salidas
  export interface CabeceraSalida {
    idCabecera:number;
    fecha:Date;
    observacion:string;
    idusuario:number;
    estado:boolean;  
  }

  export interface RespuestaCabeceraSalida{
    cSalida: CabeceraSalida[];
  }