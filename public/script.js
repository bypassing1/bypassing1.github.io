document.addEventListener('DOMContentLoaded', function () {
    // Fetch the JSON data
    // Fetch globaldata.json and playerstat.json
    Promise.all([
            fetch('data/globaldata.json').then(response => response.json()),
            fetch('data/playerstat.json').then(response => response.json())
        ])
        .then(([globaldata, playerstat]) => {
            // Ensure globaldata has the points property
            let points = 300;
            for (let i = 0; i < 100; i++) {
                globaldata[i].points = points.toFixed(2);
                points -= 2.77;
            }

            // Calculate player points for each player in playerstat
            playerstat.forEach(player => {
                let totalPoints = 0;
                let hardestObby = '';
                let highestPoints = 0;

                player.beaten.forEach(obby => {
                    const obbyData = globaldata.find(data => data.title === obby);
                    if (obbyData && obbyData.points) {
                        const obbyPoints = parseFloat(obbyData.points);
                        totalPoints += obbyPoints;
                        if (obbyPoints > highestPoints) {
                            highestPoints = obbyPoints;
                            hardestObby = obby;
                        }
                    }
                });

                player.playerpoints = totalPoints.toFixed(2);
                player.hardestobby = hardestObby;
            });

            playerstat.sort((a, b) => parseFloat(b.playerpoints) - parseFloat(a.playerpoints));

            if (document.getElementById('list-editor')) {
                document.getElementById('pushDataButton').addEventListener('click', async () => {
                    const newData = {
                        "region": "ukr",
                        "title": "Pillars : Hardcore",
                        "verifier": "sxn_nyeo",
                        "link": "https://www.youtube.com/watch?v=kTyp6PF-EZU",
                        "gamelink": "https://www.roblox.com/games/3026834641/Pillars"
                    };
                
                    try {
                        const response = await fetch('/api/updateData', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(newData)
                        });
                
                        if (response.ok) {
                            console.log('Data pushed successfully!');
                        } else {
                            console.error('Failed to push data');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                });
            }

            if (document.getElementById('statistics')) {
                const scrollableDiv = document.getElementById('scrollable');

                playerstat.forEach((player, index) => {
                    const playerDiv = document.createElement('a');
                    playerDiv.className = 'player-div';

                    const playerFlag = document.createElement('img');
                    playerFlag.src = `assets/${player.region}.svg`;
                    playerFlag.className = 'player-flag';
                    playerFlag.alt = '';

                    const playerName = document.createElement('h4');
                    playerName.textContent = `#${index + 1} - ${player.name}`;

                    playerDiv.appendChild(playerFlag);
                    playerDiv.appendChild(playerName);
                    scrollableDiv.appendChild(playerDiv);

                    // Add click event listener to each playerDiv
                    playerDiv.addEventListener('click', () => {
                        const playerStatsDiv = document.querySelector('.player-stats');
                        playerStatsDiv.innerHTML = ''; // Clear previous content

                        const nationality = player.region.toUpperCase()

                        const beatenObbyHTML = player.beaten.map(obby => {
                            const obbyData = globaldata.find(data => data.title === obby);
                            const obbyPoints = obbyData ? obbyData.points : '0.00';
                            return `<p title="${obbyPoints} Points">${obby}</p>`;
                        }).join('');

                        playerStatsDiv.innerHTML = `
                    <div class="stats-header">
                    <img src="assets/${player.region}.svg" class="flag" alt="">
                    <h2 id="player">${player.name}</h2>
                    </div>
                    <div class="stats-container">
                        <span>
                            <b>Nationality</b>
                            <p>${nationality}</p>
                        </span>
                    </div>
                    <div class="stats-container">
                        <span>
                            <b>Rank</b>
                            <p>${index + 1}</p>
                        </span>
                        <span>
                            <b>Points</b>
                            <p>${player.playerpoints}</p>
                        </span>
                    </div>
                    <div class="stats-container">
                        <span>
                            <b>Hardest Obby</b>
                            <p>${player.hardestobby}</p>
                        </span>
                    </div>
                    <div class="stats-container">
                        <span>
                            <b>Obby Beaten</b>
                            <div class="beaten-obby">
                            ${beatenObbyHTML}
                        </div>
                        </span>
                    </div>
                `;

                        playerStatsDiv.style.display = 'block'; // Show the player-stats div
                        startTransition();
                    });
                });
            }

            const loader = document.querySelector(".loader");
            const playerStatsDiv = document.querySelector(".player-stats")

            const startTransition = () => {
                playerStatsDiv.style.opacity = '0'
                loader.style.transform = "translateX(0%)";
                setTimeout(() => {
                    loader.style.transform = "translateX(100%)"; // End position
                    playerStatsDiv.style.opacity = '1'
                }, 1000);
            };

            // Continue with your existing script logic
            if (document.getElementById('index')) {
                const top1ObbyistElement = document.querySelector('.top1-obbyist');
                top1ObbyistElement.textContent = globaldata[0].verifier;
                let contributors = [
                    'itsmycrafted',
                    'galih_funfan',
                    'lcknt',
                    'zayenzoo',
                    'darkside_dammed'
                ];
                let contributorsContainer = document.querySelector('.contributors-text');
                contributors.forEach(contributor => {
                    let p = document.createElement('p');
                    p.textContent = contributor;
                    contributorsContainer.appendChild(p);
                });
            }
            if (document.getElementById('universal-list')) {
                let total = 0;
                const container = document.getElementById('cards-container');
                const legacycontainer = document.getElementById('legacy-container');

                globaldata.forEach(item => {
                    total += 1;
                    const videoId = item.link.split('v=')[1].split('&')[0];
                    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

                    // Create card element
                    const card = document.createElement('div');
                    card.className = 'card';

                    // Create background blur element
                    const bgblur = document.createElement('div');
                    bgblur.className = "background-blur";
                    bgblur.style.backgroundImage = `url(${thumbnailUrl})`;
                    card.appendChild(bgblur);

                    // Create link overlay element
                    const link = document.createElement('a');
                    link.href = item.link;
                    link.target = "_blank";
                    link.className = "link-overlay";
                    card.appendChild(link);

                    // Create image element
                    const img = document.createElement('img');
                    img.src = thumbnailUrl;
                    img.classList.add('thumbnail');
                    link.appendChild(img);

                    // Create info container
                    const info = document.createElement('div');
                    info.className = 'info';
                    card.appendChild(info);

                    // Create flag element
                    const flag = document.createElement('img');
                    flag.src = `assets/${item.region}.svg`;
                    flag.classList.add('flag');
                    info.appendChild(flag);

                    // Create title element
                    const obby = document.createElement('h1');
                    obby.id = 'after-video';
                    obby.textContent = total < 101 ? `#${total} - ${item.title}` : `${item.title}`;
                    info.appendChild(obby);

                    // Create verifier element
                    const verifier = document.createElement('p');
                    verifier.textContent = item.verifier;
                    info.appendChild(verifier);

                    // Create game link element
                    const gamelink = document.createElement('a');
                    gamelink.href = item.gamelink;
                    gamelink.target = "_blank";
                    gamelink.textContent = `Game`;
                    info.appendChild(gamelink);

                    // Append card to the appropriate container
                    if (total > 100) {
                        legacycontainer.appendChild(card);
                    } else {
                        container.appendChild(card);
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));
    if (document.getElementById('voc-list')) {
        let total = 0;
        const container = document.getElementById('cards-container');
        const legacycontainer = document.getElementById('legacy-container');

        // Fetch the JSON data
        fetch('data/vndata.json')
            .then(response => response.json())
            .then(vndata => {
                vndata.forEach(item => {
                    total += 1;
                    const videoId = item.link.split('v=')[1].split('&')[0];
                    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

                    // Create card element
                    const card = document.createElement('div');
                    card.className = 'card';

                    // Create background blur element
                    const bgblur = document.createElement('div');
                    bgblur.className = "background-blur";
                    bgblur.style.backgroundImage = `url(${thumbnailUrl})`;
                    card.appendChild(bgblur);

                    // Create link overlay element
                    const link = document.createElement('a');
                    link.href = item.link;
                    link.target = "_blank";
                    link.className = "link-overlay";
                    card.appendChild(link);

                    // Create image element
                    const img = document.createElement('img');
                    img.src = thumbnailUrl;
                    img.classList.add('thumbnail');
                    link.appendChild(img);

                    // Create info container
                    const info = document.createElement('div');
                    info.className = 'info';
                    card.appendChild(info);

                    // Create flag element
                    const flag = document.createElement('img');
                    flag.src = `assets/vn.svg`;
                    flag.classList.add('flag');
                    info.appendChild(flag);

                    // Create title element
                    const obby = document.createElement('h1');
                    obby.id = 'after-video';
                    obby.textContent = total < 51 ? `#${total} - ${item.title}` : `${item.title}`;
                    info.appendChild(obby);

                    // Create verifier element
                    const verifier = document.createElement('p');
                    verifier.textContent = item.verifier;
                    info.appendChild(verifier);

                    // Create game link element
                    const gamelink = document.createElement('a');
                    gamelink.href = item.gamelink;
                    gamelink.target = "_blank";
                    gamelink.textContent = `Game`;
                    info.appendChild(gamelink);

                    // Append card to the appropriate container
                    if (total > 50) {
                        legacycontainer.appendChild(card);
                    } else {
                        container.appendChild(card);
                    }
                });
            })
            .catch(error => console.error('Error fetching the JSON data:', error));
    }
    if (document.getElementById('eio-list')) {
        let total = 0;
        const container = document.getElementById('cards-container');
        const legacycontainer = document.getElementById('legacy-container');

        // Fetch the JSON data
        fetch('data/iddata.json')
            .then(response => response.json())
            .then(iddata => {
                iddata.forEach(item => {
                    total += 1;
                    const videoId = item.link.split('v=')[1].split('&')[0];
                    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

                    // Create card element
                    const card = document.createElement('div');
                    card.className = 'card';

                    // Create background blur element
                    const bgblur = document.createElement('div');
                    bgblur.className = "background-blur";
                    bgblur.style.backgroundImage = `url(${thumbnailUrl})`;
                    card.appendChild(bgblur);

                    // Create link overlay element
                    const link = document.createElement('a');
                    link.href = item.link;
                    link.target = "_blank";
                    link.className = "link-overlay";
                    card.appendChild(link);

                    // Create image element
                    const img = document.createElement('img');
                    img.src = thumbnailUrl;
                    img.classList.add('thumbnail');
                    link.appendChild(img);

                    // Create info container
                    const info = document.createElement('div');
                    info.className = 'info';
                    card.appendChild(info);

                    // Create flag element
                    const flag = document.createElement('img');
                    flag.src = `assets/id.svg`;
                    flag.classList.add('flag');
                    info.appendChild(flag);

                    // Create title element
                    const obby = document.createElement('h1');
                    obby.id = 'after-video';
                    obby.textContent = total < 51 ? `#${total} - ${item.title}` : `${item.title}`;
                    info.appendChild(obby);

                    // Create verifier element
                    const verifier = document.createElement('p');
                    verifier.textContent = item.verifier;
                    info.appendChild(verifier);

                    // Create game link element
                    const gamelink = document.createElement('a');
                    gamelink.href = item.gamelink;
                    gamelink.target = "_blank";
                    gamelink.textContent = `Game`;
                    info.appendChild(gamelink);

                    // Append card to the appropriate container
                    if (total > 50) {
                        legacycontainer.appendChild(card);
                    } else {
                        container.appendChild(card);
                    }
                });
            })
            .catch(error => console.error('Error fetching the JSON data:', error));
    }
    if (document.getElementById('ukr-list')) {
        let total = 0;
        const container = document.getElementById('cards-container');
        const legacycontainer = document.getElementById('legacy-container');

        // Fetch the JSON data
        fetch('data/ukrdata.json')
            .then(response => response.json())
            .then(ukrdata => {
                ukrdata.forEach(item => {
                    total += 1;
                    const videoId = item.link.split('v=')[1].split('&')[0];
                    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

                    // Create card element
                    const card = document.createElement('div');
                    card.className = 'card';

                    // Create background blur element
                    const bgblur = document.createElement('div');
                    bgblur.className = "background-blur";
                    bgblur.style.backgroundImage = `url(${thumbnailUrl})`;
                    card.appendChild(bgblur);

                    // Create link overlay element
                    const link = document.createElement('a');
                    link.href = item.link;
                    link.target = "_blank";
                    link.className = "link-overlay";
                    card.appendChild(link);

                    // Create image element
                    const img = document.createElement('img');
                    img.src = thumbnailUrl;
                    img.classList.add('thumbnail');
                    link.appendChild(img);

                    // Create info container
                    const info = document.createElement('div');
                    info.className = 'info';
                    card.appendChild(info);

                    // Create flag element
                    const flag = document.createElement('img');
                    flag.src = `assets/ukr.svg`;
                    flag.classList.add('flag');
                    info.appendChild(flag);

                    // Create title element
                    const obby = document.createElement('h1');
                    obby.id = 'after-video';
                    obby.textContent = total < 51 ? `#${total} - ${item.title}` : `${item.title}`;
                    info.appendChild(obby);

                    // Create verifier element
                    const verifier = document.createElement('p');
                    verifier.textContent = item.verifier;
                    info.appendChild(verifier);

                    // Create game link element
                    const gamelink = document.createElement('a');
                    gamelink.href = item.gamelink;
                    gamelink.target = "_blank";
                    gamelink.textContent = `Game`;
                    info.appendChild(gamelink);

                    // Append card to the appropriate container
                    if (total > 50) {
                        legacycontainer.appendChild(card);
                    } else {
                        container.appendChild(card);
                    }
                });
            })
            .catch(error => console.error('Error fetching the JSON data:', error));
    }
    if (document.getElementById('koc-list')) {
        let total = 0;
        const container = document.getElementById('cards-container');
        const legacycontainer = document.getElementById('legacy-container');

        // Fetch the JSON data
        fetch('data/krdata.json')
            .then(response => response.json())
            .then(ukrdata => {
                ukrdata.forEach(item => {
                    total += 1;
                    const videoId = item.link.split('v=')[1].split('&')[0];
                    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

                    // Create card element
                    const card = document.createElement('div');
                    card.className = 'card';

                    // Create background blur element
                    const bgblur = document.createElement('div');
                    bgblur.className = "background-blur";
                    bgblur.style.backgroundImage = `url(${thumbnailUrl})`;
                    card.appendChild(bgblur);

                    // Create link overlay element
                    const link = document.createElement('a');
                    link.href = item.link;
                    link.target = "_blank";
                    link.className = "link-overlay";
                    card.appendChild(link);

                    // Create image element
                    const img = document.createElement('img');
                    img.src = thumbnailUrl;
                    img.classList.add('thumbnail');
                    link.appendChild(img);

                    // Create info container
                    const info = document.createElement('div');
                    info.className = 'info';
                    card.appendChild(info);

                    // Create flag element
                    const flag = document.createElement('img');
                    flag.src = `assets/kr.svg`;
                    flag.classList.add('flag');
                    info.appendChild(flag);

                    // Create title element
                    const obby = document.createElement('h1');
                    obby.id = 'after-video';
                    obby.textContent = total < 51 ? `#${total} - ${item.title}` : `${item.title}`;
                    info.appendChild(obby);

                    // Create verifier element
                    const verifier = document.createElement('p');
                    verifier.textContent = item.verifier;
                    info.appendChild(verifier);

                    // Create game link element
                    const gamelink = document.createElement('a');
                    gamelink.href = item.gamelink;
                    gamelink.target = "_blank";
                    gamelink.textContent = `Game`;
                    info.appendChild(gamelink);

                    // Append card to the appropriate container
                    if (total > 50) {
                        legacycontainer.appendChild(card);
                    } else {
                        container.appendChild(card);
                    }
                });
            })
            .catch(error => console.error('Error fetching the JSON data:', error));
    }
    if (document.getElementById('mys-list')) {
        let total = 0;
        const container = document.getElementById('cards-container');
        const legacycontainer = document.getElementById('legacy-container');

        // Fetch the JSON data
        fetch('data/mysdata.json')
            .then(response => response.json())
            .then(ukrdata => {
                ukrdata.forEach(item => {
                    total += 1;
                    const videoId = item.link.split('v=')[1].split('&')[0];
                    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

                    // Create card element
                    const card = document.createElement('div');
                    card.className = 'card';

                    // Create background blur element
                    const bgblur = document.createElement('div');
                    bgblur.className = "background-blur";
                    bgblur.style.backgroundImage = `url(${thumbnailUrl})`;
                    card.appendChild(bgblur);

                    // Create link overlay element
                    const link = document.createElement('a');
                    link.href = item.link;
                    link.target = "_blank";
                    link.className = "link-overlay";
                    card.appendChild(link);

                    // Create image element
                    const img = document.createElement('img');
                    img.src = thumbnailUrl;
                    img.classList.add('thumbnail');
                    link.appendChild(img);

                    // Create info container
                    const info = document.createElement('div');
                    info.className = 'info';
                    card.appendChild(info);

                    // Create flag element
                    const flag = document.createElement('img');
                    flag.src = `assets/mys.svg`;
                    flag.classList.add('flag');
                    info.appendChild(flag);

                    // Create title element
                    const obby = document.createElement('h1');
                    obby.id = 'after-video';
                    obby.textContent = total < 51 ? `#${total} - ${item.title}` : `${item.title}`;
                    info.appendChild(obby);

                    // Create verifier element
                    const verifier = document.createElement('p');
                    verifier.textContent = item.verifier;
                    info.appendChild(verifier);

                    // Create game link element
                    const gamelink = document.createElement('a');
                    gamelink.href = item.gamelink;
                    gamelink.target = "_blank";
                    gamelink.textContent = `Game`;
                    info.appendChild(gamelink);

                    // Append card to the appropriate container
                    if (total > 50) {
                        legacycontainer.appendChild(card);
                    } else {
                        container.appendChild(card);
                    }
                });
            })
            .catch(error => console.error('Error fetching the JSON data:', error));
    }
});