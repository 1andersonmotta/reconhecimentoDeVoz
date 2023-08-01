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


    // Evento chamado quando a fala é detectada
    recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                // Se o resultado for final, adicionar o texto à transcrição final
                finalTranscript += transcript + " ";
                interimTranscript = ""; // Limpar o texto intermediário
            } else {
                // Se for resultado intermediário, atualizar o texto intermediário
                interimTranscript = transcript;
            }
        }
        // Atualizar a transcrição exibida
        appendTextWithScroll(finalTranscript + interimTranscript);
    };

    // Evento chamado em caso de erro
    recognition.onerror = (event) => {
        console.error("Erro no reconhecimento de fala:", event.error);
    };

    // Evento chamado quando o usuário para de falar
    recognition.onend = () => {
        if (isListening) {
            isListening = false;
            appendTextWithScroll(finalTranscript);
            finalTranscript = "";
        }
    };

    // Iniciar o reconhecimento de fala ao clicar no botão
    document.getElementById("startButton").addEventListener("click", () => {
        if (!isListening) {
            finalTranscript = "";
            recognition.start();
            isListening = true;
        } else {
            recognition.stop();
            isListening = false;
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
}
