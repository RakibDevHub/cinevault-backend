const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']); // Cloudflare + Google

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');


dotenv.config();

const movies = [
  {
    title: 'Inception',
    genre: 'Sci-Fi',
    rating: 8.8,
    year: 2010,
    poster:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology.',
  },
  {
    title: 'The Dark Knight',
    genre: 'Action',
    rating: 9.0,
    year: 2008,
    poster:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500',
    description:
      'When the menace known as the Joker wreaks havoc and chaos on Gotham City.',
  },
  {
    title: 'Interstellar',
    genre: 'Sci-Fi',
    rating: 8.6,
    year: 2014,
    poster:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500',
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Movie.deleteMany();
    await Movie.insertMany(movies);
    console.log('Dummy data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedDB();