const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (typeof SpeechRecognition === "undefined") {
    alert("Este navegador não suporta o reconhecimento de fala. Tente em outro navegador.");
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Permite reconhecimento contínuo
    recognition.interimResults = true; // Habilita resultados intermediários
    recognition.lang = 'pt-BR'; // Define o idioma para português do Brasil
    let finalTranscript = "";
    let isListening = false;
    let isFullscreen = false; // Variável para controlar o estado de tela inteira

    const transcriptionDiv = document.getElementById('output');
    const play = document.getElementById('play');
    const h1 = document.createElement('p');
    // Função para adicionar texto à div com scroll para baixo
    function appendTextWithScroll(text) {
        h1.textContent = text;
        transcriptionDiv.insertBefore(h1, play);
        if (!isFullscreen) { // Rolagem somente quando não estiver em tela inteira
            scrollToBottom();
        } else {
            // Se estiver em tela cheia, reajusta a rolagem após 100ms para garantir que fique na parte de baixo
            setTimeout(scrollToBottom, 100);
        }
    }

    // Função para rolar a div para baixo
    function scrollToBottom() {
        transcriptionDiv.scrollTop = transcriptionDiv.scrollHeight;
    }


    // Variável para controlar se o usuário parou de falar manualmente
    let userStoppedSpeaking = false;

    // Evento chamado quando a fala é detectada
    recognition.onresult = (event) => {
        let interimTranscript = "";
        let previousTranscript = finalTranscript; // Armazenar o texto anterior da transcrição

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            // Exibir cada palavra individualmente
            const words = transcript.split(" ");
            words.forEach((word) => {
                if (!event.results[i].isFinal) {
                    // Se for resultado intermediário, atualizar o texto intermediário
                    interimTranscript += word + " ";
                } else {
                    // Se o resultado for final, adicionar o texto à transcrição final
                    finalTranscript += word + " ";
                    previousTranscript = finalTranscript; // Atualizar o texto anterior
                    interimTranscript = ""; // Limpar o texto intermediário
                }
            });
        }

        // Atualizar a transcrição exibida com o conteúdo anterior e o novo texto
        appendTextWithScroll(previousTranscript + interimTranscript);
    };

    const mic = document.getElementById("mic")
    const micFull = document.getElementById("micFull")
    // Adicione o evento recognition.onend do reconhecimento de fala manual pelo botão
    document.getElementById("startButton").addEventListener("click", () => {
        if (!isListening) {
            finalTranscript = "";
            recognition.start();
            isListening = true;
            mic.setAttribute("src", "images/micon.svg")
            micFull.setAttribute("src", "images/micon.svg")
            mic.setAttribute("title", "Ouvindo..")
            micFull.setAttribute("title", "Ouvindo..")

        } else {
            recognition.stop();
            isListening = false;
            mic.setAttribute("src", "images/micoff.svg")
            micFull.setAttribute("src", "images/micoff.svg")
            mic.setAttribute("title", "Parado")
            micFull.setAttribute("title", "Parado")

            if (!userStoppedSpeaking) {
                // Usuário não parou de falar manualmente, então adicionamos o texto intermediário
                finalTranscript += interimTranscript;
                appendTextWithScroll(finalTranscript);
            }
            // userStoppedSpeaking = false; // Resete a variável para a próxima fala
            interimTranscript = ""; // Limpar o texto intermediário
        }
    });



    // Adicione o evento recognition.onend do reconhecimento de fala manual pelo botão no fullScreen
    document.getElementById("startButtonfullscreen").addEventListener("click", (evt) => {
        if (!isListening) {
            finalTranscript = "";
            recognition.start();
            isListening = true;
            mic.setAttribute("src", "images/micon.svg")
            micFull.setAttribute("src", "images/micon.svg")
            mic.setAttribute("title", "Ouvindo..")
            micFull.setAttribute("title", "Ouvindo..")

        } else {
            recognition.stop();
            isListening = false;
            mic.setAttribute("src", "images/micoff.svg")
            mic.setAttribute("title", "Parado")
            micFull.setAttribute("src", "images/micoff.svg")
            micFull.setAttribute("title", "Parado")
            if (!userStoppedSpeaking) {
                // Usuário não parou de falar manualmente, então adicionamos o texto intermediário
                finalTranscript += interimTranscript;
                appendTextWithScroll(finalTranscript);
            }
            // userStoppedSpeaking = false; // Resete a variável para a próxima fala
            interimTranscript = ""; // Limpar o texto intermediário
        }
    });
    document.getElementById("micFull").addEventListener("click", (evt) => {
        if (!isListening) {
            finalTranscript = "";
            recognition.start();
            isListening = true;
            mic.setAttribute("src", "images/micon.svg")
            micFull.setAttribute("src", "images/micon.svg")
            mic.setAttribute("title", "Ouvindo..")
            micFull.setAttribute("title", "Ouvindo..")

        } else {
            recognition.stop();
            isListening = false;
            mic.setAttribute("src", "images/micoff.svg")
            mic.setAttribute("title", "Parado")
            micFull.setAttribute("src", "images/micoff.svg")
            micFull.setAttribute("title", "Parado")
            if (!userStoppedSpeaking) {
                // Usuário não parou de falar manualmente, então adicionamos o texto intermediário
                finalTranscript += interimTranscript;
                appendTextWithScroll(finalTranscript);
            }
            // userStoppedSpeaking = false; // Resete a variável para a próxima fala
            interimTranscript = ""; // Limpar o texto intermediário
        }
    });
    document.getElementById("mic").addEventListener("click", (evt) => {
        if (!isListening) {
            finalTranscript = "";
            recognition.start();
            isListening = true;
            mic.setAttribute("src", "images/micon.svg")
            micFull.setAttribute("src", "images/micon.svg")
            mic.setAttribute("title", "Ouvindo..")
            micFull.setAttribute("title", "Ouvindo..")

        } else {
            recognition.stop();
            isListening = false;
            mic.setAttribute("src", "images/micoff.svg")
            mic.setAttribute("title", "Parado")
            micFull.setAttribute("src", "images/micoff.svg")
            micFull.setAttribute("title", "Parado")
            if (!userStoppedSpeaking) {
                // Usuário não parou de falar manualmente, então adicionamos o texto intermediário
                finalTranscript += interimTranscript;
                appendTextWithScroll(finalTranscript);
            }
            // userStoppedSpeaking = false; // Resete a variável para a próxima fala
            interimTranscript = ""; // Limpar o texto intermediário
        }
    });


    // Role para a parte inferior inicialmente
    scrollToBottom();

    // Adicionar evento ao botão "Tela Inteira"
    const fullscreenButton = document.getElementById("fullscreenButton");
    const exitfullscreenButton = document.getElementById("exitfullscreenButton");
    const outputDiv = document.getElementById("output");
    const menufull = document.querySelector("#menufull")

    fullscreenButton.addEventListener("click", () => {
        if (outputDiv.classList.contains("fullscreen")) {
            document.exitFullscreen();
            menufull.classList.add("ocultar")
        } else {
            menufull.classList.remove("ocultar")
            setTimeout(() => {
                menufull.classList.add("ocultar")
            }, 55000)
            outputDiv.requestFullscreen().catch((err) => {
                console.error(`Erro ao entrar no modo de tela inteira: ${err.message}`);
            });
        }
    });

    exitfullscreenButton.addEventListener("click", () => {
        if (outputDiv.classList.contains("fullscreen")) {
            document.exitFullscreen();
            menufull.classList.add("ocultar")
        } else {
            menufull.classList.remove("ocultar")
            outputDiv.requestFullscreen().catch((err) => {
                console.error(`Erro ao entrar no modo de tela inteira: ${err.message}`);
            });
        }
    });

    // Adicionar evento para sair do modo de tela inteira quando o usuário pressionar a tecla Esc
    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            menufull.classList.add("ocultar")
            outputDiv.classList.remove("fullscreen");
            isFullscreen = false;
            scrollToBottom();
        } else {
            outputDiv.classList.add("fullscreen");
            isFullscreen = true;
        }
    });

    function applyTextSettings(fontSize, fontColor, fontFamily, backgroundColor) {
        h1.style.fontSize = `${fontSize}px`;
        h1.style.color = fontColor;
        h1.style.fontFamily = fontFamily;
        const mainDiv = document.querySelector(".main");
        mainDiv.style.backgroundColor = backgroundColor;
    }

    const fontSizeInput = document.getElementById("fontSizeInput");
    const fontColorInput = document.getElementById("fontColorInput");
    const fontFamilySelect = document.getElementById("fontFamilySelect");
    const backgroundColorInput = document.getElementById("backgroundColorInput");

    fontSizeInput.addEventListener("input", () => {
        applyTextSettings(fontSizeInput.value, fontColorInput.value, fontFamilySelect.value);

    });

    fontColorInput.addEventListener("input", () => {
        applyTextSettings(fontSizeInput.value, fontColorInput.value, fontFamilySelect.value);
    });

    fontFamilySelect.addEventListener("change", () => {
        applyTextSettings(fontSizeInput.value, fontColorInput.value, fontFamilySelect.value);
    });

    backgroundColorInput.addEventListener("input", () => {
        applyBackgroundSettings(backgroundColorInput.value);
    });

    function applyBackgroundSettings(backgroundColor) {
        const mainDiv = document.querySelector(".output");
        mainDiv.style.backgroundColor = backgroundColor;
    }

    const fontSizeInputFull = document.getElementById("fontSizeInputFull");
    const fontColorInputFull = document.getElementById("fontColorInputFull");
    const fontFamilySelectFull = document.getElementById("fontFamilySelectFull");
    const backgroundColorInputFull = document.getElementById("backgroundColorInputFull");

    fontSizeInputFull.addEventListener("input", () => {
        applyTextSettings(fontSizeInputFull.value, fontColorInputFull.value, fontFamilySelectFull.value);

    });

    fontColorInputFull.addEventListener("input", () => {
        applyTextSettings(fontSizeInputFull.value, fontColorInputFull.value, fontFamilySelectFull.value);
    });

    fontFamilySelectFull.addEventListener("change", () => {
        applyTextSettings(fontSizeInputFull.value, fontColorInputFull.value, fontFamilySelectFull.value);
    });

    backgroundColorInputFull.addEventListener("input", () => {
        applyBackgroundSettingsFull(backgroundColorInputFull.value);
    });

    function applyBackgroundSettingsFull(backgroundColor) {
        const mainDiv = document.querySelector(".output");
        mainDiv.style.backgroundColor = backgroundColor;
    }

    let timerId;
    const handleMouseMove = (evt) => {
        clearTimeout(timerId);

        if (!outputDiv.classList.contains("fullscreen")) {
            menufull.classList.add("ocultar");
        } else {
            menufull.classList.remove("ocultar");
            menufull.style.cursor = "pointer";
        }

        timerId = setTimeout(() => {
            menufull.classList.add("ocultar");
            menufull.style.cursor = "none";
            outputDiv.addEventListener("mousemove", handleMouseMove);
        }, 5000);
    };

    outputDiv.addEventListener("mousemove", handleMouseMove);


}
