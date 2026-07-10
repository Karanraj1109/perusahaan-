document.addEventListener("DOMContentLoaded", () => {
    /* ==========================================================================
       1. LOADING SCREEN
       ========================================================================== */
    const loader = document.getElementById("loader");
    window.addEventListener("load", () => {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.visibility = "hidden";
                loader.style.display = "none";
                triggerReveals(); // Trigger initial reveals after load
            }, 600);
        }, 800); // Artificial delay for effect
    });

    /* ==========================================================================
       2. STICKY NAVBAR & SCROLL PROGRESS
       ========================================================================== */
    const header = document.getElementById("header");
    const scrollBar = document.getElementById("scrollBar");
    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollBar.style.width = scrolled + "%";

        // Back to Top Button
        if (window.scrollY > 500) {
            backToTop.classList.add("active");
        } else {
            backToTop.classList.remove("active");
        }
    });

    /* ==========================================================================
       3. MOBILE MENU (HAMBURGER)
       ========================================================================== */
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        hamburger.classList.toggle("active");
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
            
            // Active state handling
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });

    /* ==========================================================================
       4. SCROLL REVEAL ANIMATION
       ========================================================================== */
    const reveals = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    function triggerReveals() {
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 50;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add("active");
            }
        });
    }

    /* ==========================================================================
       5. COUNTER ANIMATION
       ========================================================================== */
    const counters = document.querySelectorAll(".counter");
    let hasCounted = false;

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute("data-target");
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps

                    let currentCount = 0;
                    const updateCounter = () => {
                        currentCount += increment;
                        if (currentCount < target) {
                            counter.innerText = Math.ceil(currentCount);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
                hasCounted = true;
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    /* ==========================================================================
       6. PROJECT FILTER
       ========================================================================== */
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove("active"));
            // Add active class to clicked button
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
                    card.classList.remove("hide");
                    // Retrigger animation
                    card.style.animation = "none";
                    card.offsetHeight; /* trigger reflow */
                    card.style.animation = null;
                } else {
                    card.classList.add("hide");
                }
            });
        });
    });

    /* ==========================================================================
       7. TESTIMONIAL SLIDER
       ========================================================================== */
    const track = document.getElementById("testiTrack");
    const cards = Array.from(track.children);
    const nextBtn = document.getElementById("nextTesti");
    const prevBtn = document.getElementById("prevTesti");
    
    let currentIndex = 0;
    
    function updateSliderPosition() {
        const cardWidth = cards[0].getBoundingClientRect().width;
        // Gap is 2rem (32px), handled via calculation
        const gap = window.innerWidth > 768 ? 32 : 0;
        track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
    }

    nextBtn.addEventListener("click", () => {
        let cardsVisible = window.innerWidth > 1024 ? 3 : (window.innerWidth > 480 ? 2 : 1);
        if (currentIndex < cards.length - cardsVisible) {
            currentIndex++;
            updateSliderPosition();
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
        }
    });
    
    window.addEventListener("resize", () => {
        currentIndex = 0;
        updateSliderPosition();
    });

    /* ==========================================================================
       8. FAQ ACCORDION
       ========================================================================== */
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const btn = item.querySelector(".faq-question");
        btn.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            
            // Close all
            faqItems.forEach(faq => {
                faq.classList.remove("active");
                faq.querySelector(".faq-answer").style.maxHeight = null;
            });

            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add("active");
                const answer = item.querySelector(".faq-answer");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    /* ==========================================================================
       9. FORM SUBMISSION (Prevent Default for Demo)
       ========================================================================== */
    const contactForm = document.getElementById("contactForm");
    if(contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Pesan Terkirim <i class="fas fa-check ml-1"></i>';
            btn.style.backgroundColor = "#28a745";
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = "";
                contactForm.reset();
            }, 3000);
        });
    }
});
