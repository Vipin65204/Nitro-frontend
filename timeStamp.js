                    function formatTimestamp(timestamp) {
                        const date = new Date(timestamp * 1000);
                        const options = {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        };

                        return date.toLocaleString('en-US', options);
                    }