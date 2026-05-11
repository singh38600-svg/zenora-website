const canvas = document.getElementById('scroll-canvas');
const context = canvas.getContext('2d');
const progressText = document.getElementById('progress');
const loader = document.getElementById('loader');

const frameCount = 240;
const currentFrame = index => (
    `frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const images = [];
const animationState = {
    frame: 0
};

// Preload images
const preloadImages = () => {
    let loadedCount = 0;
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
            loadedCount++;
            const progress = Math.round((loadedCount / frameCount) * 100);
            progressText.innerText = `${progress}%`;
            
            if (loadedCount === frameCount) {
                setTimeout(() => {
                    loader.classList.add('hidden');
                    initAnimation();
                }, 500);
            }
        };
        images.push(img);
    }
};

const initAnimation = () => {
    // Set canvas dimensions to full screen
    const setCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
    };

    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();

    const scrollContainer = document.querySelector('.hero-scroll-container');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const containerTop = scrollContainer.offsetTop;
        const containerHeight = scrollContainer.offsetHeight - window.innerHeight;
        
        let progress = (scrollTop - containerTop) / containerHeight;
        progress = Math.max(0, Math.min(1, progress));
        
        const frameIndex = Math.floor(progress * (frameCount - 1));
        requestAnimationFrame(() => updateFrame(frameIndex));
    });
};

const updateFrame = (index) => {
    animationState.frame = index;
    render();
};

const render = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const img = images[animationState.frame];
    if (img) {
        // Calculate "cover" dimensions
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
};

preloadImages();
