export class ObtenerPDF{
    public static visualizarPDF(pdfData: Blob): void {
        const url = URL.createObjectURL(pdfData);
        window.open(url, '_blank', 'height=600,width=800');
    }
    
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