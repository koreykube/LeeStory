function parseCSVLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"' && nextChar === '"') {
            current += '"';
            i++;
        } else if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

function csvToJson(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = parseCSVLine(lines[0]);
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const obj = {};

        headers.forEach((h, idx) => {
            obj[h.trim()] = values[idx] ? values[idx].replace(/^"|"$/g, '') : '';
        });

        result.push(obj);
    }

    return result;
}

function createMessageHTML(username, message, font) {
    const container = document.createElement('div');
    container.className = 'container';

    const unameFixed = String(username).trim().toLowerCase().replace(/\s+/g, '');
    const imgPath = `./images/${unameFixed}.jpg`;

    container.innerHTML = `
        <img src="${imgPath}" alt="User Image" onerror="this.onerror=null;this.src='./images/default.jpg';">
        <div class="messagecontent">
            <p class="username">${username}</p>
            <p class = "${font}">${message}</p>
        </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.appendChild(container);

    return wrapper;
}

function createNewsHTML(headline, news) {
    const container = document.createElement('div');
    container.className = 'container newspaper';

    const headlineFixed = String(headline).trim().toLowerCase().replace(/\s+/g, '').replace('.', '');
    const imgPath = `./images/${headlineFixed}.jpg`;

    container.innerHTML = `
        <div class="messagecontent">
            <p class="username">${headline}</p>
            <p>${news}</p>
        </div>
        <img class="newsimage" src="${imgPath}" alt="News Image" onerror="this.onerror=null;this.src='./images/default.jpg';">
    `;

    const wrapper = document.createElement('div');
    wrapper.appendChild(container);

    return wrapper;  
}

function createTimestampHTML(timestring) {
    const container = document.createElement('div');
    container.className = "linebreak";
    const wrapper = document.createElement('div');
    container.innerHTML = `<p>${timestring}</p>`;
    wrapper.appendChild(container);
    return wrapper;
}

// function createNewsHTML(headline, news) {
//     if(headline == "") {
//         headline = "Temp Headline";
//     }
//     const container = document.createElement('div');
//     container.className = "newspaper";
//     const wrapper = document.createElement('div');
//     container.innerHTML = `<h1>${headline}</h1><p>${news}</p>`;
//     wrapper.appendChild(container);
//     return wrapper;
// }

function createSystemMessage(message) {
    const container = document.createElement('div');
    container.className = "sysmessage";
    const wrapper = document.createElement('div');
    container.innerHTML = `<p>${message}</p>`;
    wrapper.appendChild(container);
    return wrapper;
}

function loadMessagesIntoChatbox(data) {
    const chatbox = document.querySelector('.chatboxholder');
    if (!chatbox) return;

    chatbox.innerHTML = '';

    data.forEach(entry => {
        const username = entry.name || 'Unknown';
        const type = entry.type || '';
        const message = entry.message || '';
        const font = entry.font || "default";

        if (type === "time") {
            const timeStampHTML = createTimestampHTML(message);
            chatbox.appendChild(timeStampHTML);
        } else if (type === "news"){
            const newsHTML = createNewsHTML(username, message);
            chatbox.appendChild(newsHTML);
        } else if (type === "sysmessage") {
            const sysmessageHTML = createSystemMessage(message);
            chatbox.appendChild(sysmessageHTML);
        } else {
            const messageHTML = createMessageHTML(username, message, font);
            chatbox.appendChild(messageHTML);
        }
    });
}

function loadAndParseCSV() {
    fetch('LeeStoryCSV.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error("Couldn't load file");
            }
            return response.text();
        })
        .then(csvText => {
            const messages = csvToJson(csvText);
            loadMessagesIntoChatbox(messages);
        })
        .catch(err => {
            console.error("Error loading CSV: ", err);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadAndParseCSV();
});
