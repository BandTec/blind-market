// Colocando a função dentro de uma variavel
const navSlide = function () {
  // Criando variaveis que irão receber uma classe do html da pagina
  // querySelector irá selecionar o que foi pedido no caso a seguir a classe burger
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-links li");
  const navLinksA = document.querySelectorAll(".nav-links a[href^='#']");

  // Adicionando um evento ao botão burger
  burger.addEventListener("click", function() {
    //Colocando a classe como invisivél
    nav.classList.toggle("nav-active");

    // Selecionando todos os li que estão dentro de navLinks
    navLinks.forEach(function(link, index) {
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 +
          0.4}s`;
      }
    });
  });

  // Suavizando o scroll da pagina
  // Selecionando todos os links(todos os li>a)
  navLinksA.forEach(
    function (item) {
      // Criando um evento ao ser clicado e chamando uma function
      item.addEventListener('click', scrollToIdOnClick);
    }
  );

  // Function para dar um certo espaço nos elementos alvo
  // Uma vez que, o nosso nav é fixo, então os elementos podem se sobrepor caso eu não
  // tenha criado essa função
  function scrollToIdOnClick(event) {
    event.preventDefault();
    // passando e pegando o conteudo de uma function para uma variavél
    const to = getScrollTopByHref(event.target) - 80;

    // Chamando uma function dentro de uma function
    scrollToPosition(to)
  }

  //Função responsavél por dar o scroll para o taget
  function scrollToPosition(to) {
    window.scroll({
      top: to,
      // Dizendo qual o comportamento do scroll
      behavior: 'smooth'
    })
  }

  // Pegando o valor do href
  function getScrollTopByHref(element) {
    const id = element.getAttribute('href')
    // retornando o valor
    return document.querySelector(id).offsetTop;
  }

};


function calcular_lucro() {
  // calcula o aumento de clientes mensais a mais (3.5% da população)
  var clientes_mensais_mais = Number(clientes_mensais.value * 0.035).toFixed(0);

  // calcula o número de clientes anuais a mais multiplicando o número de cliente por 12 
  // calcula o lucro mensal que é o lucro anterior mais o gasto dos clientes mensais a mais
  var lucro_mensal_total = Number(lucro_mensal.value) + Number(clientes_mensais_mais * 100 * 2);
  mensagem1.innerHTML = clientes_mensais_mais;
  mensagem2.innerHTML = lucro_mensal_total.toFixed(2);
}

function enviar_mensagem()
{
 var nome = nome_e.value;
 var email = email_e.value;
 var empresa = empresa_e.value;
 var mensagem = mensagem_e.value; 

  if(nome == "" || email == "" || empresa == "" || mensagem == "")
  {
    alert('Preencha todos os campos!')
  }
  else
  {
    alert('Mensagem enviada!')
  }
}

// Chamando function
navSlide();