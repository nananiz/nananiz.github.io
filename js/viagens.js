document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const gradeViagens = document.getElementById('grade-viagens');
    const campoBusca = document.querySelector('.campo-busca');
    const filtros = document.querySelectorAll('.filtro');
    
    // Dados de viagens (do localStorage ou inicial)
    let viagens = carregarViagens() || [
        {
            id: 1,
            destino: "Paris, França",
            dataInicio: "2023-06-15",
            dataFim: "2023-06-22",
            status: "realizada"
        },
        {
            id: 2,
            destino: "Rio de Janeiro, Brasil",
            dataInicio: "2023-12-10",
            dataFim: "2023-12-20",
            status: "realizada"
        },
        {
            id: 3,
            destino: "Tóquio, Japão",
            dataInicio: "2024-04-05",
            dataFim: "2024-04-15",
            status: "planejada"
        }
    ];

    // Carregar viagens do localStorage
    function carregarViagens() {
        const dados = localStorage.getItem('viagens');
        return dados ? JSON.parse(dados) : null;
    }

    // Salvar viagens no localStorage
    function salvarViagens() {
        localStorage.setItem('viagens', JSON.stringify(viagens));
    }

    // Formatar data para exibição
    function formatarData(dataString) {
        const opcoes = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dataString).toLocaleDateString('pt-BR', opcoes);
    }

    // Calcular dias de viagem
    function calcularDias(dataInicio, dataFim) {
        const diff = new Date(dataFim) - new Date(dataInicio);
        return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    }

    // Renderizar viagens na grade
    function renderizarViagens(viagensParaExibir = viagens) {
        gradeViagens.innerHTML = viagensParaExibir.map(viagem => `
            <div class="cartao-viagem" data-id="${viagem.id}">
                <div class="cabecalho-cartao">
                    <h3>${viagem.destino}</h3>
                    <span>${viagem.status === 'realizada' ? '🔵 Realizada' : '🟡 Planejada'}</span>
                </div>
                <div class="corpo-cartao">
                    <div class="info-viagem">
                        <span class="material-symbols-outlined">calendar_month</span>
                        <span>${formatarData(viagem.dataInicio)} - ${formatarData(viagem.dataFim)}</span>
                    </div>
                    <div class="info-viagem">
                        <span class="material-symbols-outlined">schedule</span>
                        <span>${calcularDias(viagem.dataInicio, viagem.dataFim)} dias</span>
                    </div>
                    <div class="acoes-viagem">
                        <button class="botao-icone" onclick="editarViagem(${viagem.id})">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="botao-icone" onclick="excluirViagem(${viagem.id})">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Filtrar viagens
    function filtrarViagens() {
        const termoBusca = campoBusca.value.toLowerCase();
        const filtroAtivo = document.querySelector('.filtro.ativo').textContent.toLowerCase();
        
        const viagensFiltradas = viagens.filter(viagem => {
            const correspondeBusca = viagem.destino.toLowerCase().includes(termoBusca);
            const hoje = new Date();
            const dataInicio = new Date(viagem.dataInicio);
            
            let correspondeFiltro = true;
            if (filtroAtivo === 'passadas') {
                correspondeFiltro = dataInicio < hoje;
            } else if (filtroAtivo === 'planejadas') {
                correspondeFiltro = viagem.status === 'planejada';
            } else if (filtroAtivo === 'futuras') {
                correspondeFiltro = dataInicio > hoje && viagem.status !== 'planejada';
            }
            
            return correspondeBusca && correspondeFiltro;
        });
        
        renderizarViagens(viagensFiltradas);
    }

    // Funções globais para edição/exclusão
    window.editarViagem = function(id) {
        // Redirecionar para página de edição
        window.location.href = `editar-viagem.html?id=${id}`;
    };

    window.excluirViagem = function(id) {
        if (confirm('Tem certeza que deseja excluir esta viagem?')) {
            viagens = viagens.filter(v => v.id !== id);
            salvarViagens();
            filtrarViagens();
        }
    };

    // Event listeners
    campoBusca.addEventListener('input', filtrarViagens);
    
    filtros.forEach(filtro => {
        filtro.addEventListener('click', function() {
            filtros.forEach(f => f.classList.remove('ativo'));
            this.classList.add('ativo');
            filtrarViagens();
        });
    });

    // Inicialização
    salvarViagens(); // Garante que os dados iniciais sejam salvos
    renderizarViagens();
});