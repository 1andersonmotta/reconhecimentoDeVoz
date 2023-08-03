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

    // Função para adicionar texto à div com scroll para baixo
    function appendTextWithScroll(text) {
        transcriptionDiv.textContent = text;
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
    // Use a API Keep-Alive para evitar suspensão de áudio
    const keepAliveInterval = setInterval(() => {
        navigator.mediaDevices.getUserMedia({ audio: true });
    }, 5000); // Reinicia a gravação a cada 5 segundos


    // Remova a função recognition.onend completa

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


    // Adicione o evento recognition.onend do reconhecimento de fala manual pelo botão
    document.getElementById("startButton").addEventListener("click", () => {
        if (!isListening) {
            finalTranscript = "";
            recognition.start();
            isListening = true;
        } else {
            recognition.stop();
            isListening = false;
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
    const outputDiv = document.getElementById("output");

    fullscreenButton.addEventListener("click", () => {
        if (outputDiv.classList.contains("fullscreen")) {
            document.exitFullscreen();
        } else {
            outputDiv.requestFullscreen().catch((err) => {
                console.error(`Erro ao entrar no modo de tela inteira: ${err.message}`);
            });
        }
    });

    // Adicionar evento para sair do modo de tela inteira quando o usuário pressionar a tecla Esc
    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            outputDiv.classList.remove("fullscreen");
            isFullscreen = false; // Saiu do modo tela inteira
            scrollToBottom(); // Reajusta a rolagem para garantir que fique na parte de baixo
        } else {
            outputDiv.classList.add("fullscreen");
            isFullscreen = true; // Entrou em modo tela inteira
        }
    });
    // Função para aplicar as configurações de tamanho, cor e fonte do texto
    function applyTextSettings(fontSize, fontColor, fontFamily, backgroundColor) {
        transcriptionDiv.style.fontSize = `${fontSize}px`;
        transcriptionDiv.style.color = fontColor;
        transcriptionDiv.style.fontFamily = fontFamily;
        const mainDiv = document.querySelector(".main");
        mainDiv.style.backgroundColor = backgroundColor;
    }

    // Adicionar evento para aplicar as configurações de texto ao alterar os valores nos inputs/select
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

}
