export interface DatosDetalleInventario{
    idproducto:number;
    cantidadApertura:number;
    cantidadCierre:number;
    cantidadRecepcion:number;
    cantidadSalida:number;
    precio:number;
    cantidadTotal:number;
    totalMultiplicado:number;
    Producto:{
        nombre:String;
    }
}

export interface DatosDetalleRendicion{
    cantidadApertura:number;
    cantidadCierre:number;
    totalApertura:number;
    totalCierre:number;
    montoTotal:number;
    Dinero:{
        nombreBillete:string;
    }
}

export interface RespuestaCalculosRendicion{
    detalleInventario:DatosDetalleInventario[];
    detalleRendicion:DatosDetalleRendicion[];
    totalVenta:number;
    totalAperturaDinero:number;
    totalCierreDinero:number;
    totalDiferenciaDinero:number;
    totalSalida:number;
    diferenciaVentaCaja:number;
    descVentaCaja:string;
}

export interface datosCabecera{
    idCabecera:number;
    fechaApertura:Date;
    fechaCierre:Date;
    montoApertura:number;
    montoCierre:number;
    montoDiferencia:number;
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
}

export interface RespuestaCabecera{
    total:number;
    cabecera:datosCabecera[];
}

////////////////////////// para detalle de inventario
export interface datosDetInventario extends DatosDetalleInventario{
    idproducto:number;
}

export interface RespuestaDetInventario{
    detalleInventario:datosDetInventario[];
}

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
        idsucursal:number;
        idcabinventario: number;
        createdAt: Date;
        updatedAt: Date;
        Usuario:{
            nombre:string;
        }
    },
    Producto:{
        nombre:string;
    }
}

export interface RespuestaDetRecepcion{
    dRecepcion:DatosDetRecepcion[];
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

export interface RespuestaDetallesRendicion{
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