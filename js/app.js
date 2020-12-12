const criptomonedasSelect =  document.querySelector('#criptomonedas');
const monedasSelect =  document.querySelector('#moneda');
const formulario =  document.querySelector('#formulario');
const resultado =  document.querySelector('#resultado');

const objBusqueda = {
        moneda: '',
        criptomoneda: ''
    }

//crear una promise

const obtenerCriptomonedas = criptomonedas => new Promise( resolve => resolve(criptomonedas))

document.addEventListener('DOMContentLoaded',()=>{
    consultarCriptomonedas()

    formulario.addEventListener('submit',submitFormulario);
    criptomonedasSelect.addEventListener('change',LeerValor);
    monedasSelect.addEventListener('change',LeerValor);
})


function consultarCriptomonedas (){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`

    fetch(url)
            .then(res=>res.json())
            .then(resultados=> obtenerCriptomonedas(resultados.Data))
            .then( criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas (criptomonedas){

    criptomonedas.forEach( cripto =>{

        const {FullName ,Name}= cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name ;
        option.textContent = FullName ;

        criptomonedasSelect.appendChild(option);
    })
}


function submitFormulario(e){
    e.preventDefault()

    const {moneda , criptomoneda} = objBusqueda ;

    if(moneda === ''||criptomoneda===''){
        mensajeAlerta('Todos los campos son obligatorios')
        return;
    }

    consultarAPI()
}



function LeerValor (e){
 
    objBusqueda[e.target.name] = e.target.value ;
    

    console.log(objBusqueda)
    
}


function mensajeAlerta (mensaje){

    const existeError = document.querySelector('.error')

    if(!existeError){
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');
    divMensaje.textContent = mensaje;

    formulario.appendChild(divMensaje)

    setTimeout(()=>{
        divMensaje.remove();
    },3000)
    }
    



}

function consultarAPI (){
    const {moneda,criptomoneda}= objBusqueda;

    mostrarSpinner()

    url=`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    fetch(url)
        .then(respuesta => respuesta.json())
        .then( cotizacion => mostrarCotizacionHMTL(cotizacion.DISPLAY[criptomoneda][moneda]))
}


function mostrarCotizacionHMTL (cotizacion){
    
    limpiarHTML()

    console.log(cotizacion)
    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE}=cotizacion;

    const precio =  document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`

    const precioAlto= document.createElement('p');
    precioAlto.innerHTML = `El precio mas alto del dia fue:<span>${HIGHDAY}</span>`

    const preciobajo= document.createElement('p');
    preciobajo.innerHTML = `El precio mas alto del dia fue:<span>${LOWDAY}</span>`

    const variacion= document.createElement('p');
    variacion.innerHTML = `La variacion en la ultimas 24 horas fue:<span>${CHANGEPCT24HOUR}%</span>`

    const actulizacion= document.createElement('p');
    actulizacion.innerHTML = `La ultima actulizacion fue:<span>${LASTUPDATE}</span>`



    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(preciobajo)
    resultado.appendChild(variacion) 
    resultado.appendChild(actulizacion) 



}


function limpiarHTML (){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}


function mostrarSpinner (){

    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner')
    spinner.innerHTML = `
    
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    
    `

    resultado.appendChild(spinner)
}