const electron = require('electron');
const { ipcRenderer } = electron;

//ao adicionar um arquivo pega-se o path para assim o poder ler o arquivo e trazer os dados
document.getElementById('files').addEventListener('change', (event) => {
    var [...files] = event.target.files; // FileList object
    if (files[0].path != undefined) {

        ipcRenderer.send('mandarTXT', files[0].path);
    }
});
//recebe os dados txt e enviar para a funcao passar para fazer tratamento (funçao passar)
ipcRenderer.on('caminhos', (event, caminhos) => {
    caminhos = caminhos.split("\n")
    caminhos = passar(caminhos)
});
//Envia os dados dos inputs
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    let caminhosEl = document.querySelectorAll('.caminho');
    let caminhos = new Array();
    caminhosEl.forEach((element, index) => {
        if (element.value != '') {
            caminhos[index] = element.value;
        }
    });
    if (caminhos.length > 0) {
        ipcRenderer.send('mandar', caminhos);
        document.querySelector("#alertas").innerHTML = ''
    } else {
        document.querySelector("#alertas").innerHTML = 'Preencha os campos'
    }
});
//Recebe o conjunto e envia para a funcao criar tabela
ipcRenderer.on('dados', (event, conjunto) => {
    criartabela(conjunto)
});
//Quando recebe o conjunto, essa funcao organiza e monta a matriz
function criartabela(conjunto) {
    let table = document.createElement('table')
    let tr = document.createElement("tr")
    table.appendChild(tr);
    let th, td;
    for (let i = 0; i <= conjunto.matriz.length; i++) {
        th = document.createElement("th")
        if (i != 0) {
            th.innerHTML = conjunto.vertices[i - 1];
        } else {
            th.innerHTML = '#';
        }

        tr.appendChild(th)
    }
    for (let i = 0; i < conjunto.matriz.length; i++) {
        tr = document.createElement("tr");
        td = document.createElement("td");
        td.innerHTML = conjunto.vertices[i];
        tr.appendChild(td);
        for (let j = 0; j < conjunto.matriz.length; j++) {
            td = document.createElement("td");
            td.innerHTML = conjunto.matriz[i][j];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    table.classList.add("table", "table-bordered");
    document.querySelector('#result').replaceChild(table, document.querySelector('table'));
};
//Ao receber dados do txt, essa função transfere os dados para os inputs caminhos e trava-os por padrao para evitar alterações
function passar(caminhos) {
    let caminhosEl = document.querySelectorAll('.caminho');
    caminhos.forEach((element, index) => {
        if ((caminhosEl.length - 1) < index) {
            let input = `<input class="caminho m-1" type="text">`;
            document.querySelector('#caminhos').insertAdjacentHTML('beforeend', input);
            caminhosEl = document.querySelectorAll('.caminho');
        }
        caminhosEl[index].value = element;
        caminhosEl[index].disabled = true;
    });
    document.querySelector('#aumentar').disabled = true;
    document.querySelector('#diminuir').disabled = true;
    document.querySelector('#destravar').removeAttribute("hidden");
    return caminhos;
}
//quando utilizado dados de um txt, por padrao, sao travados os inputs e botões, esse algoritmo trava e destravas
document.querySelector('#destravar').addEventListener('click', () => {
    caminhosEl = document.querySelectorAll('.caminho');
    caminhosEl.forEach((element, index) => {
        caminhosEl[index].disabled = caminhosEl[index].disabled == true ? false : true;
    });
    document.querySelector('#aumentar').disabled = document.querySelector('#aumentar').disabled == true ? false : true;
    document.querySelector('#diminuir').disabled = document.querySelector('#diminuir').disabled == true ? false : true;
});
//aumenta a quantidade de input dos caminhos
document.querySelector('#aumentar').addEventListener('click', () => {
    let input = `<input class="caminho m-1" type="text">`;
    document.querySelector('#caminhos').insertAdjacentHTML('beforeend', input);
});
//diminui a quantidade de input dos caminhos
document.querySelector('#diminuir').addEventListener('click', () => {
    let x = document.querySelectorAll('.caminho')
    document.querySelector('#caminhos').removeChild(x[x.length - 1]);
});



