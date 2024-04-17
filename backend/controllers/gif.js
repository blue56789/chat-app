const searchGifs = async (req, res) => {
    const search = req.query.search;
    if (!search) return res.json([]);
    const response = await fetch("https://tenor.googleapis.com/v2/search?q=" + search + "&key=" + process.env.TENOR_KEY + "&client_key=my_app&limit=10");
    const gifs = await response.json();
    if (response.ok)
        res.json(gifs["results"]);
    else {
        console.log(gifs);
        res.json([]);
    }
}
module.exports = { searchGifs };