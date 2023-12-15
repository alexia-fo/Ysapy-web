export class ObtenerPDF{

    /*FIXME:
        Este método estático se utiliza para visualizar un PDF en una nueva ventana del navegador.
        Toma un objeto Blob como argumento, que debe ser el contenido del archivo PDF que se desea visualizar.
        Internamente, crea una URL (Uniform Resource Locator) temporal para el objeto Blob utilizando URL.createObjectURL(pdfData). 
        Esta URL temporaria es necesaria para mostrar el PDF en una nueva ventana.
        Luego, utiliza window.open() para abrir una nueva ventana del navegador y mostrar el PDF.
        El tercer argumento de window.open() ('height=600,width=800') especifica las dimensiones de la ventana del navegador en la que se mostrará el PDF.    
    */
    // public static visualizarPDF(pdfData: Blob): void {
    //     const url = URL.createObjectURL(pdfData);
    //     window.open(url, '_blank', 'height=600,width=800');
    // }
    public static visualizarPDF(pdfData: Blob): void {
        try {
          const url = URL.createObjectURL(pdfData);
          const newWindow = window.open(url, '_blank', 'height=600,width=800');
          
          if (!newWindow) {
            throw new Error('No se pudo abrir una nueva ventana. Asegúrate de que la configuración del navegador permite abrir nuevas ventanas emergentes.');
          }
        } catch (error) {
          console.error('Error al abrir el PDF:', error);
          // Puedes mostrar un mensaje al usuario o manejar el error de alguna otra manera
        }
      }
      


    /*
        Este método estático se utiliza para descargar un archivo PDF en lugar de visualizarlo en el navegador.
        Al igual que el método visualizarPDF, toma un objeto Blob como argumento, que debe ser el contenido del archivo PDF que se desea descargar.
        Crea un nuevo Blob a partir del objeto Blob de entrada y especifica el tipo de contenido como 'application/pdf'.
        Luego, crea una URL temporaria para el nuevo Blob utilizando window.URL.createObjectURL(blob).
        A continuación, crea un elemento <a> (hipervínculo) en el DOM y configura su href para que apunte a la URL temporaria del PDF. También establece el atributo download en 'productos.pdf' para especificar el nombre del archivo cuando se descargue.
        El hipervínculo se agrega al cuerpo del documento con document.body.appendChild(a) y se hace clic automáticamente con a.click() para iniciar la descarga del archivo PDF.
        Al final, se revoca (se libera) la URL temporaria utilizando window.URL.revokeObjectURL(url) para liberar los recursos utilizados por la URL temporaria.

    */
    public static descargarPDF(pdfData: Blob): void {
        const blob = new Blob([pdfData], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        a.download = 'productos.pdf';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
}