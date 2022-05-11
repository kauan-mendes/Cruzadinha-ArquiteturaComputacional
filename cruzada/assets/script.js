
/*
	      PALAVRAS CRUZADAS
	----------------------------
	Desenvolvido em CoffeeScript

		Código: Fabiane Lima
        Arte: Eduardo Stumpf
 */

(function() {
  $(function() {
    var acertos, count, dicas, fase, func, gameOn, inter, letter, letterClass, paused, tempo, word;
    tempo = 60;
    acertos = 0;
    paused = false;
    gameOn = false;
    word = [];
    letter = '';
    letterClass = '';
    count = 0;
    fase = 0;
    inter = null;
    dicas = ['<h2>Dica</h2><p>A marca ou produto é posicionado como líder em relação a __________ ou resultados para os clientes, como economia de tempo, redução de custo, conveniência ou melhoria de resultados.</p>', '<h2>Dica</h2><p>O posicionamento comunica que a marca ou produto é a que oferece aos consumidores potenciais a melhor relação ______ versus _________ ou o melhor valor.</p>', '<h2>Dica</h2><p>A performance das características específicas da marca ou do produto, tais como padrão de qualidade, competência do pessoal, criatividade, grau de flexibilidade ou condição de entrega.</p>', '<h2>Dica</h2><p>O produto ou marca é posicionado para uma categoria de _______ específica, como para professores universitários, associações de serviços ou indústrias de confecção de vestuário.</p>', '<h2>Dica</h2><p>O produto é posicionado como líder em uma _________ __ ________ determinada, como um parque temático de recreação ou serviços de atendimento médico.</p>', '<h2>Dica</h2><p>A marca ou produto é comparado como melhor em relação ao ___________, como a empresa mais comprometida com os clientes ou empresa mais premiada.</p>', '<h2>Dica</h2><p>Apresenta o produto como sendo o melhor para uma dada ocasião de ___ ou _________, como para épocas de demanda baixa ou situações de vendas decrescentes.</p>'];
    func = {
      dismiss: function() {
        paused = false;
        return $('.modal, .fade').fadeOut();
      },
      help: function() {
        paused = true;
        $('.modal').html('<h1>Ajuda</h1><p>Clique no botão ‘COMEÇAR’ para iniciar o jogo. Clique na seta para ver a DICA. Você terá um tempo para responder cada afirmativa.</p><button class="ok">OK</button>');
        return $('.modal, .fade').fadeIn();
      },
      arrow: function(arr) {
        $('.hint').html(dicas[arr - 1]);
        $('.l').css({
          border: '2px solid #999',
          opacity: '0.6',
          cursor: 'auto'
        });
        $('.l').removeClass('current');
        $('.w' + arr).addClass('current');
        $('.w' + arr).css({
          border: '2px solid #6e4e94',
          opacity: '1',
          cursor: 'pointer'
        });
        $('.a, .p' + arr).css('pointer-events', 'none');
        $('.p' + arr).removeClass('a');
        $('.w' + arr).each(function() {
          return word.push($(this).html());
        });
        $('.w' + arr).each(function() {
          if ($(this).hasClass('y')) {
            return count++;
          }
        });
        return func.cron();
      },
      cron: function() {
        fase++;
        tempo = 60;
        gameOn = true;
        return inter = setInterval(function() {
          if (paused !== true) {
            tempo--;
            $('.timer').html(tempo);
            if (tempo <= 0) {
              tempo = 0;
              count = 0;
              word = [];
              gameOn = false;
              clearInterval(inter);
              func.feedbackFinal();
              $('.timer').html(tempo);
              $('.a').css('pointer-events', 'auto');
              $('.modal').html('<h2>Acabou o tempo</h2><p>Não sobrou tempo para adivinhar essa palavra. Clique no botão abaixo para continuar a jogar</p><button class="ok">OK</button>');
              $('.modal, .fade').fadeIn();
              return $('.hint').html('<h2>Mais sorte da próxima vez!</h2><p>Parece que não deu tempo de você adivinhar essa palavra. Clique em outra seta para continuar jogando.</p>');
            }
          }
        }, 1000);
      },
      entreLetra: function(letra, classe) {
        if (gameOn === true) {
          if (classe.split(' ').pop() === 'current') {
            letter = letra;
            letterClass = classe.slice(5, 10);
            $('.modal').html('<h2>Letra</h2><p>Digite a letra correspondente ao quadro clicado no campo abaixo:</p><input type="text" maxlength="1" class="val"></input><br/><button class="verify">Enviar</button>');
            $('.modal, .fade').fadeIn();
            return $('.val').focus();
          }
        }
      },
      verify: function(val) {
        paused = false;
        $('.modal,.fade').fadeOut();
        if (letter === val) {
          $('.' + letterClass).addClass('y');
          $('.' + letterClass).css({
            background: '#6e4e94',
            pointerEvents: 'none'
          });
          count++;
          return func.feedbackWord();
        } else {
          return setTimeout(function() {
            $('.modal').html('<h2>Letra errada</h2><p>Tente novamente!</p>');
            return $('.modal, .fade').fadeIn().delay(2000).fadeOut();
          }, 100);
        }
      },
      feedbackWord: function() {
        if (word.length === count) {
          clearInterval(inter);
          acertos++;
          count = 0;
          word = [];
          tempo = 0;
          $('.a').css('pointer-events', 'auto');
          setTimeout(function() {
            if (fase === 1) {
              $('.modal').html('<h2>Palavra correta</h2><p>Parabéns, você acertou 1 palavra!</p>');
            } else {
              $('.modal').html('<h2>Palavra correta</h2><p>Parabéns, você acertou ' + acertos + ' palavras!</p>');
            }
            $('.modal, .fade').fadeIn().delay(2000).fadeOut();
            return $('.hint').html('<h2>Muito bem!</h2><p>Você acertou uma das palavras. Agora clique em outra seta e continue a jogar.</p>');
          }, 500);
        }
        return func.feedbackFinal();
      },
      feedbackFinal: function() {
        if (fase > 7) {
          fase = 7;
        }
        if (fase === 7) {
          if (tempo === 0) {
            return setTimeout(function() {
              $('.modal').html('<h2>Fim de jogo</h2><p>Você acertou ' + acertos + ' palavras.</p><p>Para tentar mais uma vez, clique no botão abaixo.</p><button class="again">Jogar novamente</button>');
              $('.modal, .fade').fadeIn();
              return $('.hint').html('<h2>Fim de jogo!</h2>');
            }, 3500);
          }
        }
      }
    };
    $(document).on('click', '.start,.ok', function() {
      return func.dismiss();
    });
    $(document).on('click', '.help', function() {
      return func.help();
    });
    $(document).on('click', '.a', function() {
      return func.arrow(Number($(this).attr('class').slice(3)));
    });
    $(document).on('click', '.l', function() {
      return func.entreLetra($(this).html(), $(this).attr('class'));
    });
    $(document).on('click', '.verify', function() {
      return func.verify($('.val').val().toUpperCase());
    });
    return $(document).on('click', '.again', function() {
      return location.reload();
    });
  });

}).call(this);
