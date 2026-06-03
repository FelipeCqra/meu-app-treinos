import { salvarTreino, atualizarTreino, deletarTreinoDoBanco, buscarTodosOsTreinos } from "./crud.js";
import { renderNovaLinhaExercicio, renderHistoricoTreinos, obterOpcoesDeExercicios } from "./render.js";

let editingDocId = null;

window.switchTab = function(tabId) {
    const tabs = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");
    contents.forEach(c => c.classList.remove("active"));
    tabs.forEach(t => t.classList.remove("active"));
    
    const targetContent = document.getElementById(tabId);
    if (targetContent) targetContent.classList.add("active");
    
    tabs.forEach(btn => {
        const clickAttr = btn.getAttribute("onclick") || "";
        if (clickAttr.includes(tabId) || btn.getAttribute("data-tab") === tabId) {
            btn.classList.add("active");
        }
    });
};

function definirDataHoje() {
    const hoje = new Date();
    const yyyy = hoje.getFullYear();
    let mm = hoje.getMonth() + 1;
    let dd = hoje.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const inputData = document.getElementById('treinoData');
    if (inputData) inputData.value = `${yyyy}-${mm}-${dd}`;
}

async function atualizarHistorico() {
    const container = document.getElementById("meusTreinosSemanas");
    if (!container) return;
    await buscarTodosOsTreinos((listaTreinos) => {
        renderHistoricoTreinos(listaTreinos, container, iniciarEdicao, deletarTreino);
    });
}

function obterMembroAtual() {
    const selectTreino = document.getElementById('workoutType');
    if (!selectTreino) return "UPPER";
    const valorSelect = selectTreino.value ? selectTreino.value.toUpperCase() : "";
    let dataMembro = "";
    if (selectTreino.selectedIndex !== -1) {
        const optionSelecionada = selectTreino.options[selectTreino.selectedIndex];
        dataMembro = optionSelecionada.getAttribute('data-membro') ? optionSelecionada.getAttribute('data-membro').toUpperCase() : "";
    }
    const chavesValidas = ["UPPER", "LOWER", "PUSH", "PULL", "LEGS"];
    if (chavesValidas.includes(valorSelect)) return valorSelect;
    if (chavesValidas.includes(dataMembro)) return dataMembro;
    return "UPPER";
}

function iniciarEdicao(sessao) {
    editingDocId = sessao.id;
    document.getElementById('tituloRegistro').textContent = "✏️ Editando Registro de Treino";
    document.getElementById('btnSubmitForm').textContent = "Atualizar Treino (Modo Edição)";
    document.getElementById('btnCancelEdit').style.display = "block";

    document.getElementById('semanaNum').value = sessao.semana || sessao.semanaNum || 1;
    document.getElementById('faseDescricao').value = sessao.faseDescricao || "";
    document.getElementById('treinoData').value = sessao.dataTreino || "";
    document.getElementById('workoutType').value = sessao.treino;
    document.getElementById('generalNotes').value = sessao.notasGerais || "";

    const container = document.getElementById('exercisesContainer');
    container.innerHTML = "";
    const membro = obterMembroAtual();

    if (sessao.exercicios && Array.isArray(sessao.exercicios)) {
        sessao.exercicios.forEach(ex => {
            renderNovaLinhaExercicio(container, membro);
            const linhaCriada = container.lastElementChild;
            const selectName = linhaCriada.querySelector(".ex-name");
            if (selectName) selectName.value = ex.nome;
            const feedbackTextarea = linhaCriada.querySelector(".ex-feedback");
            if (feedbackTextarea) feedbackTextarea.value = ex.feedback || "";
            const setsContainer = linhaCriada.querySelector(".sets-container");
            setsContainer.innerHTML = ""; 

            if (ex.series && Array.isArray(ex.series)) {
                ex.series.forEach(s => {
                    const row = document.createElement('div');
                    row.className = 'sets-row dynamic-set';
                    // Estilização idêntica ao modelo antigo
                    row.style = "background: #111; padding: 12px; border: 1px solid #222; border-radius: 6px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px;";
                    row.innerHTML = `
                        <select class="set-type" style="padding: 8px; background: #1a1a1a; color: #fff; border: 1px solid #333; border-radius: 4px; font-size:14px; width: 100%;">
                            <option value="Aquecimento" ${s.tipo === 'Aquecimento' ? 'selected' : ''}>Aquecimento</option>
                            <option value="Ajuste" ${s.tipo === 'Ajuste' ? 'selected' : ''}>Ajuste (Feeder)</option>
                            <option value="Válida" ${s.tipo === 'Válida' ? 'selected' : ''}>Válida (Top/Backoff)</option>
                        </select>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <input type="number" class="set-placas" placeholder="Placas" min="0" value="${s.placas || ''}" style="padding: 8px; background: #1a1a1a; color: #fff; border: 1px solid #333; border-radius: 4px; font-size:14px; text-align: center;">
                            <input type="number" class="set-load" placeholder="Carga (kg)" min="0" step="0.5" value="${s.carga || ''}" style="padding: 8px; background: #1a1a1a; color: #fff; border: 1px solid #333; border-radius: 4px; font-size:14px; text-align: center;">
                        </div>
                        <input type="text" class="set-reps" placeholder="Reps (Ex: 8-10)" value="${s.reps || ''}" style="padding: 8px; background: #1a1a1a; color: #fff; border: 1px solid #333; border-radius: 4px; font-size:14px; text-align: center; width: 100%;">
                        <button type="button" class="btn-del-set" style="background: #3a1111; color: #ff4d4d; border: 1px solid #551a1a; border-radius: 4px; padding: 6px; font-weight: bold; cursor: pointer; font-size: 14px; width: 100%; text-align: center; margin-top: 4px;">X</button>
                    `;
                    row.querySelector(".btn-del-set").addEventListener("click", () => row.remove());
                    setsContainer.appendChild(row);
                });
            }
        });
    }
    window.switchTab('registrar');
}

async function deletarTreino(docId) {
    if (confirm("Tem certeza absoluta que deseja excluir este treino permanentemente da nuvem?")) {
        try {
            await deletarTreinoDoBanco(docId);
            alert("Treino excluído com sucesso!");
            atualizarHistorico();
        } catch (error) {
            alert("Erro ao excluir o treino: " + error.message);
        }
    }
}

function resetarModoFormulario() {
    editingDocId = null;
    const form = document.getElementById('trainingForm');
    if (form) form.reset();
    definirDataHoje();
    document.getElementById('tituloRegistro').textContent = "Montar Sessão de Treino";
    document.getElementById('btnSubmitForm').textContent = "Salvar Sessão Completa na Semana";
    document.getElementById('btnCancelEdit').style.display = "none";
    const container = document.getElementById('exercisesContainer');
    if (container) {
        container.innerHTML = "";
        renderNovaLinhaExercicio(container, obterMembroAtual());
    }
}

function cancelarEdicao() {
    if (confirm("Deseja cancelar a edição atual? Todas as alterações serão perdidas.")) {
        resetarModoFormulario();
        window.switchTab('feedback');
    }
}

async function handleFormSubmit(e) {
    if (e) e.preventDefault();

    const semanaInput = document.getElementById('semanaNum').value;
    const semanaNum = parseInt(semanaInput);
    const faseDescricao = document.getElementById('faseDescricao').value;
    const rawDate = document.getElementById('treinoData').value;
    const workout = document.getElementById('workoutType').value;
    const generalNotes = document.getElementById('generalNotes').value;

    if (!semanaInput || semanaNum < 1) {
        alert("Por favor, insira um número de semana válido (maior ou igual a 1)!");
        return;
    }

    if (!rawDate) { 
        alert("Por favor, selecione a data do treino!"); 
        return; 
    }

    const parts = rawDate.split('-');
    const dataStrFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`; 
    const timestampMilisegundos = new Date(parts[0], parts[1] - 1, parts[2]).getTime();

    const exerciseBlocks = document.querySelectorAll('.exercise-block');
    const exerciciosRealizados = [];
    let erroValidacao = false;

    exerciseBlocks.forEach(block => {
        const name = block.querySelector('.ex-name').value;
        if (!name || name === "") {
            alert("Por favor, selecione o nome do exercício em todas as caixas criadas!");
            erroValidacao = true;
            return;
        }

        const setRows = block.querySelectorAll('.dynamic-set');
        const seriesExtraidas = [];
        
        setRows.forEach(row => {
            const reps = row.querySelector('.set-reps').value.trim();
            if(!reps) {
                alert(`Por favor, preencha as repetições para o exercício: "${name}"`);
                erroValidacao = true;
                return;
            }

            seriesExtraidas.push({
                tipo: row.querySelector('.set-type').value,
                placas: row.querySelector('.set-placas').value,
                carga: row.querySelector('.set-load').value,
                reps: reps
            });
        });

        if (seriesExtraidas.length === 0) {
            alert(`Por favor, adicione pelo menos 1 série para o exercício "${name}"!`);
            erroValidacao = true;
            return;
        }

        const feedbackVal = block.querySelector('.ex-feedback').value;
        exerciciosRealizados.push({ 
            nome: name, 
            series: seriesExtraidas, 
            feedback: feedbackVal 
        });
    });

    if (erroValidacao) return;

    if (exerciciosRealizados.length === 0) { 
        alert("Adicione pelo menos 1 exercício válido para salvar!"); 
        return; 
    }

    const sessaoCompleta = {
        semana: semanaNum,
        semanaNum: semanaNum, 
        faseDescricao: faseDescricao, 
        dataTreino: rawDate, 
        dataStr: dataStrFormatada, 
        dataMilisegundos: timestampMilisegundos,
        treino: workout, 
        notasGerais: generalNotes, 
        exercicios: exerciciosRealizados
    };

    const btnSalvar = document.getElementById('btnSubmitForm');
    btnSalvar.textContent = "Salvando na nuvem...";
    btnSalvar.disabled = true;

    try {
        if (editingDocId) {
            await atualizarTreino(editingDocId, sessaoCompleta);
            alert("Treino atualizado com sucesso!");
        } else {
            await salvarTreino(sessaoCompleta);
            alert("Treino guardado com sucesso!");
        }
        resetarModoFormulario();
        await atualizarHistorico();
        window.switchTab('feedback');
        
    } catch (error) {
        alert("Erro na operação: " + error.message);
    } finally {
        btnSalvar.disabled = false;
        btnSalvar.textContent = editingDocId ? "Atualizar Treino (Modo Edição)" : "Salvar Sessão Completa na Semana";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    definirDataHoje();

    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab") || (btn.getAttribute("onclick") && btn.getAttribute("onclick").match(/'([^']+)'/)[1]);
            if (targetTab) window.switchTab(targetTab);
        });
    });

    const container = document.getElementById('exercisesContainer');
    const btnCancelEdit = document.getElementById('btnCancelEdit');
    const btnAddExercise = document.querySelector("#registrar .btn-add") || document.querySelector(".btn-add");
    const workoutTypeInput = document.getElementById('workoutType');

    if (workoutTypeInput) {
        workoutTypeInput.addEventListener("change", () => {
            const novoMembro = obterMembroAtual();
            const selects = document.querySelectorAll(".ex-name");
            selects.forEach(select => {
                const valorAtual = select.value;
                select.innerHTML = obterOpcoesDeExercicios(novoMembro);
                if (Array.from(select.options).some(o => o.value === valorAtual)) {
                    select.value = valorAtual;
                }
            });
        });
    }

    if (btnAddExercise && container) {
        btnAddExercise.addEventListener("click", () => {
            renderNovaLinhaExercicio(container, obterMembroAtual());
        });
    }

    if (btnCancelEdit) btnCancelEdit.addEventListener("click", cancelarEdicao);
    
    const btnSalvar = document.getElementById('btnSubmitForm');
    if (btnSalvar) {
        btnSalvar.setAttribute("type", "button"); 
        btnSalvar.addEventListener("click", handleFormSubmit);
    }
    
    if (container && container.children.length === 0) {
        renderNovaLinhaExercicio(container, obterMembroAtual());
    }

    atualizarHistorico();
});
