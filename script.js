document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(CustomEase, Flip);

    CustomEase.create(
        "hop",
        "M0,0 C0.053,0.604 0.157,0.72 0.293,0.837 0.435,0.959 0.633,1 1,1"
    );

    const itemsCount = 30;
    const container = document.querySelector(".container");
    const gallery = document.querySelector(".gallery");
    let isCircularLayout = false;

    const createItems = () => {
        for (let i = 1; i <= itemsCount; i++) {
            const item = document.createElement("div");
            item.classList.add("item");

            const img = document.createElement("img");
            img.src = `./images/img${i}.avif`;
            console.log(img.src);
            img.alt = `Image ${i}`;

            item.appendChild(img);
            gallery.appendChild(item);
        }
    };

    const setInitialLinearLayout = () => {
        const items = document.querySelectorAll(".item");
        const gap = window.innerWidth <= 768 ? 4 : 10;
        const totalItemsWidth = (items.length - 1) * gap + items[0].offsetWidth;
        const startX = (container.offsetWidth - totalItemsWidth) / 2;

        items.forEach((item, index) => {
            gsap.set(item, {
                left: `${startX + index * gap}px`,
                top: "150%",
                rotation: 0,
            });
        });

        gsap.to(items, {
            top: "50%",
            transform: "translateY(-50%)",
            duration: 1,
            ease: "hop",
            stagger: 0.03,
        });

        // Sync counter to the initial layout animation duration
        const counter = document.querySelector(".loader p");
        const counterObj = { val: 0 };
        const totalDuration = 1 + (items.length - 1) * 0.03;
        
        gsap.to(counterObj, {
            val: 100,
            duration: totalDuration,
            ease: "none",
            onUpdate: () => {
                counter.textContent = Math.floor(counterObj.val);
            },
            onComplete: () => {
                gsap.to(".loader", {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        document.querySelector(".loader").style.display = "none";
                    }
                });
            }
        });

        gsap.to(".loader p, .nav-item p", {
            y: 0,
            duration: 1,
            ease: "hop"
        });
    };

    const setCircularLayout = () => {
        const items = document.querySelectorAll(".item");
        const angleIncrement = (2 * Math.PI) / itemsCount;
        const radius = window.innerWidth <= 768 
            ? Math.min(container.offsetWidth, container.offsetHeight) / 2.8 
            : Math.min(container.offsetWidth, container.offsetHeight) / 5;
        const centerX = container.offsetWidth / 2;
        const centerY = container.offsetHeight / 2;
    
        items.forEach((item, index) => {
            const angle = index * angleIncrement;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
    
            gsap.set(item, {
                left: `${x}px`,
                top: `${y}px`,
                rotation: (angle * 180) / Math.PI - 90, // Aligning rotation with circular layout
                transform: "translate(-50%, -50%)",
            });
        });
    };
    

    const animateToCircularLayout = () => {
        const items = document.querySelectorAll(".item");
        const state = Flip.getState(items); // Capture the current state
    
        setCircularLayout(); // Change to the circular layout
    
        Flip.from(state, {
            duration: 2,
            ease: "hop",
            stagger: -0.03,
            onEnter: (element) => gsap.to(element, { rotation: "+=360" }), // Add rotation on entering
        });
    
        isCircularLayout = !isCircularLayout; // Toggle layout state
    };
    

    const initGallery = () => {
        createItems(); // Add gallery items
        setInitialLinearLayout(); // Set linear layout
    };
    setTimeout(() => {
        animateToCircularLayout();
    }, 2000);
    initGallery();
});
