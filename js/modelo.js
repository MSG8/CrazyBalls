/**
 * Clase destinada a guardar los datos de la aplicacion
 */
export class Modelo
{
    /**
     * Inicializamos los atributos que contendran los datos del programa (cantidad de bolas, la vida y el nivel)
     */
    constructor()
    {
        this.cantidadBolas = 8;
        this.vida = 100;
        this.nivel = 1;
    }
}
Modelo.limiteNumero = 50; //atributo estatico para definir el limite de numeros de los numeros
