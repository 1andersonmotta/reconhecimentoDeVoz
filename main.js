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

    const transcriptionDiv = document.getElementById('output');
    const play = document.getElementById('play');
    const h1 = document.createElement('p');

    async function appendTextWithScroll(text) {
        const langTo = document.getElementById("langTo");
        const langFor = document.getElementById("langFor");

        if (langTo.value == langFor.value) {

            h1.textContent = text;
            transcriptionDiv.insertBefore(h1, play);
            if (!isFullscreen) {
                scrollToBottom();
            } else {
                setTimeout(scrollToBottom, 100);
            }

        } else {
            const data = await loadTranslation(text, langTo.value, langFor.value)
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


    let userStoppedSpeaking = false;

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
    const icon = document.getElementById("icon");
    const mic = document.getElementById("mic")
    const micFull = document.getElementById("micFull")
    document.getElementById("startButton").addEventListener("click", () => {
        if (!isListening) {
            finalTranscript = "";
            recognition.start();
            isListening = true;
            mic.setAttribute("src", "images/micon.svg")
            micFull.setAttribute("src", "images/micon.svg")
            mic.setAttribute("title", "Ouvindo..")
            micFull.setAttribute("title", "Ouvindo..")
            icon.setAttribute("href", "images/micon.svg")

        } else {
            recognition.stop();
            isListening = false;
            mic.setAttribute("src", "images/micoff.svg")
            micFull.setAttribute("src", "images/micoff.svg")
            icon.setAttribute("href", "images/micoff.svg")
            mic.setAttribute("title", "Parado")
            micFull.setAttribute("title", "Parado")

            if (!userStoppedSpeaking) {
                finalTranscript += interimTranscript;
                appendTextWithScroll(finalTranscript);
            }
            interimTranscript = "";
        }
    });



    document.getElementById("startButtonfullscreen").addEventListener("click", (evt) => {
        if (!isListening) {
            finalTranscript = "";
            recognition.start();
            isListening = true;
            mic.setAttribute("src", "images/micon.svg")
            micFull.setAttribute("src", "images/micon.svg")
            icon.setAttribute("href", "images/micon.svg")
            mic.setAttribute("title", "Ouvindo..")
            micFull.setAttribute("title", "Ouvindo..")

        } else {
            recognition.stop();
            isListening = false;
            mic.setAttribute("src", "images/micoff.svg")
            icon.setAttribute("href", "images/micoff.svg")
            mic.setAttribute("title", "Parado")
            micFull.setAttribute("src", "images/micoff.svg")
            micFull.setAttribute("title", "Parado")
            if (!userStoppedSpeaking) {
                finalTranscript += interimTranscript;
                appendTextWithScroll(finalTranscript);
            }

            interimTranscript = "";
        }
    });
    document.getElementById("micFull").addEventListener("click", (evt) => {
        if (!isListening) {
            finalTranscript = "";
            recognition.start();
            isListening = true;
            mic.setAttribute("src", "images/micon.svg")
            micFull.setAttribute("src", "images/micon.svg")
            icon.setAttribute("href", "images/micon.svg")
            mic.setAttribute("title", "Ouvindo..")
            micFull.setAttribute("title", "Ouvindo..")

        } else {
            recognition.stop();
            isListening = false;
            mic.setAttribute("src", "images/micoff.svg")
            icon.setAttribute("href", "images/micoff.svg")
            mic.setAttribute("title", "Parado")
            micFull.setAttribute("src", "images/micoff.svg")
            micFull.setAttribute("title", "Parado")
            if (!userStoppedSpeaking) {
                finalTranscript += interimTranscript;
                appendTextWithScroll(finalTranscript);
            }
            interimTranscript = "";
        }
    });
    document.getElementById("mic").addEventListener("click", (evt) => {
        if (!isListening) {
            finalTranscript = "";
            recognition.start();
            isListening = true;
            mic.setAttribute("src", "images/micon.svg")
            micFull.setAttribute("src", "images/micon.svg")
            icon.setAttribute("href", "images/micon.svg")
            mic.setAttribute("title", "Ouvindo..")
            micFull.setAttribute("title", "Ouvindo..")

        } else {
            recognition.stop();
            isListening = false;
            mic.setAttribute("src", "images/micoff.svg")
            icon.setAttribute("href", "images/micoff.svg")
            mic.setAttribute("title", "Parado")
            micFull.setAttribute("src", "images/micoff.svg")
            micFull.setAttribute("title", "Parado")
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

async function loadTranslation(text, langTo, langFor) {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${langTo}|${langFor}`
    ).then((res) => res.json())
    return res.responseData.translatedText
}