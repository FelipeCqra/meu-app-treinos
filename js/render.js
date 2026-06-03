const exerciciosGerais = [
    "--- ABDÔMEN ---", "Abdominal supra máquina", "Abdominal infra máquina", "Canoinha isometria",
    "--- AQUECIMENTO / PREVENÇÃO ---", "Aquecimento manguito", "Liberação do Trapézio com bolinha", "Child's pose e variação", "Wall slides", "Rotação torácica"
];

export const dbExercicios = {
    "UPPER": [
        "--- PEITO ---", "Supino inclinado articulado", "Supino reto máquina", "Fly máquina",
        "--- COSTAS ---", "Remada T-bar aberta", "Puxador bilateral", "Remada baixa máquina apoio de peito", "Remada T-bar fechada", "Puxador aberto romano", "Puxador fechado romano", "Puxador aberto pronado", "Extensão lombar no banco romano",
        "--- OMBRO ---", "Elevação lateral máquina sentado", "Elevação lateral unilateral cabo", "Elevação lateral em pé máquina",
        "--- BÍCEPS ---", "Rosca unilateral cabo", "Rosca Scott", "Rosca martelo corda", "Rosca martelo halter",
        "--- TRÍCEPS ---", "Tríceps pulley encostado", "Tríceps pulley", "Tríceps testa halter"
    ].concat(exerciciosGerais),
    "LOWER": [
        "--- QUADRÍCEPS ---", "Cadeira extensora", "Leg horizontal unilateral", "Hack machine ou agachamento máquina", "Hack machine", "Leg 45", "Agachamento smith", "Agachamento máquina", "Cadeira adutora",
        "--- POSTERIOR ---", "Mesa flexora unilateral", "Cadeira flexora unilateral", "Mesa flexora", "Cadeira flexora", "Stiff", "Flexor em pé unilateral", "Extensão lombar no banco romano", "Cadeira abdutora",
        "--- PANTURRILHA ---", "Panturrilha leg horizontal", "Panturrilha sentado", "Panturrilha em pé unilateral livre"
    ].concat(exerciciosGerais),
    "PUSH": [
        "--- PEITO ---", "Supino inclinado articulado", "Supino reto máquina", "Fly máquina",
        "--- OMBRO ---", "Elevação lateral máquina sentado", "Elevação lateral unilateral cabo", "Elevação lateral em pé máquina",
        "--- TRÍCEPS ---", "Tríceps pulley encostado", "Tríceps pulley", "Tríceps testa halter"
    ].concat(exerciciosGerais),
    "PULL": [
        "--- COSTAS ---", "Remada T-bar aberta", "Puxador bilateral", "Remada baixa máquina apoio de peito", "Remada T-bar fechada", "Puxador aberto romano", "Puxador fechado romano", "Puxador aberto pronado", "Extensão lombar no banco romano",
        "--- BÍCEPS ---", "Rosca unilateral cabo", "Rosca Scott", "Rosca martelo corda", "Rosca martelo halter"
    ].concat(exerciciosGerais),
    "LEGS": [
        "--- QUADRÍCEPS ---", "Cadeira extensora", "Leg horizontal unilateral", "Hack machine ou agachamento máquina", "Hack machine", "Leg 45", "Agachamento smith", "Agachamento máquina", "Cadeira adutora",
        "--- POSTERIOR ---", "Mesa flexora unilateral", "Cadeira flexora unilateral", "Mesa flexora", "Cadeira flexora", "Stiff", "Flexor em pé unilateral", "Extensão lombar no banco romano", "Cadeira abdutora",
        "--- PANTURRILHA ---", "Panturrilha leg horizontal", "Panturrilha sentado", "Panturrilha em pé unilateral livre"
    ].concat(exerciciosGerais)
};

export function obterOpcoesDeExercicios(membro) {
    const lista = dbExercicios[membro] || [];
    let optionsHTML = '<option value="" disabled selected>Selecione um exercício...</option>';
    
    lista.forEach(ex => {
        if (ex.startsWith("---")) {
            optionsHTML += `<option disabled style="font-weight:bold; color:#ff2a2a; background: #222;">${ex}</option>`;
        } else {
            optionsHTML += `<option value="${ex}">${ex}</option>`;
        }
    });
    return optionsHTML;
}

export function renderNovaLinhaExercicio(container, membro = "UPPER") {
    const block = document.createElement('div');
    block.className = 'exercise-block';
    block.style = "background: #111; border: 1px solid #222; border-radius: 8px; padding: 15px; margin-bottom: 20px; position: relative;";
    
    block.innerHTML = `
        <button type="button" class="btn-remove" style="position: absolute; top: 12px; right: 15px; background: transparent; color: #ff2a2a; border: 1px solid #ff2a2a; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">❌ Remover Exercício</button>
        
        <div class="form-group" style="margin-bottom: 12px; width: 75%;">
            <label style="display:block; font-size:13px; color:#aaa; margin-bottom:5px;">Exercício</label>
            <select class="ex-name" style="width:100%; padding:8px; background:#161616; color:#fff; border:1px solid #333; border-radius:4px;">
                ${obterOpcoesDeExercicios(membro)}
            </select>
        </div>
        
        <div class="sets-wrapper" style="margin-top: 15px;">
            <div class="sets-container"></div>
            <button type="button" class="btn-add-set" style="margin-top: 8px; background: #222; color: #ccc; border: 1px dashed #444; padding: 12px; border-radius: 4px; cursor: pointer; font-size: 14px; width: 100%; font-weight: bold; text-transform: uppercase;">+ Adicionar Série</button>
        </div>
        
        <div class="form-group" style="margin-top: 15px;">
            <label style="display:block; font-size:13px; color:#aaa; margin-bottom:5px;">Feedback Específico do Exercício</label>
            <textarea class="ex-feedback" rows="2" placeholder="Sensação muscular, biomecânica..." style="width:100%; padding:8px; background:#161616; color:#fff; border:1px solid #333; border-radius:4px; resize:vertical; font-size:13px;"></textarea>
        </div>
    `;

    block.querySelector(".btn-remove").addEventListener("click", () => block.remove());
    const setsContainer = block.querySelector(".sets-container");
    block.querySelector(".btn-add-set").addEventListener("click", () => renderNovaSerie(setsContainer));
    renderNovaSerie(setsContainer, 'Válida');
    container.appendChild(block);
}

export function renderNovaSerie(setsContainer, defaultType = 'Ajuste') {
    const row = document.createElement('div');
    row.className = 'sets-row dynamic-set';
    
    // LAYOUT MOBILE EMPILHADO (A Correção da Tela)
    row.style = "background: #151515; padding: 12px; border: 1px solid #2a2a2a; border-radius: 6px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px;";
    
    row.innerHTML = `
        <select class="set-type" style="padding: 8px; background: #1a1a1a; color: #fff; border: 1px solid #333; border-radius: 4px; font-size:14px; width: 100%;">
            <option value="Aquecimento" ${defaultType === 'Aquecimento' ? 'selected' : ''}>Aquecimento</option>
            <option value="Ajuste" ${defaultType === 'Ajuste' ? 'selected' : ''}>Ajuste (Feeder)</option>
            <option value="Válida" ${defaultType === 'Válida' ? 'selected' : ''}>Válida (Top/Backoff)</option>
        </select>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <input type="number" class="set-placas" placeholder="Placas" min="0" style="padding: 8px; background: #1a1a1a; color: #fff; border: 1px solid #333; border-radius: 4px; font-size:14px; text-align: center;">
            <input type="number" class="set-load" placeholder="Carga (kg)" min="0" step="0.5" style="padding: 8px; background: #1a1a1a; color: #fff; border: 1px solid #333; border-radius: 4px; font-size:14px; text-align: center;">
        </div>
        <input type="text" class="set-reps" placeholder="Reps (Ex: 8-10)" style="padding: 8px; background: #1a1a1a; color: #fff; border: 1px solid #333; border-radius: 4px; font-size:14px; text-align: center; width: 100%;">
        <button type="button" class="btn-del-set" style="background: #3a1111; color: #ff4d4d; border: 1px solid #551a1a; border-radius: 4px; padding: 8px; font-weight: bold; cursor: pointer; font-size: 14px; width: 100%; text-align: center; margin-top: 4px;">X</button>
    `;
    row.querySelector(".btn-del-set").addEventListener("click", () => row.remove());
    setsContainer.appendChild(row);
}

export function renderHistoricoTreinos(treinos, container, onEdit, onDelete) {
    container.innerHTML = "";
    if (treinos.length === 0) {
        container.innerHTML = `<p style="color:#aaa; font-style:italic; text-align:center; padding: 20px;">Nenhuma sessão registrada na nuvem ainda.</p>`;
        return;
    }
    const treinosPorSemana = {};
    treinos.forEach(t => {
        const sem = t.semana || t.semanaNum || 1;
        if (!treinosPorSemana[sem]) treinosPorSemana[sem] = [];
        treinosPorSemana[sem].push(t);
    });
    const semanasOrdenadas = Object.keys(treinosPorSemana).sort((a, b) => b - a);

    semanasOrdenadas.forEach(sem => {
        const semDiv = document.createElement('div');
        semDiv.innerHTML = `<div class="semana-header" style="background: #161616; padding: 8px 12px; font-weight: bold; color: #ff2a2a; border-left: 4px solid #ff2a2a; margin-top: 25px; margin-bottom: 12px; font-size:14px; letter-spacing:1px;">SEMANA ${sem}</div>`;
        const treinosDaSemana = treinosPorSemana[sem].sort((a, b) => b.dataMilisegundos - a.dataMilisegundos);

        treinosDaSemana.forEach(sessao => {
            const card = document.createElement('div');
            card.className = 'card card-highlight';
            card.style = "background: #0d0d0d; border: 1px solid #222; border-radius: 6px; padding: 16px; margin-bottom: 15px; position: relative;";

            let htmlExercicios = "";
            if (sessao.exercicios && Array.isArray(sessao.exercicios)) {
                sessao.exercicios.forEach(ex => {
                    let htmlSeries = "";
                    if (ex.series && Array.isArray(ex.series)) {
                        ex.series.forEach((s, index) => {
                            let badgeStyle = "background: #1b263b; border: 1px solid #2e4057; color: #8ecae6;";
                            if (s.tipo === "Ajuste") badgeStyle = "background: #3e2723; border: 1px solid #5d4037; color: #ffb703;";
                            if (s.tipo === "Válida") badgeStyle = "background: #143622; border: 1px solid #1e5533; color: #2ec4b6;";

                            let infoPeso = [];
                            if (s.placas) infoPeso.push(`${s.placas} Placas`);
                            if (s.carga) infoPeso.push(`${s.carga}kg`);
                            let strPeso = infoPeso.length > 0 ? infoPeso.join(' / ') : "Sem peso";

                            htmlSeries += `
                                <div class="set-badge" style="display:flex; justify-content:space-between; align-items:center; padding:5px 10px; margin-bottom:4px; border-radius:4px; font-size:12px; font-family:monospace; ${badgeStyle}">
                                    <span>${index + 1}. ${s.tipo}</span>
                                    <span>${strPeso} | <b>${s.reps} Reps</b></span>
                                </div>`;
                        });
                    }
                    htmlExercicios += `
                        <div class="logged-ex" style="background:#121212; border:1px solid #1c1c1c; padding:10px; border-radius:5px; margin-bottom:10px;">
                            <div class="logged-ex-title" style="font-weight:bold; color:#fff; margin-bottom:6px; font-size:14px;">🏋️ ${ex.nome}</div>
                            <div class="set-badge-group">${htmlSeries}</div>
                            ${ex.feedback ? `<p style="font-size:12px; color:#999; font-style:italic; margin-top:6px; border-top:1px dashed #222; padding-top:4px;">↳ ${ex.feedback}</p>` : ''}
                        </div>`;
                });
            }

            card.innerHTML = `
                <div class="card-actions" style="position: absolute; top: 12px; right: 12px; display:flex; gap:6px;">
                    <button class="btn-action-edit" data-id="${sessao.id}" style="background:#1a1a1a; color:#fff; border:1px solid #333; padding:3px 8px; border-radius:4px; cursor:pointer; font-size:11px;">✏️ Editar</button>
                    <button class="btn-action-del" data-id="${sessao.id}" style="background:#1a1a1a; color:#ff2a2a; border:1px solid #333; padding:3px 8px; border-radius:4px; cursor:pointer; font-size:11px;">🗑️ Excluir</button>
                </div>
                <h3 style="font-size:16px; font-weight:bold; color:#fff; margin-bottom:12px; padding-right:130px;">${sessao.treino} 
                    <span style="background:#161616; padding:2px 8px; border-radius:12px; margin-left:8px; border:1px solid #ff2a2a; color:#fff; font-size:11px;">${sessao.dataStr}</span>
                    ${sessao.faseDescricao ? `<span style="color:#888; font-size:12px; font-weight:normal; margin-left:8px; font-style:italic;">🏷️ ${sessao.faseDescricao}</span>` : ''}
                </h3>
                <div style="margin-top: 10px;">${htmlExercicios}</div>
                ${sessao.notasGerais ? `<div class="feedback-block" style="background:#141414; border-left:3px solid #ff2a2a; padding:8px; border-radius:4px; margin-top:8px;"><div class="feedback-title" style="font-weight:bold; font-size:12px; color:#ff2a2a; margin-bottom:2px;">📝 Percepção Geral do Treino</div><div style="font-size:12px; color:#bbb;">${sessao.notasGerais.replace(/\n/g, '<br>')}</div></div>` : ''}
            `;
            card.querySelector(".btn-action-edit").addEventListener("click", () => onEdit(sessao));
            card.querySelector(".btn-action-del").addEventListener("click", () => onDelete(sessao.id));
            semDiv.appendChild(card);
        });
        container.appendChild(semDiv);
    });
}
