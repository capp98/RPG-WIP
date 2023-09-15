let primarias = document.getElementsByClassName('pericias')[0];
let secundarias = document.getElementsByClassName('atributos')[0];

// PREPARA OS DADOS DA FICHA
ficha.reliquias.sort(ordenarNome);
let valoresTotal = {};

ficha.reliquias.forEach(({ atributos }) => {
  if (!atributos) return;
  let values = Object.keys(atributos);
  values.forEach((field) => {
    if (field === 'passivo') return;
    if (!valoresTotal[field]) valoresTotal[field] = 0;
    valoresTotal[field] += atributos[field];
  });
});

//PREPARA OS CAMPOS A INSERIR NA TABELA "EXTRAS"
let extras = document.getElementById('extras');
let fields = Object.keys(valoresTotal);
fields.forEach((field) => {
  let linha = extras.insertRow();
  let campo = linha.insertCell();
  let valor = linha.insertCell();
  campo.innerHTML = field;
  valor.id = `extras-${field}`;
  valor.innerHTML = valoresTotal[field];
  // console.log(`${field}: ${valoresTotal[field]}`);
});

//PREPARA OS CAMPOS A INSERIR NA TABELA "ITENS"
let itens = document.getElementById('table-itens');
fields = Object.keys(valoresTotal);

ficha.reliquias.forEach((reliquia) => {
  if (!reliquia.atributos) return;
  let linha = itens.insertRow();

  let item = linha.insertCell();
  let valor = linha.insertCell();

  item.innerHTML = reliquia.nome;
  let atributos = Object.keys(reliquia.atributos);
  atributos.forEach((atributo) => {
    let pAtributo = document.createElement('p');

    if (atributo === 'passivo') {
      reliquia.atributos[atributo].forEach((passivo) => {
        pAtributo = document.createElement('p');
        pAtributo.innerHTML = `${passivo}`;
        valor.appendChild(pAtributo);
      });
    } else {
      pAtributo.innerHTML = `${atributo}: ${reliquia.atributos[atributo]}`;
      valor.appendChild(pAtributo);
    }
  });
});

let reliquiasTable = document.getElementById('table-reliquias');

let { reliquias } = ficha;

let reliquiasComEfeitos = reliquias.filter((reliquia) => !!reliquia.efeitos);

for (var i = 0; i < reliquiasComEfeitos.length; i++) {
  var reliquia = reliquiasComEfeitos[i];
  var row = reliquiasTable.insertRow();
  var cell1 = row.insertCell(0);
  row.className = 'reliquia';

  cell1.textContent = reliquia.nome;
  cell1.rowSpan = reliquia.efeitos.length + 1;
  for (var j = 0; j < reliquia.efeitos.length; j++) {
    var efeito = reliquia.efeitos[j];
    var efeitoRow = reliquiasTable.insertRow();
    var efeitoCell1 = efeitoRow.insertCell(0);
    var efeitoCell2 = efeitoRow.insertCell(1);
    efeitoCell1.textContent = efeito.descrição;
    efeitoCell2.textContent = efeito.dados;
  }
}

let { personagem } = ficha;
let { atributos, pericias } = personagem;
//PREPARA OS CAMPOS A INSERIR NA TABELA "PERÍCIAS"
let periciasTable = document.getElementById('pericias');
fields = Object.keys(pericias);
fields.forEach((field) => {
  let linha = periciasTable.insertRow();
  let campo = linha.insertCell();
  let valor = linha.insertCell();

  let values = field.split('/');
  let pericia = values[0];
  let atributo = values[1];

  linha.className = atributo;
  campo.innerHTML = pericia;

  let periciaExtra = !valoresTotal[pericia.toLowerCase()]
    ? 0
    : valoresTotal[pericia.toLowerCase()];

  let atributoExtra = !valoresTotal[atributo] ? 0 : valoresTotal[atributo];

  valor.innerHTML =
    atributos[atributo] + pericias[field] + periciaExtra + atributoExtra;
});

document.getElementById('foto').src = personagem.foto;
document.getElementById('foto').alt = `Imagem do ${personagem.nome}`;
document.getElementById('nome').innerHTML = personagem.nome;
document.getElementById('dt').innerHTML = 10 + atributos.destreza;

document.getElementById('hp').innerHTML = `${personagem.hpAtual}/${
  personagem.hp + atributos.constituição * 2 + valoresTotal.vida
}`;

document.getElementById(
  'sanidade'
).innerHTML = `${personagem.sanidadeAtual}/${personagem.sanidade}`;

document.getElementById('for').innerHTML = !valoresTotal['força']
  ? atributos['força']
  : atributos['força'] + valoresTotal['força'];

document.getElementById('int').innerHTML = !valoresTotal['inteligência']
  ? atributos['inteligência']
  : atributos['inteligência'] + valoresTotal['inteligência'];

document.getElementById('des').innerHTML = !valoresTotal.destreza
  ? atributos.destreza
  : atributos.destreza + valoresTotal.destreza;

document.getElementById('sab').innerHTML = !valoresTotal.sabedoria
  ? atributos.sabedoria
  : atributos.sabedoria + valoresTotal.sabedoria;

document.getElementById('con').innerHTML = !valoresTotal['constituição']
  ? atributos['constituição']
  : atributos['constituição'] + valoresTotal['constituição'];

document.getElementById('car').innerHTML = !valoresTotal.carisma
  ? atributos.carisma
  : atributos.carisma + valoresTotal.carisma;

document.getElementById('ins').innerHTML = personagem['inspiração'];

function ordenarNome(a, b) {
  const nomeA = a.nome.toUpperCase();
  const nomeB = b.nome.toUpperCase();

  if (nomeA < nomeB) return -1;
  if (nomeA > nomeB) return 1;

  return 0;
}
