// app.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');

    // View Management
    const views = {
        landing: document.getElementById('view-landing'),
        classSelection: document.getElementById('view-class-selection'),
        dashboard: document.getElementById('view-dashboard')
    };

    function showView(viewName) {
        Object.values(views).forEach(view => {
            if(view) view.classList.remove('active');
        });
        if(views[viewName]) {
            views[viewName].classList.add('active');
        }
    }

    // Initialize with landing page
    showView('landing');

    // Event Listeners
    const btnStartLearning = document.getElementById('btn-start-learning');
    if(btnStartLearning) {
        btnStartLearning.addEventListener('click', () => {
            showView('classSelection');
        });
    }

    // Populate Class Grid
    const classGrid = document.getElementById('class-grid');
    const streamSelection = document.getElementById('stream-selection');

    if (classGrid) {
        for (let i = 1; i <= 2; i++) {
            createClassCard(`Class ${i}`, `class_1_2`);
        }
        createClassCard(`Class 3`, `class_3`);
        for (let i = 4; i <= 5; i++) {
            createClassCard(`Class ${i}`, `class_4_5`);
        }
        for (let i = 6; i <= 8; i++) {
            createClassCard(`Class ${i}`, `junior_secondary`);
        }
        for (let i = 9; i <= 10; i++) {
            createClassCard(`Class ${i}`, `secondary`);
        }
        createClassCard(`Intermediate (11-12)`, `intermediate`);
    }

    function createClassCard(displayName, value) {
        const div = document.createElement('div');
        div.className = 'class-card';
        div.textContent = displayName;
        div.dataset.value = value;

        div.addEventListener('click', () => {
            // Remove selected class from all
            document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
            div.classList.add('selected');

            // Show stream selection if intermediate, otherwise proceed to dashboard
            if (value === 'intermediate') {
                streamSelection.classList.remove('hidden');
                // Scroll down slightly to make streams visible
                streamSelection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                streamSelection.classList.add('hidden');
                setupDashboard(displayName, value);
            }
        });

        classGrid.appendChild(div);
    }

    // Stream Selection Event Listeners
    const streamCards = document.querySelectorAll('.stream-card');
    streamCards.forEach(card => {
        card.addEventListener('click', () => {
            const stream = card.dataset.stream;
            setupDashboard(`Intermediate - ${stream.charAt(0).toUpperCase() + stream.slice(1)}`, stream);
        });
    });

    // Dashboard Logic
    const dashboardLevelDisplay = document.getElementById('dashboard-level-display');
    const subjectList = document.getElementById('subject-list');
    const chatEmptyState = document.getElementById('chat-empty-state');
    const chatInputArea = document.getElementById('chat-input-area');
    const chatSubjectTitle = document.getElementById('chat-subject-title');
    const chatSubjectIcon = document.getElementById('chat-subject-icon');
    const chatContainer = document.getElementById('chat-container');
    const btnBackSelection = document.getElementById('btn-back-selection');

    if(btnBackSelection) {
        btnBackSelection.addEventListener('click', () => {
            // Reset class selection state
            document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
            if(streamSelection) streamSelection.classList.add('hidden');

            showView('classSelection');
        });
    }

        const subjectsData = {
        class_1_2: [
            { id: 'ban', name: 'My Bengali Book', icon: 'fa-book' },
            { id: 'eng', name: 'English for Today', icon: 'fa-language' },
            { id: 'math', name: 'Primary Mathematics', icon: 'fa-calculator' }
        ],
        class_3: [
            { id: 'ban', name: 'My Bengali Book', icon: 'fa-book' },
            { id: 'eng', name: 'English for Today', icon: 'fa-language' },
            { id: 'math', name: 'Primary Mathematics', icon: 'fa-calculator' },
            { id: 'sci', name: 'Primary Science', icon: 'fa-microscope' }
        ],
        class_4_5: [
            { id: 'ban', name: 'My Bengali Book', icon: 'fa-book' },
            { id: 'eng', name: 'English for Today', icon: 'fa-language' },
            { id: 'math', name: 'Primary Mathematics', icon: 'fa-calculator' },
            { id: 'sci', name: 'Primary Science', icon: 'fa-microscope' },
            { id: 'geo', name: 'Bangladesh and World Geography', icon: 'fa-earth-asia' },
            { id: 'rel', name: 'Religion and Moral Education', icon: 'fa-hands-praying' }
        ],
        junior_secondary: [
            { id: 'ban', name: 'Bangla', icon: 'fa-book' },
            { id: 'eng', name: 'English', icon: 'fa-language' },
            { id: 'math', name: 'Mathematics', icon: 'fa-calculator' },
            { id: 'sci', name: 'Science', icon: 'fa-microscope' },
            { id: 'hist_soc', name: 'History and Social Science', icon: 'fa-landmark' },
            { id: 'dig_tech', name: 'Digital Technology', icon: 'fa-laptop-code' },
            { id: 'life_live', name: 'Life and Livelihood', icon: 'fa-briefcase' },
            { id: 'wellbeing', name: 'Health and Wellbeing', icon: 'fa-heart-pulse' },
            { id: 'rel', name: 'Religious Studies', icon: 'fa-hands-praying' },
            { id: 'art_cul', name: 'Art and Culture', icon: 'fa-palette' }
        ],
        secondary: [
            { id: 'ban', name: 'Bangla', icon: 'fa-book' },
            { id: 'eng', name: 'English', icon: 'fa-language' },
            { id: 'math', name: 'Mathematics', icon: 'fa-calculator' },
            { id: 'sci', name: 'Science', icon: 'fa-microscope' },
            { id: 'hist_soc', name: 'History and Social Science', icon: 'fa-landmark' },
            { id: 'dig_tech', name: 'Digital Technology', icon: 'fa-laptop-code' },
            { id: 'life_live', name: 'Life and Livelihood', icon: 'fa-briefcase' },
            { id: 'wellbeing', name: 'Health and Wellbeing', icon: 'fa-heart-pulse' },
            { id: 'rel', name: 'Religious Studies', icon: 'fa-hands-praying' },
            { id: 'art_cul', name: 'Art and Culture', icon: 'fa-palette' }
        ],
        science: [
            { id: 'ban', name: 'Bangla', icon: 'fa-book' },
            { id: 'eng', name: 'English', icon: 'fa-language' },
            { id: 'ict', name: 'ICT', icon: 'fa-laptop-code' },
            { id: 'phy', name: 'Physics', icon: 'fa-atom' },
            { id: 'chem', name: 'Chemistry', icon: 'fa-flask' },
            { id: 'bio', name: 'Biology', icon: 'fa-dna' },
            { id: 'hmath', name: 'Higher Math', icon: 'fa-square-root-variable' }
        ],
        arts: [
            { id: 'ban', name: 'Bangla', icon: 'fa-book' },
            { id: 'eng', name: 'English', icon: 'fa-language' },
            { id: 'ict', name: 'ICT', icon: 'fa-laptop-code' },
            { id: 'hist', name: 'History', icon: 'fa-monument' },
            { id: 'geo', name: 'Geography', icon: 'fa-earth-americas' },
            { id: 'civ', name: 'Civics / Logic', icon: 'fa-landmark' },
            { id: 'soc', name: 'Sociology / Economics', icon: 'fa-users' }
        ],
        commerce: [
            { id: 'ban', name: 'Bangla', icon: 'fa-book' },
            { id: 'eng', name: 'English', icon: 'fa-language' },
            { id: 'ict', name: 'ICT', icon: 'fa-laptop-code' },
            { id: 'acc', name: 'Accounting', icon: 'fa-file-invoice-dollar' },
            { id: 'fin', name: 'Finance & Banking', icon: 'fa-piggy-bank' },
            { id: 'bus', name: 'Business Organization', icon: 'fa-briefcase' },
            { id: 'eco', name: 'Economics', icon: 'fa-chart-pie' }
        ]
    };

    function setupDashboard(levelName, streamType) {
        dashboardLevelDisplay.textContent = levelName;
        subjectList.innerHTML = '';

        // Reset chat area
        chatEmptyState.classList.remove('hidden');
        chatInputArea.classList.add('hidden');
        chatSubjectTitle.textContent = 'Select a Subject';
        chatSubjectIcon.className = 'fa-solid fa-book';

        // Remove existing messages
        const msgs = chatContainer.querySelectorAll('.message');
        msgs.forEach(m => m.remove());

        const subjects = subjectsData[streamType] || subjectsData.class_1_2;

        subjects.forEach(sub => {
            const li = document.createElement('li');
            li.className = 'subject-item';
            li.innerHTML = `<i class="fa-solid ${sub.icon}"></i> <span>${sub.name}</span>`;

            li.addEventListener('click', () => {
                // Remove active class
                document.querySelectorAll('.subject-item').forEach(el => el.classList.remove('active'));
                li.classList.add('active');

                openChat(sub);
            });

            subjectList.appendChild(li);
        });

        showView('dashboard');
    }

    function openChat(subject) {
        chatSubjectTitle.textContent = subject.name;
        chatSubjectIcon.className = `fa-solid ${subject.icon}`;

        chatEmptyState.classList.add('hidden');
        chatInputArea.classList.remove('hidden');

        // Clear previous messages
        const msgs = chatContainer.querySelectorAll('.message');
        msgs.forEach(m => m.remove());

        // Add a greeting from AI
        addMessage('ai', `Hello! I'm your ${subject.name} AI tutor. How can I help you today?`);
    }

    // Chat functionality
    const btnSendMsg = document.getElementById('btn-send-msg');
    const chatInput = document.getElementById('chat-input');

    function handleSendMessage() {
        const text = chatInput.value.trim();
        if(!text) return;

        // User message
        addMessage('user', text);
        chatInput.value = '';

        // Simulate AI thinking and responding
        setTimeout(() => {
            addMessage('ai', `That's a great question about ${text}! Let's break it down together...`);
        }, 1000);
    }

    if(btnSendMsg) btnSendMsg.addEventListener('click', handleSendMessage);
    if(chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') handleSendMessage();
        });
    }

    function addMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;

        const avatarIcon = sender === 'ai' ? 'fa-robot' : 'fa-user';

        div.innerHTML = `
            <div class="avatar"><i class="fa-solid ${avatarIcon}"></i></div>
            <div class="msg-bubble"></div>
        `;

        // Securely add text content to prevent XSS
        const msgBubble = div.querySelector('.msg-bubble');
        msgBubble.textContent = text;

        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

});
