//Livia Souza Melo

function readSingleFile(evt) {
    const f = evt.target.files[0];
    document.getElementById('button-input').innerText = f.name
    document.getElementById('button-gerar').removeAttribute('disabled');
    document.getElementById('button-gerar').classList.remove("button-gerar");
    document.getElementById('button-gerar').classList.add("button-gerar-habilitado");
    
    if (f) {
      const r = new FileReader();
      r.onload = function(e) {
        const contents = e.target.result;        
        const dados = contents.split('\r\n')
                              .filter(x => x != '' && x != '\r')
                              .map(x => ({
                                    ano: x.split('.')[0],
                                    periodo: x.split('.')[1].split(',')[0],
                                    disciplina: x.split(',')[1],
                                    ch: Number.parseInt(x.split(',')[2]),
                                    frequencia: Number.parseFloat(x.split(',')[3]),
                                    nota: Number.parseFloat(x.split(',')[4]),
                                }))

        gerar(dados)
      }
      r.readAsText(f);
    } else {
      alert("Falhou em abrir arquivo!");
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataURL = reader.result;
    }

  }

document.getElementById('fileinput').addEventListener('change', readSingleFile, false);


const calcMediaGeralDesvioPadrao = (lista) => {
    const media = (lista.map(l => l.nota).reduce((acc, x) => acc + x, 0))/lista.length
    const desvios = lista.map(x => Math.abs(x.nota - media))
    const variancia = (desvios.reduce((acc, x) => acc + (x**2), 0))/desvios.length
    return Math.sqrt(variancia).toFixed(2)
}

const gerar = (lista) => {
    const periodos = lista.map(l =>`${l.ano}-${l.periodo}`)
    document.getElementById('qtd-periodos').innerText = [...new Set(periodos)].length
    
    const cargaHorariaTotalCursada = lista.map(x => x.ch).reduce((acc, x) => acc + x, 0)
    document.getElementById('carga-h-total').innerText = cargaHorariaTotalCursada
    
    const mediaGeralPonderada = (lista.map(l => l.nota * l.ch).reduce((acc, x) => acc + x, 0)/lista.map(l => l.ch).reduce((acc, x) => acc + x, 0)).toFixed(2)
    document.getElementById('m-geral-p').innerText = mediaGeralPonderada
    
    const mediaGeralDesvioPadrao = calcMediaGeralDesvioPadrao(lista)
    document.getElementById('desvio-padrao').innerText = mediaGeralDesvioPadrao
    
    const listaAprovadas = lista.filter(x => x.frequencia >= 75 && x.nota >= 5 ).map(d => addLinhaNaTabelaAprovadas(d))
    const listaReprovadas = lista.filter(x => x.frequencia < 75 || x.nota < 5).map(d => addLinhaNaTabelaReprovadas(d))



    const departamentos = ([...new Set(lista.map(x => x.disciplina.substring(0, 3)))]).map(d => ({
        departamento: d,
        media: (notasPesoDepart(d, lista)/pesosDepart(d, lista)).toFixed(2)
    })).map(t => addLinhaNaTabelaDepartamentos(t))
}


const notasPesoDepart = (d, lista) =>  lista.filter(x => x.disciplina.substring(0, 3) == d).map(l => l.nota * l.ch).reduce((acc, x) => acc + x, 0)
const pesosDepart = (d, lista) =>  lista.filter(x => x.disciplina.substring(0, 3) == d).map(l => l.ch).reduce((acc, x) => acc + x, 0)
    
const addLinhaNaTabelaDepartamentos = (linhaD) => {
    var tb = document.getElementById('table-media-departamento')
    var qtdLinhas = tb.rows.length;
    var linha = tb.insertRow(qtdLinhas);
    var cellDepartamento = linha.insertCell(0);
    var cellMedia = linha.insertCell(1);
    cellDepartamento.innerHTML = linhaD.departamento;
    cellMedia.innerHTML = linhaD.media;
}


const addLinhaNaTabelaAprovadas = (linhaD) => {
    var tb = document.getElementById('table-aprovadas')
    var qtdLinhas = tb.rows.length;
    var linha = tb.insertRow(qtdLinhas);
    var cellDisciplina = linha.insertCell(0);
    var cellMedia = linha.insertCell(1);
    var cellFreq = linha.insertCell(2);
    cellDisciplina.innerHTML = linhaD.disciplina;
    cellMedia.innerHTML = linhaD.nota;
    cellFreq.innerHTML = linhaD.frequencia;
}


const addLinhaNaTabelaReprovadas = (linhaD) => {
    var tb = document.getElementById('table-reprovadas')
    var qtdLinhas = tb.rows.length;
    var linha = tb.insertRow(qtdLinhas);
    var cellDisciplina = linha.insertCell(0);
    var cellMedia = linha.insertCell(1);
    var cellFreq = linha.insertCell(2);
    cellDisciplina.innerHTML = linhaD.disciplina;
    cellMedia.innerHTML = linhaD.nota;
    cellFreq.innerHTML = linhaD.frequencia;
}

const refresh = () => window.location.reload()