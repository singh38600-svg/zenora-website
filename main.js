const canvas = document.getElementById('scroll-canvas');
const context = canvas.getContext('2d');
const frameCount = 240;
const currentFrame = index => (
    `frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const images = [];
const animationState = {
    frame: 0
};

let isInitialized = false;

// Preload images
const preloadImages = () => {
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.onload = () => {
            if (!isInitialized && i === 1) {
                isInitialized = true;
                initAnimation();
            }
        };
        img.src = currentFrame(i);
        images.push(img);
    }
};

const initAnimation = () => {
    const setCanvasSize = () => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        context.scale(dpr, dpr);
        
        // Logical dimensions for rendering
        canvas.logicalWidth = window.innerWidth;
        canvas.logicalHeight = window.innerHeight;
        
        render();
    };

    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();

    const scrollContainer = document.querySelector('.hero-scroll-container');
    
    const handleScroll = () => {
        const scrollTop = window.pageYOffset;
        const containerTop = scrollContainer.offsetTop;
        const containerHeight = scrollContainer.offsetHeight - window.innerHeight;
        
        let progress = (scrollTop - containerTop) / containerHeight;
        progress = Math.max(0, Math.min(1, progress));
        
        const frameIndex = Math.floor(progress * (frameCount - 1));
        if (frameIndex !== animationState.frame) {
            animationState.frame = frameIndex;
            requestAnimationFrame(render);
        }
    };

    window.addEventListener('scroll', handleScroll);
    render();
};

const render = () => {
    const img = images[animationState.frame];
    if (!img || !img.complete) return;

    const width = canvas.logicalWidth || window.innerWidth;
    const height = canvas.logicalHeight || window.innerHeight;

    context.clearRect(0, 0, width, height);
    
    const scale = Math.max(width / img.width, height / img.height);
    const x = (width / 2) - (img.width / 2) * scale;
    const y = (height / 2) - (img.height / 2) * scale;
    
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
};

preloadImages();
