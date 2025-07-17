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
});// ... (tout le code JS existant jusqu'à la simulation de paiement) ...

    /*=============== INTÉGRATION PAYPAL SMART BUTTONS ===============*/
    const paymentStatusEl = document.getElementById('payment-status');
    
    // Fonction générique pour créer un bouton PayPal
    function renderPayPalButton(containerId, purchaseDetails) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Le conteneur PayPal #${containerId} n'a pas été trouvé.`);
            return;
        }
        // Vider le conteneur avant de rendre un nouveau bouton (utile pour la commande personnalisée)
        container.innerHTML = ''; 

        paypal.Buttons({
            // Logique pour créer la commande
            createOrder: function(data, actions) {
                console.log("Création de la commande...", purchaseDetails);
                return actions.order.create({
                    purchase_units: [{
                        description: purchaseDetails.description,
                        amount: {
                            currency_code: 'EUR',
                            value: purchaseDetails.price
                        }
                    }]
                });
            },

            // Logique lorsque le paiement est approuvé par l'utilisateur
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    console.log("Paiement réussi !", details);
                    paymentStatusEl.textContent = `Paiement de ${details.purchase_units[0].amount.value}€ réussi ! Merci, ${details.payer.name.given_name}.`;
                    paymentStatusEl.className = 'payment-status-message success';
                    
                    // Cacher le message après quelques secondes
                    setTimeout(() => {
                        paymentStatusEl.style.display = 'none';
                    }, 6000);
                });
            },

            // Logique en cas d'erreur
            onError: function(err) {
                console.error("Une erreur est survenue avec le paiement PayPal.", err);
                paymentStatusEl.textContent = "Une erreur est survenue durant le paiement. Veuillez réessayer.";
                paymentStatusEl.className = 'payment-status-message error';
            }
        }).render(`#${containerId}`);
    }

    // Rendre les boutons pour les offres fixes
    renderPayPalButton('paypal-button-container-unique', { description: 'Miniature Unique', price: '25.00' });
    renderPayPalButton('paypal-button-container-pack5', { description: 'Pack 5 Miniatures', price: '115.00' });
    renderPayPalButton('paypal-button-container-pack10', { description: 'Pack 10 Miniatures', price: '225.00' });

    // Logique pour la commande personnalisée
    const confirmCustomOrderBtn = document.getElementById('confirm-custom-order');
    if (confirmCustomOrderBtn) {
        confirmCustomOrderBtn.addEventListener('click', () => {
            const quantity = document.getElementById('quantity-input').value;
            const price = document.getElementById('total-price').textContent;
            
            const customPurchaseDetails = {
                description: `${quantity} Miniature(s) sur mesure`,
                price: price
            };
            
            // Rendre le bouton PayPal uniquement après la confirmation de la quantité
            renderPayPalButton('paypal-button-container-custom', customPurchaseDetails);
            confirmCustomOrderBtn.style.display = 'none'; // Cacher le bouton de validation
        });
    }