const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (typeof SpeechRecognition === "undefined") {
    alert("Este navegador não suporta o reconhecimento de fala. Tente em outro navegador.");
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';
    //recognition.lang = 'en-US';

    const language = document.getElementById("languageSelect");
    language.addEventListener("change", () => {
        console.log(language.value, typeof (language.value))
        recognition.lang = language.value
    })
    let finalTranscript = "";
    let isListening = false;
    let isFullscreen = false;

    const transcriptionDiv = document.getElementById('output');
    const play = document.getElementById('play');
    const h1 = document.createElement('p');

    function appendTextWithScroll(text) {
        h1.textContent = text;
        transcriptionDiv.insertBefore(h1, play);
        if (!isFullscreen) {
            scrollToBottom();
        } else {
            setTimeout(scrollToBottom, 100);
        }
    }

    function scrollToBottom() {
        transcriptionDiv.scrollTop = transcriptionDiv.scrollHeight;
    }

    let userStoppedSpeaking = false;


    recognition.onresult = (event) => {
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
        appendTextWithScroll(previousTranscript + interimTranscript);
    };

    recognition.onspeechstart = () => {
        console.log("speech ok")
    }
    recognition.onresult = (event) => {
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
        appendTextWithScroll(previousTranscript + interimTranscript);
    };



    const icon = document.getElementById("icon");
    const mic = document.getElementById("mic")
    const micFull = document.getElementById("micFull")
    const config = document.getElementById("config")



    document.getElementById("startButton").addEventListener("click", () => {
        console.log(recognition.lang)
        if (!isListening) {
            finalTranscript = "";
            recognition.start();
            isListening = true;
            mic.setAttribute("src", "images/micon.svg")
            micFull.setAttribute("src", "images/micon.svg")
            mic.setAttribute("title", "Ouvindo..")
            micFull.setAttribute("title", "Ouvindo..")
            icon.setAttribute("href", "images/micon.svg")
            console.log("log", typeof (icon.href))
            setInterval(() => {
                if (icon.href == "http://localhost:5501/images/micon.svg") {
                    return icon.setAttribute("href", "images/micon2.svg")
                } else if (icon.href == "http://localhost:5501/images/micon2.svg") {
                    icon.setAttribute("href", "images/micon.svg")
                }
            }, 500)

        } else {
            recognition.stop();
            isListening = false;
            mic.setAttribute("src", "images/micoff.svg")
            micFull.setAttribute("src", "images/micoff.svg")
            icon.setAttribute("href", "images/micoff.svg")
            mic.setAttribute("title", "Parado")
            micFull.setAttribute("title", "Parado")
            if (!userStoppedSpeaking) {
                finalTranscript += interimTranscript | '';
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




}
