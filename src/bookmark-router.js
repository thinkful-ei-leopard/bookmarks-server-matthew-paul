const express = require('express');
const { isWebUri } = require('valid-url');
const uuid = require('uuid/v4');
const bookmarkRouter = express.Router();

const logger = require('./logger');
const { bookmarks } = require('./store');

const bodyParser = express.json();

bookmarkRouter
  .route('/')
  .get((req, res) => {
    res.json({ bookmarks });
  })
  .post(bodyParser, (req, res) => {
    const reqFields = ['title', 'url', 'rating'];
    reqFields.forEach(field => {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send(`${field} is required`);
      }
    });

    const { title, url, description = '', rating } = req.body;

    if(!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating}' supplied`);
      return res.status(400).send('\'rating\' must be a number between 0 and 5');
    }

    if(!isWebUri(url)) {
      logger.error(`Invalid url '${url}' supplied`);
      return res.status(400).send('\'url must be valid');
    }

    const bookmark = {
      id: uuid(),
      title,
      url,
      description,
      rating
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id of ${bookmark.id} was created`);
    
    res
      .status(201)
      .location(`https://localhost:8000/bookmarks/${bookmark.id}`)
      .json(bookmark);
  });

bookmarkRouter
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(bookmark => bookmark.id == id);

    if (!bookmark) {
      logger.error(`Card with id ${id} not found.`);
      return res.status(404).send('Bookmark not found');
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`Card with id ${id} not found`);
      return res.status(404).send('Not found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted`);

    res.status(204).end();
  });
  
  
module.exports = bookmarkRouter;