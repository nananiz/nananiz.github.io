// Dados de exemplo (serão substituídos pelo localStorage)
const viagensExemplo = [
    { id: 1, destino: "Rio de Janeiro", data: "2023-05-15", duracao: 5, imagem: "https://source.unsplash.com/random/600x400/?rio" },
    { id: 2, destino: "São Paulo", data: "2023-08-22", duracao: 3, imagem: "https://source.unsplash.com/random/600x400/?sao-paulo" },
    { id: 3, destino: "Florianópolis", data: "2024-01-10", duracao: 7, imagem: "https://source.unsplash.com/random/600x400/?florianopolis" }
];

// Carrega viagens do localStorage ou usa as de exemplo
function carregarViagens() {
    const viagensSalvas = localStorage.getItem('viagens');
    return viagensSalvas ? JSON.parse(viagensSalvas) : viagensExemplo;
}

// Atualiza as contagens e exibe as viagens
function atualizarDashboard() {
    const viagens = carregarViagens();
    const hoje = new Date();
    
    // Filtra viagens passadas e futuras
    const viagensPassadas = viagens.filter(v => new Date(v.data) < hoje);
    const viagensFuturas = viagens.filter(v => new Date(v.data) >= hoje);
    
    // Atualiza contagens
    document.getElementById('contagem-passadas').textContent = `${viagensPassadas.length} concluídas`;
    document.getElementById('contagem-proximas').textContent = `${viagensFuturas.length} planejadas`;
    
    // Exibe viagens recentes (últimas 3)
    const viagensRecentes = [...viagensPassadas].reverse().slice(0, 3);
    const listaViagens = document.getElementById('lista-viagens');
    
    listaViagens.innerHTML = viagensRecentes.map(viagem => `
        <div class="cartao-viagem">
            <img src="${viagem.imagem}" alt="${viagem.destino}" class="imagem-viagem">
            <div class="info-viagem">
                <h3>${viagem.destino}</h3>
                <p class="data">${formatarData(viagem.data)} • ${viagem.duracao} dias</p>
            </div>
        </div>
    `).join('');
    
    // Gera resumo estatístico
    gerarResumoViagens(viagens);
}

// Formata data para exibição
function formatarData(dataString) {
    const opcoes = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dataString).toLocaleDateString('pt-BR', opcoes);
}

// Gera o resumo estatístico
function gerarResumoViagens(viagens) {
    const resumoElement = document.getElementById('resumo-viagens');

    if (viagens.length === 0) {
        resumoElement.innerHTML = '<p>Você ainda não registrou nenhuma viagem.</p>';
        return;
    }

    // Calcula estatísticas
    const viagensPorAno = {};
    let anoComMaisViagens = '';
    let maxViagens = 0;
    const anoAtual = new Date().getFullYear();

    viagens.forEach(viagem => {
        const ano = new Date(viagem.data).getFullYear();
        viagensPorAno[ano] = (viagensPorAno[ano] || 0) + 1;
        
        if (viagensPorAno[ano] > maxViagens) {
            maxViagens = viagensPorAno[ano];
            anoComMaisViagens = ano;
        }
    });

    const totalViagens = viagens.length;
    const nivelViajante = totalViagens <= 3 ? 'iniciante' : 
                         totalViagens <= 6 ? 'viajante frequente' : 'expert em viagens';

    // Exibe o resumo
    resumoElement.innerHTML = `
        <p>Em <span class="destaque">${anoComMaisViagens}</span> (seu ano mais ativo) você viajou <span class="destaque">${maxViagens} vezes</span>.</p>
        <p>No total: <span class="destaque">${totalViagens} viagens</span> - ${nivelViajante}!</p>
        ${anoComMaisViagens == anoAtual ? '<p>Este está sendo seu melhor ano de viagens! ✈️</p>' : ''}
    `;
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    // Garante que existam dados no localStorage
    if (!localStorage.getItem('viagens')) {
        localStorage.setItem('viagens', JSON.stringify(viagensExemplo));
    }
    
    atualizarDashboard();
    
    // Configura evento do botão Nova Viagem
    document.querySelector('.botao-nova-viagem').addEventListener('click', () => {
        // Lógica para adicionar nova viagem
        alert('Funcionalidade de nova viagem será implementada!');
    });
});