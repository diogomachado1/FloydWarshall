module.exports = class floydWarshall {
    constructor(caminhos) {
        this.conjunto = this.caminhoMin(caminhos)// atribui a variavel conjunto e inicia a func caminha q retorna os vertice e a matriz resposta
    }
    caminhoMin(caminhos) {
        let vertices = [];
        caminhos.forEach((element, index) => { //for para achar os vertices do problema
            caminhos[index] = caminhos[index].split(' ');
            vertices = this.achar(caminhos[index], vertices, 0)//verifica se os vertices ja estao guardados
            vertices = this.achar(caminhos[index], vertices, 1)
        });
        let num = vertices.length - 1; //numero necessario para criar a matriz
        let matriz = new Array(num); //iniciando as linhas
        for (let i = 0; i <= num; i++) {
            matriz[i] = new Array(num);// iniciando as calunas
            for (let j = 0; j <= num; j++) {
                if (i != j) {
                    matriz[i][j] = Infinity;//inifinitos
                } else {
                    matriz[i][j] = 0;//0 para v os mesmo vertices
                }
            }
        }
        for (let i = 0; i <= caminhos.length - 1; i++) {// algortimo para mapear o caminho entre dois vertices
            let posX, posY;
            vertices.forEach((element, index) => {
                if (caminhos[i][0] == element) {
                    posX = index;
                }
                if (caminhos[i][1] == element) {
                    posY = index;
                }
            })
            if(matriz[posX][posY]>= parseInt(caminhos[i][2])){
                matriz[posX][posY] = parseInt(caminhos[i][2]);
            }
        }
        for (let k = 0; k <= num; k++) { //algoritmo de floydWarshall, onde encontra os menos caminhos entre cada vertice
            for (let i = 0; i <= num; i++) {
                for (let j = 0; j <= num; j++) {
                    if ((matriz[i][k] + matriz[k][j]) < matriz[i][j]) {
                        matriz[i][j] = matriz[i][k] + matriz[k][j];
                    }
                }
            }
        }
        let conjunto = { vertices, matriz }; //cria um objeto com  vertice e matriz
        return conjunto;
    }

    achar(caminho, vertices, v) { //algoritmo para verificar se o vertice esta na vetor
        let achar = false;
        for (let i = 0; i <= vertices.length; i++) {
            if ((vertices.length == i) && (achar == false)) {
                vertices[i] = caminho[v]
            }
            if ( vertices[i] == caminho[v]) {
                achar = true;
            }
        }
        return vertices;
    }
    

}

