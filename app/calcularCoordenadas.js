function calcularDistancia(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

function vizinhoMaisProximo(clientes, inicio) {
    const n = clientes.length;
    const grafico = Array.from(Array(n), () => new Array(n));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            grafico[i][j] = calcularDistancia(clientes[i].coordenadas, clientes[j].coordenadas);
        }
    }

    let caminho = [clientes[inicio]];
    let naoVisitados = clientes.slice();
    naoVisitados.splice(inicio, 1);

    let atual = clientes[inicio];

    while (naoVisitados.length) {
        let indiceAtual = clientes.indexOf(atual);
        let proximo = naoVisitados.reduce((min, cliente) => {
            let indiceCliente = clientes.indexOf(cliente);
            return grafico[indiceAtual][indiceCliente] < grafico[indiceAtual][clientes.indexOf(min)] ? cliente : min;
        });

        atual = proximo;
        naoVisitados.splice(naoVisitados.indexOf(proximo), 1);
        caminho.push(proximo);
    }

    return caminho;
}

function calcularDistancia(pontoA, pontoB) {
    return Math.sqrt(Math.pow(pontoB[0] - pontoA[0], 2) + Math.pow(pontoB[1] - pontoA[1], 2));
}

module.exports = { vizinhoMaisProximo };