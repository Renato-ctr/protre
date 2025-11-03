document.addEventListener('DOMContentLoaded', () => {
            // --- Variáveis Globais ---
            const body = document.body;
            let animationIntensity = 1;

            // --- Fundo Plexus ---
            const canvas = document.getElementById('plexus-bg');
            const ctx = canvas.getContext('2d');
            let particles = [];
            function setupCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = body.scrollHeight;
                particles = [];
                const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
                for (let i = 0; i < particleCount; i++) {
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        vx: (Math.random() - 0.5) * 0.6,
                        vy: (Math.random() - 0.5) * 0.6,
                        radius: Math.random() * 2 + 1,
                    });
                }
            }
            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const particleColor = 'rgba(207, 250, 254, 0.9)';
                const lineColor = `rgba(100, 200, 220, ${animationIntensity === 1 ? 0.35 : 0.5})`;
                particles.forEach(p => {
                    p.x += p.vx * animationIntensity;
                    p.y += p.vy * animationIntensity;
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = particleColor;
                    ctx.fill();
                });
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                        if (dist < 120) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = lineColor;
                            ctx.lineWidth = 1 - dist / 120;
                            ctx.stroke();
                        }
                    }
                }
                requestAnimationFrame(draw);
            }

            // --- Rastro do Cursor ---
            document.addEventListener('mousemove', (e) => {
                const trail = document.createElement('div');
                trail.className = 'trail';
                body.appendChild(trail);
                const size = Math.random() * 4 + 2;
                trail.style.width = `${size * 2}px`;
                trail.style.height = `${size * 2}px`;
                trail.style.borderRadius = '50%';
                trail.style.left = `${e.clientX - size}px`;
                trail.style.top = `${e.clientY - size}px`;
                setTimeout(() => trail.remove(), 600);
            });

            // --- Navegação entre Abas (Páginas) ---
            const pages = document.querySelectorAll('.page');
            const navLinks = document.querySelectorAll('.nav-link');
            const nextButtons = document.querySelectorAll('.next-btn');
            function showPage(pageId) {
                pages.forEach(page => page.classList.remove('active'));
                const targetPage = document.getElementById(pageId);
                if (targetPage) targetPage.classList.add('active');
               
                navLinks.forEach(link => {
                    link.classList.toggle('active-link', link.getAttribute('href') === `#${pageId}`);
                });
            }
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    showPage(e.currentTarget.getAttribute('href').substring(1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            });
            nextButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const currentPage = button.closest('.page');
                    const allPages = Array.from(pages).filter(p => p.id !== 'welcome');
                    const currentIndex = allPages.indexOf(currentPage);
                    if (currentIndex < allPages.length - 1) {
                         showPage(allPages[currentIndex + 1].id);
                         window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
            });
           
            // --- Lógica do Quiz Interativo ---
            const quizData = [
                { question: "O que é um Processo na analogia do estúdio de cinema?", options: ["O diretor", "Um ator principal", "A câmera", "O roteiro"], answer: 1 },
                { question: "Qual recurso principal um Processo possui de forma exclusiva?", options: ["CPU", "Memória", "Teclado", "Dublês"], answer: 1 },
                { question: "O que representa o 'Contador de Programa'?", options: ["O número de atores", "A linha exata do roteiro", "O tempo de filme", "O orçamento"], answer: 1 },
                { question: "Um processo no estado 'Pronto' (Ready) está...", options: ["Aguardando um arquivo", "Sendo executado na CPU", "Esperando sua vez de usar a CPU", "Finalizado"], answer: 2 },
                { question: "O que são Threads na nossa analogia?", options: ["Outros atores principais", "A equipe de apoio do ator", "Os críticos de cinema", "O público"], answer: 1 },
                { question: "Qual a principal vantagem das Threads sobre os Processos?", options: ["São mais seguros", "Têm mais memória", "Compartilham memória e são mais leves", "Nunca dão erro"], answer: 2 },
                { question: "O que é uma 'Condição de Corrida' (Race Condition)?", options: ["Uma competição de atores", "Dois processos tentando acessar o mesmo recurso ao mesmo tempo", "Um erro de digitação no roteiro", "Quando o filme acaba"], answer: 1 },
                { question: "A regra de 'Exclusão Mútua' serve para...", options: ["Garantir que apenas um processo acesse uma Região Crítica por vez", "Expulsar atores do set", "Contratar mais dublês", "Aumentar o salário do diretor"], answer: 0 },
                { question: "O que é um Mutex (na analogia)?", options: ["O segurança da balada", "A sala de ensaio", "O Walkie-Talkie", "O roteiro"], answer: 2 },
                { question: "Um Semáforo é útil para...", options: ["Controlar o acesso a múltiplos recursos idênticos", "Garantir acesso a apenas um recurso", "Pausar um filme", "Acelerar a CPU"], answer: 0 },
                { question: "O que é Deadlock?", options: ["Quando um ator esquece a fala", "Um processo esperando por outro, que por sua vez espera pelo primeiro", "O fim do filme", "Um erro de hardware"], answer: 1 },
                { question: "No problema dos 'Leitores e Escritores', quem precisa de acesso exclusivo?", options: ["Os Leitores", "Os Escritores", "Ambos", "Ninguém"], answer: 1 },
                { question: "O que faz o Escalonador (Scheduler)?", options: ["Escreve o roteiro", "Decide qual processo usará a CPU", "Contrata os atores", "Serve o café"], answer: 1 },
                { question: "Qual algoritmo de escalonamento é o mais 'justo', dando um tempo igual para todos?", options: ["Por Prioridade", "Tarefa Mais Curta Primeiro", "Round Robin", "O mais famoso"], answer: 2 },
                { question: "A principal desvantagem do escalonamento por prioridade é...", options: ["Ser muito lento", "Processos de baixa prioridade podem nunca ser executados (starvation)", "Ser muito complicado", "Usar muita memória"], answer: 1 },
                { question: "O que o estado 'Bloqueado' (Blocked) significa?", options: ["O processo travou para sempre", "O processo está esperando por um evento externo (Ex: I/O)", "O processo foi deletado", "O processo está pronto para executar"], answer: 1 },
                { question: "Criar uma nova thread é geralmente mais ______ do que criar um novo processo.", options: ["lento e caro", "rápido e barato", "seguro e complexo", "instável e simples"], answer: 1 },
                { question: "A 'Região Crítica' é:", options: ["A parte mais importante do filme", "Uma seção de código que acessa recursos compartilhados", "O trailer do ator principal", "O camarim"], answer: 1 },
                { question: "Qual ferramenta é como uma 'sala de ensaio' que já garante a exclusão mútua?", options: ["Mutex", "Semáforo", "Monitor", "Contador"], answer: 2 },
                { question: "A comunicação entre threads do mesmo processo é rápida porque elas...", options: ["Usam a internet", "Falam a mesma língua", "Compartilham o mesmo espaço de memória", "São da mesma família"], answer: 2 },
                { question: "Se um processo precisa ler um arquivo no disco, ele provavelmente mudará para o estado:", options: ["Executando", "Pronto", "Bloqueado", "Finalizado"], answer: 2 },
                { question: "O que é 'context switching' (troca de contexto)?", options: ["Mudar o cenário do filme", "O SO salvando o estado de um processo para executar outro", "O ator trocando de figurino", "A troca de um disco rígido"], answer: 1 },
                { question: "No escalonamento 'Tarefa Mais Curta Primeiro', o que o sistema precisa saber de antemão?", options: ["A prioridade da tarefa", "O nome da tarefa", "A duração da tarefa", "O dono da tarefa"], answer: 2 },
                { question: "Qual o principal objetivo da sincronização?", options: ["Tornar os programas mais rápidos", "Evitar o caos e inconsistência de dados", "Usar menos CPU", "Deixar o código mais bonito"], answer: 1 },
                { question: "No final, quem é o 'diretor' do estúdio de cinema do seu PC?", options: ["Você, o usuário", "O processador (CPU)", "A memória RAM", "O Sistema Operacional"], answer: 3 },
            ];

            let currentQuestionIndex = 0;
            let score = 0;
            let answerSelected = false;

            const questionArea = document.getElementById('quiz-question-area');
            const resultsArea = document.getElementById('quiz-results');
            const questionEl = document.getElementById('quiz-question');
            const optionsEl = document.getElementById('quiz-options');
            const progressEl = document.getElementById('quiz-progress');
            const nextBtn = document.getElementById('quiz-next-btn');
           
            function loadQuestion() {
                answerSelected = false;
                nextBtn.classList.add('hidden');
                const currentQuestion = quizData[currentQuestionIndex];
                progressEl.textContent = `Pergunta ${currentQuestionIndex + 1} de ${quizData.length}`;
                questionEl.textContent = currentQuestion.question;
                optionsEl.innerHTML = '';
                currentQuestion.options.forEach((option, index) => {
                    const optionBtn = document.createElement('button');
                    optionBtn.className = 'quiz-option text-left w-full';
                    optionBtn.textContent = option;
                    optionBtn.dataset.index = index;
                    optionBtn.addEventListener('click', selectAnswer);
                    optionsEl.appendChild(optionBtn);
                });
            }

            function selectAnswer(e) {
                if (answerSelected) return;
                answerSelected = true;

                const selectedBtn = e.currentTarget;
                const selectedAnswer = parseInt(selectedBtn.dataset.index);
                const correctAnswer = quizData[currentQuestionIndex].answer;

                Array.from(optionsEl.children).forEach(btn => {
                    btn.disabled = true;
                });

                if (selectedAnswer === correctAnswer) {
                    score++;
                    selectedBtn.classList.add('correct');
                } else {
                    selectedBtn.classList.add('incorrect');
                    optionsEl.children[correctAnswer].classList.add('correct');
                }

                if (currentQuestionIndex < quizData.length - 1) {
                    nextBtn.classList.remove('hidden');
                } else {
                    setTimeout(showResults, 1000);
                }
            }
           
            nextBtn.addEventListener('click', () => {
                currentQuestionIndex++;
                loadQuestion();
            });

            function showResults() {
                questionArea.classList.add('hidden');
                resultsArea.classList.remove('hidden');
                nextBtn.classList.add('hidden');
               
                document.getElementById('quiz-score').textContent = `Você acertou ${score} de ${quizData.length}!`;
                let feedback = "Continue estudando!";
                if (score > 20) feedback = "Excelente! Você é um mestre da direção!";
                else if (score > 15) feedback = "Muito bem! Você já pode dirigir seu próprio filme.";
                document.getElementById('quiz-feedback').textContent = feedback;
            }

            document.getElementById('quiz-retry-btn').addEventListener('click', () => {
                currentQuestionIndex = 0;
                score = 0;
                resultsArea.classList.add('hidden');
                questionArea.classList.remove('hidden');
                loadQuestion();
            });

            // --- Inicialização ---
            showPage('welcome');
            loadQuestion();
            setupCanvas();
            draw();
            window.addEventListener('resize', () => {
                cancelAnimationFrame(draw);
                setupCanvas();
                draw();
            });
        });
