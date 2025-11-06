const context = cast.framework.CastReceiverContext.getInstance();

console.log('Receiver script loaded. Attempting to start context...');

context.start().then(() => {
    console.log('SUCCESS: Cast Receiver Context started successfully!');
    // For testing, let's change the screen color to blue on success
    document.body.style.backgroundColor = 'blue';
}).catch(error => {
    console.error('FAILURE: Cast Receiver Context failed to start.', error);
    // Change screen to red on failure
    document.body.style.backgroundColor = 'red';
});
