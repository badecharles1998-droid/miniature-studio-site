document.addEventListener('DOMContentLoaded', () => {

    /*=============== MENU MOBILE (BURGER) ===============*/
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
            // Change icon
            navToggle.querySelector('i').classList.toggle('fa-bars');
            navToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    /*=============== STICKY HEADER ===============*/
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY >= 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    /*=============== ANIMATIONS ON SCROLL ===============*/
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach(el => observer.observe(el));

    /*=============== TESTIMONIAL SLIDER ===============*/
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        const slides = testimonialSlider.querySelectorAll('.testimonial__slide');
        const btnLeft = testimonialSlider.querySelector('.slider__btn--left');
        const btnRight = testimonialSlider.querySelector('.slider__btn--right');
        let currentSlide = 0;
        const maxSlide = slides.length;

        const goToSlide = (slide) => {
            slides.forEach((s, i) => {
                s.classList.remove('active');
            });
            slides[slide].classList.add('active');
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % maxSlide;
            goToSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + maxSlide) % maxSlide;
            goToSlide(currentSlide);
        };
        
        btnRight.addEventListener('click', nextSlide);
        btnLeft.addEventListener('click', prevSlide);
        
        // Auto-play
        setInterval(nextSlide, 7000); // Change slide every 7 seconds
        
        goToSlide(0); // Initialize slider
    }

    /*=============== PORTFOLIO FILTER ===============*/
    const filterContainer = document.querySelector('.portfolio__filters');
    if (filterContainer) {
        const filterBtns = filterContainer.querySelectorAll('.portfolio__filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-page__grid .portfolio__item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Set active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.dataset.category === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    /*=============== FAQ ACCORDION ===============*/
    const faqItems = document.querySelectorAll('.faq__item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        question.addEventListener('click', () => {
            const openItem = document.querySelector('.faq__item.active');
            if(openItem && openItem !== item) {
                openItem.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });

    /*=============== PRICING CALCULATOR ===============*/
    const quantityInput = document.getElementById('quantity-input');
    const minusBtn = document.getElementById('quantity-minus');
    const plusBtn = document.getElementById('quantity-plus');
    const totalPriceEl = document.getElementById('total-price');
    const pricePerUnit = 25;

    function updatePrice() {
        if (quantityInput && totalPriceEl) {
            const quantity = parseInt(quantityInput.value);
            const totalPrice = quantity * pricePerUnit;
            totalPriceEl.textContent = totalPrice.toFixed(2);
        }
    }

    if (quantityInput) {
        quantityInput.addEventListener('input', updatePrice);

        minusBtn.addEventListener('click', () => {
            if (quantityInput.value > 1) {
                quantityInput.value--;
                updatePrice();
            }
        });

        plusBtn.addEventListener('click', () => {
            const max = parseInt(quantityInput.max);
            if(quantityInput.value < max) {
               quantityInput.value++;
               updatePrice();
            }
        });
        
        updatePrice(); // Initial calculation
    }
});