function entry() {
    initialize();
    mainloop();
    setInterval(update, 1000/40);
}

function mainloop() {
    drawing();
    requestAnimationFrame(mainloop);
}

window.onload = entry;