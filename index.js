const fs = require('fs');
const readline = require('readline');
let nomOriginal = '';
let nomDestino = ';'

console.log("\nEscribe nombre del archivo Original");

process.stdin.on('data', (d)=>{
    nomOriginal = d.toString().trim();
    nomDestino = 'trans-'+nomOriginal;
    verificar();
});

function verificar() {
    fs.exists(nomOriginal, (e)=>{
        if(!e){console.log("Archivo no Existe")}
        else{
            fs.exists(nomDestino, (a)=> {
                if(a){ fs.unlinkSync(nomDestino); }
                transArchivo();
            });
        }
    })
}


function transArchivo(){
    const lector = readline.createInterface({input: fs.createReadStream(nomOriginal)});
    const escribir = fs.createWriteStream(nomDestino, {flags: 'a'});
    console.log('\nTransformando TXT por favor espere, puede tardar segun el tamaño del archivo');
    escribir.write('\nMERCADO;UBICACION;UBIGEO;TIPO;AÑO DE INICIO;PUESTOS FIJOS;ALUMBRADO ELÉCTRICO;AGUA;ALCANTARILLADO;RESIDUOS SÓLIDOS;COORDENADAS UTMY;COORDENADAS UTMX;\n\n');
    
    lector.on('line', linia => {
        if(linia.includes(':')){
            escribir.write(linia.split(':')[1].split('\t')[1]+';');
        }else{
            if (linia != ''){
                escribir.write(linia+';');
            }else{
                escribir.write('\n');
            }
        }
    });
    lector.on('close', ()=>{
        console.log('Proceso Finalizado, Nombre del Archivo: ' + nomDestino);
        escribir.end();
        process.exit();
    })
}


