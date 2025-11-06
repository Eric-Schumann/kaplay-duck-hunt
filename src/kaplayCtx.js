import kaplay from 'kaplay';

const k = kaplay({
    width: 256,
    height: 224,
    letterbox: true,
    touchToMouse: true,
    scale: 4,
    pixelDensity: devicePixelRatio,
    global: false,
    debug: true, // set to false for production
    background: [0,0,0],
});

export default k;