// Salvar no localStorage e ir para lista
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("despesa-form");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const descricao = document.getElementById("descricao").value;
            const vencimento = document.getElementById("vencimento").value;
            const valor = parseFloat(document.getElementById("valor").value);

            let despesas = JSON.parse(localStorage.getItem("despesas")) || [];

            const editIndex = localStorage.getItem("editIndex");
            if (editIndex !== null && editIndex !== undefined) {
                despesas[editIndex] = { descricao, vencimento, valor };
                localStorage.removeItem("editIndex");
                localStorage.removeItem("editData");
            } else {
                despesas.push({ descricao, vencimento, valor });
            }

            localStorage.setItem("despesas", JSON.stringify(despesas));
            window.location.href = "despesas.html";
        });
    }

    const lista = document.getElementById("lista-despesas");
    if (lista) {
        let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
        let total = 0;

        const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

        lista.innerHTML = "";
        despesas.forEach((d, index) => {
            total += Number(d.valor) || 0;

            const linha = document.createElement("tr");

            linha.innerHTML = `
    <td>${d.descricao}</td>
    <td class="valor">${fmt.format(Number(d.valor) || 0)}</td>
    <td>${new Date(d.vencimento).toLocaleDateString('pt-BR')}</td>
    <td>
        <div class="botoes-acao">
            <button class="editar" onclick="editarDespesa(${index})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="excluir" onclick="excluirDespesa(${index})">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    </td>
`;
            lista.appendChild(linha);
        });

        document.getElementById("total").innerText = "Total: " + fmt.format(total);
    }
});

// Função excluir
function excluirDespesa(index) {
    let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
    despesas.splice(index, 1);
    localStorage.setItem("despesas", JSON.stringify(despesas));
    location.reload();
}

// Função editar
function editarDespesa(index) {
    let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
    let despesa = despesas[index];

    localStorage.setItem("editIndex", index);
    localStorage.setItem("editData", JSON.stringify(despesa));
    window.location.href = "index.html";
}

// Preencher formulário ao editar
document.addEventListener("DOMContentLoaded", () => {
    const editData = localStorage.getItem("editData");
    const editIndex = localStorage.getItem("editIndex");

    if (editData && editIndex !== null) {
        const despesa = JSON.parse(editData);
        if (document.getElementById("descricao")) {
            document.getElementById("descricao").value = despesa.descricao;
            document.getElementById("vencimento").value = despesa.vencimento;
            document.getElementById("valor").value = despesa.valor;

            const btn = document.querySelector('button[type="submit"]');
            if (btn) btn.textContent = "Salvar";
        }
    }
});

// Funções do modal
function limparDespesas() {
    document.getElementById('modal-confirm').style.display = 'flex';
}

function confirmLimpar(confirmado) {
    document.getElementById('modal-confirm').style.display = 'none';
    if (confirmado) {
        localStorage.removeItem("despesas");
        location.reload();
    }
}