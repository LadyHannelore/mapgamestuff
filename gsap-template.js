    <script>
        // Initialize GSAP
        gsap.registerPlugin(ScrollTrigger);
        
        document.addEventListener('DOMContentLoaded', function() {
            // GSAP page entrance animations
            const tl = gsap.timeline();
            
            tl.fromTo('.hero-title', 
                { opacity: 0, y: -30, scale: 0.9 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    duration: 1,
                    ease: "back.out(1.7)"
                }
            )
            .fromTo('.glassmorphism', 
                { opacity: 0, scale: 0.95, y: 20 },
                { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.8");
            
            // Animate cards with ScrollTrigger
            gsap.utils.toArray('.card').forEach(card => {
                gsap.fromTo(card, 
                    { opacity: 0, y: 40, rotation: 1 },
                    {
                        opacity: 1,
                        y: 0,
                        rotation: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        });
        
        // Navigation loader with GSAP animations
        fetch('nav.html')
            .then(res => res.text())
            .then(text => {
                document.getElementById('nav-placeholder').innerHTML = text;
                
                // Animate navigation
                gsap.fromTo('nav', 
                    { opacity: 0, y: -30 },
                    { 
                        opacity: 1, 
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out"
                    }
                );
                
                var script = document.createElement('script');
                script.innerHTML = `
                    document.getElementById('mobile-menu-button').addEventListener('click', function() {
                        var menu = document.getElementById('mobile-menu');
                        if (menu.classList.contains('hidden')) {
                            menu.classList.remove('hidden');
                            gsap.fromTo(menu, 
                                { opacity: 0, y: -20 },
                                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
                            );
                        } else {
                            gsap.to(menu, {
                                opacity: 0,
                                y: -20,
                                duration: 0.3,
                                ease: "power2.in",
                                onComplete: () => menu.classList.add('hidden')
                            });
                        }
                    });
                `;
                document.body.appendChild(script);
            });

        // GSAP ScrollTrigger for fade-in animations
        gsap.utils.toArray('.fade-in').forEach(element => {
            gsap.fromTo(element,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    </script>
