export function obterOpcoesDeExercicios(membro) {
    const dbExercicios = {
        UPPER: [
            "Supino Reto (Barra ou Halter)", "Supino Inclinado (Barra ou Halter)", "Crucifixo",
            "Puxada Frontal", "Remada Curvada", "Remada Baixa", "Pulldown",
            "Desenvolvimento", "Elevação Lateral", "Tríceps Polia", "Rosca Direta"
        ],
        LOWER: [
            "Agachamento Livre", "Leg Press", "Cadeira Extensora",
            "Cadeira Flexora", "Mesa Flexora", "Stiff", "RDL",
            "Panturrilha Sentado", "Panturrilha em Pé", "Elevação Pélvica"
        ],
        PUSH: [
            "Supino Reto", "Supino Inclinado", "Crucifixo Máquina",
            "Desenvolvimento Halter", "Elevação Lateral Cabo", "Tríceps Testa", "Tríceps Corda"
        ],
        PULL: [
            "Puxada Alta", "Remada Curvada", "Remada Máquina", "Pull down",
            "Crucifixo Inverso", "Rosca Direta Barra", "Rosca Martelo"
        ],
        LEGS: [
            "Agachamento Hack", "Leg Press", "Cadeira Extensora",
            "Cadeira Flexora", "Stiff", "Afundo",
            "Panturrilha no Leg", "Panturrilha em Pé"
        ]
    };
    
    const lista = dbExercicios[membro] || [...dbExercicios.UPPER, ...dbExercicios.LOWER];
    return `<option value="">Selecione um exercício...</option>` + 
           lista.map(ex => `<option value="${ex}">${ex}</option>`).join('');
}

export function renderNovaLinhaExercicio(container, membro) {
    const exDiv = document.createElement('div');
    exDiv.className = 'exercise-block';
    exDiv.style = "background: #1a1a1a; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #333;";
    
    const header = document.createElement('div');
    header.style = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;";
    header.innerHTML = `
        <h4 style="margin: 0; color: #aaa; font-size: 14px;">EXERCÍCIO</h4>
        <button type="button" class="btn-del-ex" style="background: transparent; color: #ff4d4d; border: 1px solid #ff4d4d; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px; font-weight: bold;">❌ Remover Exercício</button>
    `;

    const select = document.createElement('select');
    select.className = 'ex-name';
    select.style = "width: 100%; padding: 10px; background: #111; color: #fff; border: 1px solid #333; border-radius: 4px; margin-bottom: 20px; font-size: 15px;";
    select.innerHTML = obterOpcoesDeExercicios(membro);

    const setsContainer = document.createElement('div');
    setsContainer.className = 'sets-container';
    
    const btnAddSet = document.createElement('button');
    btnAddSet.type = 'button';
    btnAddSet.textContent = '+ ADICIONAR SÉRIE';
    btnAddSet.style = "width: 100%; padding: 12px; background: #222; color: #fff; border: 1px solid #444; border-radius: 4px; cursor: pointer; margin-bottom: 20px; font-weight: bold; font-size: 14px; margin-top: 10px;";
    
    const feedbackHeader = document.createElement('h4');
    feedbackHeader.textContent = 'FEEDBACK ESPECÍFICO DO EXERCÍCIO';
    feedbackHeader.style = "margin: 0 0 8px 0; color: #aaa; font-size: 12px;";

    const feedback = document.createElement('textarea');
    feedback.className = 'ex-feedback';
    feedback.placeholder = 'Sensação muscular, biomecânica...';
    feedback.style = "width: 100%; padding: 10px; background: #111; color: #fff; border: 1px solid #333; border-radius: 4px; resize: vertical; min-height: 70px; font-size: 14px;";

    header.querySelector('.btn-del-ex').addEventListener('click', () => exDiv.remove());
    
    const adicionarSerie = () => {
        const row = document.createElement('div');
        row.className = 'sets-row dynamic-set';
        // Estilização idêntica ao modelo antigo
        row.style = "background: #111; padding: 12px; border: 1px solid #222; border-radius: 6px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px;";
        row.innerHTML = `
            <select class="set-type" style="padding: 8px; background: #1a1a1a; color: #fff; border: 1px solid #333; border-radius: 4px; font-size:14px; width: 100%;">
                <option value="Aquecimento">Aquecimento</option>
                <option value="Ajuste">Ajuste (Feeder)</option>
                <option value="Válida" selected>Válida (Top/Backoff)</option>
            </select>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <input type="number" class="set-placas" placeholder="Placas" min="0" style="padding: 8px; background: #1a1a1a; color: #fff; border: 1px solid #333; border-radius: 4px; font-size:14px; text-align: center;">
                <input type="number" class="set-load" placeholder="Carga (kg)" min="0" step="0.5" style="padding: 8px; background: #1a1a1a; color: #fff; border: 1px solid #333; border-radius: 4px; font-size:14px; text-align: center;">
            </div>
            <input type="text" class="set-reps" placeholder="Reps (Ex: 8-10)" style="padding: 8px; background: #1a1a1a; color: #fff; border: 1px solid #333; border-radius: 4px; font-size:14px; text-align: center; width: 100%;">
            <button type="button" class="btn-del-set" style="background: #3a1111; color: #ff4d4d; border: 1px solid #551a1a; border-radius: 4px; padding: 6px; font-weight: bold; cursor: pointer; font-size: 14px; width: 100%; text-align: center; margin-top: 4px;">X</button>
        `;
        row.querySelector('.btn-del-set').addEventListener('click', () => row.remove());
        setsContainer.appendChild(row);
    };

    btnAddSet.addEventListener('click', adicionarSerie);
    adicionarSerie();

    exDiv.appendChild(header);
    exDiv.appendChild(select);
    exDiv.appendChild(setsContainer);
    exDiv.appendChild(btnAddSet);
    exDiv.appendChild(feedbackHeader);
    exDiv.appendChild(feedback);
    
    container.appendChild(exDiv);
}

export function renderHistoricoTreinos(listaTreinos, container, onEdit, onDelete) {
    container.innerHTML = "";
    if (listaTreinos.length === 0) {
        container.innerHTML = "<p style='color:#aaa; text-align:center; margin-top: 20px;'>Nenhum treino registrado ainda.</p>";
        return;
    }
    
    listaTreinos.forEach(treino => {
        const card = document.createElement('div');
        card.style = "background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 15px; margin-bottom: 15px;";
        
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 10px;">
                <div>
                    <h3 style="margin: 0 0 5px 0; color: #e50914; font-size: 16px;">${treino.treino} - Semana ${treino.semanaNum || treino.semana}</h3>
                    <p style="margin: 0; font-size: 12px; color: #aaa;">Data: ${treino.dataStr || treino.dataTreino} | Fase: ${treino.faseDescricao || 'N/A'}</p>
                </div>
                <div style="display:flex; gap: 8px;">
                    <button class="btn-edit" style="background: #333; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Editar</button>
                    <button class="btn-delete" style="background: transparent; color: #ff4d4d; border: 1px solid #ff4d4d; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Excluir</button>
                </div>
            </div>
            <div style="font-size: 13px; color: #ddd; margin-top: 10px;">
                ${treino.exercicios.map(ex => `<div style="margin-bottom: 4px;">• <strong>${ex.nome}</strong> (${ex.series.length} séries)</div>`).join('')}
            </div>
        `;
        
        card.querySelector('.btn-edit').addEventListener('click', () => onEdit(treino));
        card.querySelector('.btn-delete').addEventListener('click', () => onDelete(treino.id));
        
        container.appendChild(card);
    });
}
