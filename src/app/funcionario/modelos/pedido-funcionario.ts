//para agregar productos a la tabla de pedidos
export interface ProdPedido{
    idProducto:number;
    nombre:string;
    cantidad:number;
    unidad:string;
}

//datos enviados para registrar el listado de pedidos
export interface GuardarPedido{
    observacion:string;
    fechaEntrega:Date,
    marca:number,
    productos: ProdPedido[];
    //turno:number//TODO: COMENTADO PARA IMPLEMENTAR 27-03-2024
}

//marcas de productos
export interface Marca{
    codMarca:number,
    nombreMarca:string
}

export interface RespuestaMarcas{
    total:number,
    marca:Marca[]
}

export interface TurnoPedido{
    idParametro:number,
    nombre:string,
    valor:string,
    descripcion:string
}

export interface RespuestaTurnoPedido{
    total:number,
    turno: TurnoPedido[]
}

export interface Marca{
    codMarca:number,
    nombreMarca:string
}

export interface pedidoCabHabilitado{
    habilitado:boolean;
    descripcion:string;
    idCabeceraInv?:number;
    fechaApertura?:Date;

}

//para obtener todos los datos de una vez
export interface RespuestaDatosPedido{
    mostrar: boolean;
    // descripcion:string;
    marca?: Marca[]; 
    // idCabeceraInv?:number;
    // fechaApertura?:Date;
    turnos?:TurnoPedido[]
}

//PARA INFORMES

//*para informe de cabeceras de pedidos enviados - y detalle

//para listado de cabeceras
export interface DatosCabeceraPedidos{
    idCabecera:number,
    observacion:string,
    Marca:{
        nombreMarca:string
    },
    Sucursal:{
        nombre:string
    },
    // Parametro:{//TODO: POR AHORA EL TURNO YA NO SERA ESTABLECIDO EN LA CABECERA COMO UN ID, POR ESO YA NO SERA NECESARIO FILTRAR LOS INFORMES POR TURNO
    //     nombre:string
    // },
    fechaEntrega:Date,
    fechaAlta: Date,
}

export interface RespDatosCabeceraPedidos{
    total:number;
    cabeceras:DatosCabeceraPedidos[]
}

export interface DatosFiltroCabecera{
    desde:Date;
    limite:Date;
    tipoFecha:string;
    codMarca:number | "todos";
    turno:number | "todos";
}

//* para filtrar los pedidos recibidos antes de generar pdf
export interface DatosFiltroPedidos_sucursalMarca{
    fecha:Date;
    //turno:number | "null";   //TODO: POR AHORA EL TURNO YA NO SERA ESTABLECIDO EN LA CABECERA COMO UN ID, POR ESO YA NO SERA NECESARIO FILTRAR LOS INFORMES POR TURNO

    codMarca:number | "null";
}


//para editar pedido

export interface PedidoObtenido{
    observacion:string;
    fechaEntrega:Date,
    marca:number,
    productos: ProdPedido[];
    turno:number
}

//producto listado en el modal buscar
export interface Producto{
    idProducto:number;
    nombre:string;
    precio:number;
    descripcion:string;
    //el resto de los datos no son necesarios
    Unidad:{
        NombreUnidad:string
    };
}
export interface RespuestaProductos{
    total:number,
    producto:Producto[]
}