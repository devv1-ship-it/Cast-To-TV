const context = cast.framework.CastReceiverContext.getInstance();
const messageOverlay = document.getElementById('message-overlay');
let imageElement = null;

// This namespace MUST match your Android app
const CUSTOM_CHANNEL_NAMESPACE = 'urn:x-cast:com.xxx.screenmirroring';

context.addCustomMessageListener(CUSTOM_CHANNEL_NAMESPACE, (customEvent) => {
    try {
        const message = JSON.parse(customEvent.data);

        if (message.type === 'frame' && message.data) {
            // On the very first frame, create the image element
            if (!imageElement) {
                console.log('First frame received. Creating image element.');
                if (messageOverlay) messageOverlay.style.display = 'none';
                imageElement = document.createElement('img');
                document.body.appendChild(imageElement);
            }

            // THE FIX: Update the image source with the required data URI prefix
            imageElement.src = `data:image/jpeg;base64,${message.data}`;
        }
    } catch (e) {
        console.error('Error processing message:', e);
        if (messageOverlay) messageOverlay.innerText = 'Error processing frame.';
    }
});

// Handle when the sender disconnects
context.addEventListener(cast.framework.events.EventType.SENDER_DISCONNECTED, () => {
    console.log('Sender disconnected.');
    if (imageElement) imageElement.remove(); // Clean up the image
    if (messageOverlay) {
        messageOverlay.style.display = 'flex';
        messageOverlay.innerText = 'Sender Disconnected';
    }
});

// Start the receiver
context.start().then(() => {
    console.log('Cast Receiver Context started');
    if (messageOverlay) messageOverlay.innerText = 'Ready to Connect';
});
