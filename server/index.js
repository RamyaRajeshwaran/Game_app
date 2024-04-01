const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/game-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define Game schema
const gameSchema = new mongoose.Schema({
  player1: String,
  player2: String,
  rounds: [{ round: Number, player1: String, player2: String, winner: String }],
});

// Define Game model
const Game = mongoose.model('Game', gameSchema);

// API endpoint to create a new game
app.post('http://localhost:3000/api/games', async (req, res) => {
  try {
    const { player1, player2 } = req.body;
    const game = new Game({ player1, player2 });
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('http://localhost:3000/api/games/:id', async (req, res) => {
  try {
    const gameId = req.params.id;
    const { round, player1Choice, player2Choice, winner } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    game.rounds.push({ round, player1: player1Choice, player2: player2Choice, winner });
    game.markModified('rounds'); 
    await game.save();

    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('http://localhost:3000/api/games', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
