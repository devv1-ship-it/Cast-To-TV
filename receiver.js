// Get the CastReceiverContext, which is the main entry point for the receiver app.
const context = cast.framework.CastReceiverContext.getInstance();

// --- UI Elements ---
// We will create the image element dynamically in the body.
let imageElement = null;
const messageOverlay = document.getElementById('message-overlay'); // Assuming this exists in your HTML

// --- FPS Counter ---
let frameCount = 0;
let fpsInterval = null;

// --- Custom Message Channel ---
// This namespace MUST match the one in your Android app's ScreenCaptureService.
const CUSTOM_CHANNEL_NAMESPACE = 'urn:x-cast:com.xxx.screenmirroring';

context.addCustomMessageListener(CUSTOM_CHANNEL_NAMESPACE, (customEvent) => {
    try {
        const message = JSON.parse(customEvent.data);

        // Check if the message type is 'frame'
        if (message.type === 'frame' && message.data) {
            // This is the first frame we've received.
            if (!imageElement) {
                console.log('First frame received. Creating image element.');
                // Hide the "waiting..." message
                if (messageOverlay) messageOverlay.style.display = 'none';

                // Create an <img> element to display the stream
                imageElement = document.createElement('img');
                imageElement.style.width = '100vw';
                imageElement.style.height = '100vh';
                imageElement.style.objectFit = 'contain';
                imageElement.style.backgroundColor = 'black';
                document.body.appendChild(imageElement);

                // Start the FPS counter
                startFpsCounter();
            }

            // --- THE CRUCIAL FIX ---
            // Update the image source with the received Base64 data.
            // It MUST be prefixed with the data URI scheme for JPEG.
            imageElement.src = `data:image/jpeg;base64,${message.data}`;

            // Increment the frame counter for FPS calculation.
            frameCount++;
        }
    } catch (e) {
        console.error('Error processing message from sender:', e);
        if (messageOverlay) messageOverlay.innerText = 'Error processing frame.';
    }
});

// --- Helper Functions ---
function startFpsCounter() {
    // Clear any existing interval
    if (fpsInterval) clearInterval(fpsInterval);

    // Set up an interval to calculate and display FPS every second.
    fpsInterval = setInterval(() => {
        // You can display this on the screen if you add an element for it
        console.log(`FPS: ${frameCount}`);

        // Update an FPS counter element if it exists in your HTML
        const fpsElement = document.getElementById('fps-counter');
        if (fpsElement) {
            fpsElement.innerText = `FPS: ${frameCount}`;
        }
        
        // Reset the counter for the next second
        frameCount = 0;
    }, 1000);
}

function stopFpsCounter() {
    if (fpsInterval) {
        clearInterval(fpsInterval);
        fpsInterval = null;
    }
}

// --- Receiver Lifecycle ---
context.addEventListener(cast.framework.events.EventType.SENDER_DISCONNECTED, () => {
    console.log('Sender disconnected. Stopping display.');
    // You could also choose to close the window or show a "disconnected" message.
    if (imageElement) {
        imageElement.remove();
        imageElement = null;
    }
    if (messageOverlay) {
        messageOverlay.style.display = 'flex';
        messageOverlay.innerText = 'Sender disconnected.';
    }
    stopFpsCounter();
});

// Start the receiver context
context.start().then(() => {
    console.log('Cast Receiver Context started');
    if (messageOverlay) messageOverlay.innerText = 'Ready. Connect from your phone.';
});
