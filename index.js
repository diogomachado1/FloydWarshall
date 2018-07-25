const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const floydWarshall = require('./Model/floydWarshall')
let fs = require('fs');

let mainWindow;
let floyd;
let pathG;

//inicializar o programa
app.on('ready', () => {
    mainWindow = new BrowserWindow({ title: 'Floyd-Warshall', width: 600, height: 710, resizable: false });
    //mainWindow.setMenu(null)
    mainWindow.loadURL(`file://${__dirname}/View/index.html `);
});
//recebe o submit calcular, calcula e manda respota para view
ipcMain.on('mandar', (event, caminhos) => {
    floyd = new floydWarshall(caminhos); // inicia a class floydWarshall que retorna um conjunto contendo um array de vertices e uma matriz respota do algoritmo 
    if(pathG!=undefined){
        escreverTXT(floyd);//inicia a funcao de criar txt
    }
    mainWindow.webContents.send(
        'dados',
        floyd.conjunto //envia os dados para view
    );
});
//recebe dados quando adciona um txt e ler
ipcMain.on('mandarTXT', (event, path) => {
    pathG=path;//passando para uma variavel global
    fs.readFile(path, (err, data) => { //leitura do arquivo
        let caminhos = data.toString('utf8')
        mainWindow.webContents.send( //enviando os caminhos para r]preenche na view
            'caminhos',
            caminhos
        );
    });

});
// cirando o templete do txt
function escreverTXT(floyd){ 
    let txt='|vertices:';//inciando a string
    floyd.conjunto.vertices.forEach((element,index)=>{ //preechendo os vertices
            txt+=(element.toString()+';');
    })
    txt+= "|"
    floyd.conjunto.matriz.forEach((element,index)=>{//inserindo a matriz do floyd
        txt+= "|"
        element.forEach((element,index)=>{
            txt+=(element.toString()+' ');
        })
        txt+= "|\n" //problema:mesmo colocando \n o mesmo nao reproduz no txt
    })
    fs.writeFile(`${pathG}reposta.txt`,txt ,{flag: 'w'}, function (err) { //grava no txt
        if (err) throw err;
    });
    pathG=undefined;
}



