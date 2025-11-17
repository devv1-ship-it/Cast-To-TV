/**
 * YouTube Control Extension for Cast Receiver
 * This script extends the existing index.html without modifying it
 * Handles YT_COMMAND messages to control YouTube playback
 */

(function() {
    console.log('[YT_CONTROL] Extension loaded');

    // Wait for Cast context to be ready
    const waitForContext = setInterval(function() {
        if (typeof cast !== 'undefined' && cast.framework && cast.framework.CastReceiverContext) {
            clearInterval(waitForContext);
            initYouTubeControls();
        }
    }, 100);

    function initYouTubeControls() {
        const context = cast.framework.CastReceiverContext.getInstance();
        const NAMESPACE = 'urn:x-cast:com.xxx.screenmirroring';

        console.log('[YT_CONTROL] Registering YT_COMMAND handler');

        // Add listener for YouTube control commands
        context.addCustomMessageListener(NAMESPACE, function(customEvent) {
            try {
                let data = customEvent.data;
                if (typeof data === 'string') {
                    data = JSON.parse(data);
                }

                if (data.type === 'YT_COMMAND') {
                    console.log('[YT_CONTROL] Received command:', data.command);
                    handleYouTubeCommand(data);
                }
            } catch (e) {
                console.error('[YT_CONTROL] Error processing command:', e);
            }
        });
    }

    function handleYouTubeCommand(data) {
        // Wait for youtubePlayer to be available (defined in index.html)
        if (typeof youtubePlayer === 'undefined'  !youtubePlayer) {
            console.warn('[YT_CONTROL] YouTube player not ready yet');
            return;
        }

        const command = data.command;

        try {
            switch (command) {
                case 'play':
                    console.log('[YT_CONTROL] Playing video');
                    youtubePlayer.playVideo();
                    break;

                case 'pause':
                    console.log('[YT_CONTROL] Pausing video');
                    youtubePlayer.pauseVideo();
                    break;

                case 'stop':
                    console.log('[YT_CONTROL] Stopping video');
                    youtubePlayer.stopVideo();
                    break;

                case 'seek':
                    if (data.relative) {
                        const currentTime = youtubePlayer.getCurrentTime();
                        const newTime = currentTime + data.seconds;
                        console.log('[YT_CONTROL] Seeking relative:', data.seconds, 'seconds');
                        youtubePlayer.seekTo(newTime, true);
                    } else {
                        const duration = youtubePlayer.getDuration();
                        const seekTime = (duration * data.progress) / 100;
                        console.log('[YT_CONTROL] Seeking to progress:', data.progress, '%');
                        youtubePlayer.seekTo(seekTime, true);
                    }
                    break;

                case 'volume':
                    const level = data.level  100;
                    console.log('[YT_CONTROL] Setting volume to:', level);
                    youtubePlayer.setVolume(level);
                    if (level === 0) {
                        youtubePlayer.mute();
                    } else {
                        youtubePlayer.unMute();
                    }
                    break;

                default:
                    console.warn('[YT_CONTROL] Unknown command:', command);
            }
        } catch (e) {
            console.error('[YT_CONTROL] Error executing command:', command, e);
        }
    }
})();
