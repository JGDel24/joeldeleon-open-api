const publicKey = '7aec8be88ac3f8fff8a0ee870fe35702';
const privateKey = '8ee06740c1ffb4e5e3a4213242522e33130db1d8';
const date = Date.now().toString();
const hash = CryptoJS.MD5(date + privateKey + publicKey).toString();

const images = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
];

function changeBackground() {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.body.style.backgroundImage = `url('${randomImage}')`;
}

setInterval(changeBackground, 4000);
changeBackground();

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const characterName = document.getElementById('searchInput').value;

    if (characterName) {
        const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${characterName}&ts=${date}&apikey=${publicKey}&hash=${hash}`;


        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                const hero = data.data.results[0];

                if (hero) {
                    document.getElementById('heroInfo').innerHTML = `
                        <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}">
                        <h2>${hero.name}</h2>
                        <p>${hero.description || 'No description available.'}</p>
                    `;
                } else {
                    document.getElementById('heroInfo').innerHTML = '<p>Character not found.</p>';
                }
            })
            .catch(function(error) {
                console.error('Error fetching data:', error);
                document.getElementById('heroInfo').innerHTML = '<p>Error retrieving data.</p>';
            });
    }
});
