const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

const server = https.createServer();

const wss = new WebSocket.Server({ server });

const registeredUsers = new Map();

wss.on('connection', (ws) => {
    console.log("A Client Conencted!")
    let authenticatedUser = null;

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'login') {
                const { username } = data;
                if (!registeredUsers.has(username)) {
                    ws.send(
                        JSON.stringify({
                            type: 'error',
                            message: 'User not registered. Please register first.',
                        })
                    );
                    return;
                }
                authenticatedUser = username;
                ws.send(
                    JSON.stringify({
                        type: 'success',
                        message: `User ${username} logged in successfully.`,
                    })
                );
            } else if (data.type === 'message') {
                if (!authenticatedUser) {
                    ws.send(
                        JSON.stringify({
                            type: 'error',
                            message: 'You must log in first to send messages.',
                        })
                    );
                    return;
                }
                const { content } = data;
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(
                            JSON.stringify({
                                type: 'message',
                                user: authenticatedUser,
                                content,
                            })
                        );
                    }
                });
            } else {
                ws.send(
                    JSON.stringify({
                        type: 'error',
                        message: 'Unknown command.',
                    })
                );
            }
        } catch (err) {
            ws.send(
                JSON.stringify({
                    type: 'error',
                    message: 'Invalid message format.',
                })
            );
        }
    });

    ws.on('close', () => {
        if (authenticatedUser) {
            console.log(`User ${authenticatedUser} disconnected.`);
        }
    });
});

server.listen(process.env.PORT || 4000, () => {
    console.log(`WSS Server running on port ${process.env.PORT || 4000}`);
});
