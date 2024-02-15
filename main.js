import loadTranslation from './translation.js';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (typeof SpeechRecognition === "undefined") {
    alert("Este navegador não suporta o reconhecimento de fala. Tente em outro navegador.");
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';
    let finalTranscript = "";
    let isListening = false;
    let isFullscreen = false;
    let lanrecut = 'pt-BR';
    const transcriptionDiv = document.getElementById('output');
    const play = document.getElementById('play');
    const h1 = document.createElement('p');
    const icon = document.getElementById("icon");
    const mic = document.getElementById("mic");
    const micFull = document.getElementById("micFull");
    let userStoppedSpeaking = false;

    async function appendTextWithScroll(text) {
        if (recognition.lang == lanrecut) {
            h1.textContent = text;
            transcriptionDiv.insertBefore(h1, play);
            if (!isFullscreen) {
                scrollToBottom();
            } else {
                setTimeout(scrollToBottom, 100);
            }
        } else {
            const data = await loadTranslation(text, recognition.lang, lanrecut)
            h1.textContent = data;
            transcriptionDiv.insertBefore(h1, play);
            if (!isFullscreen) {
                scrollToBottom();
            } else {
                setTimeout(scrollToBottom, 100);
            }
        }
    }

    function scrollToBottom() {
        transcriptionDiv.scrollTop = transcriptionDiv.scrollHeight;
    }

    function rec() {
        finalTranscript = "";
        isListening = true;
        icon.setAttribute("href", "images/micon.svg")
        mic.setAttribute("src", "images/micon.svg")
        mic.setAttribute("title", "Ouvindo..")
        micFull.setAttribute("src", "images/micon.svg")
        micFull.setAttribute("title", "Ouvindo..")
        start.innerText = 'PAUSAR'
        startFull.innerText = 'PAUSAR'
    }

    function pause() {
        isListening = false;
        icon.setAttribute("href", "images/micoff.svg")
        mic.setAttribute("src", "images/micoff.svg")
        mic.setAttribute("title", "Parado")
        micFull.setAttribute("src", "images/micoff.svg")
        micFull.setAttribute("title", "Parado")
        start.innerText = 'INICIAR'
        startFull.innerText = 'INICIAR'
    }

    recognition.onresult = async (event) => {
        let interimTranscript = "";
        let previousTranscript = finalTranscript;

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const words = transcript.split(" ");
            words.forEach((word) => {
                if (!event.results[i].isFinal) {
                    interimTranscript += word + " ";
                } else {
                    finalTranscript += word + " ";
                    previousTranscript = finalTranscript;
                    interimTranscript = "";
                }
            });
        }
        await appendTextWithScroll(previousTranscript + interimTranscript);
    };


    const start = document.getElementById("startButton")
    start.addEventListener("click", () => {
        if (!isListening) {
            recognition.start();
            rec();
        } else {
            recognition.stop();
            pause()
        }
    });

    const startFull = document.getElementById("startButtonfullscreen")
    startFull.addEventListener("click", (evt) => {
        if (!isListening) {
            recognition.start();
            rec()
        } else {
            recognition.stop();
            pause()
            if (!userStoppedSpeaking) {
                finalTranscript += interimTranscript;
                appendTextWithScroll(finalTranscript);
            }
            interimTranscript = "";
        }
    });

    document.getElementById("micFull").addEventListener("click", (evt) => {
        if (!isListening) {
            recognition.start();
            rec()
        } else {
            recognition.stop();
            pause()
            if (!userStoppedSpeaking) {
                finalTranscript += interimTranscript;
                appendTextWithScroll(finalTranscript);
            }
            interimTranscript = "";
        }
    });
    document.getElementById("mic").addEventListener("click", (evt) => {
        if (!isListening) {
            recognition.start();
            rec()
        } else {
            recognition.stop();
            pause()
            if (!userStoppedSpeaking) {
                finalTranscript += interimTranscript;
                appendTextWithScroll(finalTranscript);
            }
            interimTranscript = "";
        }
    });

    scrollToBottom();

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
    const langTo = document.getElementById("langTo");
    const langFor = document.getElementById("langFor");

    fontSizeInput.addEventListener("input", () => {
        fontSizeInputFull.value = fontSizeInput.value
        applyTextSettings(fontSizeInput.value, fontColorInput.value, fontFamilySelect.value);

    });

    fontColorInput.addEventListener("input", () => {
        fontColorInputFull.value = fontColorInput.value
        applyTextSettings(fontSizeInput.value, fontColorInput.value, fontFamilySelect.value);
    });

    fontFamilySelect.addEventListener("change", () => {
        fontFamilySelectFull.value = fontFamilySelect.value
        applyTextSettings(fontSizeInput.value, fontColorInput.value, fontFamilySelect.value);
    });

    backgroundColorInput.addEventListener("input", () => {
        applyBackgroundSettings(backgroundColorInput.value);
    });

    function applyBackgroundSettings(backgroundColor) {
        const mainDiv = document.querySelector(".output");
        mainDiv.style.backgroundColor = backgroundColor;
        backgroundColorInputFull.value = backgroundColor;
    }

    langTo.addEventListener("change", () => {
        recognition.lang = langTo.value;
        langToFull.value = langTo.value;
    })
    langFor.addEventListener("change", () => {
        langForFull.value = langFor.value;
        lanrecut = langFor.value
    })

    const fontSizeInputFull = document.getElementById("fontSizeInputFull");
    const fontColorInputFull = document.getElementById("fontColorInputFull");
    const fontFamilySelectFull = document.getElementById("fontFamilySelectFull");
    const backgroundColorInputFull = document.getElementById("backgroundColorInputFull");
    const langToFull = document.getElementById("langToFull");
    const langForFull = document.getElementById("langForFull");

    langToFull.addEventListener("change", () => {
        langTo.value = langToFull.value
        recognition.lang = langToFull.value;
    })
    langForFull.addEventListener("change", () => {
        langFor.value = langForFull.value
        lanrecut = langForFull.value
    })

    fontSizeInputFull.addEventListener("input", () => {
        fontSizeInput.value = fontSizeInputFull.value
        applyTextSettings(fontSizeInputFull.value, fontColorInputFull.value, fontFamilySelectFull.value);
    });

    fontColorInputFull.addEventListener("input", () => {
        fontColorInput.value = fontColorInputFull.value
        applyTextSettings(fontSizeInputFull.value, fontColorInputFull.value, fontFamilySelectFull.value);
    });

    fontFamilySelectFull.addEventListener("change", () => {
        fontFamilySelect.value = fontFamilySelectFull.value
        applyTextSettings(fontSizeInputFull.value, fontColorInputFull.value, fontFamilySelectFull.value);
    });

    backgroundColorInputFull.addEventListener("input", () => {
        applyBackgroundSettingsFull(backgroundColorInputFull.value);
    });

    function applyBackgroundSettingsFull(backgroundColor) {
        const mainDiv = document.querySelector(".output");
        mainDiv.style.backgroundColor = backgroundColor;
        backgroundColorInput.value = backgroundColor
    }

    const menu = document.getElementById("menu")
    const body = document.getElementById("body")
    let timerId;
    const handleMouseMove = (evt) => {
        clearTimeout(timerId);

        if (!outputDiv.classList.contains("fullscreen")) {
            menufull.classList.add("ocultar");
        } else {
            menufull.classList.remove("ocultar");
            menufull.style.cursor = "pointer";
        }

        if (menu.classList.contains("ocultar")) {
            menu.classList.remove("ocultar");
            menu.style.cursor = "pointer";
        }

        timerId = setTimeout(() => {
            menufull.classList.add("ocultar");
            menufull.style.cursor = "none";
            menu.classList.add("ocultar");
            menu.style.cursor = "none";
            outputDiv.addEventListener("mousemove", handleMouseMove);
            body.addEventListener("mousemove", handleMouseMove);
        }, 5000);
    };

    outputDiv.addEventListener("mousemove", handleMouseMove);
    body.addEventListener("mousemove", handleMouseMove);

}

