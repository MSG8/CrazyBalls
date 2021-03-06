/**
 * @description Clase principal de la aplicacion
 * @file app.js
 * @license GPL3 
 * @author Manuel Solís Gómez(masogo008@gmail.com), Daniel Nuñez Santiago, Genaro Salas Galindo y Julio Ramos Gago
 */
import {Vista} from './vista.js';
import {Modelo} from './modelo.js';
/**
* Esta clase es el controlador de nuestra aplicacion 
*/
export class App
{
    /**
     * El constructor declarara la vista, el modelo, el animador y el boton que permitira iniciar el juego
     */
    constructor()
    {
        this.vista = new Vista(this); // Clase referente a todo el apartado visual de la aplicacion
        this.modelo = new Modelo(); // Clase referente a todos los datos de la aplicacion
        this.animador = null; // Creamos el animador

        // Centramos el boton de juego
        this.botonJuego = document.getElementById('juego');
        this.botonJuego.style.left = (document.getElementById('ventanaJuego').clientWidth/2 - this.botonJuego.clientWidth/2)+'px';
        this.botonJuego.style.top = (document.getElementById('ventanaJuego').clientHeight/2 - this.botonJuego.clientHeight/2)+'px';
        this.botonJuego.onclick= this.iniciar.bind(this); //Clase destinada a iniciar el juego
    }
    /**
     * Metodo encargada de iniciar el minijuego
     */
    iniciar()
    {
        this.botonJuego.remove(); //borramos el boton de jugar

        this.modelo.nivel = parseInt(document.getElementById('niveles').value); // Colocamos el nivel en el modelo
        this.modelo.cantidadBolas = this.cantNivel();
        this.vidaNivel();
        this.vista.vida(this.modelo.vida); //Muestra la puntuacion

        this.vista.generarBolas(this.modelo.cantidadBolas); //Llamamos a generar las bolas, podriamos llamarlo si clica algun boton
        this.animador = window.setInterval(this.vista.moverBolas.bind(this.vista), 200); // nuestra animador llamara cada cierto intervalo de tiempo a la funcion de movimiento, el animador pertenece al controlador y verlas moviendose a la vista
        
        document.getElementById('acabarJuego').onclick = this.finPrograma.bind(this);//Colocamos el evento que llama al metodo de fin de programa;
    }
    /**
     * Metodo encargada de colocar la cantidad de vida dependiendo del nivel
     */
    vidaNivel()
    {
        this.modelo.vida -= (this.modelo.nivel-1) * 10;
    }
    /**
     * Metodo encargada de colocar la cantidad de bolas dependiendo del nivel
     * 
     * @return devuelve la cantidad de bolas
     */
    cantNivel()
    {
        return this.modelo.nivel * this.modelo.cantidadBolas;
    }
    /**
     * Metodo encargada de comprobar si la bola selecionada es un multiplo
     */
    verificar(evento)
    {
        let bola = evento.target //tomamos el elemento bola buscado
        let textoBola = bola.childNodes[0].nodeValue; //Saca el nodo de texto de la bola, es decir el numero a coparar si el multiplo
        let multiplo = document.getElementById('numeroAside'); //tomamos el elemento numeroAside que tiene el multiplo
        let textMultiplo = multiplo.childNodes[0].nodeValue; //Saca el nodo de texto de multiplo

        const sonFallo = new Audio('sound/error.wav');//Audio declarado

        if (textoBola % textMultiplo == 0)
        {
            this.vista.cambiarClase(bola,'bolaAcertada');
            this.vista.destruirBola(bola);
        }
        else
        {
            this.vista.cambiarClase(bola,'bolaError');
            this.vista.puntuarVida(-10);

            sonFallo.play();
        }
    }
    /**
     * Metodo encargada de finalizar el programa, segun la vida y las bolas restantes sacara la puntuacion.
     * Tambien iniciara la clase encargada de volver a jugar
     */
    finPrograma()
    {
        let bolas = document.querySelectorAll('.bola'); //tomamos todos los div de las bolas
        let bolasMal = document.querySelectorAll('.bolaError'); //tomamos todos los div de las bolas que ya han dado error
        let multiplo = document.getElementById('numeroAside'); //tomamos el elemento numeroAside que tiene el multiplo
        let textMultiplo = multiplo.childNodes[0].nodeValue; //Saca el nodo de texto de multiplo
        let multiplica = false; //Variable para controlar si algun multiplo da 0

        for (let indice = 0; indice < bolas.length && multiplica==false; indice++) //For para pasar por cada una de las div de las bolas y mientras no hay multiplicacion con resto 0
        {
            let textoBola = bolas[indice].childNodes[0].nodeValue; //Saca el nodo de texto de la bola, es decir el numero a coparar si el multiplo
            if (textoBola % textMultiplo == 0) 
            {
                multiplica = true; //Nos dice que ha multiplicado alguno
            }
        }

        for (let indice = 0; indice < bolas.length; indice++) //Eliminamos las bolas que no han sido probadas
        {
            bolas[indice].remove();
        }

        for (let indice = 0; indice < bolasMal.length; indice++) //Eliminamos las bolas de error
        {
            bolasMal[indice].remove();
        }

        document.getElementsByTagName('audio')[0].remove();

        if (!multiplica && document.getElementById('puntuacion').children[1].textContent > 0)
        {
            this.vista.ganador(); //si no existe multiplo nos llevara a que la vista nos enseñe que ganamos
            this.puntuacionFinal(this.modelo.vida * this.modelo.nivel,false);
        }
        else
        {
            this.vista.perdedor(); //si existe multiplo nos llevara a que la vista nos enseñe que hemos perdido
            this.puntuacionFinal('',true);
        }
        this.volverJugar();
    }
    /**
     * Metodo encargada de crear el boton para volver a jugar y eliminar el de acabar juego
     */
    volverJugar()
    {
        //llamamos que la vista cree el boton
        this.vista.generarBoton('VOLVER A JUEGAR','otraVez').onclick = this.recargar.bind(this);

        //borramos el boton de fin de juego
        document.getElementById('acabarJuego').remove();
    }
    /**
     * Metodo encargada de colocar la puntuacion en una cookie
     * @param {int} puntuacion la puntuacion de juego
     * @param {boolean} tiempo usado para colocar un tiempo de expiracion menor al actual
     */
    puntuacionFinal(puntuacion,tiempo=false)
    {
        let fecha = new Date(); //Fecha actual
        if (tiempo) 
        {
            fecha.setDate(fecha.getDate()-100);
            document.cookie = 'puntuacion='+puntuacion+';expires='+fecha;
        } 
        else 
        {
            document.cookie = `puntuacion=${puntuacion}`;
        }
    }
    /**
     * Metodo que recargara la pagina para volver a jugar
     */
    recargar()
    {
        location.reload(); //Recargar la pagina
    }
}
let controlador = new App();
