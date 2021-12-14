import {Modelo} from './modelo.js';
/**
 * Clase destinada a guardar los datos de cada bola
 */
export class Bola
{
    /**
     * El constructor formara la velocidad de desplzamiento de las bolas de forma aleatoria, ademas del apartado de estilo de las bolas
     * @param {div} contenedor div que contiene a la bola
     * @param {class} controlador controlador de la aplicacion, usado para conectar desde la bola al controlador
     */
    constructor(contenedor,controlador)
    {
        this.controlador=controlador;
        this.velocidadx =  Math.floor (Math.random () * 51) -25;
        this.velocidady =  Math.floor (Math.random () * 51) -25;
        this.div = document.createElement('div');
        //Colocamos el numero a la bola de 0 al limite del numero
        this.div.appendChild(document.createTextNode((Math.floor(Math.random() * (Modelo.limiteNumero - 2)) + 2)));
        //Colocamos su clase correspondiente
        this.cambiarClase('bola');
        //Cada vez que se cree una bola se generara en el centro
        this.div.style.top = (contenedor.clientHeight/2) + 'px'; //Colocamos las medidas por defecto de los div en top
        this.div.style.left = (contenedor.clientWidth/2) + 'px';//Colocamos las medidas por defecto de los div en left
        this.div.onclick = this.controlador.verificar.bind(this.controlador); // this.pulsar.bind(this)
    }
    /**
     * Metodo encargada de cambiar la clase a su bola
     * @param {string} nombreClase 
     */
    cambiarClase(nombreClase)
    {
        this.div.classList.add(nombreClase);
    }
}
