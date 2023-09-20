let primarias = document.getElementsByClassName('pericias')[0];
let secundarias = document.getElementsByClassName('atributos')[0];

async function foo() {
  let obj;

  const res = await fetch(
    'https://anxious-puce-cloak.cyclic.cloud/chars/rafael%20dewitt'
  );

  obj = await res.json();

  return obj[0];
}

let ficha = await foo();

// console.log(ficha)

// PREPARA OS DADOS DA FICHA
let valoresTotal = {};

ficha.reliquias.sort(ordenarNome);

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

let { atributos, pericias } = ficha;
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

document.getElementById('foto').src = ficha.foto;
document.getElementById('foto').alt = `Imagem do ${ficha.nome}`;
document.getElementById('nome').innerHTML = ficha.nome;
document.getElementById('dt').innerHTML = 10 + atributos.destreza;

let vidaEmPorcentagem =
  1.0 + (valoresTotal['% de vida'] ? valoresTotal['% de vida'] / 100 : 0);

let hpMaximo =
  (40 + atributos.constituição * 2 + valoresTotal.vida) * vidaEmPorcentagem;

document.getElementById('hp').innerHTML = `${
  ficha.hpatual > hpMaximo ? hpMaximo : ficha.hpatual
}/${hpMaximo}`;

document.getElementById('sanidade').innerHTML = `${
  ficha.sanidadeatual > ficha.sanidade ? ficha.sanidade : ficha.sanidadeatual
}/${
  valoresTotal.sanidade
    ? ficha.sanidade + valoresTotal.sanidade
    : ficha.sanidade
}`;

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

document.getElementById('inspiracao').innerHTML = ficha.inspiracao;

valoresTotal.armadura = valoresTotal.armadura ? valoresTotal.armadura : 0;

valoresTotal['resistência mágica'] = valoresTotal['resistência mágica']
  ? valoresTotal['resistência mágica']
  : 0;

valoresTotal.defesa = valoresTotal.defesa ? valoresTotal.defesa : 0;

document.getElementById('armadura').innerHTML =
  valoresTotal.armadura + valoresTotal.defesa;

document.getElementById('resistencia-magica').innerHTML =
  valoresTotal['resistência mágica'] + valoresTotal.defesa;

function ordenarNome(a, b) {
  const nomeA = a.nome.toUpperCase();
  const nomeB = b.nome.toUpperCase();

  if (nomeA < nomeB) return -1;
  if (nomeA > nomeB) return 1;

  return 0;
}
