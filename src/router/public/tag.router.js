const express = require('express');
const router = express.Router();
const tagService = require('../../services/tag.service');
const categoryService = require('../../services/category.service');

router.get('/tags', (req, res) => {
  res.render('pages/tags', {
    title: 'Etiquetas',
    tag: 'Todos',
    tagSlug: '',
    posts: [],
    todasLasCategorias: categoryService.getAll(),
    todosLosTags: tagService.getAll()
  });
});

module.exports = router;
