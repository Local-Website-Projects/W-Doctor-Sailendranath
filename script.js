/* ==========================================================================
   Dr. Shailendranath Biswas Portfolio JavaScript
   Interactive logic, active scroll tracking, dynamic FAQ, live chamber status,
   bilingual switching (EN/BN), and serial builder message generator.
   ========================================================================== */

// Global update pointer for chamber statuses
let updateChamberStatuses = () => {};
let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitcher();
    initNavigation();
    initFAQ();
    initChamberStatus();
    initAppointmentBuilder();
    
    // Apply preferred language
    applyLanguage(currentLang);
});

/**
 * Multi-Language Switcher (English / Bengali)
 */
function initLanguageSwitcher() {
    // Read from localStorage if set
    currentLang = localStorage.getItem('preferredLang') || 'en';
    
    const langBtns = document.querySelectorAll('[data-switch-lang]');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-switch-lang');
            applyLanguage(selectedLang);
        });
    });
}

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLang', lang);
    document.body.className = `lang-${lang}`;
    document.documentElement.lang = lang;
    
    // Toggle active state on language switcher buttons
    document.querySelectorAll('[data-switch-lang]').forEach(btn => {
        if (btn.getAttribute('data-switch-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Refresh chamber statuses using translated strings
    if (typeof updateChamberStatuses === 'function') {
        updateChamberStatuses();
    }
}

/**
 * Mobile Navigation Menu & Smooth Scroll Active Highlighting
 */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        // Simple animation for the bars
        const bars = navToggle.querySelectorAll('.bar');
        if (navToggle.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // Scroll active link highlight using IntersectionObserver
    const sections = document.querySelectorAll('section, header');
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // triggers when section is in the middle of the viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.id) observer.observe(section);
    });
}

/**
 * FAQ Accordion Toggles
 */
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Live Chamber Status Calculator
 * Calculates whether Dr. Biswas is currently in clinic based on the local time and day.
 * Includes dynamic English and Bengali translation mappings.
 */
function initChamberStatus() {
    const translations = {
        en: {
            checking: "Checking status...",
            inChamber: "In Chamber Now",
            opensToday3: "Opens Today at 3:00 PM",
            closedTomorrow3: "Chamber Closed (Opens Tomorrow 3:00 PM)",
            closedSat3: "Closed (Opens Sat 3:00 PM)",
            closedFriday: "Closed Today (Friday)",
            opensToday830: "Opens Today at 8:30 AM",
            closedNextFriday: "Closed (Opens next Friday)",
            fridayOnly: "Chamber Open on Fridays Only",
            availableCall: "Available Today on Call",
            closedTodayFriday: "Closed Today (Friday)"
        },
        bn: {
            checking: "আপডেট দেখা হচ্ছে...",
            inChamber: "বর্তমানে চেম্বারে আছেন",
            opensToday3: "আজ বিকাল ৩:০০ টায় খুলবে",
            closedTomorrow3: "চেম্বার বন্ধ (আগামীকাল বিকাল ৩:০০ টায় খুলবে)",
            closedSat3: "বন্ধ (শনিবার বিকাল ৩:০০ টায় খুলবে)",
            closedFriday: "আজ বন্ধ (শুক্রবার)",
            opensToday830: "আজ সকাল ৮:৩০ টায় খুলবে",
            closedNextFriday: "বন্ধ (আগামী শুক্রবার খুলবে)",
            fridayOnly: "শুধুমাত্র শুক্রবার চেম্বার খোলা",
            availableCall: "আজ ফোনে সিরিয়াল নেওয়া হচ্ছে",
            closedTodayFriday: "আজ বন্ধ (শুক্রবার)"
        }
    };

    updateChamberStatuses = function() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMinutes = hours * 60 + minutes;

        // Element references
        const statusSandhani = document.getElementById('status-sandhani');
        const statusJanani = document.getElementById('status-janani');
        const statusIslamia = document.getElementById('status-islamia');

        if (!statusSandhani || !statusJanani || !statusIslamia) return;

        const t = translations[currentLang] || translations['en'];

        /* --- Sandhani Clinic: Sat - Thu (6, 0, 1, 2, 3, 4), 3:00 PM - 9:00 PM (900 - 1260 mins) --- */
        const isSandhaniDay = (day === 6 || day === 0 || day === 1 || day === 2 || day === 3 || day === 4);
        if (isSandhaniDay) {
            if (totalMinutes >= 900 && totalMinutes < 1260) {
                statusSandhani.textContent = t.inChamber;
                statusSandhani.className = "chamber-status active";
            } else if (totalMinutes < 900) {
                statusSandhani.textContent = t.opensToday3;
                statusSandhani.className = "chamber-status";
            } else {
                statusSandhani.textContent = t.closedTomorrow3;
                if (day === 4) { // Thursday night, next open is Saturday
                    statusSandhani.textContent = t.closedSat3;
                }
                statusSandhani.className = "chamber-status";
            }
        } else {
            // Friday
            statusSandhani.textContent = t.closedFriday;
            statusSandhani.className = "chamber-status";
        }

        /* --- Janani Diagnostic Centre: Friday Only (5), 8:30 AM - 3:30 PM (510 - 930 mins) --- */
        const isJananiDay = (day === 5);
        if (isJananiDay) {
            if (totalMinutes >= 510 && totalMinutes < 930) {
                statusJanani.textContent = t.inChamber;
                statusJanani.className = "chamber-status active";
            } else if (totalMinutes < 510) {
                statusJanani.textContent = t.opensToday830;
                statusJanani.className = "chamber-status";
            } else {
                statusJanani.textContent = t.closedNextFriday;
                statusJanani.className = "chamber-status";
            }
        } else {
            statusJanani.textContent = t.fridayOnly;
            statusJanani.className = "chamber-status";
        }

        /* --- Islami Bank Hospital: Sat - Thu (6, 0, 1, 2, 3, 4), Appointment Based --- */
        const isIslamiaDay = (day === 6 || day === 0 || day === 1 || day === 2 || day === 3 || day === 4);
        if (isIslamiaDay) {
            statusIslamia.textContent = t.availableCall;
            statusIslamia.className = "chamber-status active";
        } else {
            statusIslamia.textContent = t.closedTodayFriday;
            statusIslamia.className = "chamber-status";
        }
    };

    // Run immediately and update every 60 seconds
    updateChamberStatuses();
    setInterval(updateChamberStatuses, 60000);
}

/**
 * Appointment Serial Builder
 * Handles form validation and generates direct WhatsApp templates.
 */
function initAppointmentBuilder() {
    const form = document.getElementById('appointmentForm');
    const resultBox = document.getElementById('bookingResult');
    const resultText = document.getElementById('resultText');
    const copyBtn = document.getElementById('copyBtn');
    const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('patientName').value.trim();
        const age = document.getElementById('patientAge').value.trim();
        const chamberSelect = document.getElementById('chamberSelect');
        const chamberValue = chamberSelect.value;
        
        // Select chamber text depending on what language option is showing
        // Let's resolve the actual chamber name based on value
        let resolvedChamberEn = '';
        let resolvedChamberBn = '';
        if (chamberValue === 'Sandhani') {
            resolvedChamberEn = 'Sandhani Clinic (Babu Khan Road, Khulna)';
            resolvedChamberBn = 'সন্ধানী ক্লিনিক (বাবু খান রোড, খুলনা)';
        } else if (chamberValue === 'Janani') {
            resolvedChamberEn = 'Janani Diagnostic Centre (Post Office Main Road, Bagerhat)';
            resolvedChamberBn = 'জননী ডায়াগনস্টিক সেন্টার (পোস্ট অফিস মেইন রোড, বাগেরহাট)';
        } else {
            resolvedChamberEn = 'Islami Bank Hospital (Amtola, Nirala, Khulna)';
            resolvedChamberBn = 'ইসলামী ব্যাংক হাসপাতাল (আমতলা, নিরালা, খুলনা)';
        }
        
        const dateInput = document.getElementById('appointmentDate').value;
        const symptoms = document.getElementById('symptoms').value.trim();

        // Format Date
        const dateObj = new Date(dateInput);
        const formattedDateEn = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedDateBn = dateObj.toLocaleDateString('bn-BD', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Construct message template based on current active language
        let message = '';
        if (currentLang === 'bn') {
            message += `নমস্কার/হ্যালো চেম্বার কো-অর্ডিনেটর,\n`;
            message += `আমি ডাঃ শৈলেন্দ্রনাথ বিশ্বাসের সিরিয়ালের জন্য একটি অ্যাপয়েন্টমেন্ট বুক করতে চাই।\n\n`;
            message += `রোগীর নাম: ${name}\n`;
            message += `রোগীর বয়স: ${age} বছর\n`;
            message += `চেম্বার: ${resolvedChamberBn}\n`;
            message += `তারিখ: ${formattedDateBn}\n`;
            if (symptoms) {
                message += `সমস্যা/উপসর্গ: ${symptoms}\n`;
            }
            message += `\nঅনুগ্রহ করে আমাকে সিরিয়াল নম্বর ও সময়টি জানিয়ে দেবেন। ধন্যবাদ!`;
        } else {
            message += `Hello Chamber Coordinator,\n`;
            message += `I would like to request an appointment serial for Dr. Shailendranath Biswas.\n\n`;
            message += `Patient Name: ${name}\n`;
            message += `Patient Age: ${age} years\n`;
            message += `Chamber: ${resolvedChamberEn}\n`;
            message += `Preferred Date: ${formattedDateEn}\n`;
            if (symptoms) {
                message += `Key Problem/Symptoms: ${symptoms}\n`;
            }
            message += `\nPlease let me know the serial number and estimated timing. Thank you!`;
        }

        // Render result
        resultText.textContent = message;
        resultBox.classList.remove('hidden');

        // Scroll to results
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // WhatsApp redirection URL setup
        // If Janani Bagerhat, target Bagerhat coordinator: +8801710916500
        // Else target Sandhani coordinator: +8801979159579
        let serialPhone = '8801979159579';
        if (chamberValue === 'Janani') {
            serialPhone = '8801710916500';
        }

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${serialPhone}&text=${encodeURIComponent(message)}`;
        sendWhatsAppBtn.setAttribute('href', whatsappUrl);
    });

    // Copy to Clipboard Action
    copyBtn.addEventListener('click', () => {
        const textToCopy = resultText.textContent;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = currentLang === 'bn' ? 'কপি হয়েছে!' : 'Copied!';
                copyBtn.style.backgroundColor = '#10b981';
                copyBtn.style.color = '#ffffff';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.backgroundColor = '';
                    copyBtn.style.color = '';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert(currentLang === 'bn' ? 'কপি করা যায়নি, অনুগ্রহ করে সম্পূর্ণ টেক্সটটি সিলেক্ট করে কপি করুন।' : 'Could not copy automatically. Please copy the text manually.');
            });
    });
}
