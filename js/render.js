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
        card.className = "card-historico";
        card.style = "background: #151515; border-left: 4px solid #e50914; border-radius: 6px; padding: 16px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);";
        
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 12px; border-bottom: 1px solid #252525; padding-bottom: 10px;">
                <div>
                    <h3 style="margin: 0 0 4px 0; color: #fff; font-size: 17px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${treino.treino} <span style="color: #e50914; font-size: 14px; margin-left: 5px;">• Semana ${treino.semanaNum || treino.semana}</span>
                    </h3>
                    <p style="margin: 0; font-size: 12px; color: #888; font-weight: 500;">
                        📅 ${treino.dataStr || treino.dataTreino} ${treino.faseDescricao ? ` | 🏷️ ${treino.faseDescricao}` : ''}
                    </p>
                </div>
                <div style="display:flex; gap: 8px;">
                    <button class="btn-edit" style="background: #252525; color: #fff; border: 1px solid #333; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; transition: background 0.2s;">Editar</button>
                    <button class="btn-delete" style="background: rgba(229, 9, 20, 0.1); color: #ff4d4d; border: 1px solid rgba(229, 9, 20, 0.3); padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; transition: background 0.2s;">Excluir</button>
                </div>
            </div>
            
            <div class="card-exercicios-lista" style="font-size: 13px; color: #ddd; display: flex; flex-direction: column; gap: 8px;">
                ${treino.exercicios.map(ex => `
                    <div style="background: #1c1c1c; padding: 8px 12px; border-radius: 4px; border: 1px solid #222;">
                        <div style="color: #fff; font-weight: 600; margin-bottom: 4px;">💪 ${ex.nome}</div>
                        <div style="font-size: 12px; color: #aaa; padding-left: 14px;">
                            ${ex.series.map((s, idx) => `
                                <div style="margin-bottom: 2px;">
                                    Série ${idx + 1} (${s.tipo}): 
                                    ${s.placas ? `<strong>${s.placas} Placas</strong>` : ''} 
                                    ${s.placas && s.carga ? ' / ' : ''} 
                                    ${s.carga ? `<strong>${s.carga} kg</strong>` : ''} 
                                    → <span style="color: #e50914; font-weight: 600;">${s.reps} Reps</span>
                                </div>
                            `).join('')}
                            ${ex.feedback ? `<div style="margin-top: 4px; color: #e50914; font-style: italic; font-size: 11px;">💬 ${ex.feedback}</div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>

            ${treino.notasGerais ? `
                <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #252525; font-size: 12px; color: #aaa; font-style: italic;">
                    📝 <strong>Notas Gerais:</strong> ${treino.notasGerais}
                </div>
            ` : ''}
        `;
        
        card.querySelector('.btn-edit').addEventListener('click', () => onEdit(treino));
        card.querySelector('.btn-delete').addEventListener('click', () => onDelete(treino.id));
        
        container.appendChild(card);
    });
}
