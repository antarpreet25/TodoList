const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Task = require('./models/Task');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// MongoDB Local
mongoose.connect('mongodb://127.0.0.1:27017/todoDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.get('/', async (req, res) => {
  const tasks = await Task.find({});
  res.render('index', { tasks });
});

app.post('/add', async (req, res) => {
  const { title, priority } = req.body;
  if (!title) return res.send("<script>alert('Task title cannot be empty'); window.location.href='/'</script>");
  await Task.create({ title, priority });
  res.redirect('/');
});

app.put('/edit/:id', async (req, res) => {
  const { title, priority } = req.body;
  await Task.findByIdAndUpdate(req.params.id, { title, priority });
  res.send("<script>alert('Task updated successfully'); window.location.href='/'</script>");
});

app.delete('/delete/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send("<script>alert('Task deleted successfully'); window.location.href='/'</script>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
