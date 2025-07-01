// Aplicação de Reconhecimento de Fala e Tradução
// Versão refatorada com múltiplas funcionalidades

class SpeechRecognitionApp {
    constructor() {
        this.recognition = null;
        this.isRecording = false;
        this.autoTranslate = false;
        this.finalTranscript = '';
        this.interimTranscript = '';
        this.currentLanguage = 'pt-BR';
        this.targetLanguage = 'en';
        this.manualStop = false; // Flag para controlar paradas manuais
        this.firstStart = true; // Flag para controlar notificação de início
        
        // Cache de elementos DOM
        this.elements = {};
        
        // Timer para auto-hide dos controles
        this.controlsTimer = null;
        this.controlsHideTimer = null;
        
        // Inicialização
        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.checkBrowserSupport();
        this.setupKeyboardShortcuts();
        this.loadSettings();
        this.setupAutoHideControls();
    }

    cacheElements() {
        this.elements = {
            // Botões principais
            startBtn: document.getElementById('startButton'),
            fullscreenBtn: document.getElementById('fullscreenButton'),
            
            // Seletores de idioma
            languageSelect: document.getElementById('langTo'),
            targetLanguageSelect: document.getElementById('langFor'),
            
            // Área de saída
            output: document.getElementById('output'),
            translationOutput: document.getElementById('translationOutput'),
            
            // Botões de ação
            clearBtn: document.getElementById('clearButton'),
            copyBtn: document.getElementById('copyButton'),
            downloadBtn: document.getElementById('downloadButton'),
            
            // Controles de personalização
            fontSizeInput: document.getElementById('fontSizeInput'),
            fontColorInput: document.getElementById('fontColorInput'),
            fontFamilySelect: document.getElementById('fontFamilySelect'),
            
            // Painéis
            controlPanel: document.querySelector('.controls-panel'),
            languagePanel: document.querySelector('.language-section'),
            
            // Status
            statusIndicator: document.querySelector('.status-indicator'),
            micIcon: document.getElementById('mic')
        };
    }

    setupEventListeners() {
        // Botões principais - botão único que alterna entre iniciar/parar
        this.elements.startBtn?.addEventListener('click', () => {
            if (this.isRecording) {
                this.manualStop = true; // Marca como parada manual
                this.stopRecording();
            } else {
                this.startRecording();
            }
        });
        
        // Botões de ação
        this.elements.clearBtn?.addEventListener('click', () => this.clearOutput());
        this.elements.copyBtn?.addEventListener('click', () => this.copyToClipboard());
        this.elements.downloadBtn?.addEventListener('click', () => this.downloadTranscript());
        this.elements.fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());
        
        // Controles de personalização
        this.elements.fontSizeInput?.addEventListener('input', (e) => {
            this.updateFontSize(e.target.value);
        });
        
        this.elements.fontColorInput?.addEventListener('change', (e) => {
            this.updateFontColor(e.target.value);
        });
        
        this.elements.fontFamilySelect?.addEventListener('change', (e) => {
            this.updateFontFamily(e.target.value);
        });
        
        // Seletores de idioma
        this.elements.languageSelect?.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.syncSettings();
            // Se estiver gravando, reinicia com novo idioma
            if (this.isRecording) {
                this.manualStop = true;
                this.stopRecording();
                setTimeout(() => this.startRecording(), 500);
            }
        });
        
        this.elements.targetLanguageSelect?.addEventListener('change', (e) => {
            this.targetLanguage = e.target.value;
            this.syncSettings();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + Espaço para iniciar/parar gravação
            if (e.ctrlKey && e.code === 'Space') {
                e.preventDefault();
                if (this.isRecording) {
                    this.manualStop = true;
                    this.stopRecording();
                } else {
                    this.startRecording();
                }
            }
            
            // Ctrl + C para copiar
            if (e.ctrlKey && e.key === 'c' && !e.shiftKey) {
                if (this.finalTranscript) {
                    this.copyToClipboard();
                }
            }
            
            // Ctrl + L para limpar
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                this.clearOutput();
            }
        });
    }

    setupAutoHideControls() {
        const panels = [
            this.elements.controlPanel,
            this.elements.languagePanel
        ];

        panels.forEach(panel => {
            if (panel) {
                panel.addEventListener('mouseenter', () => {
                    clearTimeout(this.controlsTimer);
                    panel.style.opacity = '1';
                });

                panel.addEventListener('mouseleave', () => {
                    if (this.isFullscreen) {
                        this.controlsTimer = setTimeout(() => {
                            panel.style.opacity = '0.3';
                        }, 3000);
                    }
                });
            }
        });
    }

    checkBrowserSupport() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showNotification('Seu navegador não suporta reconhecimento de fala.', 'error');
            return false;
        }
        return true;
    }

    initializeRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configurações para permitir pausas sem interromper
        this.recognition.continuous = true; // Sempre contínuo
        this.recognition.interimResults = true;
        this.recognition.lang = this.currentLanguage;
        this.recognition.maxAlternatives = 1;
        
        this.recognition.onstart = () => {
            this.isRecording = true;
            this.updateUI();
            // Só mostrar notificação na primeira vez
            if (this.firstStart) {
                this.showNotification('Reconhecimento iniciado');
                this.firstStart = false;
            }
        };
        
        this.recognition.onresult = (event) => {
            this.handleRecognitionResult(event);
        };
        
        this.recognition.onerror = (event) => {
            this.handleRecognitionError(event);
        };
        
        this.recognition.onend = () => {
            // Se ainda deveria estar gravando, reinicia automaticamente
            if (this.isRecording && !this.manualStop) {
                try {
                    this.recognition.start();
                } catch (error) {
                    console.log('Erro ao reiniciar reconhecimento:', error);
                    this.isRecording = false;
                    this.firstStart = true; // Reset para próxima sessão
                    this.updateUI();
                    this.showNotification('Reconhecimento interrompido');
                }
            } else {
                this.isRecording = false;
                this.firstStart = true; // Reset para próxima sessão
                this.updateUI();
                this.showNotification('Reconhecimento finalizado');
            }
        };
    }

    handleRecognitionResult(event) {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        this.finalTranscript += finalTranscript;
        this.interimTranscript = interimTranscript;
        
        this.updateOutput();
        
        if (finalTranscript && this.autoTranslate) {
            this.translateText(finalTranscript);
        }
    }

    handleRecognitionError(event) {
        let errorMessage = 'Erro no reconhecimento de fala';
        let shouldRestart = false;
        
        switch (event.error) {
            case 'no-speech':
                // Não mostrar erro para "no-speech" - é normal durante pausas
                if (this.isRecording && !this.manualStop) {
                    shouldRestart = true;
                }
                return; // Não mostra notificação
            case 'audio-capture':
                errorMessage = 'Erro ao capturar áudio';
                break;
            case 'not-allowed':
                errorMessage = 'Permissão negada para usar o microfone';
                break;
            case 'network':
                errorMessage = 'Erro de rede - tentando reconectar...';
                shouldRestart = true;
                break;
            case 'aborted':
                // Erro de abort é normal quando paramos manualmente
                if (this.manualStop) return;
                shouldRestart = true;
                break;
            default:
                errorMessage = `Erro: ${event.error}`;
                shouldRestart = true;
        }
        
        if (shouldRestart && this.isRecording && !this.manualStop) {
            // Tentar reiniciar após um pequeno delay
            setTimeout(() => {
                try {
                    this.recognition.start();
                } catch (e) {
                    console.log('Falha ao reiniciar:', e);
                    this.isRecording = false;
                    this.firstStart = true; // Reset para próxima sessão
                    this.updateUI();
                    this.showNotification(errorMessage, 'error');
                }
            }, 100);
        } else {
            this.showNotification(errorMessage, 'error');
            this.isRecording = false;
            this.firstStart = true; // Reset para próxima sessão
            this.updateUI();
        }
    }

    startRecording() {
        if (!this.checkBrowserSupport()) return;
        
        if (this.isRecording) {
            this.showNotification('Já está gravando', 'warning');
            return;
        }
        
        this.manualStop = false; // Reset da flag
        this.firstStart = true; // Permitir notificação para nova sessão
        this.initializeRecognition();
        
        try {
            this.recognition.start();
        } catch (error) {
            console.error('Erro ao iniciar reconhecimento:', error);
            this.showNotification('Erro ao iniciar reconhecimento', 'error');
        }
    }

    stopRecording() {
        if (!this.isRecording) {
            this.showNotification('Não está gravando', 'warning');
            return;
        }
        
        this.manualStop = true; // Indica que foi uma parada manual
        this.recognition.stop();
    }

    updateOutput() {
        const fullText = this.finalTranscript + this.interimTranscript;
        const finalSpan = '<span class="final">' + this.finalTranscript + '</span>';
        const interimSpan = '<span class="interim" style="opacity: 0.7; font-style: italic;">' + this.interimTranscript + '</span>';
        
        console.log('updateOutput called with text:', fullText);
        
        // Atualizar saída
        if (this.elements.output) {
            if (fullText.trim()) {
                this.elements.output.innerHTML = finalSpan + interimSpan;
                const emptyState = document.getElementById('emptyState');
                if (emptyState) emptyState.style.display = 'none';
            } else {
                const emptyState = document.getElementById('emptyState');
                if (emptyState) emptyState.style.display = 'block';
            }
        }
        
        // Atualizar texto no modo tela cheia também
        this.updateFullscreenText();
    }

    async translateText(text) {
        if (!text.trim()) return;
        
        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    from: this.getLanguageCode(this.currentLanguage),
                    to: this.getLanguageCode(this.targetLanguage)
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.updateTranslationOutput(data.translation);
            } else {
                // Fallback para Google Translate (cliente)
                this.showFallbackTranslation(text);
            }
        } catch (error) {
            console.error('Erro na tradução:', error);
            this.showFallbackTranslation(text);
        }
    }

    showFallbackTranslation(text) {
        const encodedText = encodeURIComponent(text);
        const fromLang = this.getLanguageCode(this.currentLanguage);
        const toLang = this.getLanguageCode(this.targetLanguage);
        
        const translationHTML = `
            <div class="translation-fallback">
                <p>Tradução automática não disponível. 
                <a href="https://translate.google.com/?sl=${fromLang}&tl=${toLang}&text=${encodedText}" 
                   target="_blank" rel="noopener">
                   Traduzir no Google Translate
                </a></p>
            </div>
        `;
        
        this.updateTranslationOutput(translationHTML);
    }

    updateTranslationOutput(translation) {
        if (this.elements.translationOutput) {
            this.elements.translationOutput.innerHTML = translation;
        }
        
        if (this.elements.fullscreenElements.translationOutput) {
            this.elements.fullscreenElements.translationOutput.innerHTML = translation;
        }
    }

    getLanguageCode(langCode) {
        // Converter códigos de idioma para tradução
        const langMap = {
            'pt-BR': 'pt',
            'en-US': 'en',
            'es-ES': 'es',
            'fr-FR': 'fr',
            'de-DE': 'de',
            'it-IT': 'it',
            'ja-JP': 'ja',
            'ko-KR': 'ko',
            'zh-CN': 'zh',
            'ru-RU': 'ru'
        };
        
        return langMap[langCode] || langCode.split('-')[0];
    }

    clearOutput() {
        this.finalTranscript = '';
        this.interimTranscript = '';
        
        // Limpar saída normal
        if (this.elements.output) {
            this.elements.output.innerHTML = '';
            const emptyState = document.getElementById('emptyState');
            if (emptyState) emptyState.style.display = 'block';
        }
        
        // Limpar saída de tela cheia
        const fullscreenOutput = document.getElementById('outputfullscreen');
        if (fullscreenOutput) {
            const textContainer = fullscreenOutput.querySelector('.fullscreen-text');
            if (textContainer) {
                textContainer.innerHTML = 'Clique em "INICIAR" para começar a transcrição em tela cheia';
            }
        }
        
        // Limpar traduções
        if (this.elements.translationOutput) this.elements.translationOutput.innerHTML = '';
        if (this.elements.fullscreenElements.translationOutput) this.elements.fullscreenElements.translationOutput.innerHTML = '';
        
        this.showNotification('Saída limpa');
    }

    async copyToClipboard() {
        if (!this.finalTranscript) {
            this.showNotification('Nada para copiar', 'warning');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(this.finalTranscript);
            this.showNotification('Texto copiado para a área de transferência');
        } catch (error) {
            // Fallback para navegadores mais antigos
            this.fallbackCopyToClipboard(this.finalTranscript);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Texto copiado para a área de transferência');
        } catch (error) {
            this.showNotification('Erro ao copiar texto', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    downloadTranscript() {
        if (!this.finalTranscript) {
            this.showNotification('Nada para baixar', 'warning');
            return;
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `transcricao-${timestamp}.txt`;
        
        const content = `Transcrição de Fala\n` +
                       `Data: ${new Date().toLocaleString('pt-BR')}\n` +
                       `Idioma: ${this.currentLanguage}\n` +
                       `\n--- TRANSCRIÇÃO ---\n\n` +
                       `${this.finalTranscript}`;
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Arquivo baixado: ' + filename);
    }

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        
        if (this.isFullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }

    enterFullscreen() {
        // Criar elemento de tela cheia simples
        const fullscreenDiv = document.createElement('div');
        fullscreenDiv.className = 'fullscreen-mode';
        fullscreenDiv.id = 'fullscreenMode';
        
        // Configurações iniciais para tela cheia
        this.fullscreenSettings = {
            fontSize: 3, // rem
            fontFamily: 'Inter',
            textColor: '#ffffff',
            backgroundColor: '#000000'
        };
        
        // Aplicar configurações de background
        fullscreenDiv.style.backgroundColor = this.fullscreenSettings.backgroundColor;
        
        // Texto da transcrição
        const textDiv = document.createElement('div');
        textDiv.className = 'fullscreen-text';
        textDiv.id = 'fullscreenText';
        textDiv.textContent = this.finalTranscript || 'Clique em "INICIAR" para começar a transcrição em tela cheia';
        textDiv.style.fontSize = this.fullscreenSettings.fontSize + 'rem';
        textDiv.style.fontFamily = this.fullscreenSettings.fontFamily;
        textDiv.style.color = this.fullscreenSettings.textColor;
        
        // Painel de configurações
        const settingsDiv = document.createElement('div');
        settingsDiv.className = 'fullscreen-settings';
        settingsDiv.id = 'fullscreenSettings';
        settingsDiv.innerHTML = `
            <h4><i class="fas fa-cog"></i> Configurações</h4>
            
            <div class="setting-row">
                <label>Tamanho:</label>
                <input type="range" id="fsTextSize" min="1" max="8" step="0.1" value="${this.fullscreenSettings.fontSize}">
                <span class="value-display" id="fsTextSizeValue">${this.fullscreenSettings.fontSize}rem</span>
            </div>
            
            <div class="setting-row">
                <label>Fonte:</label>
                <select id="fsFontFamily">
                    <option value="Inter">Inter</option>
                    <option value="Lora">Lora</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="'Courier New', monospace">Courier</option>
                    <option value="'Dancing Script', cursive">Dancing</option>
                </select>
            </div>
            
            <div class="setting-row">
                <label>Cor Texto:</label>
                <input type="color" id="fsTextColor" value="${this.fullscreenSettings.textColor}">
            </div>
            
            <div class="setting-row">
                <label>Cor Fundo:</label>
                <input type="color" id="fsBackgroundColor" value="${this.fullscreenSettings.backgroundColor}">
            </div>
        `;
        
        // Controles de tela cheia
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'fullscreen-controls';
        controlsDiv.id = 'fullscreenControls';
        
        const startBtn = document.createElement('button');
        startBtn.innerHTML = this.isRecording ? '<i class="fas fa-stop"></i> PARAR' : '<i class="fas fa-play"></i> INICIAR';
        startBtn.onclick = () => {
            if (this.isRecording) {
                this.manualStop = true;
                this.stopRecording();
            } else {
                this.startRecording();
            }
            this.resetHideTimer();
        };
        
        const micIcon = document.createElement('img');
        micIcon.src = this.isRecording ? 'images/micon.svg' : 'images/micoff.svg';
        micIcon.className = 'mic-icon';
        micIcon.id = 'fullscreenMic';
        
        const exitBtn = document.createElement('button');
        exitBtn.innerHTML = '<i class="fas fa-times"></i> SAIR';
        exitBtn.onclick = () => this.exitFullscreen();
        
        controlsDiv.appendChild(startBtn);
        controlsDiv.appendChild(micIcon);
        controlsDiv.appendChild(exitBtn);
        
        fullscreenDiv.appendChild(textDiv);
        fullscreenDiv.appendChild(settingsDiv);
        fullscreenDiv.appendChild(controlsDiv);
        
        document.body.appendChild(fullscreenDiv);
        
        // Configurar event listeners das configurações
        this.setupFullscreenSettings();
        
        // Configurar sistema de auto-hide
        this.setupAutoHideFullscreen();
        
        // Esconder scroll
        document.body.style.overflow = 'hidden';
        
        // Atualizar botão principal
        if (this.elements.fullscreenBtn) {
            this.elements.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> SAIR TELA CHEIA';
        }
        
        // Escutar ESC para sair
        this.handleEscKey = (e) => {
            if (e.key === 'Escape') {
                this.exitFullscreen();
            }
        };
        document.addEventListener('keydown', this.handleEscKey);
    }

    setupFullscreenSettings() {
        const textSizeSlider = document.getElementById('fsTextSize');
        const textSizeValue = document.getElementById('fsTextSizeValue');
        const fontFamilySelect = document.getElementById('fsFontFamily');
        const textColorInput = document.getElementById('fsTextColor');
        const backgroundColorInput = document.getElementById('fsBackgroundColor');
        const textDiv = document.getElementById('fullscreenText');
        const fullscreenDiv = document.getElementById('fullscreenMode');
        
        // Event listener para tamanho do texto
        textSizeSlider?.addEventListener('input', (e) => {
            this.fullscreenSettings.fontSize = parseFloat(e.target.value);
            textSizeValue.textContent = this.fullscreenSettings.fontSize + 'rem';
            textDiv.style.fontSize = this.fullscreenSettings.fontSize + 'rem';
            this.resetHideTimer();
        });
        
        // Event listener para fonte
        fontFamilySelect?.addEventListener('change', (e) => {
            this.fullscreenSettings.fontFamily = e.target.value;
            textDiv.style.fontFamily = this.fullscreenSettings.fontFamily;
            this.resetHideTimer();
        });
        
        // Event listener para cor do texto
        textColorInput?.addEventListener('change', (e) => {
            this.fullscreenSettings.textColor = e.target.value;
            textDiv.style.color = this.fullscreenSettings.textColor;
            this.resetHideTimer();
        });
        
        // Event listener para cor de fundo
        backgroundColorInput?.addEventListener('change', (e) => {
            this.fullscreenSettings.backgroundColor = e.target.value;
            fullscreenDiv.style.backgroundColor = this.fullscreenSettings.backgroundColor;
            this.resetHideTimer();
        });
        
        // Definir valor inicial da fonte
        fontFamilySelect.value = this.fullscreenSettings.fontFamily;
    }

    setupAutoHideFullscreen() {
        const fullscreenDiv = document.getElementById('fullscreenMode');
        const controls = document.getElementById('fullscreenControls');
        const settings = document.getElementById('fullscreenSettings');
        
        if (!fullscreenDiv) return;
        
        this.fullscreenHideTimer = null;
        
        // Função para mostrar controles
        const showControls = () => {
            fullscreenDiv.classList.add('show-cursor');
            controls?.classList.remove('hidden');
            settings?.classList.remove('hidden');
        };
        
        // Função para esconder controles
        const hideControls = () => {
            fullscreenDiv.classList.remove('show-cursor');
            controls?.classList.add('hidden');
            settings?.classList.add('hidden');
        };
        
        // Função para resetar timer
        this.resetHideTimer = () => {
            clearTimeout(this.fullscreenHideTimer);
            showControls();
            this.fullscreenHideTimer = setTimeout(hideControls, 3000);
        };
        
        // Event listener para movimento do mouse
        fullscreenDiv.addEventListener('mousemove', this.resetHideTimer);
        fullscreenDiv.addEventListener('click', this.resetHideTimer);
        
        // Iniciar timer
        this.resetHideTimer();
    }

    exitFullscreen() {
        // Limpar timer de auto-hide
        if (this.fullscreenHideTimer) {
            clearTimeout(this.fullscreenHideTimer);
            this.fullscreenHideTimer = null;
        }
        
        // Remover elemento de tela cheia
        const fullscreenDiv = document.getElementById('fullscreenMode');
        if (fullscreenDiv) {
            fullscreenDiv.remove();
        }
        
        // Restaurar scroll
        document.body.style.overflow = '';
        
        // Atualizar botão principal
        if (this.elements.fullscreenBtn) {
            this.elements.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> TELA CHEIA';
        }
        
        // Remover listener do ESC
        if (this.handleEscKey) {
            document.removeEventListener('keydown', this.handleEscKey);
            this.handleEscKey = null;
        }
        
        this.isFullscreen = false;
    }

    updateFullscreenText() {
        // Atualizar texto no modo tela cheia
        if (this.isFullscreen) {
            const fullscreenText = document.getElementById('fullscreenText');
            const fullscreenMic = document.getElementById('fullscreenMic');
            
            if (fullscreenText) {
                fullscreenText.textContent = this.finalTranscript || 'Aguardando fala...';
            }
            
            if (fullscreenMic) {
                fullscreenMic.src = this.isRecording ? 'images/micon.svg' : 'images/micoff.svg';
            }
            
            // Atualizar botão de iniciar/parar
            const startBtn = document.querySelector('.fullscreen-controls button');
            if (startBtn) {
                startBtn.innerHTML = this.isRecording ? '<i class="fas fa-stop"></i> PARAR' : '<i class="fas fa-play"></i> INICIAR';
            }
        }
    }

    syncSettings() {
        // Salvar configurações atuais
        this.saveSettings();
    }

    updateUI() {
        const startBtn = this.elements.startBtn;
        const micIcon = this.elements.micIcon;
        const statusIndicator = this.elements.statusIndicator;
        
        if (startBtn) {
            if (this.isRecording) {
                startBtn.innerHTML = '<i class="fas fa-stop"></i> PARAR';
                startBtn.classList.add('recording');
                startBtn.title = 'Parar Transcrição';
            } else {
                startBtn.innerHTML = '<i class="fas fa-play"></i> INICIAR';
                startBtn.classList.remove('recording');
                startBtn.title = 'Iniciar Transcrição';
            }
        }
        
        // Atualizar ícone do microfone
        if (micIcon) {
            micIcon.src = this.isRecording ? './images/micon.svg' : './images/micoff.svg';
            micIcon.title = this.isRecording ? 'Gravando' : 'Parado';
        }
        
        // Atualizar indicador de status
        if (statusIndicator) {
            statusIndicator.className = 'status-indicator ' + 
                (this.isRecording ? 'recording' : 'stopped');
        }
        
        // Atualizar favicon
        const favicon = document.getElementById('icon');
        if (favicon) {
            favicon.href = this.isRecording ? './images/micon.svg' : './images/micoff.svg';
        }
        
        // Atualizar também o modo tela cheia
        this.updateFullscreenText();
    }

    showNotification(message, type = 'info') {
        // Remover notificação anterior
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Criar nova notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    saveSettings() {
        const settings = {
            currentLanguage: this.currentLanguage,
            targetLanguage: this.targetLanguage,
            autoTranslate: this.autoTranslate,
            continuous: this.elements.continuousCheck?.checked || false
        };
        
        localStorage.setItem('speechRecognitionSettings', JSON.stringify(settings));
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('speechRecognitionSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                
                this.currentLanguage = settings.currentLanguage || 'pt-BR';
                this.targetLanguage = settings.targetLanguage || 'en';
                this.autoTranslate = settings.autoTranslate || false;
                
                // Aplicar configurações aos elementos
                if (this.elements.languageSelect) {
                    this.elements.languageSelect.value = this.currentLanguage;
                }
                if (this.elements.targetLanguageSelect) {
                    this.elements.targetLanguageSelect.value = this.targetLanguage;
                }
                if (this.elements.autoTranslateCheck) {
                    this.elements.autoTranslateCheck.checked = this.autoTranslate;
                }
                if (this.elements.continuousCheck) {
                    this.elements.continuousCheck.checked = settings.continuous || false;
                }
                
                this.syncSettings();
            }
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        }
    }

    // Métodos de personalização
    updateFontSize(value) {
        const output = this.elements.output;
        const fullscreenOutput = this.elements.fullscreenElements.output;
        const fontSizeValue = document.getElementById('fontSizeValue');
        const fontSizeValueFull = document.getElementById('fontSizeValueFull');
        
        if (output) output.style.fontSize = `${value}px`;
        if (fullscreenOutput) {
            const textContainer = fullscreenOutput.querySelector('.fullscreen-text');
            if (textContainer) textContainer.style.fontSize = `${value}px`;
        }
        if (fontSizeValue) fontSizeValue.textContent = `${value}px`;
        if (fontSizeValueFull) fontSizeValueFull.textContent = `${value}px`;
        
        // Sincronizar controles
        if (this.elements.fontSizeInput) this.elements.fontSizeInput.value = value;
        if (this.elements.fullscreenElements.fontSizeInput) this.elements.fullscreenElements.fontSizeInput.value = value;
    }
    
    updateFontColor(color) {
        const output = this.elements.output;
        const fullscreenOutput = this.elements.fullscreenElements.output;
        
        if (output) output.style.color = color;
        if (fullscreenOutput) {
            const textContainer = fullscreenOutput.querySelector('.fullscreen-text');
            if (textContainer) textContainer.style.color = color;
        }
        
        // Sincronizar controles
        if (this.elements.fontColorInput) this.elements.fontColorInput.value = color;
        if (this.elements.fullscreenElements.fontColorInput) this.elements.fullscreenElements.fontColorInput.value = color;
    }
    
    updateFontFamily(fontFamily) {
        const output = this.elements.output;
        const fullscreenOutput = this.elements.fullscreenElements.output;
        
        if (output) output.style.fontFamily = fontFamily;
        if (fullscreenOutput) {
            const textContainer = fullscreenOutput.querySelector('.fullscreen-text');
            if (textContainer) textContainer.style.fontFamily = fontFamily;
        }
        
        // Sincronizar controles
        if (this.elements.fontFamilySelect) this.elements.fontFamilySelect.value = fontFamily;
        if (this.elements.fullscreenElements.fontFamilySelect) this.elements.fullscreenElements.fontFamilySelect.value = fontFamily;
    }
    
    updateBackgroundColor(color) {
        // Apenas disponível no modo tela cheia
        if (this.isFullscreen) {
            document.body.style.backgroundColor = color;
        }
    }

    // Método de teste para verificar se os elementos existem
    testFullscreenElements() {
        console.log('=== TESTE DOS ELEMENTOS DE TELA CHEIA ===');
        const elements = {
            fullscreenContainer: document.getElementById('fullscreenContainer'),
            fullscreenControls: document.getElementById('menufull'),
            fullscreenOutput: document.getElementById('outputfullscreen'),
            fullscreenText: document.querySelector('#outputfullscreen .fullscreen-text'),
            startBtnFullscreen: document.getElementById('startButtonfullscreen'),
            exitBtnFullscreen: document.getElementById('exitfullscreenButton'),
            mainContainer: document.querySelector('.container')
        };
        
        Object.entries(elements).forEach(([name, element]) => {
            console.log(`${name}:`, element ? '✓ ENCONTRADO' : '✗ NÃO ENCONTRADO');
            if (element) {
                const styles = window.getComputedStyle(element);
                console.log(`  - Display: ${element.style.display || styles.display}`);
                console.log(`  - Visibility: ${element.style.visibility || styles.visibility}`);
                console.log(`  - Opacity: ${element.style.opacity || styles.opacity}`);
                console.log(`  - Z-index: ${element.style.zIndex || styles.zIndex}`);
            }
        });
        
        console.log('Current fullscreen state:', this.isFullscreen);
        console.log('Body classes:', document.body.className);
        console.log('==========================================');
        return elements;
    }
    
    // Método para forçar modo tela cheia (para debug)
    forceFullscreenMode() {
        console.log('Forcing fullscreen mode...');
        this.isFullscreen = true;
        this.updateFullscreenUI();
        console.log('Fullscreen mode forced');
    }
    
    // Método para sair forçadamente do modo tela cheia (para debug)
    forceExitFullscreen() {
        console.log('Forcing exit fullscreen...');
        this.isFullscreen = false;
        this.updateFullscreenUI();
        console.log('Exited fullscreen mode');
    }
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.speechApp = new SpeechRecognitionApp();
    
    // Funções globais para debug (pode remover em produção)
    window.testFullscreen = () => window.speechApp.testFullscreenElements();
    window.forceFullscreen = () => window.speechApp.forceFullscreenMode();
    window.forceExit = () => window.speechApp.forceExitFullscreen();
    
    console.log('Aplicação carregada. Comandos de debug disponíveis:');
    console.log('- testFullscreen(): Testar elementos de tela cheia');
    console.log('- forceFullscreen(): Forçar modo tela cheia');
    console.log('- forceExit(): Sair do modo tela cheia');
});

// Adicionar estilos para notificações se não existirem
if (!document.querySelector('style[data-notification-styles]')) {
    const notificationStyles = document.createElement('style');
    notificationStyles.setAttribute('data-notification-styles', '');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--surface-color, #fff);
            color: var(--text-color, #333);
            padding: 12px 20px;
            border-radius: 8px;
            border-left: 4px solid var(--primary-color, #007bff);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification.error {
            border-left-color: #dc3545;
            background: #f8d7da;
            color: #721c24;
        }
        
        .notification.warning {
            border-left-color: #ffc107;
            background: #fff3cd;
            color: #856404;
        }
        
        .notification.info {
            border-left-color: #17a2b8;
            background: #d1ecf1;
            color: #0c5460;
        }
    `;
    document.head.appendChild(notificationStyles);
}
