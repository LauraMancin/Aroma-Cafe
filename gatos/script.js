const botao = document.getElementById('botao')
botao.addEventListener('click', autentificacao)

function autentificacao(){
    let name = document.getElementById('name')
    let last = document.getElementById('last')
    let email = document.getElementById('email')
    let date = document.getElementById('date')

    if(name.value.length == 0 || last.value.length == 0 || email.value.length == 0 || date. value.length == 0){
        alert('[ERRO] Preencha os dados corretamente!')
    }
    else{
        alert('Perfeito! Sua reserva já foi solicitada, logo um e-mail de confirmação chegará para você, até logo!')
    }
}